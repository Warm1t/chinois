import { Communicate } from 'edge-tts-universal';

let currentAudio: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;

export const stopEdgeAudio = () => {
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
};

/**
 * Joue une phrase en utilisant la voix neurale Microsoft Yunxi (homme) ou Xiaoxiao (femme)
 * directement via le moteur haute fidélité Edge TTS, avec support du débit ralenti (0.5x, 0.85x, 1.0x).
 */
export const playEdgeTtsAudio = async (
  text: string,
  voice: 'zh-CN-YunxiNeural' | 'zh-CN-YunjianNeural' | 'zh-CN-XiaoxiaoNeural' = 'zh-CN-YunxiNeural',
  rate: number = 0.85
): Promise<boolean> => {
  stopEdgeAudio();

  const cleanText = text.replace(/[^\u4e00-\u9fa5，。？！、\s]/g, '').trim();
  if (!cleanText) return false;

  // Calcul du paramètre de vitesse pour Edge TTS (ex: '-50%' pour 0.5x, '-15%' pour 0.85x, '+0%' pour 1.0x)
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

  try {
    const communicate = new Communicate(cleanText, {
      voice,
      rate: rateParam,
    });

    const stream = await communicate.stream();
    const audioChunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      if (chunk.type === 'audio' && chunk.data) {
        audioChunks.push(chunk.data);
      }
    }

    if (audioChunks.length === 0) return false;

    const audioBlob = new Blob(audioChunks as any, { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(audioBlob);
    currentBlobUrl = blobUrl;

    const audio = new Audio(blobUrl);
    currentAudio = audio;

    return new Promise<boolean>((resolve) => {
      audio.onended = () => {
        stopEdgeAudio();
        resolve(true);
      };
      audio.onerror = () => {
        stopEdgeAudio();
        resolve(false);
      };
      audio.play().catch(() => {
        stopEdgeAudio();
        resolve(false);
      });
    });
  } catch (err) {
    console.warn("Échec Edge TTS en direct, repli sur synthèse locale :", err);
    return false;
  }
};
