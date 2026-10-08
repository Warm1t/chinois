import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  getAuthUser, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  sendMagicLink, 
  pushProfileToCloud, 
  pullProfileFromCloud,
  getLastSyncTime
} from '../utils/cloudSyncUtils';
import { getCurrentLocalProfile } from '../utils/cloudSyncUtils';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  LogOut, 
  RefreshCw, 
  Smartphone, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: User) => void;
  onSignOutSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onSignOutSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'magic'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Vérifier si l'utilisateur est déjà connecté à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      getAuthUser().then((user) => {
        setCurrentUser(user);
        setLastSyncTime(getLastSyncTime());
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Connexion par Email & Mot de Passe
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await signInWithEmail(email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSuccessMessage('🎉 Connexion réussie ! Vos appareils sont désormais reliés.');
      
      // Synchroniser immédiatement les données du compte
      setIsSyncing(true);
      await pullProfileFromCloud();
      setIsSyncing(false);
      setLastSyncTime(getLastSyncTime());

      if (onAuthSuccess) onAuthSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      const err = res.error || '';
      if (err.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage('Email ou mot de passe incorrect.');
      } else if (err.toLowerCase().includes('email not confirmed')) {
        setErrorMessage('Veuillez confirmer votre adresse email en cliquant sur le lien reçu dans votre boîte mail.');
      } else {
        setErrorMessage(err || 'Échec de la connexion.');
      }
    }
  };

  // 2. Inscription
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Veuillez renseigner un email et un mot de passe.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await signUpWithEmail(email, password);
    setIsLoading(false);

    if (res.success) {
      if (res.session && res.user) {
        // Connexion immédiate si pas de confirmation requise
        setCurrentUser(res.user);
        setSuccessMessage('🎉 Compte créé et connecté ! Sauvegarde en cours...');
        
        // Sauvegarder la progression actuelle locale dans ce nouveau compte
        const currentLocal = getCurrentLocalProfile();
        await pushProfileToCloud(currentLocal, res.user.id);
        
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(() => onClose(), 1500);
      } else {
        // Confirmation par email requise par Supabase
        setSuccessMessage(
          '✉️ Compte créé avec succès ! Un email de confirmation vous a été envoyé. Cliquez sur le lien reçu pour finaliser votre inscription.'
        );
      }
    } else {
      setErrorMessage(res.error || 'Erreur lors de la création du compte.');
    }
  };

  // 3. Connexion par Magic Link (Lien magique en 1-clic)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Veuillez renseigner votre email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await sendMagicLink(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('✉️ Lien magique envoyé ! Vérifiez votre boîte mail pour vous connecter en 1 clic.');
    } else {
      setErrorMessage(res.error || 'Erreur d’envoi du lien magique.');
    }
  };

  // 4. Déconnexion
  const handleSignOut = async () => {
    setIsLoading(true);
    await signOutUser();
    setCurrentUser(null);
    setIsLoading(false);
    setSuccessMessage('Vous êtes déconnecté sur cet appareil.');
    if (onSignOutSuccess) onSignOutSuccess();
  };

  // 5. Forcer la synchronisation manuelle
  const handleForceSync = async () => {
    setIsSyncing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await pullProfileFromCloud();
      if (res.success) {
        setSuccessMessage('✅ Synchronisation réussie avec le Cloud !');
        setLastSyncTime(new Date().toISOString());
      } else {
        // Si le cloud n'avait pas encore de données, pousser les données locales
        const local = getCurrentLocalProfile();
        const pushRes = await pushProfileToCloud(local);
        if (pushRes.success) {
          setSuccessMessage('✅ Progression locale synchronisée vers votre compte Cloud !');
          setLastSyncTime(new Date().toISOString());
        } else {
          setErrorMessage(res.error || 'Erreur de synchronisation.');
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
      <div className="bg-[#fcfaf7] dark:bg-[#181513] border-2 border-stone-900 dark:border-stone-700 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[6px_6px_0px_#1c1917] dark:shadow-[6px_6px_0px_#000000] relative space-y-5 transition-colors">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center space-x-3.5 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Supabase Cloud Auth
            </span>
            <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 font-serif tracking-tight mt-0.5">
              {currentUser ? 'Mon Compte Fluent' : 'Connexion Multi-Appareils'}
            </h2>
          </div>
        </div>

        {/* Message d'erreur ou de succès */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* ÉTAT 1 : UTILISATEUR CONNECTÉ (GESTION DU PROFIL & SYNCHRO) */}
        {/* ======================================================== */}
        {currentUser ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-base border border-emerald-300 dark:border-emerald-700">
                  {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {currentUser.email}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">
                      Connecté
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate font-mono">
                    ID: {currentUser.id.substring(0, 8)}...
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Synchronisation active entre tes appareils</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Connecte-toi avec cet email sur ton iPhone pour retrouver automatiquement toutes tes cartes Anki et tes streaks.
                </p>
              </div>

              {lastSyncTime && (
                <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                  <span>Dernière synchronisation :</span>
                  <span className="font-mono">
                    {new Date(lastSyncTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>

            {/* Boutons d'action quand connecté */}
            <div className="space-y-2">
              <button
                onClick={handleForceSync}
                disabled={isSyncing}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronisation en cours...' : 'Forcer la synchronisation maintenant'}</span>
              </button>

              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* ÉTAT 2 : FORMULAIRE DE CONNEXION / INSCRIPTION / MAGIC LINK */
          /* ======================================================== */
          <div className="space-y-4 animate-fadeIn">
            {/* Onglets Mode de Connexion */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
                className={`py-1.5 rounded-xl transition-all ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                }`}
              >
                Connexion
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setErrorMessage(null); }}
                className={`py-1.5 rounded-xl transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                }`}
              >
                Créer compte
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('magic'); setErrorMessage(null); }}
                className={`py-1.5 rounded-xl transition-all ${
                  activeTab === 'magic'
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                }`}
              >
                Lien Magique
              </button>
            </div>

            {/* Note explicative Multi-Appareils */}
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>L'astuce pour relier ton PC et ton iPhone :</strong> Utilise le même email et mot de passe sur les deux appareils. Supabase fusionnera et synchronisera automatiquement ta progression !
              </div>
            </div>

            {/* Formulaire Login ou Signup */}
            {(activeTab === 'login' || activeTab === 'signup') && (
              <form onSubmit={activeTab === 'login' ? handleLogin : handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: hugo@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Au moins 6 caractères"
                      required
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-md"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{activeTab === 'login' ? 'Se connecter à mon compte' : 'Créer mon compte'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Formulaire Magic Link */}
            {activeTab === 'magic' && (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                    Adresse Email (aucun mot de passe requis)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: hugo@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-md"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Envoyer mon lien magique</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
