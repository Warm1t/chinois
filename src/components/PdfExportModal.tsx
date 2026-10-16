import React, { useState } from 'react';
import { FileDown, X, Check, Layers, BookOpen, Languages, HelpCircle, Sparkles, Printer } from 'lucide-react';
import { MaayotStory } from '../types/fluent';
import { AudioNovel } from '../types/novel';
import {
  PdfExportOptions,
  exportStoryToPdf,
  exportMultipleStoriesToPdf,
  exportNovelToPdf,
} from '../utils/storyPdfExport';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  story?: MaayotStory;
  customStories?: MaayotStory[];
  novel?: AudioNovel;
  currentChapterNumber?: number;
  currentPageNumber?: number;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  story,
  customStories = [],
  novel,
  currentChapterNumber = 1,
  currentPageNumber = 1,
}) => {
  const [layoutMode, setLayoutMode] = useState<'interlinear' | 'classic' | 'immersion'>('interlinear');
  const [includePinyin, setIncludePinyin] = useState<boolean>(true);
  const [includeTranslation, setIncludeTranslation] = useState<boolean>(true);
  const [includeVocabulary, setIncludeVocabulary] = useState<boolean>(true);
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);

  // Pour les histoires courtes : exporter l'histoire active ou toutes les histoires générées
  const [storyScope, setStoryScope] = useState<'single' | 'all_custom'>('single');

  // Pour les romans : exporter tout le roman, le chapitre actuel ou la page actuelle
  const [novelScope, setNovelScope] = useState<'all' | 'chapter' | 'page'>('all');

  if (!isOpen) return null;

  const handleExport = () => {
    const options: PdfExportOptions = {
      layoutMode,
      includePinyin,
      includeTranslation,
      includeVocabulary,
      includeQuiz,
      novelScope,
      currentChapterNumber,
      currentPageNumber,
    };

    if (novel) {
      exportNovelToPdf(novel, options);
    } else if (storyScope === 'all_custom' && customStories.length > 0) {
      exportMultipleStoriesToPdf(customStories, options);
    } else if (story) {
      exportStoryToPdf(story, options);
    }

    onClose();
  };

  const titleDisplay = novel
    ? `${novel.coverEmoji} ${novel.title} (${novel.titleTranslation})`
    : story
    ? `${story.title} (${story.titleTranslation})`
    : 'Histoire Mandarin';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#fcfaf7] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl shadow-[6px_6px_0px_#1c1917] dark:shadow-[6px_6px_0px_#000] p-6 space-y-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-3.5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#c23b22]/10 text-[#c23b22] dark:text-amber-400 text-[11px] font-bold">
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF Haute Définition (A4)</span>
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100">
              Exporter en PDF
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 truncate max-w-sm">
              {titleDisplay}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Périmètre d'export (Roman ou Histoires générées) */}
        {novel ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              1. Parties du roman à exporter
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setNovelScope('all')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  novelScope === 'all'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="text-xs font-black">Roman complet</div>
                <div className="text-[10px] opacity-80">{novel.totalPages} pages • {novel.totalChapters} chap.</div>
              </button>

              <button
                type="button"
                onClick={() => setNovelScope('chapter')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  novelScope === 'chapter'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="text-xs font-black">Chapitre {currentChapterNumber}</div>
                <div className="text-[10px] opacity-80">Chapitre en cours</div>
              </button>

              <button
                type="button"
                onClick={() => setNovelScope('page')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  novelScope === 'page'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="text-xs font-black">Page {currentPageNumber}</div>
                <div className="text-[10px] opacity-80">Page actuelle (10 phrases)</div>
              </button>
            </div>
          </div>
        ) : customStories.length > 0 ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              1. Quelles histoires exporter ?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStoryScope('single')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  storyScope === 'single'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="text-xs font-black">Histoire affichée</div>
                <div className="text-[10px] opacity-80 truncate">{story?.title}</div>
              </button>

              <button
                type="button"
                onClick={() => setStoryScope('all_custom')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  storyScope === 'all_custom'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="text-xs font-black flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Toutes mes histoires générées</span>
                </div>
                <div className="text-[10px] opacity-80">Recueil complet ({customStories.length} histoires)</div>
              </button>
            </div>
          </div>
        ) : null}

        {/* 2. Style de mise en page PDF */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
            {novel || customStories.length > 0 ? '2.' : '1.'} Disposition visuelle des phrases
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setLayoutMode('interlinear')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                layoutMode === 'interlinear'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-[#c23b22] text-stone-900 dark:text-amber-100 ring-1 ring-[#c23b22]'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="text-xs font-black text-[#c23b22] dark:text-amber-400">
                Cartes Mot-à-Mot
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                Capsules avec Pinyin, Hanzi et sens de chaque mot (comme sur le site).
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('classic')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                layoutMode === 'classic'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-[#c23b22] text-stone-900 dark:text-amber-100 ring-1 ring-[#c23b22]'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="text-xs font-black text-stone-900 dark:text-stone-100">
                Bilingue Classique
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                Phrase en chinois, ligne de Pinyin dessous et traduction française.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('immersion')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                layoutMode === 'immersion'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-[#c23b22] text-stone-900 dark:text-amber-100 ring-1 ring-[#c23b22]'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="text-xs font-black text-stone-900 dark:text-stone-100">
                Lecture Immersion
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                Grands caractères chinois continus comme dans un livre chinois.
              </div>
            </button>
          </div>
        </div>

        {/* 3. Éléments à inclure */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
            {novel || customStories.length > 0 ? '3.' : '2.'} Options à inclure dans le PDF
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
              <input
                type="checkbox"
                checked={includePinyin}
                onChange={(e) => setIncludePinyin(e.target.checked)}
                className="w-4 h-4 accent-[#c23b22] rounded"
              />
              <span>Inclure le Pinyin</span>
            </label>

            <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
              <input
                type="checkbox"
                checked={includeTranslation}
                onChange={(e) => setIncludeTranslation(e.target.checked)}
                className="w-4 h-4 accent-[#c23b22] rounded"
              />
              <span>Traduction française</span>
            </label>

            <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
              <input
                type="checkbox"
                checked={includeVocabulary}
                onChange={(e) => setIncludeVocabulary(e.target.checked)}
                className="w-4 h-4 accent-[#c23b22] rounded"
              />
              <span>Table du vocabulaire</span>
            </label>

            {!novel && (
              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={includeQuiz}
                  onChange={(e) => setIncludeQuiz(e.target.checked)}
                  className="w-4 h-4 accent-[#c23b22] rounded"
                />
                <span>Quiz de compréhension</span>
              </label>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="pt-2 flex items-center justify-end space-x-2.5 border-t border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="px-6 py-2.5 rounded-2xl bg-[#c23b22] hover:bg-[#a9301a] text-white font-black text-xs shadow-md border-2 border-stone-900 dark:border-stone-700 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Générer & Télécharger le PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

