import { AnchoringRecord, NuanceCard, AnchoringStage } from '../types/fluent';

const STORAGE_KEY = 'fluent_anchoring_records';

export const getAnchoringRecords = (): Record<string, AnchoringRecord> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
};

export const saveAnchoringRecord = (record: AnchoringRecord): Record<string, AnchoringRecord> => {
  const records = getAnchoringRecords();
  records[record.cardId] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records;
};

// Mettre à jour l'ancrage lors de la réussite du test actif
export const recordTestSuccess = (cardId: string): AnchoringRecord => {
  const records = getAnchoringRecords();
  const current = records[cardId] || {
    cardId,
    stage: 'decouvert',
    testPassed: false,
    voiceBestScore: 0,
    lastPracticedDate: new Date().toISOString(),
    nextReviewDate: getFormattedDate(1), // J+1
    intervalDays: 1,
    consecutiveSuccesses: 0,
  };

  current.testPassed = true;
  if (current.voiceBestScore >= 80) {
    current.stage = 'ancre';
  } else {
    current.stage = 'assimilation';
  }
  current.lastPracticedDate = new Date().toISOString();

  saveAnchoringRecord(current);
  return current;
};

// Mettre à jour l'ancrage lors de la pratique vocale
export const recordVoiceScore = (cardId: string, score: number): AnchoringRecord => {
  const records = getAnchoringRecords();
  const current = records[cardId] || {
    cardId,
    stage: 'decouvert',
    testPassed: false,
    voiceBestScore: 0,
    lastPracticedDate: new Date().toISOString(),
    nextReviewDate: getFormattedDate(1),
    intervalDays: 1,
    consecutiveSuccesses: 0,
  };

  if (score > current.voiceBestScore) {
    current.voiceBestScore = score;
  }

  // Si score >= 80 et test passé -> passage au stade ANCRÉ
  if (score >= 80 && current.testPassed) {
    current.stage = 'ancre';
    current.consecutiveSuccesses += 1;
    // Intervalles de répétition espacée (SRS) : 1j, 3j, 7j, 14j, 30j
    const intervals = [1, 3, 7, 14, 30];
    const nextInterval = intervals[Math.min(current.consecutiveSuccesses, intervals.length - 1)];
    current.intervalDays = nextInterval;
    current.nextReviewDate = getFormattedDate(nextInterval);
  } else if (current.testPassed) {
    current.stage = 'assimilation';
  }

  current.lastPracticedDate = new Date().toISOString();
  saveAnchoringRecord(current);
  return current;
};

// Format YYYY-MM-DD avec décalage de jours
export const getFormattedDate = (daysOffset: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

// Obtenir la liste des fiches à réviser aujourd'hui
export const getCardsDueForReview = (cards: NuanceCard[]): NuanceCard[] => {
  const records = getAnchoringRecords();
  const today = getFormattedDate(0);

  return cards.filter((card) => {
    const rec = records[card.id];
    if (!rec) return false;
    // Si la date de révision est aujourd'hui ou passée, ou si pas encore ancré
    return rec.nextReviewDate <= today || rec.stage !== 'ancre';
  });
};
