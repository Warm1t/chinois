import React, { useState, useEffect } from 'react';
import { Cloud, CloudUpload, CloudDownload, Key, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, X, Smartphone } from 'lucide-react';
import { 
  getSyncUserId, 
  setSyncUserId, 
  pushProfileToCloud, 
  pullProfileFromCloud, 
  getLastSyncTime,
  isAutoSyncEnabled,
  setAutoSyncEnabled
} from '../utils/cloudSyncUtils';
import { createProfileBackup } from '../utils/profileSyncUtils';
import { AnkiWord, AnchoringRecord } from '../types/fluent';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedExercises: string[];
  streakDays: number;
  syncedAnkiWords: AnkiWord[];
  anchoringRecords: Record<string, AnchoringRecord>;
  onProfileRestored: (
    completed: string[],
    streak: number,
    anki: AnkiWord[],
    anchors: Record<string, AnchoringRecord>
  ) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  completedExercises,
  streakDays,
  syncedAnkiWords,
  anchoringRecords,
  onProfileRestored,
}) => {
  const [syncKey, setSyncKey] = useState<string>(getSyncUserId());
  const [isEditingKey, setIsEditingKey] = useState<boolean>(false);
  const [autoSync, setAutoSync] = useState<boolean>(isAutoSyncEnabled());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
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

  const handleSaveKey = () => {
    setSyncUserId(syncKey);
    setIsEditingKey(false);
    setStatusMessage({ type: 'info', text: `Clé Cloud mise à jour : "${syncKey}"` });
  };

  const handlePush = async () => {
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
        text: '✅ Progression sauvegardée avec succès sur Supabase Cloud !',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `❌ Échec de la sauvegarde : ${res.error || 'Erreur inconnue'}`,
      });
    }
  };

  const handlePull = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const res = await pullProfileFromCloud(syncKey);
    setIsLoading(false);

    if (res.success && res.data) {
      onProfileRestored(
        res.data.completedExercises,
        res.data.streakDays,
        res.data.syncedAnkiWords,
        res.data.anchoringRecords
      );
      setLastSyncFormatted(formatLastSync(new Date().toISOString()));
      setStatusMessage({
        type: 'success',
        text: '🎉 Progression récupérée depuis le Cloud et appliquée !',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `❌ Échec de la récupération : ${res.error || 'Erreur'}`,
      });
    }
  };

  const handleToggleAutoSync = () => {
    const next = !autoSync;
    setAutoSync(next);
    setAutoSyncEnabled(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl shadow-2xl border p-6 overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          color: 'var(--text-primary, #1e293b)',
          borderColor: 'var(--border-color, #e2e8f0)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Synchronisation Supabase Cloud</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connecté au Cloud (vdbtwcbydir...)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="py-4 space-y-4 text-sm">
          {/* Identifiant Secret de Synchro */}
          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-stone-800 bg-gray-50/70 dark:bg-stone-900/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                Votre Clé de Profil Privée
              </span>
              {!isEditingKey ? (
                <button
                  onClick={() => setIsEditingKey(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  Modifier
                </button>
              ) : (
                <button
                  onClick={handleSaveKey}
                  className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded hover:bg-emerald-700 font-medium"
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
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
              />
            ) : (
              <div className="flex items-center justify-between font-mono font-bold text-base text-gray-800 dark:text-gray-100">
                <span>{syncKey}</span>
                <span className="text-xs font-sans font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                  Actif
                </span>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Cette clé isole vos données. Tapez simplement la même clé sur votre iPhone pour partager instantanément votre progression.
            </p>
          </div>

          {/* Statut message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 animate-fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
                  : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-300'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Boutons d'actions Cloud */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePush}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-primary-200 dark:border-primary-900/40 bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 text-primary-800 dark:text-primary-200 transition group disabled:opacity-50 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              </div>
              <span className="font-semibold text-xs text-center">Sauvegarder vers le Cloud</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-0.5">Envoie vos stats & révisions</span>
            </button>

            <button
              onClick={handlePull}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 transition group disabled:opacity-50 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudDownload className="w-4 h-4" />}
              </div>
              <span className="font-semibold text-xs text-center">Restaurer du Cloud</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-0.5">Charge vos stats en ligne</span>
            </button>
          </div>

          {/* Option Synchronisation Automatique */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-stone-800 hover:bg-gray-50/50 dark:hover:bg-stone-900/30 transition">
            <div className="flex items-center space-x-2.5">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-xs font-semibold">Sauvegarde automatique</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Envoie les nouvelles révisions dès qu'elles sont terminées</p>
              </div>
            </div>
            <button
              onClick={handleToggleAutoSync}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                autoSync ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform absolute top-1 ${
                  autoSync ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Conseil iPhone / Mobile */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold">
              <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Accès depuis votre iPhone ou autre appareil :</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
              Ouvrez simplement votre site HTTPS sur Safari, cliquez sur <strong>⚙️ Outils & Synchro</strong> &gt; <strong>☁️ Cloud Supabase</strong>, et vérifiez que votre clé est bien <strong>{syncKey}</strong>. Cliquez ensuite sur <em>Restaurer</em> pour récupérer toutes vos données instantanément sans aucun fichier à manipuler !
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 dark:border-stone-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{lastSyncFormatted}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 font-medium text-gray-800 dark:text-gray-200 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
