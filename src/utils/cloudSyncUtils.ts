import { supabase } from './supabaseClient';
import { UserProfileBackup, applyProfileBackupToStorage } from './profileSyncUtils';

const SYNC_USER_ID_KEY = 'fluent_sync_user_id';
const LAST_SYNC_KEY = 'fluent_last_cloud_sync';
const AUTO_SYNC_ENABLED_KEY = 'fluent_auto_cloud_sync_enabled';

// Récupérer l'identifiant secret de synchro de l'utilisateur (défaut 'warm1t')
export const getSyncUserId = (): string => {
  return localStorage.getItem(SYNC_USER_ID_KEY) || 'warm1t';
};

// Définir un nouvel identifiant (ex: pour connecter son iPhone avec la même clé)
export const setSyncUserId = (userId: string) => {
  const clean = userId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  localStorage.setItem(SYNC_USER_ID_KEY, clean || 'warm1t');
};

// Savoir si l'auto-synchronisation est activée
export const isAutoSyncEnabled = (): boolean => {
  const val = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
  return val === null ? true : val === 'true'; // activé par défaut
};

export const setAutoSyncEnabled = (enabled: boolean) => {
  localStorage.setItem(AUTO_SYNC_ENABLED_KEY, enabled ? 'true' : 'false');
};

export const getLastSyncTime = (): string | null => {
  return localStorage.getItem(LAST_SYNC_KEY);
};

export const setLastSyncTime = (timestamp: string) => {
  localStorage.setItem(LAST_SYNC_KEY, timestamp);
};

/**
 * Sauvegarder la progression dans Supabase
 */
export const pushProfileToCloud = async (
  profile: UserProfileBackup,
  customUserId?: string
): Promise<{ success: boolean; error?: string }> => {
  const userId = (customUserId || getSyncUserId()).trim().toLowerCase();
  if (!userId) {
    return { success: false, error: 'Identifiant de synchronisation manquant.' };
  }

  try {
    const { error } = await supabase
      .from('fluent_profiles')
      .upsert(
        {
          user_id: userId,
          data: profile,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Erreur Supabase push:', error);
      return { success: false, error: error.message };
    }

    const nowIso = new Date().toISOString();
    setLastSyncTime(nowIso);
    return { success: true };
  } catch (err: any) {
    console.error('Exception Supabase push:', err);
    return { success: false, error: err.message || 'Erreur réseau vers Supabase' };
  }
};

/**
 * Récupérer la progression depuis Supabase
 */
export const pullProfileFromCloud = async (
  customUserId?: string
): Promise<{ success: boolean; data?: UserProfileBackup; error?: string }> => {
  const userId = (customUserId || getSyncUserId()).trim().toLowerCase();
  if (!userId) {
    return { success: false, error: 'Identifiant de synchronisation manquant.' };
  }

  try {
    const { data, error } = await supabase
      .from('fluent_profiles')
      .select('data, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erreur Supabase pull:', error);
      return { success: false, error: error.message };
    }

    if (!data || !data.data) {
      return {
        success: false,
        error: `Aucune sauvegarde trouvée dans le Cloud pour la clé "${userId}". Cliquez sur "Sauvegarder vers le Cloud" d'abord.`,
      };
    }

    const cloudProfile = data.data as UserProfileBackup;
    applyProfileBackupToStorage(cloudProfile);
    setLastSyncTime(data.updated_at || new Date().toISOString());

    return { success: true, data: cloudProfile };
  } catch (err: any) {
    console.error('Exception Supabase pull:', err);
    return { success: false, error: err.message || 'Erreur réseau vers Supabase' };
  }
};
