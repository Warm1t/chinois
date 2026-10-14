import { Communicate } from 'edge-tts-universal';

let currentAudio: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;
let pendingResolve: ((val: boolean) => void) | null = null;
let currentAbortController: { abort: () => void } | null = null;
let consecutiveFailures = 0;
let lastFailureTime = 0;

const ttsBlobCache = new Map<string, string>();

/**
 * Arrête immédiatement toute lecture Edge TTS en cours et libère les ressources
 */
export const stopEdgeAudio = () => {
  if (currentAbortController) {
    try {
      currentAbortController.abort();
    } catch {}
    currentAbortController = null;
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  // Ne pas révoquer les blobs mis en cache pour réécoute instantanée (0ms)
  if (currentBlobUrl && !Array.from(ttsBlobCache.values()).includes(currentBlobUrl)) {
    try {
      URL.revokeObjectURL(currentBlobUrl);
    } catch {}
  }
  currentBlobUrl = null;
  // Débloque immédiatement toute promesse en attente de terminaison
  if (pendingResolve) {
    const resolve = pendingResolve;
    pendingResolve = null;
    resolve(false);
  }
};

/**
 * Joue une phrase en utilisant la voix neurale Microsoft Yunxi (homme) ou Xiaoxiao (femme)
 * directement via le moteur haute fidélité Edge TTS, avec support du débit ralenti (0.5x, 0.85x, 1.0x).
 * 
 * En cas de timeout réseau, d'erreur ou d'interruption, bascule proprement et immédiatement 
 * vers la synthèse vocale locale (Web Speech API) sans bloquer la lecture de l'histoire.
 */
export const playEdgeTtsAudio = async (
  text: string,
  voice: 'zh-CN-YunxiNeural' | 'zh-CN-YunjianNeural' | 'zh-CN-XiaoxiaoNeural' = 'zh-CN-YunxiNeural',
  rate: number = 0.85
): Promise<boolean> => {
  stopEdgeAudio();

  const cleanText = text.replace(/[^\u4e00-\u9fa5，。？！、\s]/g, '').trim();
  if (!cleanText) return false;

  // Calcul du paramètre de vitesse pour Edge TTS
  let rateParam = '+0%';
  if (rate <= 0.55) {
    rateParam = '-50%';
  } else if (rate <= 0.75) {
    rateParam = '-25%';
  } else if (rate <= 0.88) {
    rateParam = '-15%';
  } else if (rate >= 1.15) {
    rateParam = '+15%';
  }

  const cacheKey = `${voice}_${rateParam}_${cleanText}`;

  // 1. REPRODUIRE INSTANTANÉMENT DEPUIS LE CACHE MÉMOIRE SI DÉJÀ TÉLÉCHARGÉ (0ms de latence)
  if (ttsBlobCache.has(cacheKey)) {
    const cachedBlobUrl = ttsBlobCache.get(cacheKey)!;
    currentBlobUrl = cachedBlobUrl;
    const audio = new Audio(cachedBlobUrl);
    currentAudio = audio;

    return new Promise<boolean>((resolve) => {
      let resolved = false;
      const cleanupAndResolve = (result: boolean) => {
        if (resolved) return;
        resolved = true;
        pendingResolve = null;
        stopEdgeAudio();
        resolve(result);
      };

      pendingResolve = cleanupAndResolve;
      audio.onended = () => cleanupAndResolve(true);
      audio.onerror = () => cleanupAndResolve(false);
      audio.play().catch(() => cleanupAndResolve(false));
    });
  }

  // Si Edge TTS a échoué consécutivement récemment, basculer immédiatement sur Web Speech API locale sans latence
  const now = Date.now();
  if (consecutiveFailures >= 2 && now - lastFailureTime < 30000) {
    return false;
  }

  let aborted = false;
  currentAbortController = {
    abort: () => {
      aborted = true;
    }
  };

  try {
    const communicate = new Communicate(cleanText, {
      voice,
      rate: rateParam,
    });

    // Timeout rapide de 1.2s pour initialiser le flux WebSocket afin de ne pas bloquer l'utilisateur
    const stream = await Promise.race([
      communicate.stream(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Edge TTS stream timeout')), 1200)
      )
    ]);

    if (aborted) return false;

    // Récupération des paquets audio avec timeout rapide de 1.8s
    const audioChunks: Uint8Array[] = [];
    let chunkTimeoutId: any = null;

    const chunkCollection = (async () => {
      for await (const chunk of stream) {
        if (aborted) break;
        if (chunk.type === 'audio' && chunk.data) {
          audioChunks.push(chunk.data);
        }
      }
    })();

    await Promise.race([
      chunkCollection,
      new Promise<never>((_, reject) => {
        chunkTimeoutId = setTimeout(() => reject(new Error('Edge TTS chunk timeout')), 1800);
      })
    ]);

    if (chunkTimeoutId) clearTimeout(chunkTimeoutId);

    if (aborted || audioChunks.length === 0) {
      consecutiveFailures++;
      lastFailureTime = Date.now();
      return false;
    }

    // Création du Blob et mise en cache
    const audioBlob = new Blob(audioChunks as any, { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(audioBlob);
    ttsBlobCache.set(cacheKey, blobUrl);
    currentBlobUrl = blobUrl;

    const audio = new Audio(blobUrl);
    currentAudio = audio;

    return new Promise<boolean>((resolve) => {
      let resolved = false;

      const cleanupAndResolve = (result: boolean) => {
        if (resolved) return;
        resolved = true;
        pendingResolve = null;
        if (playbackTimeout) clearTimeout(playbackTimeout);
        stopEdgeAudio();
        if (result) {
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
          lastFailureTime = Date.now();
        }
        resolve(result);
      };

      pendingResolve = cleanupAndResolve;

      // Timeout max de lecture (longueur de texte * 550ms + 3s de marge) pour ne jamais geler
      const maxPlaybackMs = Math.max(4000, cleanText.length * 550 + 3000);
      const playbackTimeout = setTimeout(() => {
        cleanupAndResolve(true);
      }, maxPlaybackMs);

      audio.onended = () => {
        cleanupAndResolve(true);
      };

      audio.onerror = () => {
        cleanupAndResolve(false);
      };

      audio.play().catch(() => {
        cleanupAndResolve(false);
      });
    });
  } catch (err) {
    consecutiveFailures++;
    lastFailureTime = Date.now();
    return false;
  }
};
