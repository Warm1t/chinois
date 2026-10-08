import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Key, 
  BookOpen, 
  Layers, 
  Check, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Wand2,
  Bookmark
} from 'lucide-react';
import { AnkiWord, MaayotStory } from '../types/fluent';
import { 
  generateStoryWithAi, 
  getStoredAiApiKey, 
  setStoredAiApiKey, 
  hasAiApiKey 
} from '../utils/aiStoryGenerator';

interface GenerateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncedAnkiWords: AnkiWord[];
  onStoryGenerated: (story: MaayotStory) => void;
}

const PRESET_THEMES = [
  { icon: '🍜', label: 'Commander au restaurant', prompt: 'Commander des spécialités très épicées dans un restaurant bondé de Chengdu' },
  { icon: '🚕', label: 'Course en taxi à Pékin', prompt: 'Discuter avec un chauffeur de taxi bavard à Pékin pendant les bouchons' },
  { icon: '🛍️', label: 'Marché de nuit à Taipei', prompt: 'Négocier des souvenirs et goûter des snacks insolites dans un marché de nuit' },
  { icon: '☕', label: 'Café branché à Shanghai', prompt: 'Une rencontre fortuite avec un jeune photographe dans une ancienne concession française' },
  { icon: '🚄', label: 'Prendre le TGV chinois', prompt: 'Trouver sa place dans le train à grande vitesse Fuxing et partager des fruits avec ses voisins' },
  { icon: '🏮', label: 'Fête traditionnelle', prompt: 'Préparer des raviolis en famille pour la veille du Nouvel An chinois' },
];

export const GenerateStoryModal: React.FC<GenerateStoryModalProps> = ({
  isOpen,
  onClose,
  syncedAnkiWords,
  onStoryGenerated,
}) => {
  const [themeInput, setThemeInput] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5'>('HSK 3');
  const [includeAnkiWords, setIncludeAnkiWords] = useState<boolean>(syncedAnkiWords.length > 0);
  
  // Gestion de la clé API
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => getStoredAiApiKey());
  const [isKeyConfigOpen, setIsKeyConfigOpen] = useState<boolean>(!hasAiApiKey());
  const [keySavedToast, setKeySavedToast] = useState<boolean>(false);

  // État de chargement et erreurs
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    setStoredAiApiKey(apiKeyInput.trim());
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2500);
    if (apiKeyInput.trim()) {
      setIsKeyConfigOpen(false);
    }
  };

  const handleSelectPreset = (presetPrompt: string) => {
    setThemeInput(presetPrompt);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const story = await generateStoryWithAi({
        theme: themeInput.trim() || undefined,
        level: selectedLevel,
        ankiWords: includeAnkiWords ? syncedAnkiWords : undefined,
        apiKeyOverride: apiKeyInput.trim() || undefined,
      });

      onStoryGenerated(story);
      onClose();
    } catch (err: any) {
      console.error('Erreur génération histoire IA :', err);
      setErrorMessage(err?.message || "Une erreur est survenue lors de la génération.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-[#fcfaf7] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl shadow-[6px_6px_0px_#1c1917] dark:shadow-[6px_6px_0px_#000] p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* En-tête */}
        <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Générateur Illimité & Sauvegardé Cloud</span>
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100">
              Générer une Histoire IA sur-mesure
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Chaque histoire est unique, interactive, synchronisée sur ton compte et dotée d'audio et de quiz.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Clé API IA (BYOK) */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-800/50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-stone-800 dark:text-stone-200">
              <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Compte IA & Clé API (Google Gemini)</span>
            </div>
            
            <button
              onClick={() => setIsKeyConfigOpen(!isKeyConfigOpen)}
              className="text-[11px] font-bold text-[#c23b22] dark:text-amber-400 hover:underline"
            >
              {isKeyConfigOpen ? 'Masquer' : (hasAiApiKey() ? 'Modifier la clé' : '⚙️ Configurer ma clé')}
            </button>
          </div>

          {hasAiApiKey() && !isKeyConfigOpen ? (
            <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-xl">
              <span className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clé API connectée (générations actives)</span>
              </span>
              <span className="font-mono text-[10px] text-stone-400">••••••••</span>
            </div>
          ) : null}

          {isKeyConfigOpen && (
            <div className="space-y-2.5 pt-1 animate-fadeIn">
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                Connecte ta propre clé API <strong>Google Gemini</strong>. Elle est <strong>100% gratuite</strong> et s'obtient en 30 secondes sans carte bancaire :
              </p>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Colle ta clé API Gemini (AIzaSy...)"
                  className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#c23b22]"
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-white text-xs font-bold transition-all shadow-xs"
                >
                  {keySavedToast ? '✓ Enregistré !' : 'Enregistrer'}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[#c23b22] dark:text-amber-400 hover:underline font-semibold"
                >
                  <span>Créer une clé gratuite sur Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-stone-400">(Stockée sur ton appareil)</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Thème / Contexte de l'histoire */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
            1. Choisis un thème ou une situation
          </label>

          {/* Suggestions en 1 clic */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {PRESET_THEMES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.prompt)}
                className={`p-2 rounded-xl text-left border text-[11px] font-medium transition-all flex items-center space-x-1.5 ${
                  themeInput === preset.prompt
                    ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-stone-900 dark:text-amber-200 shadow-2xs font-bold'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }`}
              >
                <span>{preset.icon}</span>
                <span className="truncate">{preset.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={themeInput}
            onChange={(e) => setThemeInput(e.target.value)}
            rows={2}
            placeholder="Ou décris librement ton idée (ex: Deux amis découvrent un marché d'antiquités à Xi'an et négocient un bol en porcelaine...)"
            className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c23b22]"
          />
        </div>

        {/* 3. Niveau HSK & Option Anki */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Niveau HSK */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <span>Niveau de difficulté</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['HSK 2', 'HSK 3', 'HSK 4', 'HSK 5'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedLevel === lvl
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Intégration Mots Anki */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Vocabulaire personnel</span>
            </label>

            <button
              type="button"
              onClick={() => setIncludeAnkiWords(!includeAnkiWords)}
              disabled={syncedAnkiWords.length === 0}
              className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                syncedAnkiWords.length === 0
                  ? 'opacity-40 cursor-not-allowed bg-stone-100 dark:bg-stone-800/50 border-stone-200'
                  : includeAnkiWords
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 font-bold'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="truncate pr-1">
                <span className="block truncate">Tisser mes cartes Anki</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                  {syncedAnkiWords.length > 0 
                    ? `${syncedAnkiWords.length} mots disponibles` 
                    : 'Aucun mot Anki enregistré'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeAnkiWords}
                onChange={() => {}}
                disabled={syncedAnkiWords.length === 0}
                className="w-4 h-4 text-[#c23b22] rounded accent-[#c23b22]"
              />
            </button>
          </div>

        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Échec de la génération :</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="pt-2 flex items-center justify-end space-x-2.5 border-t border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-2xl bg-[#c23b22] hover:bg-[#a9301a] text-white font-black text-xs shadow-md border-2 border-stone-900 dark:border-stone-700 transition-all flex items-center space-x-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>L'IA rédige ton histoire (~2s)...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>✨ Générer l'Histoire</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

