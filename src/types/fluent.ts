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
}
