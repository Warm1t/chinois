import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioNovel, NovelPage, NovelChapterMeta } from '../types/novel';
import { AUDIO_NOVELS } from '../data/novelsData';
import { AnkiWord, StoryWordToken, StorySentence } from '../types/fluent';
import { 
  playChineseAudio, 
  playChineseStoryAudio, 
  stopChineseAudio, 
  playNativeWordAudio,
  evaluatePronunciation,
  isSpeechRecognitionSupported
} from '../utils/speechUtils';
import { 
  analyzeSentenceRhythm, 
  playSentenceWithProsodicPauses, 
  stopSentenceRhythmAudio 
} from '../utils/chineseRhythmEngine';
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
  Clock, 
  Eye, 
  EyeOff, 
  Languages, 
  Library, 
  Check, 
  X,
  FileText,
  Music,
  Info,
  Mic,
  Square
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

  // Préférences du lecteur immersif (identiques à StoryReaderView)
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [readerMode, setReaderMode] = useState<'rhythm' | 'words'>('rhythm');
  const [showRhythmGuide, setShowRhythmGuide] = useState<boolean>(false);

  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeSpeakerGender, setActiveSpeakerGender] = useState<'female' | 'male' | null>(null);
  const [playingSentenceIndex, setPlayingSentenceIndex] = useState<number | null>(null);
  const [playingSingleSentenceIdx, setPlayingSingleSentenceIdx] = useState<number | null>(null);
  const [playingRhythmSentenceIdx, setPlayingRhythmSentenceIdx] = useState<number | null>(null);
  const [activeRhythmChunkIdx, setActiveRhythmChunkIdx] = useState<number | null>(null);

  // Studio interactif de Shadowing
  const [shadowingGlobalIdx, setShadowingGlobalIdx] = useState<number | null>(null);
  const [shadowingSentence, setShadowingSentence] = useState<StorySentence | null>(null);
  const [shadowingRecording, setShadowingRecording] = useState<boolean>(false);
  const [shadowingAudioUrl, setShadowingAudioUrl] = useState<string | null>(null);
  const [shadowingSpokenText, setShadowingSpokenText] = useState<string>('');
  const [shadowingEvaluation, setShadowingEvaluation] = useState<any | null>(null);
  const [isPlayingShadowUserAudio, setIsPlayingShadowUserAudio] = useState<boolean>(false);

  const shadowMediaStreamRef = useRef<MediaStream | null>(null);
  const shadowMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const shadowAudioChunksRef = useRef<Blob[]>([]);
  const shadowUserAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Modales
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  // Dictionnaire / Token de mot actif
  const [selectedWord, setSelectedWord] = useState<StoryWordToken | null>(null);
  const [selectedWordSentenceIdx, setSelectedWordSentenceIdx] = useState<number | null>(null);

  // Notification Anki
  const [ankiToast, setAnkiToast] = useState<string | null>(null);
  const [, setLocalAnkiVersion] = useState<number>(0);

  // Récupérer la page active
  const currentPage: NovelPage = activeNovel.pages.find(p => p.pageNumber === currentPageNumber) || activeNovel.pages[0];

  // Nettoyage enregistrement Shadowing
  const cleanupShadowRecording = () => {
    if (shadowMediaRecorderRef.current) {
      try {
        if (shadowMediaRecorderRef.current.state === 'recording') {
          shadowMediaRecorderRef.current.stop();
        }
      } catch (e) {}
      shadowMediaRecorderRef.current = null;
    }
    if (shadowMediaStreamRef.current) {
      try {
        shadowMediaStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (e) {}
      shadowMediaStreamRef.current = null;
    }
    setShadowingRecording(false);
  };

  // Sauvegarder la progression
  useEffect(() => {
    try {
      localStorage.setItem('fluent_last_selected_novel_id', activeNovel.id);
      localStorage.setItem(`fluent_novel_progress_${activeNovel.id}`, JSON.stringify({
        currentPage: currentPageNumber,
        timestamp: Date.now()
      }));
    } catch {}
  }, [activeNovel.id, currentPageNumber]);

  // Synchroniser lors du changement de roman
  const handleSelectNovel = (novelId: string) => {
    stopChineseAudio();
    stopSentenceRhythmAudio();
    setIsPlayingAudio(false);
    setSelectedWord(null);
    setSelectedWordSentenceIdx(null);
    setPlayingSentenceIndex(null);
    setPlayingSingleSentenceIdx(null);
    setPlayingRhythmSentenceIdx(null);
    setActiveRhythmChunkIdx(null);
    setShadowingGlobalIdx(null);
    setShadowingSentence(null);
    cleanupShadowRecording();

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
    stopSentenceRhythmAudio();
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
    setPlayingSentenceIndex(null);
    setPlayingSingleSentenceIdx(null);
    setPlayingRhythmSentenceIdx(null);
    setActiveRhythmChunkIdx(null);
    setSelectedWord(null);
    setSelectedWordSentenceIdx(null);
    setShadowingGlobalIdx(null);
    setShadowingSentence(null);
    cleanupShadowRecording();

    if (shadowUserAudioPlayerRef.current) {
      try { shadowUserAudioPlayerRef.current.pause(); } catch (e) {}
      setIsPlayingShadowUserAudio(false);
    }
    if (shadowingAudioUrl) {
      URL.revokeObjectURL(shadowingAudioUrl);
      setShadowingAudioUrl(null);
    }

    return () => {
      stopChineseAudio();
      stopSentenceRhythmAudio();
      cleanupShadowRecording();
    };
  }, [currentPageNumber, selectedNovelId]);

  // Écouter les changements Anki
  useEffect(() => {
    const handleAnkiChange = () => setLocalAnkiVersion(v => v + 1);
    window.addEventListener('fluent_anki_words_changed', handleAnkiChange);
    return () => window.removeEventListener('fluent_anki_words_changed', handleAnkiChange);
  }, []);

  // Déplacement clavier (flèche gauche / droite)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageNumber, activeNovel.totalPages]);

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

  // Lecture audio complète de la page actuelle (raconter la page)
  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      stopChineseAudio();
      stopSentenceRhythmAudio();
      setIsPlayingAudio(false);
      setActiveSpeakerGender(null);
      setPlayingSentenceIndex(null);
      return;
    }

    stopChineseAudio();
    stopSentenceRhythmAudio();
    setPlayingSingleSentenceIdx(null);
    setPlayingRhythmSentenceIdx(null);
    setActiveRhythmChunkIdx(null);
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
      stopSentenceRhythmAudio();
      setPlayingSingleSentenceIdx(null);
      return;
    }

    stopChineseAudio();
    stopSentenceRhythmAudio();
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
    setPlayingSentenceIndex(null);
    setPlayingRhythmSentenceIdx(null);
    setActiveRhythmChunkIdx(null);
    setPlayingSingleSentenceIdx(globalIdx);

    try {
      await playChineseAudio(sentence.hanzi, playbackSpeed);
    } finally {
      setPlayingSingleSentenceIdx(null);
    }
  };

  // Lecture de la cadence rythmée avec micro-pauses
  const handlePlaySentenceRhythmCadence = async (sentence: StorySentence, globalIdx: number) => {
    if (playingRhythmSentenceIdx === globalIdx) {
      stopSentenceRhythmAudio();
      stopChineseAudio();
      setPlayingRhythmSentenceIdx(null);
      setActiveRhythmChunkIdx(null);
      return;
    }

    stopChineseAudio();
    stopSentenceRhythmAudio();
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
    setPlayingSentenceIndex(null);
    setPlayingSingleSentenceIdx(null);
    setPlayingRhythmSentenceIdx(globalIdx);

    const analysis = analyzeSentenceRhythm(sentence);
    try {
      await playSentenceWithProsodicPauses(
        analysis.chunks,
        playbackSpeed,
        'female',
        (chunkIdx) => {
          setActiveRhythmChunkIdx(chunkIdx);
        }
      );
    } finally {
      setPlayingRhythmSentenceIdx(null);
      setActiveRhythmChunkIdx(null);
    }
  };

  // Shadowing : enregistrement micro
  const handleToggleShadowRecording = async (targetSentence: StorySentence) => {
    if (!isSpeechRecognitionSupported()) {
      alert("La reconnaissance vocale n'est pas disponible sur ce navigateur. Essaie sur Google Chrome ou Edge !");
      return;
    }

    if (shadowingRecording) {
      cleanupShadowRecording();
      return;
    }

    if (shadowUserAudioPlayerRef.current) {
      try { shadowUserAudioPlayerRef.current.pause(); } catch (e) {}
      setIsPlayingShadowUserAudio(false);
    }
    if (shadowingAudioUrl) {
      URL.revokeObjectURL(shadowingAudioUrl);
      setShadowingAudioUrl(null);
    }
    setShadowingEvaluation(null);
    setShadowingSpokenText('');
    shadowAudioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        shadowMediaStreamRef.current = stream;
        const mimeType = 'audio/webm';
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            shadowAudioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (shadowAudioChunksRef.current.length > 0) {
            const audioBlob = new Blob(shadowAudioChunksRef.current, { type: 'audio/webm' });
            if (audioBlob.size > 0) {
              const url = URL.createObjectURL(audioBlob);
              setShadowingAudioUrl(url);
            }
          }
        };

        shadowMediaRecorderRef.current = recorder;
        recorder.start(100);
      }
    } catch (err) {
      console.warn("Capture MediaRecorder :", err);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    setShadowingRecording(true);

    recognition.onresult = (event: any) => {
      let spoken = '';
      for (let i = 0; i < event.results.length; ++i) {
        spoken += event.results[i][0].transcript;
      }
      spoken = spoken.trim();
      setShadowingSpokenText(spoken);
      cleanupShadowRecording();

      const evalRes = evaluatePronunciation(spoken, targetSentence.hanzi);
      setShadowingEvaluation(evalRes);
    };

    recognition.onerror = () => cleanupShadowRecording();
    recognition.onend = () => cleanupShadowRecording();
    recognition.start();
  };

  const handleTogglePlayShadowUserAudio = () => {
    if (!shadowingAudioUrl) return;

    if (isPlayingShadowUserAudio) {
      if (shadowUserAudioPlayerRef.current) {
        shadowUserAudioPlayerRef.current.pause();
      }
      setIsPlayingShadowUserAudio(false);
      return;
    }

    const audio = new Audio(shadowingAudioUrl);
    shadowUserAudioPlayerRef.current = audio;
    setIsPlayingShadowUserAudio(true);

    audio.onended = () => setIsPlayingShadowUserAudio(false);
    audio.onerror = () => setIsPlayingShadowUserAudio(false);
    audio.play().catch(() => setIsPlayingShadowUserAudio(false));
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

  let sentenceCounter = 0;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-2.5 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center space-x-2">
          {onSwitchToShortStories && (
            <button
              onClick={onSwitchToShortStories}
              className="px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 cursor-pointer"
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

          {/* Jauge de progression */}
          <div className="shrink-0 bg-black/30 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 flex flex-col items-center justify-center min-w-[170px] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
              Progression du roman
            </span>
            <div className="text-3xl font-black font-serif text-white flex items-baseline space-x-1">
              <span>Page {currentPageNumber}</span>
              <span className="text-sm text-stone-300">/ 30</span>
            </div>
            
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

      {/* 3. TOOLBAR IMMERSIVE IDENTIQUE À STORYREADERVIEW (IMAGE 1) */}
      <div className="sticky top-16 z-30 bg-[#fdfcf9]/95 dark:bg-[#0e0d0c]/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm transition-colors space-y-3">
        
        {/* Ligne 1 : Contrôles d'affichage & Audio (Exactement comme Image 1) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Groupe Gauche : Pinyin, Traduction, Mode Rythme vs Mots */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Pinyin */}
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition-all text-xs cursor-pointer ${
                showPinyin
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-2xs'
                  : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
              }`}
              title="Afficher ou masquer la transcription en pinyin au-dessus des sinogrammes"
            >
              {showPinyin ? <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Pinyin</span>
            </button>

            {/* Toggle Traduction Française */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition-all text-xs cursor-pointer ${
                showTranslation
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 shadow-2xs'
                  : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
              }`}
              title="Afficher ou masquer la traduction française sous chaque phrase"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Traduction Française</span>
            </button>

            {/* Commutateur Mode Rythme (意群) vs Mots seuls */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700 text-xs font-bold">
              <button
                onClick={() => setReaderMode('rhythm')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all ${
                  readerMode === 'rhythm'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs font-black'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Découpage en groupes de sens (意群) avec pauses de souffle (/)"
              >
                <Music className="w-3 h-3 text-amber-400" />
                <span>Mode Rythme (意群)</span>
              </button>

              <button
                onClick={() => setReaderMode('words')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  readerMode === 'words'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Mots isolés classiques"
              >
                <span>Mots seuls</span>
              </button>
            </div>

            {/* Bouton Info Guide du Rythme */}
            <button
              onClick={() => setShowRhythmGuide(!showRhythmGuide)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Guide : Comment le rythme chinois élimine la récitation mécanique"
            >
              <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </button>
          </div>

          {/* Groupe Droite : Voix, Vitesse et Raconter la page */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {isPlayingAudio && activeSpeakerGender && (
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border animate-pulse ${
                activeSpeakerGender === 'female'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
              }`}>
                <span>{activeSpeakerGender === 'female' ? '👩 Voix Chinoise (Femme)' : '👨 Voix Chinoise (Homme)'}</span>
              </span>
            )}

            {/* Sélecteur de voix Homme / Femme / Alterné */}
            <VoiceSelector compact />

            {/* Sélecteur de vitesse */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700 text-[11px] font-bold">
              {[0.5, 0.75, 0.85, 1.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    playbackSpeed === speed
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-black'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                  title={`${speed}x`}
                >
                  {speed === 0.5 ? '🐢 0.5x' : `${speed}x`}
                </button>
              ))}
            </div>

            {/* Bouton Raconter la Page */}
            <button
              onClick={handleToggleAudio}
              className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 border-stone-900'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Arrêter la lecture</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Raconter la Page {currentPageNumber}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Ligne 2 : Bandeau Défilement des 30 pages + Bouton Sommaire */}
        <div className="pt-2 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsTocOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
            title="Ouvrir la table des matières (6 chapitres / 30 pages)"
          >
            <ListOrdered className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sommaire (Ch. {currentPage.chapterNumber}/6)</span>
          </button>

          <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 scrollbar-thin">
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

        {/* GUIDE PÉDAGOGIQUE DU RYTHME VOCAL (Collapsible) */}
        {showRhythmGuide && (
          <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-stone-800 dark:text-stone-200 space-y-2 animate-fadeIn shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h4 className="font-bold text-stone-900 dark:text-stone-100 font-serif">
                  Le Secret du Rythme Chinois : Ne plus Répéter Machinalement
                </h4>
              </div>
              <button 
                onClick={() => setShowRhythmGuide(false)} 
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-[11px] font-bold"
              >
                ✕ Fermer
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-amber-200 dark:border-amber-800">
                <strong className="block text-amber-950 dark:text-amber-300 font-bold mb-0.5">1. 意群 (Groupes de sens) :</strong>
                Ne lis jamais mot à mot. Les caractères d'une même capsule forment un seul souffle ininterrompu.
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-amber-200 dark:border-amber-800">
                <strong className="block text-amber-950 dark:text-amber-300 font-bold mb-0.5">2. 停顿 (Barres de souffle / ) :</strong>
                Respire uniquement aux séparateurs (/ pour micro-pause, // pour virgule). Entre deux barres, garde le même élan.
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-amber-200 dark:border-amber-800">
                <strong className="block text-amber-950 dark:text-amber-300 font-bold mb-0.5">3. 重音 (Accent d'insistance) :</strong>
                Les capsules dorées portent l'accent logique. Prononce-les avec plus de corps sans crier.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. CONTENU PRINCIPAL DE LA PAGE (Paragraphes riches avec affichage identique à Image 1) */}
      <div className="bg-white dark:bg-stone-900/90 rounded-3xl p-6 sm:p-10 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        
        {/* Titre & Repère de Page */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              Chapitre {currentPage.chapterNumber} • Page {currentPage.pageNumber} / {activeNovel.totalPages}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100 mt-0.5">
              {currentPage.chapterTitle}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 italic">
              « {currentPage.chapterTitleTranslation} »
            </p>
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
            <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 px-1">
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

        {/* Phrases de la page sous forme de cartes structurées (EXACTEMENT COMME IMAGE 1) */}
        <div className="space-y-6 text-stone-800 dark:text-stone-200">
          {currentPage.paragraphs.map((para, pIdx) => (
            <div key={pIdx} className="space-y-5">
              {para.sentences.map((sentence) => {
                const globalIdx = sentenceCounter++;
                const isCurrentAudioPlaying = isPlayingAudio && playingSentenceIndex === globalIdx;
                const isCurrentSinglePlaying = playingSingleSentenceIdx === globalIdx;
                const isCurrentRhythmPlaying = playingRhythmSentenceIdx === globalIdx;
                const isHighlighted = isCurrentAudioPlaying || isCurrentSinglePlaying || isCurrentRhythmPlaying;
                const isShadowingActive = shadowingGlobalIdx === globalIdx;

                const analysis = analyzeSentenceRhythm(sentence);

                return (
                  <div
                    key={globalIdx}
                    className={`p-5 rounded-3xl transition-all border-2 shadow-xs ${
                      isHighlighted
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/30'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    {/* Header de la Phrase : Badge "Phrase X" + 3 Boutons d'action (Écouter / Cadence / Répéter) */}
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100 dark:border-stone-800/80">
                      <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold font-mono text-xs text-stone-600 dark:text-stone-300">
                        Phrase {globalIdx + 1}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        {/* 1. Écouter la phrase */}
                        <button
                          onClick={() => handlePlaySingleSentence(sentence, globalIdx)}
                          className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all text-xs cursor-pointer ${
                            isCurrentSinglePlaying
                              ? 'bg-stone-900 text-white shadow-2xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
                          }`}
                          title="Écouter cette phrase avec son intonation naturelle"
                        >
                          {isCurrentSinglePlaying ? (
                            <VolumeX className="w-3 h-3 text-rose-300" />
                          ) : (
                            <Play className="w-3 h-3 fill-current text-stone-700 dark:text-stone-300" />
                          )}
                          <span className="text-[11px]">Écouter</span>
                        </button>

                        {/* 2. Décomposer le rythme avec pauses de souffle */}
                        <button
                          onClick={() => handlePlaySentenceRhythmCadence(sentence, globalIdx)}
                          className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all text-xs cursor-pointer ${
                            isCurrentRhythmPlaying
                              ? 'bg-amber-600 text-white shadow-2xs animate-pulse'
                              : 'bg-amber-100/70 hover:bg-amber-200 text-amber-900 border border-amber-300/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                          }`}
                          title="Décomposer le rythme : écoute avec micro-pauses entre chaque groupe de sens (意群)"
                        >
                          <Music className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                          <span className="text-[11px]">Cadence & Pauses</span>
                        </button>

                        {/* 3. Répéter / Shadowing */}
                        <button
                          onClick={() => {
                            if (isShadowingActive) {
                              setShadowingGlobalIdx(null);
                              setShadowingSentence(null);
                              cleanupShadowRecording();
                            } else {
                              setShadowingGlobalIdx(globalIdx);
                              setShadowingSentence(sentence);
                              setShadowingEvaluation(null);
                              setShadowingSpokenText('');
                            }
                          }}
                          className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all text-xs cursor-pointer ${
                            isShadowingActive
                              ? 'bg-[#c23b22] text-white shadow-2xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
                          }`}
                          title="Répéter cette phrase et calibrer ton rythme avec l'IA"
                        >
                          <Mic className="w-3 h-3 text-[#c23b22]" />
                          <span className="text-[11px]">{isShadowingActive ? 'Fermer studio' : 'Répéter'}</span>
                        </button>
                      </div>
                    </div>

                    {/* CORPS DE LA PHRASE : MODE RYTHME (意群) OU MOTS ISOLÉS (EXACTEMENT COMME IMAGE 1) */}
                    {readerMode === 'rhythm' ? (
                      /* CAPSULES DE SOUFFLE PROSODIQUES */
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-3.5 py-1.5">
                        {analysis.chunks.map((chunk, cIdx) => {
                          const isChunkActive = isCurrentRhythmPlaying && activeRhythmChunkIdx === cIdx;

                          return (
                            <React.Fragment key={chunk.id || cIdx}>
                              <div
                                className={`inline-flex flex-wrap items-end rounded-2xl p-1.5 px-3 transition-all border ${
                                  isChunkActive
                                    ? 'bg-amber-400 text-stone-950 border-stone-900 shadow-md scale-105 ring-2 ring-amber-300'
                                    : chunk.stressLevel === 'prominent'
                                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 shadow-2xs'
                                    : chunk.stressLevel === 'light'
                                    ? 'bg-stone-50/50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                                }`}
                                title={chunk.stressLevel === 'prominent' ? "Groupe avec emphase ou intensité prosodique" : undefined}
                              >
                                <div className="flex items-end gap-x-1.5">
                                  {chunk.words.map((word, wIdx) => {
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
                                        className={`group inline-flex flex-col items-center cursor-pointer rounded-lg px-1 py-0.5 transition-all select-none ${
                                          isSelected
                                            ? 'bg-amber-300 text-stone-950 font-bold ring-2 ring-stone-900'
                                            : inAnki
                                            ? 'hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                            : 'hover:bg-stone-200/80 dark:hover:bg-stone-800'
                                        }`}
                                      >
                                        {showPinyin && (
                                          <span data-pinyin className="text-[11px] sm:text-xs font-mono tracking-wide pinyin-text text-stone-600 dark:text-amber-300 font-bold">
                                            {word.pinyin}
                                          </span>
                                        )}
                                        <span className={`text-xl sm:text-2xl font-serif font-black chinese-text tracking-wide relative text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] dark:group-hover:text-amber-400 ${
                                          inAnki ? 'border-b-2 border-[#c23b22]' : ''
                                        }`}>
                                          {word.hanzi}
                                          {inAnki && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-stone-900" title="Déjà dans Anki" />
                                          )}
                                        </span>
                                      </span>
                                    );
                                  })}
                                </div>

                                {chunk.sandhiHint && (
                                  <span 
                                    className="ml-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-bold cursor-help"
                                    title={chunk.sandhiHint}
                                  >
                                    ⚡ ton
                                  </span>
                                )}
                              </div>

                              {/* SÉPARATEURS PROSODIQUES (// ou /) */}
                              {cIdx < analysis.chunks.length - 1 && (
                                <span className="inline-flex items-center select-none" title={
                                  chunk.pauseType === 'comma' 
                                    ? 'Pause de virgule (pause respiratoire moyenne)' 
                                    : 'Micro-souffle respiratoire (/)'
                                }>
                                  {chunk.pauseType === 'comma' ? (
                                    <span className="text-stone-400 font-mono font-black text-sm px-1.5">//</span>
                                  ) : (
                                    <span className="text-amber-500 font-mono font-black text-xs px-1.5">/</span>
                                  )}
                                </span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    ) : (
                      /* MODE CLASSIQUE MOT PAR MOT */
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
                              className={`group inline-flex flex-col items-center cursor-pointer rounded-lg px-1.5 py-0.5 transition-all select-none ${
                                isSelected
                                  ? 'bg-amber-300 text-stone-950 font-bold ring-2 ring-stone-900'
                                  : inAnki
                                  ? 'border-b-2 border-[#c23b22]'
                                  : 'hover:bg-stone-200/80 dark:hover:bg-stone-800'
                              }`}
                            >
                              {showPinyin && (
                                <span data-pinyin className="text-[11px] sm:text-xs font-mono tracking-wide pinyin-text text-stone-600 dark:text-amber-300 font-bold">
                                  {word.pinyin}
                                </span>
                              )}
                              <span className="text-xl sm:text-2xl font-serif font-black chinese-text tracking-wide text-stone-900 dark:text-stone-100 group-hover:text-[#c23b22] dark:group-hover:text-amber-400 relative">
                                {word.hanzi}
                                {inAnki && (
                                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                                )}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* TRADUCTION FRANÇAISE */}
                    {showTranslation && sentence.translation && (
                      <p className="text-xs sm:text-sm font-sans text-stone-500 dark:text-stone-400 italic pl-2 border-l-2 border-amber-300 dark:border-amber-600 mt-2">
                        {sentence.translation}
                      </p>
                    )}

                    {/* POP-UP DICTIONNAIRE & ANKI */}
                    {selectedWord && selectedWordSentenceIdx === globalIdx && (
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
                    )}

                    {/* STUDIO INTERACTIF DE SHADOWING */}
                    {isShadowingActive && (
                      <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 text-white space-y-4 animate-fadeIn border-2 border-stone-800 shadow-lg font-sans">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                            <h4 className="font-serif font-black text-sm text-amber-300">
                              Studio de Shadowing : Phrase {globalIdx + 1}
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              setShadowingGlobalIdx(null);
                              setShadowingSentence(null);
                              cleanupShadowRecording();
                            }}
                            className="text-xs font-bold text-stone-400 hover:text-white"
                          >
                            ✕ Fermer
                          </button>
                        </div>

                        <div className="space-y-1.5 text-center">
                          <p data-pinyin className="text-xs text-stone-400 dark:text-amber-200 font-mono pinyin-text">
                            {sentence.pinyin}
                          </p>
                          <p className="text-xl sm:text-2xl font-black font-serif text-white chinese-text">
                            {sentence.hanzi}
                          </p>
                          <p className="text-xs text-stone-400 italic">
                            « {sentence.translation} »
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                          <button
                            onClick={() => handlePlaySentenceRhythmCadence(sentence, globalIdx)}
                            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold border border-stone-700 flex items-center space-x-1.5 transition-all"
                          >
                            <Music className="w-3.5 h-3.5 text-amber-400" />
                            <span>1. Réécouter la cadence</span>
                          </button>

                          <button
                            onClick={() => handleToggleShadowRecording(sentence)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md ${
                              shadowingRecording
                                ? 'bg-rose-600 text-white animate-pulse'
                                : 'bg-gradient-to-r from-[#c23b22] to-amber-600 hover:from-[#a8331e] hover:to-amber-700 text-white'
                            }`}
                          >
                            {shadowingRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
                            <span>{shadowingRecording ? 'Terminer & Analyser' : '2. Enregistrer ma voix'}</span>
                          </button>

                          {shadowingAudioUrl && (
                            <button
                              onClick={handleTogglePlayShadowUserAudio}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all ${
                                isPlayingShadowUserAudio
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                              }`}
                            >
                              {isPlayingShadowUserAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              <span>3. Écouter mon enregistrement</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleSaveWordToAnki({
                              hanzi: sentence.hanzi,
                              pinyin: sentence.pinyin,
                              translation: sentence.translation
                            })}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                              isWordInUserAnki(sentence.hanzi)
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                            }`}
                            title="Ajouter cette phrase d'histoire directement à Anki"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ajouter la phrase à Anki</span>
                          </button>
                        </div>

                        {shadowingEvaluation && (
                          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300">Résultat de la répétition :</span>
                              <span className={`px-2 py-0.5 rounded-md font-mono font-bold ${
                                shadowingEvaluation.accuracyScore >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}>
                                Score : {shadowingEvaluation.accuracyScore}%
                              </span>
                            </div>
                            {shadowingSpokenText && (
                              <p className="text-stone-400 font-mono text-[11px]">
                                Capté : « {shadowingSpokenText} »
                              </p>
                            )}
                            <p className="text-stone-300 leading-snug">
                              {shadowingEvaluation.feedbackMessage}
                            </p>
                          </div>
                        )}
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
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <span>Page suivante (Page {currentPageNumber + 1})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleMarkNovelCompleted}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer ${
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

      {/* MODALE SOMMAIRE DU ROMAN */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-stone-300 dark:border-stone-700 shadow-2xl">
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

      {/* MODALE BIBLIOTHÈQUE DES ROMANS */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-stone-300 dark:border-stone-700 shadow-2xl">
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

            <div className="p-5 overflow-y-auto space-y-4">
              {novels.map((novel) => {
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
