import React, { useState, useEffect } from 'react';
import { StoryWordToken, StorySentence } from '../types/fluent';
import { getWordExampleSentences, WordExampleSentence } from '../utils/pinnedSentenceGenerator';
import { playChineseAudio, stopChineseAudio } from '../utils/speechUtils';
import { 
  Volume2, 
  VolumeX, 
  BookmarkCheck, 
  X, 
  Sparkles, 
  Quote, 
  Plus, 
  Check 
} from 'lucide-react';

interface WordDefinitionBannerProps {
  selectedWord: StoryWordToken;
  currentSentence?: StorySentence;
  playbackSpeed?: number;
  isWordInAnki: boolean;
  onPronounceWord: (wordHanzi: string, e?: React.MouseEvent) => void;
  onSaveWordToAnki: (word: {
    hanzi: string;
    pinyin?: string;
    translation?: string;
    exampleSentence?: string;
    examplePinyin?: string;
    exampleTranslation?: string;
  }) => void;
  onClose: () => void;
}

export const WordDefinitionBanner: React.FC<WordDefinitionBannerProps> = ({
  selectedWord,
  currentSentence,
  playbackSpeed = 0.85,
  isWordInAnki,
  onPronounceWord,
  onSaveWordToAnki,
  onClose,
}) => {
  const [examples, setExamples] = useState<WordExampleSentence[]>([]);
  const [playingExampleId, setPlayingExampleId] = useState<string | null>(null);
  const [savedExampleId, setSavedExampleId] = useState<string | null>(null);

  // Charger les phrases d'exemple contenant le mot cliqué
  useEffect(() => {
    if (selectedWord?.hanzi) {
      const foundExamples = getWordExampleSentences(
        selectedWord,
        currentSentence?.hanzi
      );
      setExamples(foundExamples);
      setPlayingExampleId(null);
      setSavedExampleId(null);
    }
  }, [selectedWord?.hanzi, currentSentence?.hanzi]);

  // Jouer l'audio d'une phrase d'exemple
  const handlePlayExampleAudio = async (example: WordExampleSentence, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingExampleId === example.id) {
      stopChineseAudio();
      setPlayingExampleId(null);
      return;
    }

    stopChineseAudio();
    setPlayingExampleId(example.id);
    try {
      await playChineseAudio(example.hanzi, playbackSpeed);
    } finally {
      setPlayingExampleId(null);
    }
  };

  // Enregistrer le mot dans Anki avec cette phrase d'exemple spécifique
  const handleSaveWithSpecificExample = (example: WordExampleSentence, e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveWordToAnki({
      hanzi: selectedWord.hanzi,
      pinyin: selectedWord.pinyin,
      translation: selectedWord.translation,
      exampleSentence: example.hanzi,
      examplePinyin: example.pinyin,
      exampleTranslation: example.french,
    });
    setSavedExampleId(example.id);
    setTimeout(() => setSavedExampleId(null), 2500);
  };

  // Découpage et mise en valeur visuelle du mot cible dans la phrase chinoise
  const renderHighlightedSentence = (text: string, target: string) => {
    if (!target || !text.includes(target)) {
      return <span className="chinese-text font-bold">{text}</span>;
    }

    const parts = text.split(target);
    return (
      <span className="chinese-text font-bold leading-relaxed">
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="inline-block bg-amber-200/90 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 font-black px-1.5 py-0.5 mx-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                {target}
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="mt-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-stone-50 to-white dark:from-stone-900 dark:to-stone-950 border border-stone-200/90 dark:border-stone-800 shadow-md font-sans antialiased text-stone-800 dark:text-stone-100 space-y-4 animate-fadeIn">
      {/* 1. BANDEAU PRINCIPAL DU MOT : VOCAL, PINYIN, TRADUCTION & BOUTONS D'ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center space-x-3.5">
          {/* Bouton audio du mot isolé */}
          <button
            onClick={(e) => onPronounceWord(selectedWord.hanzi, e)}
            className="w-11 h-11 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60 flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-2xs group"
            title="Écouter la prononciation du mot"
          >
            <Volume2 className="w-5 h-5 text-amber-800 dark:text-amber-300 group-hover:scale-110 transition-transform" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-sans chinese-text tracking-wide">
                {selectedWord.hanzi}
              </span>
              <span className="font-sans text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-lg">
                {selectedWord.pinyin}
              </span>
              {isWordInAnki && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center space-x-1 font-sans">
                  <BookmarkCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Dans ton Anki</span>
                </span>
              )}
            </div>
            <p className="font-sans text-sm sm:text-base font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
              {selectedWord.translation}
            </p>
          </div>
        </div>

        {/* Boutons d'action (Anki + Fermer) */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button
            onClick={() => onSaveWordToAnki(selectedWord)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-sans border transition-all ${
              isWordInAnki
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                : 'bg-white hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 hover:text-emerald-900 border-stone-300 hover:border-emerald-300 shadow-2xs active:scale-95'
            }`}
            title="Ajouter ce mot directement à ton deck Anki (Paquet Fluent)"
          >
            <BookmarkCheck className={`w-3.5 h-3.5 ${isWordInAnki ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span>{isWordInAnki ? 'Dans ton Anki (Fluent)' : 'Ajouter à Anki (Fluent)'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Fermer la définition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SECTION PHRASES D'EXEMPLE CONTENANT LE MOT (EXIGÉE PAR L'UTILISATEUR) */}
      <div className="space-y-2.5 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Quote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <h5 className="font-bold text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-sans">
              Phrases d’exemple avec « {selectedWord.hanzi} »
            </h5>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {examples.length}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 dark:text-stone-400 hidden sm:inline">
            Clique sur 🔊 pour écouter la cadence en contexte
          </span>
        </div>

        {/* Liste des phrases d'exemple */}
        <div className="grid grid-cols-1 gap-2.5">
          {examples.map((example) => {
            const isPlaying = playingExampleId === example.id;
            const isSaved = savedExampleId === example.id;

            return (
              <div
                key={example.id}
                className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-600/60 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-2xs group"
              >
                <div className="flex items-start space-x-3">
                  {/* Bouton d'écoute audio de l'exemple */}
                  <button
                    onClick={(e) => handlePlayExampleAudio(example, e)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all active:scale-95 mt-0.5 ${
                      isPlaying
                        ? 'bg-amber-500 text-white animate-pulse shadow-sm'
                        : 'bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-amber-950 text-stone-600 dark:text-stone-300 hover:text-amber-900'
                    }`}
                    title={isPlaying ? 'Arrêter la lecture' : 'Écouter cette phrase d’exemple'}
                  >
                    {isPlaying ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-stone-600 dark:text-stone-300 group-hover:text-amber-800 dark:group-hover:text-amber-300" />
                    )}
                  </button>

                  {/* Contenu textuel de la phrase d'exemple */}
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-relaxed font-sans">
                      {renderHighlightedSentence(example.hanzi, selectedWord.hanzi)}
                    </p>
                    <p data-pinyin className="font-mono text-xs font-semibold text-stone-500 dark:text-amber-200 pinyin-text">
                      {example.pinyin}
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic font-medium">
                      « {example.french} »
                    </p>
                    {example.situation && (
                      <div className="pt-0.5 flex items-center space-x-1.5">
                        <span className="text-[10px] font-medium text-stone-400 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                          📍 {example.situation}
                        </span>
                        {example.sourceLabel && (
                          <span className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                            {example.sourceLabel}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton pour ajouter cette phrase comme exemple sur la carte Anki */}
                <div className="self-end sm:self-center shrink-0">
                  <button
                    onClick={(e) => handleSaveWithSpecificExample(example, e)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      isSaved
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                        : 'bg-stone-50 hover:bg-amber-50 dark:bg-stone-800/80 dark:hover:bg-amber-950/40 text-stone-600 hover:text-amber-900 dark:text-stone-300 border-stone-200 hover:border-amber-300'
                    }`}
                    title="Ajouter ou enrichir la carte Anki avec cette phrase d’exemple"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Enregistré !</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-stone-500 group-hover:text-amber-700" />
                        <span>+ Anki cet exemple</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

