import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { 
  UserProfileBackup, 
  applyProfileBackupToStorage, 
  mergeProfileBackups,
  createProfileBackup,
  saveUserScopedBackup,
  loadUserScopedBackup,
  clearActiveProfileFromStorage,
  ACTIVE_AUTH_UID_KEY
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

    if (data.user?.id) {
      localStorage.setItem(ACTIVE_AUTH_UID_KEY, data.user.id);
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

    if (data.user?.id) {
      localStorage.setItem(ACTIVE_AUTH_UID_KEY, data.user.id);
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
 * Déconnexion du compte :
 * 1. Sauvegarde la progression du compte courant dans son cache scopé et sur le Cloud
 * 2. Déconnecte la session Supabase
 * 3. Nettoie les données actives pour que l'interface hors-connexion affiche 0 progression
 */
export const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentUser = await getAuthUser();
    if (currentUser?.id) {
      const currentProfile = createProfileBackup();
      saveUserScopedBackup(currentUser.id, currentProfile);
      await pushProfileToCloud(currentProfile, currentUser.id).catch(() => {});
    }

    const { error } = await supabase.auth.signOut();
    clearActiveProfileFromStorage();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    clearActiveProfileFromStorage();
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
 * Récupère l'identifiant manuel s'il a été explicitement configuré par l'utilisateur
 */
export const getSyncUserId = (): string => {
  const val = localStorage.getItem(SYNC_USER_ID_KEY);
  // Ignorer l'ancien identifiant par défaut 'warm1t' qui polluait les sessions non connectées
  if (!val || val === 'warm1t') return '';
  return val;
};

/**
 * Définir un identifiant manuel
 */
export const setSyncUserId = (userId: string) => {
  const clean = userId.trim().toLowerCase().replace(/[^a-z0-9_@-]/g, '');
  if (clean && clean !== 'warm1t') {
    localStorage.setItem(SYNC_USER_ID_KEY, clean);
  } else {
    localStorage.removeItem(SYNC_USER_ID_KEY);
  }
};

/**
 * Détermine l'identifiant effectif :
 * 1. customUserId si spécifié explicitement
 * 2. ID de l'utilisateur authentifié (Supabase Auth UID) si connecté
 * 3. Chaîne vide si non connecté (aucune synchronisation fantôme !)
 */
export const resolveEffectiveUserId = async (customUserId?: string): Promise<string> => {
  if (customUserId && customUserId.trim() && customUserId.trim() !== 'warm1t') {
    return customUserId.trim().toLowerCase();
  }

  const authUser = await getAuthUser();
  if (authUser && authUser.id) {
    return authUser.id;
  }

  return '';
};

// ==========================================
// 3. PARAMÈTRES ET STATUT DE SYNCHRO
// ==========================================

export const isAutoSyncEnabled = (): boolean => {
  const val = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
  return val === null ? true : val === 'true'; // activé par défaut quand connecté
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
 * Lire le profil local actuel depuis localStorage
 */
export const getCurrentLocalProfile = (): UserProfileBackup => {
  return createProfileBackup();
};

let autoSyncTimeout: any = null;

/**
 * Déclenche une synchronisation automatique vers Supabase Cloud
 * UNIQUEMENT si un utilisateur est connecté à son compte !
 */
export const triggerAutoSyncToCloud = (immediate = false): Promise<void> => {
  if (autoSyncTimeout) {
    clearTimeout(autoSyncTimeout);
    autoSyncTimeout = null;
  }

  const runSync = async () => {
    const authUser = await getAuthUser();
    if (!authUser || !authUser.id) {
      // Non connecté : ne jamais envoyer sur un compte partagé
      return;
    }
    const profile = getCurrentLocalProfile();
    saveUserScopedBackup(authUser.id, profile);
    if (!isAutoSyncEnabled()) return;
    await pushProfileToCloud(profile, authUser.id);
  };

  if (immediate) {
    return runSync().catch((err) => {
      console.warn('Auto-sync cloud immédiat :', err);
    });
  }

  return new Promise((resolve) => {
    autoSyncTimeout = setTimeout(async () => {
      try {
        await runSync();
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
    return { success: false, error: 'Connectez-vous à votre compte pour sauvegarder dans le Cloud.' };
  }

  try {
    saveUserScopedBackup(userId, profile);

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
 * Récupérer et restaurer la progression depuis Supabase pour l'utilisateur connecté
 */
export const pullProfileFromCloud = async (
  customUserId?: string
): Promise<{ success: boolean; data?: UserProfileBackup; effectiveUserId?: string; error?: string }> => {
  const userId = await resolveEffectiveUserId(customUserId);
  if (!userId) {
    return { success: false, error: 'Aucun compte connecté.' };
  }

  localStorage.setItem(ACTIVE_AUTH_UID_KEY, userId);

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

    const scopedLocal = loadUserScopedBackup(userId);
    const activeLocal = getCurrentLocalProfile();
    const baseLocal = scopedLocal ? mergeProfileBackups(scopedLocal, activeLocal) : activeLocal;

    if (!data || !data.data) {
      // Si aucune sauvegarde cloud n'existe encore pour ce compte, appliquer son cache scopé ou sauvegarder sa session actuelle
      applyProfileBackupToStorage(baseLocal);
      saveUserScopedBackup(userId, baseLocal);
      await pushProfileToCloud(baseLocal, userId).catch(() => {});
      return {
        success: true,
        data: baseLocal,
        effectiveUserId: userId,
      };
    }

    const cloudProfile = data.data as UserProfileBackup;

    // Fusion intelligente entre le profil du compte (scopé + session) et le Cloud
    const mergedProfile = mergeProfileBackups(baseLocal, cloudProfile);
    applyProfileBackupToStorage(mergedProfile);
    saveUserScopedBackup(userId, mergedProfile);
    setLastSyncTime(data.updated_at || new Date().toISOString());

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
