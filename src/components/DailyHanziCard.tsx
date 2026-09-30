import React, { useState } from 'react';
import { DailyHanzi, AnkiWord } from '../types/fluent';
import { 
  Sparkles, 
  Volume2, 
  Layers, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Smartphone, 
  Calendar, 
  BookOpen, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { playChineseAudio } from '../utils/speechUtils';

interface DailyHanziCardProps {
  hanzi: DailyHanzi;
  syncedAnkiWords: AnkiWord[];
  onOpenAppleSyncModal: () => void;
  onOpenAnkiModal: () => void;
  onSelectPreviousHanzi?: () => void;
  onSelectNextHanzi?: () => void;
}

export const DailyHanziCard: React.FC<DailyHanziCardProps> = ({
  hanzi,
  syncedAnkiWords,
  onOpenAppleSyncModal,
  onOpenAnkiModal,
  onSelectPreviousHanzi,
  onSelectNextHanzi
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [addedToAnkiSuccess, setAddedToAnkiSuccess] = useState(false);

  // Vérifier si le Hanzi ou ses mots dérivés sont dans l'Anki de l'utilisateur
  const isInUserAnki = syncedAnkiWords.some(w => 
    w.hanzi.includes(hanzi.character) || hanzi.compoundWords.some(cw => cw.hanzi === w.hanzi)
  );

  const handlePlayAudio = async (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await playChineseAudio(text, 0.9);
    setIsPlayingAudio(false);
  };

  return (
    <div className="bg-white dark:bg-[#181513] rounded-3xl p-6 sm:p-7 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000000] relative space-y-5 transition-all">
      
      {/* 1. En-tête de la carte */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-stone-100 dark:border-stone-800/80 pb-3.5">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c23b22] animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 font-serif flex items-center space-x-1.5">
            <span>Caractère du Jour (Daily Hanzi)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-[#c23b22] font-mono border border-rose-300 dark:border-rose-800">
              {hanzi.level}
            </span>
          </h3>
        </div>

        {/* Navigation rapide entre les jours */}
        <div className="flex items-center space-x-1.5 text-xs">
          {onSelectPreviousHanzi && (
            <button
              onClick={onSelectPreviousHanzi}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="Jour précédent"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="text-[11px] font-mono text-stone-400 font-semibold px-1">
            Aujourd'hui
          </span>

          {onSelectNextHanzi && (
            <button
              onClick={onSelectNextHanzi}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="Jour suivant"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Cœur Visuel : Le Grand Hanzi & Informations Clés */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        
        {/* Sceau Grand Hanzi interactif */}
        <div 
          onClick={() => handlePlayAudio(hanzi.character)}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#fdfaf5] dark:bg-[#201c19] border-2 border-stone-900 dark:border-stone-700 flex flex-col items-center justify-center cursor-pointer group hover:-translate-y-1 hover:shadow-[4px_4px_0px_#c23b22] transition-all shrink-0 select-none relative shadow-sm"
          title="Cliquer pour écouter la prononciation native"
        >
          <span className="text-5xl sm:text-6xl font-black text-stone-900 dark:text-stone-100 font-serif leading-none group-hover:scale-105 transition-transform chinese-text">
            {hanzi.character}
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#c23b22] mt-1.5 tracking-wider">
            {hanzi.pinyin}
          </span>
          
          <div className="absolute top-2 right-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <Volume2 className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#c23b22]" />
          </div>
        </div>

        {/* Explications & Métadonnées */}
        <div className="flex-1 space-y-2.5 text-center sm:text-left">
          
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 font-serif">
              {hanzi.meaning}
            </h4>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                Clé : <strong className="text-stone-800 dark:text-stone-200 font-serif">{hanzi.radical}</strong> ({hanzi.radicalMeaning})
              </span>
              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                {hanzi.strokeCount} traits
              </span>
              {isInUserAnki && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                  <Check className="w-3 h-3 mr-0.5" />
                  <span>Dans ton Anki</span>
                </span>
              )}
            </div>
          </div>

          {/* Mnémonique visuelle */}
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200 leading-relaxed text-left">
            <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
              💡 Mnémonique & Décomposition :
            </span>
            <span>{hanzi.mnemonic}</span>
          </div>

        </div>

      </div>

      {/* 3. Mots Composés Clés avec ce Hanzi */}
      <div className="space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
          Vocabulaire clé formé avec {hanzi.character} :
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {hanzi.compoundWords.map((cw, idx) => (
            <div
              key={idx}
              onClick={() => handlePlayAudio(cw.hanzi)}
              className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 hover:border-amber-400 cursor-pointer flex flex-col justify-between transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22]">
                  {cw.hanzi}
                </span>
                <Volume2 className="w-3 h-3 text-stone-400 group-hover:text-[#c23b22]" />
              </div>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                {cw.pinyin}
              </span>
              <span className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 truncate" title={cw.translation}>
                {cw.translation}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Phrase en Contexte avec Audio */}
      <div className="p-3.5 rounded-2xl bg-[#fbf9f5] dark:bg-[#1a1715] border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-[10px] uppercase tracking-wider text-stone-400 block">
            Phrase d'exemple du jour :
          </span>
          <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
            {hanzi.exampleSentence.chinese}
          </p>
          <p className="text-[11px] font-mono text-stone-500">
            {hanzi.exampleSentence.pinyin}
          </p>
          <p className="text-xs text-stone-700 dark:text-stone-300 italic">
            « {hanzi.exampleSentence.translation} »
          </p>
        </div>

        <button
          onClick={() => handlePlayAudio(hanzi.exampleSentence.chinese)}
          className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white shrink-0 mt-2 transition-transform hover:scale-105 shadow-sm"
          title="Écouter la phrase"
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
        </button>
      </div>

      {/* 5. Barre d'Action : Connexion iPhone & Anki */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Bouton Connexion iPhone / Apple */}
        <button
          onClick={onOpenAppleSyncModal}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-bold transition-all shadow-sm hover:-translate-y-0.5"
          title="Recevoir le Hanzi du jour chaque matin sur ton iPhone (Widget & Calendrier Apple)"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-300" />
          <span>Connecter à mon iPhone (Apple)</span>
        </button>

        {/* Bouton Lier ou synchroniser avec Anki */}
        <button
          onClick={onOpenAnkiModal}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all shadow-2xs"
          title="Voir dans mes paquets Anki"
        >
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>Synchroniser Anki</span>
        </button>

      </div>

    </div>
  );
};
