import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { 
  UserProfileBackup, 
  applyProfileBackupToStorage, 
  mergeProfileBackups,
  createProfileBackup
} from './profileSyncUtils';

const SYNC_USER_ID_KEY = 'fluent_sync_user_id';
const LAST_SYNC_KEY = 'fluent_last_cloud_sync';
const AUTO_SYNC_ENABLED_KEY = 'fluent_auto_cloud_sync_enabled';

// ==========================================
// 1. GESTION DE L'AUTHENTIFICATION SUPABASE
// ==========================================

/**
 * Récupérer la session active de Supabase Auth
 */
export const getAuthSession = async (): Promise<Session | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
};

/**
 * Récupérer l'utilisateur actuellement connecté
 */
export const getAuthUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
};

/**
 * Inscription par Email & Mot de passe
 */
export const signUpWithEmail = async (
  email: string, 
  password: string
): Promise<{ success: boolean; user?: User; session?: Session | null; error?: string }> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      user: data.user || undefined, 
      session: data.session 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de l’inscription' };
  }
};

/**
 * Connexion par Email & Mot de passe
 */
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<{ success: boolean; user?: User; session?: Session | null; error?: string }> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      user: data.user || undefined, 
      session: data.session 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de la connexion' };
  }
};

/**
 * Déconnexion du compte
 */
export const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de la déconnexion' };
  }
};

/**
 * Connexion par Magic Link (Lien magique en 1-clic par email)
 */
export const sendMagicLink = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur d’envoi du lien magique' };
  }
};

// ==========================================
// 2. IDENTIFIANT DE SYNCHRONISATION EFFECTIF
// ==========================================

/**
 * Récupère l'identifiant synchrone stocké en local (défaut 'warm1t')
 */
export const getSyncUserId = (): string => {
  return localStorage.getItem(SYNC_USER_ID_KEY) || 'warm1t';
};

/**
 * Définir un identifiant manuel
 */
export const setSyncUserId = (userId: string) => {
  const clean = userId.trim().toLowerCase().replace(/[^a-z0-9_@-]/g, '');
  localStorage.setItem(SYNC_USER_ID_KEY, clean || 'warm1t');
};

/**
 * Détermine l'identifiant effectif :
 * 1. customUserId si spécifié
 * 2. ID de l'utilisateur authentifié (Supabase Auth UID) si connecté
 * 3. Pseudo local stocké en dernier recours
 */
export const resolveEffectiveUserId = async (customUserId?: string): Promise<string> => {
  if (customUserId && customUserId.trim()) {
    return customUserId.trim().toLowerCase();
  }

  const authUser = await getAuthUser();
  if (authUser && authUser.id) {
    return authUser.id;
  }

  return getSyncUserId();
};

// ==========================================
// 3. PARAMÈTRES ET STATUT DE SYNCHRO
// ==========================================

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
 * Lire le profil local actuel depuis localStorage (comprend exercices, streak, mots Anki, ancrage, histoires et labo vocal)
 */
export const getCurrentLocalProfile = (): UserProfileBackup => {
  return createProfileBackup();
};

let autoSyncTimeout: any = null;

/**
 * Déclenche une synchronisation automatique transparente vers Supabase Cloud
 * (immédiate ou debouncée pour grouper les ajouts rapides de cartes Anki ou d'exercices)
 */
export const triggerAutoSyncToCloud = (immediate = false): Promise<void> => {
  if (autoSyncTimeout) {
    clearTimeout(autoSyncTimeout);
    autoSyncTimeout = null;
  }

  if (immediate) {
    if (!isAutoSyncEnabled()) return Promise.resolve();
    const profile = getCurrentLocalProfile();
    return pushProfileToCloud(profile).then(() => {}).catch(err => {
      console.warn('Auto-sync cloud immédiat :', err);
    });
  }

  return new Promise((resolve) => {
    autoSyncTimeout = setTimeout(async () => {
      if (!isAutoSyncEnabled()) {
        resolve();
        return;
      }
      try {
        const profile = getCurrentLocalProfile();
        await pushProfileToCloud(profile);
      } catch (err) {
        console.warn('Auto-sync cloud débouncé :', err);
      }
      resolve();
    }, 600);
  });
};

// ==========================================
// 4. OPÉRATIONS PUSH & PULL CLOUD
// ==========================================

/**
 * Sauvegarder la progression dans Supabase
 */
export const pushProfileToCloud = async (
  profile: UserProfileBackup,
  customUserId?: string
): Promise<{ success: boolean; effectiveUserId?: string; error?: string }> => {
  const userId = await resolveEffectiveUserId(customUserId);
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
    return { success: true, effectiveUserId: userId };
  } catch (err: any) {
    console.error('Exception Supabase push:', err);
    return { success: false, error: err.message || 'Erreur réseau vers Supabase' };
  }
};

/**
 * Récupérer et fusionner la progression depuis Supabase
 */
export const pullProfileFromCloud = async (
  customUserId?: string
): Promise<{ success: boolean; data?: UserProfileBackup; effectiveUserId?: string; error?: string }> => {
  const userId = await resolveEffectiveUserId(customUserId);
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
        error: `Aucune sauvegarde trouvée dans le Cloud pour ce compte. Enregistrez votre progression d’abord !`,
      };
    }

    const cloudProfile = data.data as UserProfileBackup;
    const localProfile = getCurrentLocalProfile();

    // Fusion intelligente : conserve les cartes Anki et progrès des deux côtés sans perte
    const mergedProfile = mergeProfileBackups(localProfile, cloudProfile);
    applyProfileBackupToStorage(mergedProfile);
    setLastSyncTime(data.updated_at || new Date().toISOString());

    // Si le local avait du contenu nouveau qui a enrichi le profil (cartes Anki, histoires, labo vocal, exercices ou histoires personnalisées), le renvoyer silencieusement vers Supabase
    const cloudWords = cloudProfile.syncedAnkiWords?.length || 0;
    const cloudExercises = cloudProfile.completedExercises?.length || 0;
    const cloudStories = cloudProfile.completedStories?.length || 0;
    const cloudVoice = Object.keys(cloudProfile.voiceLabScores || {}).length;
    const cloudCustomStories = (cloudProfile.customStories || []).length;

    const mergedWords = mergedProfile.syncedAnkiWords.length;
    const mergedExercises = mergedProfile.completedExercises.length;
    const mergedStories = (mergedProfile.completedStories || []).length;
    const mergedVoice = Object.keys(mergedProfile.voiceLabScores || {}).length;
    const mergedCustomStories = (mergedProfile.customStories || []).length;

    if (
      mergedWords > cloudWords || 
      mergedExercises > cloudExercises ||
      mergedStories > cloudStories ||
      mergedVoice > cloudVoice ||
      mergedCustomStories > cloudCustomStories
    ) {
      pushProfileToCloud(mergedProfile, userId).catch(() => {});
    }

    return { success: true, data: mergedProfile, effectiveUserId: userId };
  } catch (err: any) {
    console.error('Exception Supabase pull:', err);
    return { success: false, error: err.message || 'Erreur réseau vers Supabase' };
  }
};
