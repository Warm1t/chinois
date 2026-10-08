import { MaayotStory } from '../types/fluent';
import { triggerAutoSyncToCloud } from './cloudSyncUtils';

const STORAGE_KEY = 'fluent_custom_stories';

export const getCustomStories = (): MaayotStory[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Erreur lecture histoires personnalisées :', err);
    return [];
  }
};

export const saveCustomStory = (story: MaayotStory): void => {
  try {
    const current = getCustomStories();
    const filtered = current.filter(s => s.id !== story.id);
    const updated = [story, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fluent_custom_stories_changed', {
          detail: { stories: updated }
        })
      );
    }

    // Déclencher la synchronisation immédiate vers Supabase Cloud
    triggerAutoSyncToCloud();
  } catch (err) {
    console.error('Erreur sauvegarde histoire personnalisée :', err);
  }
};

export const deleteCustomStory = (storyId: string): void => {
  try {
    const current = getCustomStories();
    const updated = current.filter(s => s.id !== storyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fluent_custom_stories_changed', {
          detail: { stories: updated }
        })
      );
    }

    triggerAutoSyncToCloud();
  } catch (err) {
    console.error('Erreur suppression histoire personnalisée :', err);
  }
};

