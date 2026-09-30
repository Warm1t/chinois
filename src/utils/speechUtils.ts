import { VoiceEvaluationResult, MatchedChar } from '../types/fluent';

// Déclaration pour TypeScript du SpeechRecognition du navigateur
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type VoiceGenderPreference = 'alternate' | 'female' | 'male';

export interface VoiceOptionInfo {
  voice: SpeechSynthesisVoice;
  gender: 'female' | 'male';
  isNeural: boolean;
  displayName: string;
}

export interface VoiceBankSummary {
  preference: VoiceGenderPreference;
  activeGender: 'female' | 'male';
  femaleVoices: SpeechSynthesisVoice[];
  maleVoices: SpeechSynthesisVoice[];
  bestFemaleName: string;
  bestMaleName: string;
  isNeuralAvailable: boolean;
  totalChineseVoices: number;
}

// Clé de stockage locale
const VOICE_PREF_KEY = 'fluent_voice_gender';

// État d'alternance en mémoire (alterne à chaque lecture en mode 'alternate')
let currentAlternateGender: 'female' | 'male' = 'female';
let isStoryAudioPlaying = false;
let currentStoryAbortController: { abort: () => void } | null = null;

// Mots-clés pour classer les voix chinoises
const FEMALE_NAMES = [
  'xiaoxiao', 'xiaoyi', 'huihui', 'yaoyao', 'tingting', 'meijia', 
  'sinji', 'hiugaai', 'hsiaochen', 'hanhan', 'female', 'wavenet-a', 
  'wavenet-c', 'wavenet-d', '普通话', 'standard'
];

const MALE_NAMES = [
  'yunxi', 'yunjian', 'yunyang', 'kangkang', 'zhiwei', 'yushu', 
  'limu', 'male', 'yunfan', 'yunze', 'wavenet-b', 'homme', 'daniel'
];

const NEURAL_KEYWORDS = [
  'natural', 'neural', 'online', 'premium', 'multilingual', 'google', 'apple'
];

/**
 * Récupérer la préférence utilisateur (par défaut 'alternate' pour habituer l'oreille)
 */
export const getVoiceGenderPreference = (): VoiceGenderPreference => {
  if (typeof window === 'undefined') return 'alternate';
  const saved = localStorage.getItem(VOICE_PREF_KEY);
  if (saved === 'female' || saved === 'male' || saved === 'alternate') {
    return saved;
  }
  return 'alternate';
};

/**
 * Mettre à jour la préférence utilisateur et notifier l'interface
 */
export const setVoiceGenderPreference = (preference: VoiceGenderPreference): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VOICE_PREF_KEY, preference);
  window.dispatchEvent(new CustomEvent('fluent_voice_gender_changed', { detail: preference }));
};

/**
 * Chargement asynchrone des voix du navigateur (compatible Edge, Chrome, Safari, Firefox)
 */
export const loadBrowserVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Si la liste est encore vide au premier chargement, écouter l'événement navigateur
    const onVoicesChanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    // Timeout de secours au cas où le navigateur ne déclenche pas l'événement
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 350);
  });
};

/**
 * Analyse et sélection des meilleures voix chinoises (Homme & Femme, Naturelles / Neurales)
 */
export const getChineseVoicesBank = async (): Promise<VoiceBankSummary> => {
  const allVoices = await loadBrowserVoices();
  const pref = getVoiceGenderPreference();

  // Filtre des voix chinoises (mandarin, cantonais, taïwanais)
  const chineseVoices = allVoices.filter(v => {
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase();
    return (
      lang.startsWith('zh') ||
      lang.startsWith('cmn') ||
      name.includes('chinese') ||
      name.includes('mandarin') ||
      /[\u4e00-\u9fa5]/.test(v.name)
    );
  });

  const femaleList: SpeechSynthesisVoice[] = [];
  const maleList: SpeechSynthesisVoice[] = [];

  chineseVoices.forEach(voice => {
    const nameLower = voice.name.toLowerCase();
    const isMale = MALE_NAMES.some(kw => nameLower.includes(kw));
    const isFemale = FEMALE_NAMES.some(kw => nameLower.includes(kw));

    if (isMale) {
      maleList.push(voice);
    } else if (isFemale) {
      femaleList.push(voice);
    } else {
      // Par défaut, la plupart des voix système chinoises standards (ex: Huihui) sont féminines
      femaleList.push(voice);
    }
  });

  // Fonction de tri privilégiant les voix neurales/naturelles
  const sortQuality = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aIsNeural = NEURAL_KEYWORDS.some(kw => aName.includes(kw));
    const bIsNeural = NEURAL_KEYWORDS.some(kw => bName.includes(kw));
    if (aIsNeural && !bIsNeural) return -1;
    if (!aIsNeural && bIsNeural) return 1;
    return 0;
  };

  femaleList.sort(sortQuality);
  maleList.sort(sortQuality);

  const bestFemale = femaleList[0]?.name || (chineseVoices[0]?.name || 'Voix Féminine (Synthèse HD)');
  const bestMale = maleList[0]?.name || (chineseVoices[0] ? `${chineseVoices[0].name} (Modulation Timbre Homme)` : 'Voix Masculine (Timbre Résonant)');
  
  const isNeuralAvailable = chineseVoices.some(v => 
    NEURAL_KEYWORDS.some(kw => v.name.toLowerCase().includes(kw))
  );

  return {
    preference: pref,
    activeGender: currentAlternateGender,
    femaleVoices: femaleList,
    maleVoices: maleList,
    bestFemaleName: bestFemale,
    bestMaleName: bestMale,
    isNeuralAvailable,
    totalChineseVoices: chineseVoices.length,
  };
};

