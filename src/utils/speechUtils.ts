import { VoiceEvaluationResult, MatchedChar } from '../types/fluent';

// Déclaration pour TypeScript du SpeechRecognition du navigateur
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// 1. Synthèse vocale native (100% gratuite, intégrée au système)
export const playChineseAudio = (text: string, rate: number = 1.0): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      alert("Votre navigateur ne supporte pas la synthèse vocale intégrée.");
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stoppe toute lecture en cours

    const cleanText = text.replace(/[^\u4e00-\u9fa5，。？！、]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    utterance.rate = rate; // 1.0 pour normal, 0.8 pour ralenti

    // Recherche d'une voix native chinoise si disponible
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
};

// 2. Vérification du support du micro
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

// 3. Algorithme d'alignement et de correction vocale caractère par caractère
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

