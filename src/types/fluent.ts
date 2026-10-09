export type HskLevel = 'HSK 3' | 'HSK 4';

export type NuanceCategory = 
  | 'aspect_temps'           // 了1, 了2, 过, 着, 在
  | 'recurrence_frequence'    // 又, 再, 还, 往往, 常常
  | 'structures_speciales'   // 把, 被, 是...的, 连...都
  | 'complements'            // Compléments de résultat (完, 到, 见, 懂) et de potentiel (得/不)
  | 'connecteurs_fluidite';  // 虽然...但是, 只要...就, 越来越

export interface ActiveTestQuestion {
  promptFrench: string;              // "Comment exprimer : 'Tu es encore arrivé en retard hier !' ?"
  sentenceWithBlank: string;         // "你怎么_____迟到了？"
  options: string[];                 // ["又", "再", "还", "过"]
  correctIndex: number;
  explanation: string;               // Pourquoi cette option est la bonne
  distractorExplanations?: string[]; // Explication pour chaque option erronée
  // Défi « Placer dans la phrase » rédigé à la main : segments coupés aux vraies frontières de mots,
  // chaque emplacement incorrect produit une phrase agrammaticale.
  placement?: {
    word: string;          // Mot à insérer
    segments: string[];    // Reste de la phrase, sans ponctuation finale
    correctGap: number;    // Emplacement i = juste avant segments[i] ; segments.length = à la fin
    punctuation?: string;  // Ponctuation finale
  };
}

export interface ExampleSentence {
  chinese: string;
  pinyin: string;
  translation: string;
  contextNote?: string;
}

export interface DialogueLine {
  speaker: string;                   // ex: "A", "B", "Xiao Li"
  chinese: string;
  pinyin: string;
  translation: string;
}

export interface SentenceBuilderExercise {
  promptFrench: string;              // "Remets les mots dans l'ordre pour dire : 'J'ai fini de nettoyer ma chambre avec la structure 把'"
  tokens: string[];                  // Blocs mélangés : ["我", "把", "房间", "打扫", "干净", "了"]
  correctTokens: string[];           // Ordre correct attendu
  explanation: string;               // Explication syntaxique
}

export interface LessonRulePoint {
  pointTitle: string;                // "1. L'objet doit être spécifique et connu"
  explanation: string;               // "On ne peut pas utiliser 把 avec un objet indéfini comme 'un livre quelconque'."
  exampleChinese?: string;
  examplePinyin?: string;
  exampleFrench?: string;
}

export interface NuanceCard {
  id: string;
  moduleId: string;
  moduleTitle: string;
  level: HskLevel;
  category: NuanceCategory;
  title: string;
  structuralFormula: string;         // Formule clé (ex: Sujet + 把 + Objet + Verbe + Résultat)
  situationFrench: string;          // Contexte de communication réel
  keyNuanceExplanation: string;    // Pourquoi les Chinois pensent ainsi
  commonTrap: string;               // Le piège français typique (traduction littérale)
  culturalNote: string;             // Astuce de locuteur natif
  targetChinese: string;           // Phrase cible complète en sinogrammes simplifiés
  targetPinyin: string;            // Pinyin avec accents
  translationFrench: string;       // Traduction française fidèle
  activeTest: ActiveTestQuestion;   // Test de discrimination active
  // Éléments du cours complet & dynamique :
  rulePoints?: LessonRulePoint[];
  additionalExamples?: ExampleSentence[];
  dialogue?: DialogueLine[];
  sentenceBuilder?: SentenceBuilderExercise;
}

// Rétrocompatibilité avec l'ancien nom de type si nécessaire
export type VoiceExercise = NuanceCard;

export interface MatchedChar {
  char: string;
  status: 'correct' | 'incorrect' | 'missing';
}

export interface VoiceEvaluationResult {
  spokenText: string;
  accuracyScore: number;           // 0 à 100%
  matchedCharacters: MatchedChar[];
  feedbackMessage: string;
  isPerfect: boolean;
  aiFeedback?: any;
}

export type AnchoringStage = 'decouvert' | 'assimilation' | 'ancre';

