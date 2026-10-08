import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  ChevronDown, 
  Layers, 
  Cloud, 
  Calendar, 
  Smartphone, 
  Volume2, 
  RotateCw, 
  Check, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  VoiceGenderPreference, 
  getVoiceGenderPreference, 
  setVoiceGenderPreference 
} from '../utils/speechUtils';

interface HeaderMenuDropdownProps {
  syncedAnkiWordsCount: number;
  onOpenAnkiModal: () => void;
  onOpenPinnedWordsModal?: () => void;
  onOpenCalendarModal: () => void;
  onOpenProfileSyncModal: () => void;
  onOpenAppleSyncModal?: () => void;
}

export const HeaderMenuDropdown: React.FC<HeaderMenuDropdownProps> = ({
  syncedAnkiWordsCount,
  onOpenAnkiModal,
  onOpenPinnedWordsModal,
  onOpenCalendarModal,
  onOpenProfileSyncModal,
  onOpenAppleSyncModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voicePreference, setVoicePreference] = useState<VoiceGenderPreference>(getVoiceGenderPreference());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Écouter les changements de voix
  useEffect(() => {
    const handleVoiceChange = (e: any) => {
      setVoicePreference(e.detail as VoiceGenderPreference);
    };
    window.addEventListener('fluent_voice_gender_changed', handleVoiceChange);
    return () => window.removeEventListener('fluent_voice_gender_changed', handleVoiceChange);
  }, []);

  // Fermer au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectVoice = (pref: VoiceGenderPreference) => {
    setVoicePreference(pref);
    setVoiceGenderPreference(pref);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Bouton Principal Déroulant Unique */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
          isOpen
            ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
            : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
        }`}
        title="Ouvrir le menu des outils, de la voix et de la synchronisation"
      >
        <Settings className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
        <span>Outils & Synchro</span>
        
        {/* Pastille discrète si Anki est connecté */}
        {syncedAnkiWordsCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Anki connecté" />
        )}

        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu Déroulant Structuré & Organisé */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-[#181513] border-2 border-stone-900 dark:border-stone-700 rounded-3xl shadow-[6px_6px_0px_#1c1917] dark:shadow-[6px_6px_0px_#000000] p-4 z-50 space-y-4 animate-fadeIn">
          
          {/* Section 1 : Banque Vocale Chinoise */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#c23b22]" />
                <span>Voix & Tessiture (Écoute Active)</span>
              </span>
            </div>

            {/* Sélecteur de voix en pilules */}
            <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => handleSelectVoice('alternate')}
                className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  voicePreference === 'alternate'
                    ? 'bg-stone-900 text-white shadow-2xs dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
                title="Alterne automatiquement homme et femme pour habituer l'oreille"
              >
                <RotateCw className="w-3 h-3 text-amber-400" />
                <span>Alterné</span>
              </button>

              <button
                onClick={() => handleSelectVoice('female')}
                className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  voicePreference === 'female'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
                title="Voix féminine claire"
              >
                <span>👩 Femme</span>
              </button>

              <button
                onClick={() => handleSelectVoice('male')}
                className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  voicePreference === 'male'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
                title="Voix masculine résonante"
              >
                <span>👨 Homme</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-stone-100 dark:bg-stone-800" />

          {/* Section 2 : Synchronisation & Données */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-1">
              Données & Synchronisation
            </span>

            {/* Option 0 : Mes Mots Épinglés & Export Anki */}
            <div
              onClick={() => {
                if (onOpenPinnedWordsModal) onOpenPinnedWordsModal();
                else onOpenAnkiModal();
                setIsOpen(false);
              }}
              className="p-2.5 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 cursor-pointer border border-amber-200/80 dark:border-amber-800/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold">
                  📌
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] transition-colors">
                    Mes Mots & Export Anki
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {syncedAnkiWordsCount > 0 
                      ? `${syncedAnkiWordsCount} mots • Export .txt & phrases` 
                      : "Gérer mes mots et exporter vers Anki"}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200">
                {syncedAnkiWordsCount}
              </span>
            </div>

            {/* Option 1 : Anki */}
            <div
              onClick={() => {
                onOpenAnkiModal();
                setIsOpen(false);
              }}
              className="p-2.5 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/80 cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] transition-colors">
                    AnkiConnect (Desktop)
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Lier tes paquets locaux Anki
                  </p>
                </div>
              </div>

              {syncedAnkiWordsCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-0.5">
                  <Check className="w-3 h-3 mr-0.5" />
                  <span>Actif</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                  Lier
                </span>
              )}
            </div>

            {/* Option 2 : Profil & Sauvegarde Cloud */}
            <div
              onClick={() => {
                onOpenProfileSyncModal();
                setIsOpen(false);
              }}
              className="p-2.5 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/80 cursor-pointer border border-transparent hover:border-stone-200 dark:border-transparent dark:hover:border-stone-700 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                      Synchro Cloud & Profil
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Supabase
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Synchro automatique sans fichier & multi-appareils
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="h-px bg-stone-100 dark:bg-stone-800" />

          {/* Section 3 : Mobiles & Alertes */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-1">
              Appareils & Rappels
            </span>

            {/* Option 3 : iPhone & Apple */}
            {onOpenAppleSyncModal && (
              <div
                onClick={() => {
                  onOpenAppleSyncModal();
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/80 cursor-pointer border border-transparent hover:border-stone-200 dark:border-transparent dark:hover:border-stone-700 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] transition-colors">
                      iPhone & Écosystème Apple
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Widget Lock Screen, .ics & Raccourcis
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Option 4 : Rappels & Calendrier */}
            <div
              onClick={() => {
                onOpenCalendarModal();
                setIsOpen(false);
              }}
              className="p-2.5 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/80 cursor-pointer border border-transparent hover:border-stone-200 dark:border-transparent dark:hover:border-stone-700 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] transition-colors">
                    Rappels d'Étude & Calendrier
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Configurer l'heure quotidienne et notifications
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
