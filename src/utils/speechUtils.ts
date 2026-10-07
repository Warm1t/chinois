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

// Mots-clés pour classer les voix chinoises par genre
const CHINESE_FEMALE_KEYWORDS = [
  'xiaoxiao', 'xiaoyi', 'huihui', 'yaoyao', 'tingting', 'meijia', 
  'sinji', 'hiugaai', 'hsiaochen', 'hanhan', 'female', 'wavenet-a', 
  'wavenet-d', 'standard-a', 'standard-d', '普通话', 'yating', 
  'xiaoyan', 'xiaomeng', 'xiaoshuang', 'tiantian', 'femme', '女'
];

const CHINESE_MALE_KEYWORDS = [
  'yunxi', 'yunjian', 'yunyang', 'kangkang', 'zhiwei', 'yushu', 
  'yu-shu', 'limu', 'li-mu', 'male', 'yunfan', 'yunze', 'wavenet-b', 
  'wavenet-c', 'standard-b', 'standard-c', 'wanlung', 'yunfeng', 
  'yunhao', 'homme', '男', 'daniel'
];

/**
 * Vérifie si une voix est formellement exclue (Japonais, Coréen, ou autre langue non-chinoise).
 * Empêche catégoriquement que des voix japonaises (ex: "Google 日本語", "Microsoft 七海") ou coréennes
 * soient sélectionnées par erreur à cause des caractères Kanji / Hanja partagés en Unicode.
 */
export const isVoiceForbiddenNonChinese = (voice: SpeechSynthesisVoice): boolean => {
  const lang = (voice.lang || '').toLowerCase().replace(/_/g, '-');
  const name = (voice.name || '').toLowerCase();

  // 1. Exclusion absolue du japonais
  if (lang.startsWith('ja') || lang.startsWith('jp')) return true;
  if (
    name.includes('japan') || 
    name.includes('japanese') || 
    name.includes('nihon') || 
    voice.name.includes('日本語') || 
    voice.name.includes('日語')
  ) {
    return true;
  }

  // 2. Exclusion absolue du coréen
  if (lang.startsWith('ko') || lang.startsWith('kr')) return true;
  if (
    name.includes('korea') || 
    name.includes('korean') || 
    name.includes('hangul') || 
    voice.name.includes('한국') || 
    voice.name.includes('韓国')
  ) {
    return true;
  }

  // 3. Exclusion des autres langues occidentales / courantes non-chinoises
  if (
    lang.startsWith('en') ||
    lang.startsWith('fr') ||
    lang.startsWith('de') ||
    lang.startsWith('es') ||
    lang.startsWith('it') ||
    lang.startsWith('pt') ||
    lang.startsWith('ru') ||
    lang.startsWith('vi') ||
    lang.startsWith('th') ||
    lang.startsWith('hi') ||
    lang.startsWith('ar') ||
    lang.startsWith('nl') ||
    lang.startsWith('pl') ||
    lang.startsWith('tr')
  ) {
    return true;
  }

  return false;
};

/**
 * Vérifie si une voix est authentiquement chinoise (Mandarin, Taïwanais, Cantonais).
 */
export const isVoiceChinese = (voice: SpeechSynthesisVoice): boolean => {
  if (isVoiceForbiddenNonChinese(voice)) return false;

  const lang = (voice.lang || '').toLowerCase().replace(/_/g, '-');
  const name = (voice.name || '').toLowerCase();

  // 1. Code ISO chinois officiel
  if (lang.startsWith('zh') || lang.startsWith('cmn') || lang.startsWith('yue')) {
    return true;
  }

  // 2. Mots-clés explicites désignant la langue chinoise dans le nom
  const CHINESE_KEYWORDS = [
    'chinese', 'mandarin', 'putonghua', 'guoyu', 'huayu', 
    'cantonese', 'zhongwen', 'hanyu'
  ];
  if (CHINESE_KEYWORDS.some(kw => name.includes(kw))) {
    return true;
  }

  // 3. Noms en caractères chinois sans ambiguïté
  if (
    voice.name.includes('普通话') || 
    voice.name.includes('普通話') || 
    voice.name.includes('国语') || 
    voice.name.includes('國語') || 
    voice.name.includes('中文') || 
    voice.name.includes('汉语') || 
    voice.name.includes('漢語') || 
    voice.name.includes('华语') || 
    voice.name.includes('華語')
  ) {
    return true;
  }

  return false;
};

/**
 * Détermine si une voix chinoise est masculine
 */
export const isChineseMaleVoice = (voice: SpeechSynthesisVoice): boolean => {
  const name = voice.name.toLowerCase();
  return CHINESE_MALE_KEYWORDS.some(kw => name.includes(kw));
};

/**
 * Détermine si une voix chinoise est féminine
 */
export const isChineseFemaleVoice = (voice: SpeechSynthesisVoice): boolean => {
  if (isChineseMaleVoice(voice)) return false;
  const name = voice.name.toLowerCase();
  return CHINESE_FEMALE_KEYWORDS.some(kw => name.includes(kw));
};

/**
 * Score de pertinence privilégiant le Mandarin Standard (Putonghua / HSK)
 * et les voix neurales / naturelles haute fidélité.
 */