export interface AnchoringRecord {
  cardId: string;
  stage: AnchoringStage;           // 🌱 Découvert, 🌿 En assimilation, 🌳 Ancré
  testPassed: boolean;             // Test de discrimination réussi
  voiceBestScore: number;          // Meilleur score oral (>= 80% requis pour ancrage)
  lastPracticedDate: string;       // Format ISO
  nextReviewDate: string;          // Format YYYY-MM-DD
  intervalDays: number;            // 1, 3, 7, 14, 30 jours
  consecutiveSuccesses: number;
}

export interface CurriculumModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  category: NuanceCategory;
  cardIds: string[];
}

export interface AnkiWord {
  id: string;
  hanzi: string;
  pinyin?: string;
  translation?: string;
  deckName?: string;
  addedAt: string;
  exampleSentence?: string;
  examplePinyin?: string;
  exampleTranslation?: string;
  source?: 'imported_from_anki' | 'fluent_to_anki'; // Distinction : vient d'Anki Desktop vs mot créé dans Fluent à transférer
  syncedToAnkiDesktop?: boolean; // Vrai si le mot a été injecté directement dans Anki Desktop
}

// ==========================================
// TYPES POUR L'ONGLET HISTOIRES IMMERSIVES
// ==========================================

export interface StoryWordToken {
  hanzi: string;
  pinyin: string;
  translation: string;
  isTarget?: boolean;
}

export interface StoryRhythmChunk {
  id: string;
  text: string;
  pinyin: string;
  translation?: string;
  words: StoryWordToken[];
  pauseType: 'breath' | 'comma' | 'period' | 'none'; // '/' = souffle micro-pause, '//' = virgule, '///' = fin de phrase
  stressLevel: 'prominent' | 'standard' | 'light';   // prominent = accent d'insistance, light = particule/pronom rapide
  sandhiHint?: string;                               // ex: "bú devant ton 4" ou "yí wèi" ou "3e+3e -> 2e+3e"
}

export interface SentenceRhythmAnalysis {
  sentenceHanzi: string;
  sentencePinyin: string;
  translation: string;
  chunks: StoryRhythmChunk[];
  rhythmAdvice: string;
}

export interface StorySentence {
  hanzi: string;
  pinyin: string;
  translation: string;
  words: StoryWordToken[];
  rhythmChunks?: StoryRhythmChunk[];
  rhythmAdvice?: string;
}

export interface StoryParagraph {
  sentences: StorySentence[];
}

export interface StoryQuizQuestion {
  question: string;
  questionPinyin?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StoryDiscussionPrompt {
  question: string;
  questionPinyin?: string;
  questionTranslation: string;
  suggestedWords?: string[];
}

export interface MaayotStory {
  id: string;
  title: string;
  titlePinyin: string;
  titleTranslation: string;
  level: HskLevel | 'HSK 2' | 'HSK 5';
  category: string;
  readTime: string;
  wordCount: number;
  dateStr?: string;
  isDaily?: boolean;
  targetWords: {
    hanzi: string;
    pinyin: string;
    translation: string;
  }[];
  paragraphs: StoryParagraph[];
  audioText: string;
  quiz: StoryQuizQuestion[];
  discussionPrompt: StoryDiscussionPrompt;
}

// ==========================================
// TYPES POUR LE CARACTÈRE DU JOUR (DAILY HANZI)
// ==========================================

export interface HanziCompoundWord {
  hanzi: string;
  pinyin: string;
  translation: string;
  level?: string;
}

export interface DailyHanzi {
  id: string;
  character: string;             // ex: "悟"
  pinyin: string;                // ex: "wù"
  tone: number;                  // 1, 2, 3, 4, 5
  meaning: string;               // ex: "Comprendre profondément, s'éveiller à"
  radical: string;               // ex: "忄"
  radicalMeaning: string;        // ex: "Cœur / Esprit / Sentiment"
  strokeCount: number;           // ex: 10
  level: HskLevel | 'HSK 2' | 'HSK 5';
  mnemonic: string;              // Mnémonique visuelle / étymologie
  culturalContext: string;       // Anecdote culturelle ou philosophique
  compoundWords: HanziCompoundWord[]; // Mots courants formés avec ce caractère
  exampleSentence: {
    chinese: string;
    pinyin: string;
    translation: string;
  };
}

