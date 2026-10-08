import { AnkiWord, AnchoringRecord } from '../types/fluent';
import { STORAGE_KEY as ANCHOR_STORAGE_KEY } from './anchoringUtils';

export interface UserProfileBackup {
  version: number;
  exportedAt: string;
  completedExercises: string[];
  streakDays: number;
  syncedAnkiWords: AnkiWord[];
  anchoringRecords: Record<string, AnchoringRecord>;
  reminderTime?: string;
  webhookUrl?: string;
}

// 1. Générer l'objet de sauvegarde complet
export const createProfileBackup = (
  completedExercises: string[],
  streakDays: number,
  syncedAnkiWords: AnkiWord[],
  anchoringRecords: Record<string, AnchoringRecord>
): UserProfileBackup => {
  const reminderTime = localStorage.getItem('fluent_reminder_time') || '09:00';
  const webhookUrl = localStorage.getItem('fluent_webhook_url') || '';

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedExercises,
    streakDays,
    syncedAnkiWords,
    anchoringRecords,
    reminderTime,
    webhookUrl,
  };
};

// 2. Télécharger la sauvegarde sous forme de fichier JSON
export const downloadProfileBackup = (backup: UserProfileBackup) => {
  const jsonString = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `fluent-progression-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 3. Valider et parser un fichier de sauvegarde
export const parseProfileBackup = (rawContent: string): UserProfileBackup | null => {
  try {
    const data = JSON.parse(rawContent);
    if (typeof data !== 'object' || data === null) return null;

    return {
      version: data.version || 1,
      exportedAt: data.exportedAt || new Date().toISOString(),
      completedExercises: Array.isArray(data.completedExercises) ? data.completedExercises : [],
      streakDays: typeof data.streakDays === 'number' ? data.streakDays : 1,
      syncedAnkiWords: Array.isArray(data.syncedAnkiWords) ? data.syncedAnkiWords : [],
      anchoringRecords: typeof data.anchoringRecords === 'object' && data.anchoringRecords !== null ? data.anchoringRecords : {},
      reminderTime: data.reminderTime || '09:00',
      webhookUrl: data.webhookUrl || '',
    };
  } catch (err) {
    console.error('Erreur lors du parsing de la sauvegarde :', err);
    return null;
  }
};

// 4. Appliquer la sauvegarde dans le stockage local
export const applyProfileBackupToStorage = (backup: UserProfileBackup) => {
  localStorage.setItem('fluent_completed_exercises', JSON.stringify(backup.completedExercises || []));
  localStorage.setItem('fluent_streak_days', (backup.streakDays || 1).toString());
  localStorage.setItem('fluent_anki_words', JSON.stringify(backup.syncedAnkiWords || []));
  localStorage.setItem(ANCHOR_STORAGE_KEY, JSON.stringify(backup.anchoringRecords || {}));
  if (backup.reminderTime) localStorage.setItem('fluent_reminder_time', backup.reminderTime);
  if (backup.webhookUrl) localStorage.setItem('fluent_webhook_url', backup.webhookUrl);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fluent_anki_words_changed', { 
        detail: { words: backup.syncedAnkiWords || [] } 
      })
    );
  }
};

// 5. Fusionner intelligemment la sauvegarde locale et cloud pour ne rien perdre
export const mergeProfileBackups = (
  local: UserProfileBackup,
  cloud: UserProfileBackup
): UserProfileBackup => {
  // Fusionner les exercices complétés sans doublons
  const completedExercises = Array.from(
    new Set([...(local.completedExercises || []), ...(cloud.completedExercises || [])])
  );

  // Conserver le meilleur streak
  const streakDays = Math.max(local.streakDays || 1, cloud.streakDays || 1);

  // Fusionner les mots Anki par Hanzi
  const wordsMap = new Map<string, AnkiWord>();
  (cloud.syncedAnkiWords || []).forEach(w => {
    if (w && w.hanzi) wordsMap.set(w.hanzi.trim(), w);
  });
  (local.syncedAnkiWords || []).forEach(w => {
    if (w && w.hanzi) {
      const cleanH = w.hanzi.trim();
      if (wordsMap.has(cleanH)) {
        const existing = wordsMap.get(cleanH)!;
        wordsMap.set(cleanH, {
          ...existing,
          ...w,
          exampleSentence: w.exampleSentence || existing.exampleSentence,
          examplePinyin: w.examplePinyin || existing.examplePinyin,
          exampleTranslation: w.exampleTranslation || existing.exampleTranslation,
        });
      } else {
        wordsMap.set(cleanH, w);
      }
    }
  });

  // Fusionner les enregistrements d'ancrage
  const anchoringRecords: Record<string, AnchoringRecord> = {
    ...(cloud.anchoringRecords || {}),
    ...(local.anchoringRecords || {}),
  };

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedExercises,
    streakDays,
    syncedAnkiWords: Array.from(wordsMap.values()),
    anchoringRecords,
    reminderTime: local.reminderTime || cloud.reminderTime || '09:00',
    webhookUrl: local.webhookUrl || cloud.webhookUrl || '',
  };
};