const getChineseVoiceScore = (voice: SpeechSynthesisVoice): number => {
  const lang = (voice.lang || '').toLowerCase().replace(/_/g, '-');
  const name = (voice.name || '').toLowerCase();
  let score = 0;

  // 1. Priorité Mandarin Standard (Putonghua / Chine continentale / Singapour)
  if (lang.includes('zh-cn') || lang.includes('cmn-hans') || lang.includes('zh-sg')) {
    score += 100;
  } else if (lang.includes('zh-tw') || lang.includes('cmn-hant') || name.includes('taiwan')) {
    score += 80; // Mandarin Taïwan (Guoyu)
  } else if (lang.includes('zh-hk') || lang.includes('yue')) {
    score += 40; // Cantonais (si aucun mandarin n'est disponible)
  } else if (lang.startsWith('zh') || lang.startsWith('cmn')) {
    score += 70;
  }

  // 2. Bonus qualité : Voix Neurales / Naturelles / Online
  if (name.includes('natural') || name.includes('neural') || name.includes('online') || name.includes('premium')) {
    score += 50;
  }
  if (name.includes('google') || name.includes('apple') || name.includes('wavenet')) {
    score += 30;
  }

  return score;
};

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
    }, 400);
  });
};

/**
 * Analyse et sélection des meilleures voix chinoises (Homme & Femme, Naturelles / Neurales)
 */
export const getChineseVoicesBank = async (): Promise<VoiceBankSummary> => {
  const allVoices = await loadBrowserVoices();
  const pref = getVoiceGenderPreference();

  // Filtrage STRICT des voix chinoises (élimine 100% des voix japonaises ou autres)
  const chineseVoices = allVoices.filter(isVoiceChinese);

  const femaleList: SpeechSynthesisVoice[] = [];
  const maleList: SpeechSynthesisVoice[] = [];

  chineseVoices.forEach(voice => {
    if (isChineseMaleVoice(voice)) {
      maleList.push(voice);
    } else if (isChineseFemaleVoice(voice)) {
      femaleList.push(voice);
    } else {
      // Voix générique chinoise non identifiée spécifiquement comme masculine
      femaleList.push(voice);
    }
  });

  // Tri par pertinence Mandarin + qualité
  femaleList.sort((a, b) => getChineseVoiceScore(b) - getChineseVoiceScore(a));
  maleList.sort((a, b) => getChineseVoiceScore(b) - getChineseVoiceScore(a));

  const formatVoiceName = (voice?: SpeechSynthesisVoice, fallbackLabel = ''): string => {
    if (!voice) return fallbackLabel;
    return voice.name
      .replace(/^Microsoft\s+/i, '')
      .replace(/\s+Online\s+\(Natural\)/i, ' (HD Naturelle)')
      .replace(/\s+Desktop/i, '')
      .replace(/\s*-\s*Chinese\s*\([^)]+\)/i, '');
  };

  const bestFemale = femaleList[0] 
    ? formatVoiceName(femaleList[0])
    : (chineseVoices[0] ? formatVoiceName(chineseVoices[0]) : 'Voix Chinoise Féminine (Mandarin)');

  const bestMale = maleList[0] 
    ? formatVoiceName(maleList[0])
    : (femaleList[0] 
        ? `${formatVoiceName(femaleList[0])} (Timbre Homme)` 
        : 'Voix Chinoise Masculine (Mandarin)');

  const isNeuralAvailable = chineseVoices.some(v => 
    v.name.toLowerCase().includes('natural') || 
    v.name.toLowerCase().includes('neural') ||
    v.name.toLowerCase().includes('online') ||
    v.name.toLowerCase().includes('google')
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
 * 1. Synthèse vocale enrichie avec alternance Homme/Femme et timbres naturels chinois
 * Entraîne l'oreille en variant les timbres et fréquences acoustiques en mandarin standard.
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
    utterance.lang = 'zh-CN'; // Force standard Mandarin language tag

    let voiceToUse: SpeechSynthesisVoice | undefined;
    let pitch = 1.0;
    let playbackRate = rate;

    if (genderToUse === 'female') {
      voiceToUse = bank.femaleVoices[0] || bank.maleVoices[0];
      pitch = 1.06;
      playbackRate = rate * 1.0;
    } else {
      if (bank.maleVoices.length > 0) {
        voiceToUse = bank.maleVoices[0];
        pitch = 0.94;
        playbackRate = rate * 0.98;
      } else {
        // Si aucune voix masculine native n'est installée, on utilise la voix chinoise disponible
        // avec une modulation acoustique de formants (pitch plus grave) pour simuler un timbre masculin
        voiceToUse = bank.femaleVoices[0];
        pitch = 0.82;
        playbackRate = rate * 0.94;
      }
    }

    // Sécurité absolue : on n'assigne la voix QUE si elle est 100% chinoise vérifiée
    if (voiceToUse && isVoiceChinese(voiceToUse)) {
      utterance.voice = voiceToUse;
    }
    // Si aucune voix dans la liste ne correspond, utterance.voice reste undefined
    // et le navigateur utilise son moteur natif zh-CN au lieu d'une voix japonaise/autre!

    utterance.pitch = pitch;
    utterance.rate = playbackRate;

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
