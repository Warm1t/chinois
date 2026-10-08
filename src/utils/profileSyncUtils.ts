import { AnkiWord, AnchoringRecord } from '../types/fluent';
import { STORAGE_KEY as ANCHOR_STORAGE_KEY } from './anchoringUtils';

export interface UserProfileBackup {
  version: number;
  exportedAt: string;
  completedExercises: string[];
  streakDays: number;
  syncedAnkiWords: AnkiWord[];
  anchoringRecords: Record<string, AnchoringRecord>;
  completedStories?: string[];
  voiceLabScores?: Record<string, number>;
  builderCompleted?: Record<string, boolean>;
  customVoicePhrases?: any[];
  reminderTime?: string;
  webhookUrl?: string;
}

// 1. Générer l'objet de sauvegarde complet (avec repli automatique sur localStorage si non passé)
export const createProfileBackup = (
  completedExercises?: string[],
  streakDays?: number,
  syncedAnkiWords?: AnkiWord[],
  anchoringRecords?: Record<string, AnchoringRecord>,
  completedStories?: string[],
  voiceLabScores?: Record<string, number>,
  builderCompleted?: Record<string, boolean>,
  customVoicePhrases?: any[]
): UserProfileBackup => {
  const getStoredJson = <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const finalCompletedExercises = completedExercises ?? getStoredJson<string[]>('fluent_completed_exercises', []);
  const finalStreakDays = streakDays ?? parseInt(localStorage.getItem('fluent_streak_days') || '1', 10);
  const finalSyncedAnkiWords = syncedAnkiWords ?? getStoredJson<AnkiWord[]>('fluent_anki_words', []);
  const finalAnchoringRecords = anchoringRecords ?? getStoredJson<Record<string, AnchoringRecord>>(ANCHOR_STORAGE_KEY, {});
  const finalCompletedStories = completedStories ?? getStoredJson<string[]>('fluent_completed_stories', []);
  const finalVoiceLabScores = voiceLabScores ?? getStoredJson<Record<string, number>>('fluent_voice_lab_scores', {});
  const finalBuilderCompleted = builderCompleted ?? getStoredJson<Record<string, boolean>>('fluent_builder_completed', {});
  const finalCustomVoicePhrases = customVoicePhrases ?? getStoredJson<any[]>('fluent_custom_voice_phrases', []);

  const reminderTime = localStorage.getItem('fluent_reminder_time') || '09:00';
  const webhookUrl = localStorage.getItem('fluent_webhook_url') || '';

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedExercises: finalCompletedExercises,
    streakDays: finalStreakDays,
    syncedAnkiWords: finalSyncedAnkiWords,
    anchoringRecords: finalAnchoringRecords,
    completedStories: finalCompletedStories,
    voiceLabScores: finalVoiceLabScores,
    builderCompleted: finalBuilderCompleted,
    customVoicePhrases: finalCustomVoicePhrases,
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
      completedStories: Array.isArray(data.completedStories) ? data.completedStories : [],
      voiceLabScores: typeof data.voiceLabScores === 'object' && data.voiceLabScores !== null ? data.voiceLabScores : {},
      builderCompleted: typeof data.builderCompleted === 'object' && data.builderCompleted !== null ? data.builderCompleted : {},
      customVoicePhrases: Array.isArray(data.customVoicePhrases) ? data.customVoicePhrases : [],
      reminderTime: data.reminderTime || '09:00',
      webhookUrl: data.webhookUrl || '',
    };
  } catch (err) {
    console.error('Erreur lors du parsing de la sauvegarde :', err);
    return null;
  }
};