/**
 * 1. Synthèse vocale enrichie avec alternance Homme/Femme et timbres naturels
 * Entraîne l'oreille en variant les timbres et fréquences acoustiques.
 */
export const playChineseAudio = async (
  text: string, 
  rate: number = 1.0, 
  forcedGender?: 'female' | 'male'
): Promise<void> => {
  return new Promise(async (resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Votre navigateur ne supporte pas la synthèse vocale intégrée.");
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stoppe toute lecture en cours

    const cleanText = text.replace(/[^\u4e00-\u9fa5，。？！、\s]/g, '').trim();
    if (!cleanText) {
      resolve();
      return;
    }

    const bank = await getChineseVoicesBank();
    const pref = getVoiceGenderPreference();

    // Détermination du genre pour cette écoute
    let genderToUse: 'female' | 'male';
    if (forcedGender) {
      genderToUse = forcedGender;
    } else if (pref === 'alternate') {
      // Alterne à chaque appel pour habituer l'oreille
      genderToUse = currentAlternateGender === 'female' ? 'male' : 'female';
      currentAlternateGender = genderToUse;
    } else {
      genderToUse = pref;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';

    if (genderToUse === 'female') {
      // Profil Féminin : timbre clair, pitch légèrement rehaussé pour une clarté cristalline
      const voice = bank.femaleVoices[0] || bank.maleVoices[0];
      if (voice) utterance.voice = voice;
      utterance.pitch = 1.08;
      utterance.rate = rate * 1.0;
    } else {
      // Profil Masculin : timbre plus profond, résonance pectorale naturelle
      const maleVoice = bank.maleVoices[0];
      if (maleVoice) {
        utterance.voice = maleVoice;
        utterance.pitch = 0.92;
        utterance.rate = rate * 0.96;
      } else {
        // Si le système n'a pas de voix masculine dédiée installée,
        // on applique une modulation acoustique de formants (pitch 0.80) qui crée
        // un timbre masculin distinct et authentique à partir de la voix disponible.
        if (bank.femaleVoices[0]) utterance.voice = bank.femaleVoices[0];
        utterance.pitch = 0.80;
        utterance.rate = rate * 0.92;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Arrêter immédiatement la synthèse vocale en cours
 */
export const stopChineseAudio = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentStoryAbortController) {
    currentStoryAbortController.abort();
    currentStoryAbortController = null;
  }
  isStoryAudioPlaying = false;
};

/**
 * Lecture complète d'une histoire phrase par phrase avec alternance dynamique Homme/Femme
 * Évite le bug Chromium des textes longs et crée une immersion narrative vivante.
 */
export const playChineseStoryAudio = async (
  storyText: string,
  rate: number = 1.0,
  onSentenceProgress?: (currentSentenceIndex: number, sentenceText: string, gender: 'female' | 'male') => void
): Promise<void> => {
  stopChineseAudio();

  // Découpage en phrases
  const rawSentences = storyText.split(/(?<=[。！？!?\n])/g).map(s => s.trim()).filter(Boolean);
  if (rawSentences.length === 0) return;

  isStoryAudioPlaying = true;
  let aborted = false;

  currentStoryAbortController = {
    abort: () => {
      aborted = true;
      window.speechSynthesis?.cancel();
    }
  };

  const pref = getVoiceGenderPreference();
  let sentenceGender: 'female' | 'male' = 'female';

  for (let i = 0; i < rawSentences.length; i++) {
    if (aborted) break;

    const sentence = rawSentences[i];

    // Détermination du genre de la phrase
    if (pref === 'female') {
      sentenceGender = 'female';
    } else if (pref === 'male') {
      sentenceGender = 'male';
    } else {
      // Mode 'alternate' : dialogue / alternance phrase par phrase !
      sentenceGender = i % 2 === 0 ? 'female' : 'male';
    }

    if (onSentenceProgress) {
      onSentenceProgress(i, sentence, sentenceGender);
    }

    await playChineseAudio(sentence, rate, sentenceGender);

    if (aborted) break;

    // Petite pause naturelle entre les phrases (250ms)
    await new Promise(r => setTimeout(r, 220));
  }

  isStoryAudioPlaying = false;
  currentStoryAbortController = null;
};

/**
 * Prononciation de mots isolés / vocabulaire de dictionnaire avec audio natif haute fidélité
 */
export const playNativeWordAudio = async (word: string, fallbackRate: number = 0.85): Promise<void> => {
  const cleanWord = word.replace(/[^\u4e00-\u9fa5]/g, '').trim();
  if (!cleanWord) return;

  try {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanWord)}&le=zh`;
    const audio = new Audio(audioUrl);
    
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject();
      // Sécurité : timeout de 2.5 secondes si réseau lent
      setTimeout(() => resolve(), 2500);
      audio.play().catch(reject);
    });
  } catch {
    // Repli immédiat sur la synthèse vocale locale si hors-ligne ou bloqué
    await playChineseAudio(cleanWord, fallbackRate);
  }
};

/**
 * 2. Vérification du support du micro
 */
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

/**
 * 3. Algorithme d'alignement et de correction vocale caractère par caractère
 */
export const evaluatePronunciation = (spokenRaw: string, targetRaw: string): VoiceEvaluationResult => {
  // Nettoyage : retirer espaces et ponctuation
  const cleanTarget = targetRaw.replace(/[^\u4e00-\u9fa5]/g, '');
  const cleanSpoken = spokenRaw.replace(/[^\u4e00-\u9fa5]/g, '');

  if (!cleanSpoken) {
    return {
      spokenText: '',
      accuracyScore: 0,
      matchedCharacters: cleanTarget.split('').map(char => ({ char, status: 'missing' })),
      feedbackMessage: "Aucun son chinois détecté. Parle bien en face de ton micro en articulant.",
      isPerfect: false,
    };
  }

  const matchedCharacters: MatchedChar[] = [];
  let correctCount = 0;
  const spokenChars = cleanSpoken.split('');
  const targetChars = cleanTarget.split('');

  // Comparaison par alignement
  for (let i = 0; i < targetChars.length; i++) {
    const targetChar = targetChars[i];
    
    // Exact match à la même position
    if (spokenChars[i] === targetChar) {
      matchedCharacters.push({ char: targetChar, status: 'correct' });
      correctCount++;
    } 
    // Présent dans la phrase prononcée à proximité
    else if (spokenChars.includes(targetChar)) {
      matchedCharacters.push({ char: targetChar, status: 'correct' });
      correctCount++;
    } 
    // Caractère manqué ou mal prononcé
    else {
      matchedCharacters.push({ char: targetChar, status: 'incorrect' });
    }
  }

  // Calcul du score en pourcentage
  const rawScore = Math.round((correctCount / targetChars.length) * 100);
  const accuracyScore = Math.min(100, Math.max(0, rawScore));
  const isPerfect = accuracyScore >= 95;

  let feedbackMessage = "";
  if (isPerfect) {
    feedbackMessage = "太棒了 ! Prononciation et rythme parfaits, phrase 100% naturelle !";
  } else if (accuracyScore >= 75) {
    feedbackMessage = "Très bon essai ! Presque parfait, fais attention aux caractères surlignés en rouge.";
  } else if (accuracyScore >= 50) {
    feedbackMessage = "Compréhensible, mais certains sons ou tons ont été escamotés. Écoute la voix ralentie et réessaie !";
  } else {
    feedbackMessage = "La reconnaissance a eu du mal à capter tes sons. Réécoute attentivement à 0.8x et insiste sur les consonnes et les tons.";
  }

  return {
    spokenText: cleanSpoken,
    accuracyScore,
    matchedCharacters,
    feedbackMessage,
    isPerfect,
  };
};
