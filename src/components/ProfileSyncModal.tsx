import React, { useState, useEffect } from 'react';
import { AnkiWord, AnchoringRecord } from '../types/fluent';
import { 
  createProfileBackup, 
  downloadProfileBackup, 
  parseProfileBackup, 
  applyProfileBackupToStorage, 
  UserProfileBackup 
} from '../utils/profileSyncUtils';
import { 
  getSyncUserId, 
  setSyncUserId, 
  pushProfileToCloud, 
  pullProfileFromCloud, 
  getLastSyncTime,
  isAutoSyncEnabled,
  setAutoSyncEnabled
} from '../utils/cloudSyncUtils';
import { 
  X, 
  DownloadCloud, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Flame, 
  Layers, 
  Cloud,
  Smartphone,
  Laptop,
  Key,
  RefreshCw,
  FileText
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface ProfileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedExercises: string[];
  streakDays: number;
  syncedAnkiWords: AnkiWord[];
  anchoringRecords: Record<string, AnchoringRecord>;
  onProfileRestored: (backup: UserProfileBackup) => void;
  onOpenAuthModal?: () => void;
  currentUser?: User | null;
}

export const ProfileSyncModal: React.FC<ProfileSyncModalProps> = ({
  isOpen,
  onClose,
  completedExercises,
  streakDays,
  syncedAnkiWords,
  anchoringRecords,
  onProfileRestored,
  onOpenAuthModal,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'file'>('cloud');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // États Cloud Supabase
  const [syncKey, setSyncKey] = useState<string>(getSyncUserId());
  const [isEditingKey, setIsEditingKey] = useState<boolean>(false);
  const [autoSync, setAutoSync] = useState<boolean>(isAutoSyncEnabled());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSyncFormatted, setLastSyncFormatted] = useState<string>('');

  const formatLastSync = (iso: string | null) => {
    if (!iso) return 'Aucune synchronisation récente';
    try {
      const d = new Date(iso);
      return `Dernière synchro : le ${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Dernière synchro : récemment';
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSyncKey(getSyncUserId());
      setAutoSync(isAutoSyncEnabled());
      setLastSyncFormatted(formatLastSync(getLastSyncTime()));
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Actions Cloud
  const handleSaveKey = () => {
    setSyncUserId(syncKey);
    setIsEditingKey(false);
    setStatusMessage({
      type: 'info',
      text: `Clé Cloud mise à jour : "${syncKey}". Utilisez la même clé sur votre iPhone !`,
    });
  };

  const handlePushCloud = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const backup = createProfileBackup(
      completedExercises,
      streakDays,
      syncedAnkiWords,
      anchoringRecords
    );

    const res = await pushProfileToCloud(backup, syncKey);
    setIsLoading(false);

    if (res.success) {
      setLastSyncFormatted(formatLastSync(new Date().toISOString()));
      setStatusMessage({
        type: 'success',
        text: '✅ Progression sauvegardée avec succès sur le Cloud Supabase !',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `❌ Échec de la sauvegarde : ${res.error || 'Erreur'}`,
      });
    }
  };

  const handlePullCloud = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const res = await pullProfileFromCloud(syncKey);
    setIsLoading(false);

    if (res.success && res.data) {
      onProfileRestored(res.data);
      setLastSyncFormatted(formatLastSync(new Date().toISOString()));
      setStatusMessage({
        type: 'success',
        text: `🎉 Progression restaurée depuis le Cloud ! ${res.data.completedExercises.length} exercices, ${res.data.streakDays}j de streak rechargés.`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `❌ Échec : ${res.error || 'Aucune donnée'}`,
      });
    }
  };

  const handleToggleAutoSync = () => {
    const next = !autoSync;
    setAutoSync(next);
    setAutoSyncEnabled(next);
  };

  // Actions Fichier JSON Local (Secours)
  const handleDownloadFile = () => {
    const backup = createProfileBackup(
      completedExercises,
      streakDays,
      syncedAnkiWords,
      anchoringRecords
    );
    downloadProfileBackup(backup);
    setStatusMessage({
      text: "Fichier JSON exporté ! Conservez-le comme copie de secours hors-ligne.",
      type: 'success',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const backup = parseProfileBackup(content);
      if (!backup) {
        setStatusMessage({
          text: "Fichier de sauvegarde invalide ou corrompu. Assurez-vous de choisir un fichier .json valide.",
          type: 'error',
        });
        return;
      }

      applyProfileBackupToStorage(backup);
      onProfileRestored(backup);
      setStatusMessage({
        text: `🎉 Progression restaurée depuis le fichier ! ${backup.completedExercises.length} exercices, ${backup.streakDays}j de streak et ${backup.syncedAnkiWords.length} mots Anki rechargés.`,
        type: 'success',
      });
    };
    reader.readAsText(file);
  };

  const totalAnchors = Object.keys(anchoringRecords).length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fcfaf7] dark:bg-[#181513] border-2 border-stone-900 dark:border-stone-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[6px_6px_0px_#1c1917] dark:shadow-[6px_6px_0px_#000000] relative space-y-5 transition-colors">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center space-x-3.5 border-b-2 border-stone-200 dark:border-stone-800 pb-4">
          <div className="p-3 rounded-2xl bg-[#c23b22] text-white font-bold border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917]">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              ⚡ Synchronisation Multi-Appareils
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif tracking-tight mt-0.5">
              Sauvegarder ma Progression
            </h2>
          </div>
        </div>

        {/* Message de notification */}
        {statusMessage && (
          <div className={`p-3.5 rounded-2xl border flex items-center space-x-2.5 text-xs font-semibold animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Résumé de la progression actuelle sur cet appareil */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="font-bold text-stone-700 dark:text-stone-300">Progression locale actuelle :</span>
            <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md font-mono">Navigateur</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-base font-black text-stone-900 dark:text-stone-100 block">{completedExercises.length}</span>
              <span className="text-[9px] text-stone-500 font-medium">Nuances</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-base font-black text-amber-600 block flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 mr-0.5 fill-amber-500 text-amber-600" /> {streakDays}j
              </span>
              <span className="text-[9px] text-stone-500 font-medium">Streak</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-base font-black text-[#c23b22] block">{syncedAnkiWords.length}</span>
              <span className="text-[9px] text-stone-500 font-medium">Cartes Anki</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-base font-black text-emerald-700 dark:text-emerald-400 block">{totalAnchors}</span>
              <span className="text-[9px] text-stone-500 font-medium">Ancrages</span>
            </div>
          </div>
        </div>

        {/* Onglets de sélection du mode de synchro */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`pb-2.5 px-3 flex items-center space-x-1.5 transition-all border-b-2 ${
              activeTab === 'cloud'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>1. Cloud Supabase (Instantané & Sans Fichier)</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold">
              Nouveau
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 px-3 flex items-center space-x-1.5 transition-all border-b-2 ${
              activeTab === 'file'
                ? 'border-stone-800 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Fichier JSON (Secours Hors-Ligne)</span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : CLOUD SUPABASE */}
        {activeTab === 'cloud' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Bannière de Connexion Supabase Auth (Recommandée pour lier iPhone et PC) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              currentUser
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-300 dark:border-amber-700/60'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    currentUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white shadow-2xs'
                  }`}>
                    {currentUser ? <ShieldCheck className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
                        {currentUser ? 'Compte Connecté (Multi-Appareils Actif)' : 'Lier PC & iPhone Automatiquement'}
                      </h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        currentUser
                          ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                          : 'bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200'
                      }`}>
                        {currentUser ? 'Actif' : 'Recommandé'}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {currentUser ? (
                        <>
                          Tu es connecté avec <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{currentUser.email}</strong>. Tes révisions, cartes Anki et progrès sont enregistrés sous ce compte unique.
                        </>
                      ) : (
                        <>
                          Pour que le site comprenne que tu es la <strong>même personne</strong> sur ton PC et ton iPhone, connecte-toi avec ton adresse email et mot de passe.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      onClose();
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      currentUser
                        ? 'bg-white hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    }`}
                  >
                    {currentUser ? 'Mon Compte' : 'Se Connecter'}
                  </button>
                )}
              </div>
            </div>

            {/* Clé de Profil Privée */}
            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-500" />
                  Votre Identifiant Secret de Synchronisation
                </span>
                {!isEditingKey ? (
                  <button
                    onClick={() => setIsEditingKey(true)}
                    className="text-xs text-[#c23b22] hover:underline font-bold"
                  >
                    Modifier
                  </button>
                ) : (
                  <button
                    onClick={handleSaveKey}
                    className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-lg hover:bg-emerald-700 font-bold"
                  >
                    Valider
                  </button>
                )}
              </div>

              {isEditingKey ? (
                <input
                  type="text"
                  value={syncKey}
                  onChange={(e) => setSyncKey(e.target.value)}
                  placeholder="Ex: warm1t"
                  className="w-full px-3 py-1.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#c23b22]"
                />
              ) : (
                <div className="flex items-center justify-between font-mono font-black text-base text-stone-900 dark:text-stone-100">
                  <span>{syncKey}</span>
                  <span className="text-[10px] font-sans font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    🟢 Cloud Actif
                  </span>
                </div>
              )}
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Cette clé isole votre progression dans la base Supabase. Tapez la même clé sur votre iPhone pour récupérer vos révisions instantanément.
              </p>
            </div>

            {/* Boutons d'Action Cloud */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePushCloud}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-stone-900 dark:text-stone-100 transition group disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#c23b22] text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                </div>
                <span className="font-bold text-xs text-center">Sauvegarder vers le Cloud</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 text-center mt-0.5">Envoie vos stats & révisions</span>
              </button>

              <button
                onClick={handlePullCloud}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-stone-900 dark:text-stone-100 transition group disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                </div>
                <span className="font-bold text-xs text-center">Restaurer du Cloud</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 text-center mt-0.5">Télécharge vos données en ligne</span>
              </button>
            </div>

            {/* Option Synchronisation Automatique */}
            <div className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
              <div className="flex items-center space-x-2.5">
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Sauvegarde automatique Cloud</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Synchronise automatiquement après chaque exercice validé</p>
                </div>
              </div>
              <button
                onClick={handleToggleAutoSync}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                  autoSync ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform absolute top-1 ${
                    autoSync ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Guide iPhone */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-200">
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Synchronisation transparente avec votre iPhone :</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-200/80">
                1. Ouvrez votre site HTTPS sur Safari iPhone.<br />
                2. Cliquez sur <strong>Outils & Synchro &gt; Sauvegarder ma progression</strong>.<br />
                3. Assurez-vous que la clé est bien <strong>{syncKey}</strong>, puis cliquez sur <strong>Restaurer du Cloud</strong>.<br />
                Fini les transferts de fichiers à la main !
              </p>
            </div>

            <div className="text-[10px] text-stone-400 text-center">
              {lastSyncFormatted}
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 2 : FICHIER JSON LOCAL */}
        {activeTab === 'file' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Télécharger la sauvegarde */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5 text-xs text-stone-800 dark:text-stone-200">
                <div className="font-bold flex items-center space-x-1.5 text-amber-950 dark:text-amber-300">
                  <DownloadCloud className="w-4 h-4 text-amber-700" />
                  <span>Exporter ma progression (Fichier JSON)</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  Télécharge votre profil complet sous forme de fichier JSON léger.
                </p>
              </div>
              <button
                onClick={handleDownloadFile}
                className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 shrink-0"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Télécharger (.json)</span>
              </button>
            </div>

            {/* Charger la sauvegarde */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5 text-xs text-stone-800 dark:text-stone-200">
                <div className="font-bold flex items-center space-x-1.5 text-blue-950 dark:text-blue-300">
                  <UploadCloud className="w-4 h-4 text-blue-700" />
                  <span>Restaurer depuis un fichier JSON</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  Chargez un fichier de sauvegarde préalablement exporté.
                </p>
              </div>
              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 shrink-0">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Choisir le fichier...</span>
                <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* Pied de boîte de dialogue */}
        <div className="pt-2 text-center border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Fermer et continuer l'entraînement
          </button>
        </div>

      </div>
    </div>
  );
};