// 4. Appliquer la sauvegarde dans le stockage local et notifier tous les modules actifs
export const applyProfileBackupToStorage = (backup: UserProfileBackup) => {
  if (Array.isArray(backup.completedExercises)) {
    localStorage.setItem('fluent_completed_exercises', JSON.stringify(backup.completedExercises));
  }
  if (typeof backup.streakDays === 'number') {
    localStorage.setItem('fluent_streak_days', (backup.streakDays || 1).toString());
  }
  if (Array.isArray(backup.syncedAnkiWords)) {
    localStorage.setItem('fluent_anki_words', JSON.stringify(backup.syncedAnkiWords));
  }
  if (backup.anchoringRecords) {
    localStorage.setItem(ANCHOR_STORAGE_KEY, JSON.stringify(backup.anchoringRecords));
  }
  if (Array.isArray(backup.completedStories)) {
    localStorage.setItem('fluent_completed_stories', JSON.stringify(backup.completedStories));
  }
  if (backup.voiceLabScores) {
    localStorage.setItem('fluent_voice_lab_scores', JSON.stringify(backup.voiceLabScores));
  }
  if (backup.builderCompleted) {
    localStorage.setItem('fluent_builder_completed', JSON.stringify(backup.builderCompleted));
  }
  if (Array.isArray(backup.customVoicePhrases)) {
    localStorage.setItem('fluent_custom_voice_phrases', JSON.stringify(backup.customVoicePhrases));
  }
  if (backup.reminderTime) localStorage.setItem('fluent_reminder_time', backup.reminderTime);
  if (backup.webhookUrl) localStorage.setItem('fluent_webhook_url', backup.webhookUrl);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fluent_anki_words_changed', { 
        detail: { words: backup.syncedAnkiWords || [] } 
      })
    );
    window.dispatchEvent(
      new CustomEvent('fluent_completed_stories_changed', { 
        detail: { completedStoryIds: backup.completedStories || [] } 
      })
    );
    window.dispatchEvent(
      new CustomEvent('fluent_voice_lab_scores_changed', { 
        detail: { scores: backup.voiceLabScores || {} } 
      })
    );
    window.dispatchEvent(
      new CustomEvent('fluent_custom_voice_phrases_changed', { 
        detail: { phrases: backup.customVoicePhrases || [] } 
      })
    );
    window.dispatchEvent(
      new CustomEvent('fluent_profile_updated', { 
        detail: backup 
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

  // Fusionner les histoires complétées
  const completedStories = Array.from(
    new Set([...(local.completedStories || []), ...(cloud.completedStories || [])])
  );

  // Fusionner les scores du labo vocal (meilleur score conservé par phrase)
  const voiceLabScores: Record<string, number> = { ...(cloud.voiceLabScores || {}) };
  Object.entries(local.voiceLabScores || {}).forEach(([id, score]) => {
    voiceLabScores[id] = Math.max(voiceLabScores[id] || 0, score);
  });

  // Fusionner les exercices de construction de phrases
  const builderCompleted: Record<string, boolean> = {
    ...(cloud.builderCompleted || {}),
    ...(local.builderCompleted || {})
  };

  // Fusionner les phrases personnalisées du labo vocal
  const customPhrasesMap = new Map<string, any>();
  (cloud.customVoicePhrases || []).forEach(p => {
    if (p && p.hanzi) customPhrasesMap.set(p.hanzi.trim(), p);
  });
  (local.customVoicePhrases || []).forEach(p => {
    if (p && p.hanzi) customPhrasesMap.set(p.hanzi.trim(), p);
  });
  const customVoicePhrases = Array.from(customPhrasesMap.values());

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
          syncedToAnkiDesktop: existing.syncedToAnkiDesktop || w.syncedToAnkiDesktop,
        });
      } else {
        wordsMap.set(cleanH, w);
      }
    }
  });

  // Fusionner les enregistrements d'ancrage SRS (conserver l'avancement maximal)
  const anchoringRecords: Record<string, AnchoringRecord> = { ...(cloud.anchoringRecords || {}) };
  Object.entries(local.anchoringRecords || {}).forEach(([cardId, localRecord]) => {
    const cloudRecord = anchoringRecords[cardId];
    if (!cloudRecord) {
      anchoringRecords[cardId] = localRecord;
    } else {
      anchoringRecords[cardId] = {
        ...cloudRecord,
        ...localRecord,
        consecutiveSuccesses: Math.max(localRecord.consecutiveSuccesses || 0, cloudRecord.consecutiveSuccesses || 0),
        voiceBestScore: Math.max(localRecord.voiceBestScore || 0, cloudRecord.voiceBestScore || 0),
        stage: (localRecord.consecutiveSuccesses || 0) >= (cloudRecord.consecutiveSuccesses || 0) ? localRecord.stage : cloudRecord.stage,
      };
    }
  });

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedExercises,
    streakDays,
    syncedAnkiWords: Array.from(wordsMap.values()),
    anchoringRecords,
    completedStories,
    voiceLabScores,
    builderCompleted,
    customVoicePhrases,
    reminderTime: cloud.reminderTime || local.reminderTime || '09:00',
    webhookUrl: cloud.webhookUrl || local.webhookUrl || '',
  };
};
