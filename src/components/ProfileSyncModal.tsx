import React, { useState } from 'react';
import { AnkiWord, AnchoringRecord } from '../types/fluent';
import { 
  createProfileBackup, 
  downloadProfileBackup, 
  parseProfileBackup, 
  applyProfileBackupToStorage, 
  UserProfileBackup 
} from '../utils/profileSyncUtils';
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
  FileText,
  Cloud,
  Smartphone,
  Laptop
} from 'lucide-react';

interface ProfileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedExercises: string[];
  streakDays: number;
  syncedAnkiWords: AnkiWord[];
  anchoringRecords: Record<string, AnchoringRecord>;
  onProfileRestored: (backup: UserProfileBackup) => void;
}

export const ProfileSyncModal: React.FC<ProfileSyncModalProps> = ({
  isOpen,
  onClose,
  completedExercises,
  streakDays,
  syncedAnkiWords,
  anchoringRecords,
  onProfileRestored,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const backup = createProfileBackup(
      completedExercises,
      streakDays,
      syncedAnkiWords,
      anchoringRecords
    );
    downloadProfileBackup(backup);
    setStatusMessage({
      text: "Fichier de progression téléchargé ! Garde-le sur ton Google Drive ou envoie-le sur ton autre appareil.",
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
          text: "Fichier de sauvegarde invalide ou corrompu. Assure-toi de choisir un fichier .json exporté depuis Fluent.",
          type: 'error',
        });
        return;
      }

      applyProfileBackupToStorage(backup);
      onProfileRestored(backup);
      setStatusMessage({
        text: `🎉 Progression restaurée avec succès ! ${backup.completedExercises.length} exercices, ${backup.streakDays}j de streak et ${backup.syncedAnkiWords.length} mots Anki rechargés.`,
        type: 'success',
      });
    };
    reader.readAsText(file);
  };

  const totalAnchors = Object.keys(anchoringRecords).length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fcfaf7] border-2 border-stone-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[6px_6px_0px_#1c1917] relative space-y-6">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center space-x-3.5 border-b-2 border-stone-200 pb-4">
          <div className="p-3 rounded-2xl bg-[#c23b22] text-white font-bold border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917]">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
              Profil & Progression Multi-Appareils
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight mt-0.5">
              Sauvegarder & Synchroniser ma Progression
            </h2>
          </div>
        </div>

        {/* Message de notification */}
        {statusMessage && (
          <div className={`p-3.5 rounded-2xl border flex items-center space-x-2.5 text-xs font-semibold animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
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
        <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold text-stone-700">Progression enregistrée sur cet appareil :</span>
            <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-md font-mono">Navigateur Local</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-lg font-black text-stone-900 block">{completedExercises.length}</span>
              <span className="text-[10px] text-stone-500 font-medium">Nuances orales</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-lg font-black text-amber-600 block flex items-center justify-center">
                <Flame className="w-4 h-4 mr-0.5 fill-amber-500 text-amber-600" /> {streakDays}j
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Streak régulier</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-lg font-black text-[#c23b22] block">{syncedAnkiWords.length}</span>
              <span className="text-[10px] text-stone-500 font-medium">Cartes Anki</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-lg font-black text-emerald-700 block">{totalAnchors}</span>
              <span className="text-[10px] text-stone-500 font-medium">Ancrages SRS</span>
            </div>
          </div>
        </div>

        {/* Les 2 Actions principales : Exporter et Importer */}
        <div className="space-y-3">
          
          {/* Action 1 : Télécharger la sauvegarde */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5 text-xs text-stone-800">
              <div className="font-bold flex items-center space-x-1.5 text-amber-950">
                <DownloadCloud className="w-4 h-4 text-amber-700" />
                <span>1. Exporter ma progression (Sauvegarde)</span>
              </div>
              <p className="text-[11px] text-stone-600">
                Télécharge ton profil complet sous forme de fichier JSON léger à emporter partout.
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 shrink-0"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Télécharger (.json)</span>
            </button>
          </div>

          {/* Action 2 : Charger la sauvegarde */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5 text-xs text-stone-800">
              <div className="font-bold flex items-center space-x-1.5 text-blue-950">
                <UploadCloud className="w-4 h-4 text-blue-700" />
                <span>2. Restaurer ma progression sur cet appareil</span>
              </div>
              <p className="text-[11px] text-stone-600">
                Charge ton fichier de sauvegarde depuis ton autre PC, mobile ou Google Drive.
              </p>
            </div>
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 shrink-0">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Choisir le fichier...</span>
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

        </div>

        {/* Note pédagogique pour mobile & autre PC */}
        <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200 text-[11px] text-stone-600 space-y-1 leading-relaxed">
          <p className="font-bold text-stone-800 flex items-center space-x-1.5">
            <Laptop className="w-3.5 h-3.5" /> <span>Multi-PC</span> & <Smartphone className="w-3.5 h-3.5" /> <span>Mobile :</span>
          </p>
          <p>
            Comme l'application est pensée pour un usage 100% personnel sans tracking, les données sont stockées dans le navigateur.
            En téléchargeant ton fichier sur ton premier PC et en le chargeant ici, tu récupères instantanément l'intégralité de tes exercices et de tes scores !
          </p>
        </div>

        {/* Pied de boîte de dialogue */}
        <div className="pt-2 text-center border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all"
          >
            Fermer et reprendre mon entraînement
          </button>
        </div>

      </div>
    </div>
  );
};
