import { Communicate } from 'edge-tts-universal';

let currentAudio: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;
let pendingResolve: ((val: boolean) => void) | null = null;
let currentAbortController: { abort: () => void } | null = null;
let consecutiveFailures = 0;
let lastFailureTime = 0;

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
  if (currentBlobUrl) {
    try {
      URL.revokeObjectURL(currentBlobUrl);
    } catch {}
    currentBlobUrl = null;
  }
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

  // Si Edge TTS a échoué 2 fois consécutivement récemment (ex: bloqué par le réseau/navigateur),
  // on bascule directement sur la synthèse vocale locale pendant 30s sans faire attendre l'utilisateur
  const now = Date.now();
  if (consecutiveFailures >= 2 && now - lastFailureTime < 30000) {
    return false;
  }

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

    // 1. Timeout strict de 3.5 secondes pour initialiser le flux WebSocket
    const stream = await Promise.race([
      communicate.stream(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Edge TTS stream timeout')), 3500)
      )
    ]);

    if (aborted) return false;

    // 2. Récupération des paquets audio avec timeout de sécurité de 4 secondes
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
        chunkTimeoutId = setTimeout(() => reject(new Error('Edge TTS chunk timeout')), 4000);
      })
    ]);

    if (chunkTimeoutId) clearTimeout(chunkTimeoutId);

    if (aborted || audioChunks.length === 0) {
      consecutiveFailures++;
      lastFailureTime = Date.now();
      return false;
    }

    // 3. Création du Blob et lecture audio
    const audioBlob = new Blob(audioChunks as any, { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(audioBlob);
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
