import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioNovel, NovelPage, NovelChapterMeta } from '../types/novel';
import { AUDIO_NOVELS } from '../data/novelsData';
import { AnkiWord, StoryWordToken, StorySentence } from '../types/fluent';
import { 
  playChineseAudio, 
  playChineseStoryAudio, 
  stopChineseAudio, 
  playNativeWordAudio 
} from '../utils/speechUtils';
import { saveWordToLocalAnki, isWordInLocalAnki } from '../utils/ankiConnect';
import { triggerAutoSyncToCloud } from '../utils/cloudSyncUtils';
import { WordDefinitionBanner } from './WordDefinitionBanner';
import { VoiceSelector } from './VoiceSelector';
import { 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  ListOrdered, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Layers, 
  Clock, 
  Eye, 
  EyeOff, 
  Languages, 
  Library, 
  Check, 
  X,
  Compass,
  Headphones,
  FileText
} from 'lucide-react';

interface AudioNovelReaderViewProps {
  syncedAnkiWords: AnkiWord[];
  onOpenAnkiModal: () => void;
  onIncrementStreak?: () => void;
  onSwitchToShortStories?: () => void;
}

export const AudioNovelReaderView: React.FC<AudioNovelReaderViewProps> = ({
  syncedAnkiWords,
  onOpenAnkiModal,
  onIncrementStreak,
  onSwitchToShortStories,
}) => {
  // Liste des romans audio
  const novels = AUDIO_NOVELS;

  // Roman actuellement sélectionné
  const [selectedNovelId, setSelectedNovelId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('fluent_last_selected_novel_id');
      if (saved && novels.some(n => n.id === saved)) return saved;
      return novels[0]?.id || '';
    } catch {
      return novels[0]?.id || '';
    }
  });

  const activeNovel: AudioNovel = novels.find(n => n.id === selectedNovelId) || novels[0];

  // Page actuelle dans le roman sélectionné (1 à 30)
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`fluent_novel_progress_${selectedNovelId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentPage && parsed.currentPage >= 1 && parsed.currentPage <= (activeNovel?.totalPages || 30)) {
          return parsed.currentPage;
        }
      }
      return 1;
    } catch {
      return 1;
    }
  });

  // Romans terminés
  const [completedNovelIds, setCompletedNovelIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fluent_completed_novels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Préférences de lecture
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [autoAdvancePage, setAutoAdvancePage] = useState<boolean>(false);

  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeSpeakerGender, setActiveSpeakerGender] = useState<'female' | 'male' | null>(null);
  const [playingSentenceIndex, setPlayingSentenceIndex] = useState<number | null>(null);
  const [playingSingleSentenceIdx, setPlayingSingleSentenceIdx] = useState<number | null>(null);

  // Modale Sommaire / Table des matières
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);

  // Modale de sélection de romans (Bibliothèque)
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  // Dictionnaire / Token de mot actif
  const [selectedWord, setSelectedWord] = useState<StoryWordToken | null>(null);
  const [selectedWordSentenceIdx, setSelectedWordSentenceIdx] = useState<number | null>(null);

  // Notification Anki
  const [ankiToast, setAnkiToast] = useState<string | null>(null);
  const [, setLocalAnkiVersion] = useState<number>(0);

  // Récupérer la page active
  const currentPage: NovelPage = activeNovel.pages.find(p => p.pageNumber === currentPageNumber) || activeNovel.pages[0];

  // Chapitre correspondant à la page actuelle
  const currentChapter: NovelChapterMeta | undefined = activeNovel.chaptersMeta.find(
    c => currentPageNumber >= c.startPage && currentPageNumber <= c.endPage
  );

  // Sauvegarder la progression à chaque changement de page ou de roman
  useEffect(() => {
    try {
      localStorage.setItem('fluent_last_selected_novel_id', activeNovel.id);
      localStorage.setItem(`fluent_novel_progress_${activeNovel.id}`, JSON.stringify({
        currentPage: currentPageNumber,
        timestamp: Date.now()
      }));
    } catch {}
  }, [activeNovel.id, currentPageNumber]);

  // Synchroniser la page sauvegardée lors du changement de roman
  const handleSelectNovel = (novelId: string) => {
    stopChineseAudio();
    setIsPlayingAudio(false);
    setSelectedWord(null);
    setSelectedWordSentenceIdx(null);
    setPlayingSentenceIndex(null);
    setPlayingSingleSentenceIdx(null);

    setSelectedNovelId(novelId);
    const targetNovel = novels.find(n => n.id === novelId);
    let targetPage = 1;
    try {
      const saved = localStorage.getItem(`fluent_novel_progress_${novelId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentPage && parsed.currentPage >= 1 && parsed.currentPage <= (targetNovel?.totalPages || 30)) {
          targetPage = parsed.currentPage;
        }
      }
    } catch {}
    setCurrentPageNumber(targetPage);
    setIsLibraryOpen(false);
  };

  // Arrêter l'audio lors du changement de page ou démontage
  useEffect(() => {
    stopChineseAudio();
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
    setPlayingSentenceIndex(null);
    setPlayingSingleSentenceIdx(null);
    setSelectedWord(null);
    setSelectedWordSentenceIdx(null);

    return () => {
      stopChineseAudio();
    };
  }, [currentPageNumber, selectedNovelId]);

  // Écouter les changements dans le stockage Anki local
  useEffect(() => {
    const handleAnkiChange = () => setLocalAnkiVersion(v => v + 1);
    window.addEventListener('fluent_anki_words_changed', handleAnkiChange);
    return () => window.removeEventListener('fluent_anki_words_changed', handleAnkiChange);
  }, []);

  // Déplacement clavier (flèche gauche / droite)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur tape dans un input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPageNumber > 1) {
          setCurrentPageNumber(p => p - 1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentPageNumber < activeNovel.totalPages) {
          setCurrentPageNumber(p => p + 1);
        }
      } else if (e.key === ' ' && !e.repeat) {
        // Barre d'espace pour Play / Pause
        e.preventDefault();
        handleToggleAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageNumber, activeNovel.totalPages, isPlayingAudio]);

  // Vérifier si un mot est déjà dans Anki
  const isWordInUserAnki = useCallback((hanzi: string) => {
    if (!hanzi) return false;
    return syncedAnkiWords.some(w => w.hanzi.includes(hanzi) || hanzi.includes(w.hanzi)) || isWordInLocalAnki(hanzi);
  }, [syncedAnkiWords]);

  // Sauvegarder un mot dans Anki
  const handleSaveWordToAnki = (word: {
    hanzi: string;
    pinyin?: string;
    translation?: string;
    exampleSentence?: string;
    examplePinyin?: string;
    exampleTranslation?: string;
  }) => {
    const res = saveWordToLocalAnki({
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      translation: word.translation,
      deckName: 'Fluent',
      source: 'fluent_to_anki',
      exampleSentence: word.exampleSentence,
      examplePinyin: word.examplePinyin,
      exampleTranslation: word.exampleTranslation,
    });
    setAnkiToast(res.isNew 
      ? `✨ "${word.hanzi}" ajouté à ton paquet Anki "Fluent" (${res.totalCount} cartes) !` 
      : `✓ "${word.hanzi}" est déjà présent dans ton paquet Anki.`
    );
    setTimeout(() => setAnkiToast(null), 3800);
  };

  // Lecture audio complète de la page actuelle
  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      stopChineseAudio();
      setIsPlayingAudio(false);
      setActiveSpeakerGender(null);
      setPlayingSentenceIndex(null);
      return;
    }

    stopChineseAudio();
    setPlayingSingleSentenceIdx(null);
    setIsPlayingAudio(true);

    const pageSentences = currentPage.paragraphs.flatMap(p => p.sentences.map(s => s.hanzi));

    try {
      await playChineseStoryAudio(
        pageSentences.length > 0 ? pageSentences : currentPage.audioText,
        playbackSpeed,
        (idx, _text, gender) => {
          setActiveSpeakerGender(gender);
          setPlayingSentenceIndex(idx);
        }
      );

      // Auto-avance optionnelle si activée et pas sur la dernière page
      if (autoAdvancePage && currentPageNumber < activeNovel.totalPages) {
        setTimeout(() => {
          setCurrentPageNumber(p => p + 1);
        }, 1200);
      }
    } finally {
      setIsPlayingAudio(false);
      setActiveSpeakerGender(null);
      setPlayingSentenceIndex(null);
    }
  };

  // Lecture audio d'une seule phrase
  const handlePlaySingleSentence = async (sentence: StorySentence, globalIdx: number) => {
    if (playingSingleSentenceIdx === globalIdx) {
      stopChineseAudio();
      setPlayingSingleSentenceIdx(null);
      return;
    }

    stopChineseAudio();
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
    setPlayingSentenceIndex(null);
    setPlayingSingleSentenceIdx(globalIdx);

    try {
      await playChineseAudio(sentence.hanzi, playbackSpeed);
    } finally {
      setPlayingSingleSentenceIdx(null);
    }
  };

  // Prononcer un mot au clic
  const handlePronounceWord = (wordHanzi: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playNativeWordAudio(wordHanzi, 0.85);
  };

  // Marquer le roman comme terminé
  const handleMarkNovelCompleted = () => {
    if (!completedNovelIds.includes(activeNovel.id)) {
      const updated = [...completedNovelIds, activeNovel.id];
      setCompletedNovelIds(updated);
      try {
        localStorage.setItem('fluent_completed_novels', JSON.stringify(updated));
      } catch {}
      triggerAutoSyncToCloud();
      if (onIncrementStreak) onIncrementStreak();
    }
  };

  // Liste de toutes les phrases de la page pour indexation globale
  let sentenceCounter = 0;

  // Calcul du pourcentage de lecture du roman
  const progressPercent = Math.round((currentPageNumber / activeNovel.totalPages) * 100);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Toast Notification Anki */}
      {ankiToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-400 font-bold text-xs flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{ankiToast}</span>
        </div>
      )}

      {/* 1. BARRE DE COMMUTATION SUPÉRIEURE (Histoires courtes vs Romans longs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center space-x-2">
          {onSwitchToShortStories && (
            <button
              onClick={onSwitchToShortStories}
              className="px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📖 Histoires Courtes (Short Stories)</span>
            </button>
          )}

          <div className="px-4 py-2 rounded-2xl text-xs font-black bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>📚 Romans & Livres Audio (30 pages)</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black">
              3 Romans
            </span>
          </div>
        </div>

        {/* Bouton pour changer de roman dans la bibliothèque */}
        <button
          onClick={() => setIsLibraryOpen(true)}
          className="px-3.5 py-2 rounded-2xl text-xs font-bold border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <Library className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Changer de Roman ({novels.findIndex(n => n.id === activeNovel.id) + 1}/3)</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      {/* 2. EN-TÊTE DU ROMAN ACTIF : BANNIÈRE ÉLÉGANTE */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${activeNovel.coverColor} text-white shadow-lg border border-stone-800`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-black/30 backdrop-blur-md border border-white/20 text-white">
                {activeNovel.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-amber-200 border border-white/10">
                {activeNovel.genre}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/20 text-white/90 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>{activeNovel.estimatedListeningTime} d'écoute</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/20 text-white/90">
                {activeNovel.wordCount} mots • 30 pages
              </span>
              {completedNovelIds.includes(activeNovel.id) && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Roman Terminé</span>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-mono text-amber-200 tracking-wide">
                {activeNovel.titlePinyin}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white flex items-center space-x-3">
                <span className="text-3xl sm:text-4xl">{activeNovel.coverEmoji}</span>
                <span>{activeNovel.title}</span>
              </h2>
              <p className="text-sm sm:text-base text-stone-200 italic font-serif">
                « {activeNovel.titleTranslation} »
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed pt-1 line-clamp-2 md:line-clamp-3">
              {activeNovel.synopsisTranslation}
            </p>
          </div>

          {/* Badge & Jauge de progression */}
          <div className="shrink-0 bg-black/30 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 flex flex-col items-center justify-center min-w-[170px] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
              Progression du roman
            </span>
            <div className="text-3xl font-black font-serif text-white flex items-baseline space-x-1">
              <span>Page {currentPageNumber}</span>
              <span className="text-sm text-stone-300">/ 30</span>
            </div>
            
            {/* Barre de progression miniature */}
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-300 font-mono">
              {progressPercent}% complété
            </span>
          </div>
        </div>
      </div>

      {/* 3. BARRE DE CONTRÔLE DU LECTEUR & SOMMAIRE */}
      <div className="sticky top-16 z-30 bg-[#fdfcf9]/95 dark:bg-[#0e0d0c]/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Section Gauche : Indicateur de Chapitre & Bouton Sommaire */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsTocOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Ouvrir la table des matières (6 chapitres / 30 pages)"
            >
              <ListOrdered className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Sommaire (Chapitre {currentPage.chapterNumber})</span>
            </button>

            <div className="truncate min-w-0">
              <div className="flex items-center space-x-2 truncate">
                <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-[10px] shrink-0">
                  Ch. {currentPage.chapterNumber}/6
                </span>
                <span className="font-serif font-black text-sm text-stone-900 dark:text-stone-100 truncate">
                  {currentPage.chapterTitle}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate italic">
                {currentPage.chapterTitleTranslation}
              </p>
            </div>
          </div>

          {/* Section Droite : Toolbar Audio & Toggles de lecture */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Bouton Principal de Lecture Audio */}
            <button
              onClick={handleToggleAudio}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause (Page {currentPageNumber})</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Écouter la Page {currentPageNumber}</span>
                </>
              )}
            </button>

            {/* Vitesse de lecture */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-2xl p-1 border border-stone-200 dark:border-stone-700 text-xs font-bold">
              {[0.75, 0.85, 1.0, 1.25].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-xl transition-all ${
                    playbackSpeed === speed
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-black'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Toggle Pinyin */}
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                showPinyin
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
              }`}
              title="Afficher ou masquer la transcription en pinyin"
            >
              {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Pinyin</span>
            </button>

            {/* Toggle Traduction */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                showTranslation
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
              }`}
              title="Afficher ou masquer les traductions en français"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Traduction</span>
            </button>

            {/* Sélecteur de voix Homme / Femme */}
            <VoiceSelector compact />
          </div>

        </div>

        {/* Barre de défilement horizontal des 30 pages pour saut rapide */}
        <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800/80 flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider shrink-0 mr-1.5">
            Pages :
          </span>
          {activeNovel.pages.map((p) => {
            const isCurrent = p.pageNumber === currentPageNumber;
            const isRead = p.pageNumber < currentPageNumber;
            return (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageNumber(p.pageNumber)}
                className={`w-7 h-7 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 shadow-xs scale-105 ring-2 ring-amber-400/50'
                    : isRead
                    ? 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-200'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
                title={`Page ${p.pageNumber} (${p.chapterTitle})`}
              >
                {p.pageNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CONTENU DE LA PAGE : TEXTE IMMERSIF */}
      <div className="bg-white dark:bg-stone-900/90 rounded-3xl p-6 sm:p-10 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
        
        {/* Titre et repère de la page */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                Chapitre {currentPage.chapterNumber} • Page {currentPage.pageNumber} / {activeNovel.totalPages}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100 mt-0.5">
              {currentPage.chapterTitle}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPageNumber(Math.max(1, currentPageNumber - 1))}
              disabled={currentPageNumber === 1}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Page précédente (Flèche gauche)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-stone-500 px-1">
              {currentPageNumber} / {activeNovel.totalPages}
            </span>
            <button
              onClick={() => setCurrentPageNumber(Math.min(activeNovel.totalPages, currentPageNumber + 1))}
              disabled={currentPageNumber === activeNovel.totalPages}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Page suivante (Flèche droite)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paragraphes de la page */}
        <div className="space-y-6 sm:space-y-8 text-stone-800 dark:text-stone-200">
          {currentPage.paragraphs.map((para, pIdx) => (
            <div key={pIdx} className="space-y-4">
              {para.sentences.map((sentence) => {
                const globalIdx = sentenceCounter++;
                const isCurrentAudioPlaying = isPlayingAudio && playingSentenceIndex === globalIdx;
                const isCurrentSinglePlaying = playingSingleSentenceIdx === globalIdx;
                const isHighlighted = isCurrentAudioPlaying || isCurrentSinglePlaying;

                return (
                  <div
                    key={globalIdx}
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      isHighlighted
                        ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-stone-50/50 dark:bg-stone-800/30 border-transparent hover:border-stone-200 dark:hover:border-stone-700'
                    }`}
                  >
                    {/* Header de la phrase avec bouton d'écoute isolée */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 font-bold">
                          #{globalIdx + 1}
                        </span>
                        {isHighlighted && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold flex items-center space-x-1 animate-pulse">
                            <Headphones className="w-2.5 h-2.5" />
                            <span>En cours d'écoute {activeSpeakerGender === 'female' ? '(Voix Féminine)' : activeSpeakerGender === 'male' ? '(Voix Masculine)' : ''}</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handlePlaySingleSentence(sentence, globalIdx)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                          isCurrentSinglePlaying
                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                            : 'bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300'
                        }`}
                        title="Écouter uniquement cette phrase"
                      >
                        {isCurrentSinglePlaying ? (
                          <VolumeX className="w-3 h-3 text-rose-300" />
                        ) : (
                          <Play className="w-3 h-3 fill-current text-stone-700 dark:text-stone-300" />
                        )}
                        <span className="text-[11px]">Écouter</span>
                      </button>
                    </div>

                    {/* Mots chinois interactifs et cliquables */}
                    <div className="flex flex-wrap items-end gap-x-1.5 gap-y-3 py-1">
                      {sentence.words.map((word, wIdx) => {
                        const isSelected = selectedWord?.hanzi === word.hanzi && selectedWordSentenceIdx === globalIdx;
                        const inAnki = isWordInUserAnki(word.hanzi);

                        return (
                          <span
                            key={wIdx}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedWord(null);
                                setSelectedWordSentenceIdx(null);
                              } else {
                                setSelectedWord(word);
                                setSelectedWordSentenceIdx(globalIdx);
                              }
                            }}
                            className={`group inline-flex flex-col items-center cursor-pointer rounded-xl px-1.5 py-0.5 transition-all select-none ${
                              isSelected
                                ? 'bg-amber-200 dark:bg-amber-900/80 shadow-xs ring-2 ring-amber-400'
                                : inAnki
                                ? 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                : 'hover:bg-stone-200/80 dark:hover:bg-stone-700/60'
                            }`}
                            title={`Cliquer pour voir la traduction et ajouter à Anki (${word.pinyin})`}
                          >
                            {/* Pinyin au-dessus du caractère */}
                            {showPinyin && (
                              <span
                                data-pinyin
                                className="text-xs sm:text-sm font-mono tracking-wide pinyin-text transition-colors text-stone-600 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200"
                              >
                                {word.pinyin}
                              </span>
                            )}

                            {/* Sinogramme Chinois */}
                            <span className="text-xl sm:text-2xl font-serif font-black chinese-text tracking-wide relative text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] dark:group-hover:text-amber-400">
                              {word.hanzi}
                              {inAnki && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-stone-900" title="Déjà dans Anki" />
                              )}
                            </span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Traduction de la phrase */}
                    {showTranslation && sentence.translation && (
                      <p className="text-xs sm:text-sm font-sans text-stone-500 dark:text-stone-400 italic pl-2 border-l-2 border-amber-400 dark:border-amber-600 mt-2">
                        {sentence.translation}
                      </p>
                    )}

                    {/* Dictionnaire interactif popup pour le mot cliqué */}
                    {selectedWord && selectedWordSentenceIdx === globalIdx && (
                      <div className="mt-3 pt-2 border-t border-amber-200 dark:border-amber-800/80">
                        <WordDefinitionBanner
                          selectedWord={selectedWord}
                          currentSentence={sentence}
                          playbackSpeed={playbackSpeed}
                          isWordInAnki={isWordInUserAnki(selectedWord.hanzi)}
                          onPronounceWord={handlePronounceWord}
                          onSaveWordToAnki={handleSaveWordToAnki}
                          onClose={() => {
                            setSelectedWord(null);
                            setSelectedWordSentenceIdx(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 5. NAVIGATION DE FIN DE PAGE (Suivant / Précédent) */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPageNumber(Math.max(1, currentPageNumber - 1))}
            disabled={currentPageNumber === 1}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Page précédente (Page {currentPageNumber - 1})</span>
          </button>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Page {currentPageNumber} sur {activeNovel.totalPages} • Flèches gauche/droite pour tourner
          </div>

          {currentPageNumber < activeNovel.totalPages ? (
            <button
              onClick={() => setCurrentPageNumber(currentPageNumber + 1)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Page suivante (Page {currentPageNumber + 1})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleMarkNovelCompleted}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-md ${
                completedNovelIds.includes(activeNovel.id)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completedNovelIds.includes(activeNovel.id)
                  ? 'Roman validé (+1j Pratique)'
                  : 'Terminer le roman & Valider (+1j Streak)'}
              </span>
            </button>
          )}
        </div>

      </div>

      {/* 6. VOCABULAIRE CLÉ DU ROMAN */}
      <div className="bg-stone-100/90 dark:bg-stone-800/50 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Vocabulaire essentiel du roman :</span>
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Cliquer sur un mot pour l'écouter ou l'ajouter à Anki
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeNovel.keyVocabulary.map((word, idx) => {
            const inAnki = isWordInUserAnki(word.hanzi);
            return (
              <div
                key={idx}
                onClick={() => playNativeWordAudio(word.hanzi, 0.9)}
                className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer flex items-center justify-between transition-all shadow-2xs group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-black text-lg text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] dark:group-hover:text-amber-400">
                      {word.hanzi}
                    </span>
                    <span className="text-stone-500 dark:text-amber-300 font-mono text-xs">
                      {word.pinyin}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    {word.translation}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveWordToAnki(word);
                  }}
                  className={`p-2 rounded-xl border transition-all ${
                    inAnki
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-stone-50 dark:bg-stone-700 hover:bg-emerald-50 text-stone-400 dark:text-stone-300 hover:text-emerald-700 border-stone-200 dark:border-stone-600'
                  }`}
                  title={inAnki ? 'Déjà dans ton Anki' : 'Ajouter à Anki'}
                >
                  {inAnki ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODALE 1 : TABLE DES MATIÈRES / SOMMAIRE DU ROMAN        */}
      {/* ======================================================== */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-stone-300 dark:border-stone-700 shadow-2xl">
            {/* Header Sommaire */}
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
                    Table des matières
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {activeNovel.title} • 6 Chapitres • 30 Pages
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTocOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Liste des Chapitres et Pages */}
            <div className="p-5 overflow-y-auto space-y-4">
              {activeNovel.chaptersMeta.map((chap) => {
                const isCurrentChap = currentPageNumber >= chap.startPage && currentPageNumber <= chap.endPage;
                return (
                  <div 
                    key={chap.chapterNumber}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrentChap 
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 ring-1 ring-amber-400/30' 
                        : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-black font-mono">
                          Ch. {chap.chapterNumber}
                        </span>
                        <h4 className="font-serif font-black text-stone-900 dark:text-stone-100 text-sm">
                          {chap.title}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-400">
                        Pages {chap.startPage}-{chap.endPage}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 italic mb-3">
                      {chap.titleTranslation}
                    </p>

                    {/* Grille des boutons de pages pour ce chapitre */}
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: chap.endPage - chap.startPage + 1 }, (_, i) => chap.startPage + i).map(pNum => {
                        const isCurrentPage = pNum === currentPageNumber;
                        return (
                          <button
                            key={pNum}
                            onClick={() => {
                              setCurrentPageNumber(pNum);
                              setIsTocOpen(false);
                            }}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              isCurrentPage
                                ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 shadow-xs'
                                : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 border border-stone-200 dark:border-stone-600'
                            }`}
                          >
                            P. {pNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALE 2 : BIBLIOTHÈQUE DES 3 ROMANS AUDIO DISPONIBLES    */}
      {/* ======================================================== */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-stone-300 dark:border-stone-700 shadow-2xl">
            {/* Header Bibliothèque */}
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#c23b22]/15 text-[#c23b22] flex items-center justify-center">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
                    Bibliothèque de Romans Audio (HSK 3 - 4)
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Choisis un roman complet de 30 pages à lire et écouter
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Liste des romans */}
            <div className="p-5 overflow-y-auto space-y-4">
              {novels.map((novel, idx) => {
                const isSelected = novel.id === activeNovel.id;
                let savedPage = 1;
                try {
                  const saved = localStorage.getItem(`fluent_novel_progress_${novel.id}`);
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.currentPage) savedPage = parsed.currentPage;
                  }
                } catch {}

                return (
                  <div
                    key={novel.id}
                    onClick={() => handleSelectNovel(novel.id)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-400/30'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-stone-50/40 dark:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                            {novel.level}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                            {novel.genre}
                          </span>
                          <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{novel.estimatedListeningTime}</span>
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{novel.coverEmoji}</span>
                            <h4 className="font-serif font-black text-lg text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] dark:group-hover:text-amber-400 transition-colors">
                              {novel.title}
                            </h4>
                          </div>
                          <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                            « {novel.titleTranslation} »
                          </p>
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                          {novel.synopsisTranslation}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end space-y-2">
                        {isSelected && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400 text-stone-950">
                            En cours
                          </span>
                        )}
                        <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                          P. {savedPage} / 30
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
