import React, { useState, useEffect, useRef } from 'react';
import { MaayotStory, StoryWordToken, AnkiWord, StorySentence, StoryRhythmChunk } from '../types/fluent';
import { BUILT_IN_STORIES, generateStoryFromAnkiWords } from '../data/storiesData';
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
import { VoiceSelector } from './VoiceSelector';
import { WordDefinitionBanner } from './WordDefinitionBanner';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Languages, 
  Mic, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  Clock, 
  Flame, 
  Layers, 
  Wand2, 
  ExternalLink,
  ChevronRight,
  Smartphone,
  BookmarkCheck,
  Send,
  Play,
  Pause,
  Music,
  Info,
  Square,
  Award
} from 'lucide-react';

interface StoryReaderViewProps {
  syncedAnkiWords: AnkiWord[];
  onOpenAnkiModal: () => void;
  onIncrementStreak?: () => void;
  onOpenAppleSyncModal?: () => void;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({
  syncedAnkiWords,
  onOpenAnkiModal,
  onIncrementStreak,
  onOpenAppleSyncModal,
}) => {
  const [stories, setStories] = useState<MaayotStory[]>(BUILT_IN_STORIES);
  const [selectedStoryId, setSelectedStoryId] = useState<string>(BUILT_IN_STORIES[0].id);

  // Préférences du lecteur immersif
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeSpeakerGender, setActiveSpeakerGender] = useState<'female' | 'male' | null>(null);

  // Nouveau : Mode Rythme & Flux Prosodique (意群)
  const [readerMode, setReaderMode] = useState<'rhythm' | 'words'>('rhythm');
  const [showRhythmGuide, setShowRhythmGuide] = useState<boolean>(false);

  // Suivi temps réel audio
  const [playingSentenceIndex, setPlayingSentenceIndex] = useState<number | null>(null);
  const [playingSingleSentenceIdx, setPlayingSingleSentenceIdx] = useState<number | null>(null);
  const [playingRhythmSentenceIdx, setPlayingRhythmSentenceIdx] = useState<number | null>(null);
  const [activeRhythmChunkIdx, setActiveRhythmChunkIdx] = useState<number | null>(null);

  // État du Shadowing / Entraînement de phrase individuelle
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

  // Mot actif sélectionné pour la pop-up de dictionnaire et index de phrase associé
  const [selectedWord, setSelectedWord] = useState<StoryWordToken | null>(null);
  const [selectedWordSentenceIdx, setSelectedWordSentenceIdx] = useState<number | null>(null);

  // État du Quiz
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizExplanations, setShowQuizExplanations] = useState<boolean>(false);
  const [showQuizTranslations, setShowQuizTranslations] = useState<boolean>(false);

  // État du Défi Oral / Écrit
  const [writtenResponse, setWrittenResponse] = useState<string>('');
  const [showPromptTranslation, setShowPromptTranslation] = useState<boolean>(false);
  const [ankiToast, setAnkiToast] = useState<string | null>(null);
  const [, setLocalAnkiVersion] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<any | null>(null);

  // Audio capture et réécoute pour le défi oral de l'histoire
  const storyMediaStreamRef = useRef<MediaStream | null>(null);
  const storyMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const storyAudioChunksRef = useRef<Blob[]>([]);
  const storyUserAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [storyRecordedAudioUrl, setStoryRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingStoryUserAudio, setIsPlayingStoryUserAudio] = useState<boolean>(false);

  // Histoires terminées (sauvegardées en local)
  const [completedStoryIds, setCompletedStoryIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('fluent_completed_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const activeStory = stories.find(s => s.id === selectedStoryId) || stories[0];

  const cleanupStoryRecording = () => {
    if (storyMediaRecorderRef.current) {
      try {
        if (storyMediaRecorderRef.current.state === 'recording') {
          storyMediaRecorderRef.current.stop();
        }
      } catch (e) {}
      storyMediaRecorderRef.current = null;
    }
    if (storyMediaStreamRef.current) {
      try {
        storyMediaStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (e) {}
      storyMediaStreamRef.current = null;
    }
    setIsRecording(false);
  };

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

  useEffect(() => {
    // Réinitialiser les états lors du changement d'histoire
    setSelectedAnswers({});
    setShowQuizExplanations(false);
    setShowQuizTranslations(false);
    setShowPromptTranslation(false);
    setSelectedWord(null);
    setWrittenResponse('');
    setSpeechEvaluation(null);
    stopChineseAudio();
    stopSentenceRhythmAudio();
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);

    setPlayingSentenceIndex(null);
    setPlayingSingleSentenceIdx(null);
    setPlayingRhythmSentenceIdx(null);
    setActiveRhythmChunkIdx(null);
    setShadowingGlobalIdx(null);
    setShadowingSentence(null);
    setShadowingEvaluation(null);
    setShadowingSpokenText('');

    cleanupStoryRecording();
    cleanupShadowRecording();

    if (storyUserAudioPlayerRef.current) {
      try {
        storyUserAudioPlayerRef.current.pause();
      } catch (e) {}
      setIsPlayingStoryUserAudio(false);
    }
    if (storyRecordedAudioUrl) {
      URL.revokeObjectURL(storyRecordedAudioUrl);
      setStoryRecordedAudioUrl(null);
    }

    if (shadowUserAudioPlayerRef.current) {
      try {
        shadowUserAudioPlayerRef.current.pause();
      } catch (e) {}
      setIsPlayingShadowUserAudio(false);
    }
    if (shadowingAudioUrl) {
      URL.revokeObjectURL(shadowingAudioUrl);
      setShadowingAudioUrl(null);
    }
  }, [selectedStoryId]);

  // Nettoyage au démontage du composant
  useEffect(() => {
    return () => {
      cleanupStoryRecording();
      cleanupShadowRecording();
      stopChineseAudio();
      stopSentenceRhythmAudio();
      if (storyRecordedAudioUrl) {
        URL.revokeObjectURL(storyRecordedAudioUrl);
      }
      if (shadowingAudioUrl) {
        URL.revokeObjectURL(shadowingAudioUrl);
      }
      if (storyUserAudioPlayerRef.current) {
        try {
          storyUserAudioPlayerRef.current.pause();
        } catch (e) {}
      }
      if (shadowUserAudioPlayerRef.current) {
        try {
          shadowUserAudioPlayerRef.current.pause();
        } catch (e) {}
      }
    };
  }, [storyRecordedAudioUrl, shadowingAudioUrl]);

  // Lecture audio complète avec alternance intelligente des voix Homme / Femme
  const handlePlayFullAudio = async () => {
    if (isPlayingAudio) {
      stopChineseAudio();
      stopSentenceRhythmAudio();
      setIsPlayingAudio(false);
      setActiveSpeakerGender(null);
      setPlayingSentenceIndex(null);
      return;
    }

    stopSentenceRhythmAudio();
    setIsPlayingAudio(true);
    await playChineseStoryAudio(
      activeStory.audioText, 
      playbackSpeed, 
      (idx, _text, gender) => {
        setActiveSpeakerGender(gender);
        setPlayingSentenceIndex(idx);
      }
    );
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
    setPlayingSentenceIndex(null);
  };

  // Lecture isolée d'une phrase
  const handlePlaySingleSentence = async (sentence: StorySentence, globalIdx: number) => {
    if (playingSingleSentenceIdx === globalIdx) {
      stopChineseAudio();
      stopSentenceRhythmAudio();
      setPlayingSingleSentenceIdx(null);
      return;
    }

    stopChineseAudio();
    stopSentenceRhythmAudio();
    setPlayingSingleSentenceIdx(globalIdx);
    setPlayingRhythmSentenceIdx(null);
    await playChineseAudio(sentence.hanzi, playbackSpeed);
    setPlayingSingleSentenceIdx(null);
  };

  // Lecture de la cadence rythmée avec pauses de souffle
  const handlePlaySentenceRhythmCadence = async (sentence: StorySentence, globalIdx: number) => {
    if (playingRhythmSentenceIdx === globalIdx) {
      stopSentenceRhythmAudio();
      setPlayingRhythmSentenceIdx(null);
      setActiveRhythmChunkIdx(null);
      return;
    }

    stopChineseAudio();
    stopSentenceRhythmAudio();
    setPlayingRhythmSentenceIdx(globalIdx);
    setPlayingSingleSentenceIdx(null);

    const analysis = analyzeSentenceRhythm(sentence);
    await playSentenceWithProsodicPauses(
      analysis.chunks,
      playbackSpeed,
      'female',
      (chunkIdx) => {
        setActiveRhythmChunkIdx(chunkIdx);
      }
    );
    setPlayingRhythmSentenceIdx(null);
    setActiveRhythmChunkIdx(null);
  };

  // Prononcer un mot précis au clic (avec audio studio dictionnaire haute définition)
  const handlePronounceWord = (wordHanzi: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playNativeWordAudio(wordHanzi, 0.85);
  };

  // Valider une réponse au Quiz
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  // Marquer l'histoire comme lue
  const handleMarkAsCompleted = () => {
    if (!completedStoryIds.includes(activeStory.id)) {
      const updated = [...completedStoryIds, activeStory.id];
      setCompletedStoryIds(updated);
      localStorage.setItem('fluent_completed_stories', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('fluent_completed_stories_changed', { detail: { completedStoryIds: updated } }));
      triggerAutoSyncToCloud();
      if (onIncrementStreak) onIncrementStreak();
    }
  };

  // Générer une histoire personnalisée à partir des cartes Anki de l'utilisateur
  const handleGenerateAnkiStory = () => {
    if (syncedAnkiWords.length === 0) {
      onOpenAnkiModal();
      return;
    }

    // Mélanger aléatoirement 4 cartes Anki
    const shuffled = [...syncedAnkiWords].sort(() => 0.5 - Math.random());
    const newStory = generateStoryFromAnkiWords(shuffled);

    setStories(prev => [newStory, ...prev]);
    setSelectedStoryId(newStory.id);
  };

  // Helper pour trouver un mimeType audio supporté par le navigateur
  const getSupportedStoryMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac'];
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return '';
  };

  // Enregistrement micro pour le défi d'expression (SpeechRecognition + MediaRecorder)
  const handleToggleVoiceRecording = async () => {
    if (!isSpeechRecognitionSupported()) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Essaie sur Google Chrome ou Edge !");
      return;
    }

    if (isRecording) {
      cleanupStoryRecording();
      return;
    }

    // Réinitialiser la lecture en cours et l'ancien blob audio
    if (storyUserAudioPlayerRef.current) {
      storyUserAudioPlayerRef.current.pause();
      setIsPlayingStoryUserAudio(false);
    }
    if (storyRecordedAudioUrl) {
      URL.revokeObjectURL(storyRecordedAudioUrl);
      setStoryRecordedAudioUrl(null);
    }

    storyAudioChunksRef.current = [];

    // 1. Démarrer MediaRecorder pour la réécoute vocale
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        storyMediaStreamRef.current = stream;

        const mimeType = getSupportedStoryMimeType();
        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            storyAudioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (storyAudioChunksRef.current.length > 0) {
            const blobType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(storyAudioChunksRef.current, { type: blobType });
            if (audioBlob.size > 0) {
              const url = URL.createObjectURL(audioBlob);
              setStoryRecordedAudioUrl(url);
            }
          }
        };

        storyMediaRecorderRef.current = recorder;
        recorder.start(100);
      }
    } catch (err) {
      console.warn("Capture MediaRecorder non disponible dans StoryReaderView:", err);
    }

    // 2. Démarrer SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setWrittenResponse(spokenText);
      cleanupStoryRecording();

      // Évaluer si la phrase contient l'un des mots suggérés
      const targetList = activeStory.discussionPrompt.suggestedWords || [];
      const evaluation = evaluatePronunciation(spokenText, spokenText);
      setSpeechEvaluation({
        ...evaluation,
        usedSuggestedWords: targetList.filter(w => spokenText.includes(w.replace(/\s*\(.*\)/, ''))),
      });
    };

    recognition.onerror = () => {
      cleanupStoryRecording();
    };

    recognition.onend = () => {
      cleanupStoryRecording();
    };

    recognition.start();
  };

  // Jouer ou mettre en pause l'audio enregistré de l'utilisateur
  const handleTogglePlayStoryUserAudio = () => {
    if (!storyRecordedAudioUrl) return;

    if (isPlayingStoryUserAudio) {
      if (storyUserAudioPlayerRef.current) {
        storyUserAudioPlayerRef.current.pause();
        storyUserAudioPlayerRef.current.currentTime = 0;
      }
      setIsPlayingStoryUserAudio(false);
      return;
    }

    const audio = new Audio(storyRecordedAudioUrl);
    storyUserAudioPlayerRef.current = audio;
    setIsPlayingStoryUserAudio(true);

    audio.onended = () => setIsPlayingStoryUserAudio(false);
    audio.onerror = () => setIsPlayingStoryUserAudio(false);
    audio.play().catch(() => setIsPlayingStoryUserAudio(false));
  };

  // Enregistrement micro et évaluation IA d'une phrase isolée (Shadowing)
  const handleToggleShadowRecording = async (targetSentence: StorySentence) => {
    if (!isSpeechRecognitionSupported()) {
      alert("La reconnaissance vocale n'est pas disponible sur ce navigateur. Essaie sur Google Chrome ou Edge !");
      return;
    }

    if (shadowingRecording) {
      cleanupShadowRecording();
      return;
    }

    // Réinitialisation
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

    // 1. Capture MediaRecorder pour réécoute de l'utilisateur
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        shadowMediaStreamRef.current = stream;
        const mimeType = getSupportedStoryMimeType();
        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            shadowAudioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (shadowAudioChunksRef.current.length > 0) {
            const blobType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(shadowAudioChunksRef.current, { type: blobType });
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
      console.warn("Capture MediaRecorder non disponible pour le shadowing :", err);
    }

    // 2. Détection SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    setShadowingRecording(true);

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setShadowingSpokenText(spoken);
      cleanupShadowRecording();

      const evalRes = evaluatePronunciation(spoken, targetSentence.hanzi);
      setShadowingEvaluation(evalRes);
    };

    recognition.onerror = () => cleanupShadowRecording();
    recognition.onend = () => cleanupShadowRecording();
    recognition.start();
  };

  // Jouer ou mettre en pause l'audio de la phrase enregistrée par l'utilisateur
  const handleTogglePlayShadowUserAudio = () => {
    if (!shadowingAudioUrl) return;

    if (isPlayingShadowUserAudio) {
      if (shadowUserAudioPlayerRef.current) {
        shadowUserAudioPlayerRef.current.pause();
        shadowUserAudioPlayerRef.current.currentTime = 0;
      }
      setIsPlayingShadowUserAudio(false);
      return;
    }

    stopChineseAudio();
    stopSentenceRhythmAudio();
    const audio = new Audio(shadowingAudioUrl);
    shadowUserAudioPlayerRef.current = audio;
    setIsPlayingShadowUserAudio(true);

    audio.onended = () => setIsPlayingShadowUserAudio(false);
    audio.onerror = () => setIsPlayingShadowUserAudio(false);
    audio.play().catch(() => setIsPlayingShadowUserAudio(false));
  };

  useEffect(() => {
    const handleAnkiChange = () => {
      setLocalAnkiVersion(v => v + 1);
    };
    window.addEventListener('fluent_anki_words_changed', handleAnkiChange);
    return () => window.removeEventListener('fluent_anki_words_changed', handleAnkiChange);
  }, []);

  useEffect(() => {
    const handleStoriesChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ completedStoryIds?: string[] }>;
      if (customEvent.detail && Array.isArray(customEvent.detail.completedStoryIds)) {
        setCompletedStoryIds(customEvent.detail.completedStoryIds);
      } else {
        const saved = localStorage.getItem('fluent_completed_stories');
        if (saved) {
          try {
            setCompletedStoryIds(JSON.parse(saved));
          } catch {}
        }
      }
    };
    window.addEventListener('fluent_completed_stories_changed', handleStoriesChange);
    return () => window.removeEventListener('fluent_completed_stories_changed', handleStoriesChange);
  }, []);

  // Vérifier si un mot dans le dictionnaire fait partie des cartes Anki de l'utilisateur
  const isWordInUserAnki = (hanzi: string) => {
    if (!hanzi) return false;
    return syncedAnkiWords.some(w => w.hanzi.includes(hanzi) || hanzi.includes(w.hanzi)) || isWordInLocalAnki(hanzi);
  };

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
      : `✓ "${word.hanzi}" mis à jour dans ton Anki "Fluent" !`);
    setTimeout(() => setAnkiToast(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification Anki */}
      {ankiToast && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{ankiToast}</span>
        </div>
      )}
      
      {/* 1. SÉLECTEUR D'HISTOIRES & CARROUSEL HAUT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border-2 border-stone-900 rounded-3xl shadow-[4px_4px_0px_#1c1917]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Lectures Immersives
            </span>
            <span className="text-xs font-bold text-stone-500">
              {completedStoryIds.length} histoires lues
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            Histoires Quotidiennes & Ancrage
          </h2>
          <p className="text-xs text-stone-600">
            Une histoire par jour pour contextualiser tes mots Anki, avec lecture audio native, dictionnaire au clic et quiz.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {onOpenAppleSyncModal && (
            <button
              onClick={onOpenAppleSyncModal}
              className="px-3.5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs shadow-xs border-2 border-stone-900 transition-all flex items-center justify-center space-x-2 shrink-0 hover:-translate-y-0.5"
              title="Exporter les histoires vers le Calendrier / Widget Apple"
            >
              <Smartphone className="w-4 h-4 text-amber-500" />
              <span>Widget iPhone</span>
            </button>
          )}

          {/* Bouton Générer avec mes mots Anki */}
          <button
            onClick={handleGenerateAnkiStory}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-md border-2 border-stone-900 transition-all flex items-center justify-center space-x-2 shrink-0 hover:-translate-y-0.5"
          >
            <Wand2 className="w-4 h-4" />
            <span>Créer une Histoire avec mes Mots Anki</span>
          </button>
        </div>
      </div>

      {/* Onglets de sélection des histoires */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {stories.map(story => {
          const isSelected = story.id === selectedStoryId;
          const isCompleted = completedStoryIds.includes(story.id);

          return (
            <button
              key={story.id}
              onClick={() => setSelectedStoryId(story.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center space-x-2 ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              {isCompleted ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="font-serif font-black">{story.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200/50 text-stone-700 font-mono">
                {story.level}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. LE LECTEUR IMMERSIF */}
      <div className="bg-[#fcfaf7] border-2 border-stone-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#1c1917] space-y-6 relative">
        
        {/* En-tête de l'histoire */}
        <div className="border-b-2 border-stone-200 pb-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-[#c23b22] border border-rose-300">
                {activeStory.level}
              </span>
              <span className="text-xs font-bold text-stone-500">
                • {activeStory.category} • ~{activeStory.readTime} ({activeStory.wordCount} caractères)
              </span>
            </div>

            {completedStoryIds.includes(activeStory.id) && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Histoire lue & validée</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
            {activeStory.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-mono">
            {activeStory.titlePinyin}
          </p>
          <p className="text-xs sm:text-sm text-stone-700 italic">
            « {activeStory.titleTranslation} »
          </p>
        </div>

        {/* 3. BARRE D'OUTILS DE LECTURE (PINYIN, TRADUCTION, RYTHME & FLUX, AUDIO, VITESSE) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-stone-200 rounded-2xl">
          
          {/* Toggles Pinyin, Traduction & Mode Rythme */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all ${
                showPinyin
                  ? 'bg-amber-100/80 border-amber-300 text-amber-950 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {showPinyin ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
              <span>Pinyin</span>
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all ${
                showTranslation
                  ? 'bg-blue-100/80 border-blue-300 text-blue-950 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-blue-700" />
              <span>Traduction Française</span>
            </button>

            {/* Sélecteur Mode Rythme & Flux Prosodique (意群) */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                onClick={() => setReaderMode('rhythm')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                  readerMode === 'rhythm'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Découpage en blocs de souffle (意群) avec pauses marquées pour ne plus répéter machinalement"
              >
                <Music className="w-3 h-3 text-amber-400" />
                <span>Mode Rythme (意群)</span>
              </button>

              <button
                onClick={() => setReaderMode('words')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  readerMode === 'words'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Mots isolés"
              >
                <span>Mots seuls</span>
              </button>
            </div>

            <button
              onClick={() => setShowRhythmGuide(!showRhythmGuide)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Guide : Comment le rythme chinois élimine la récitation mécanique"
            >
              <Info className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>

          {/* Contrôles Audio : Voix, Vitesse et Lecture globale */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Indicateur de locuteur actif en alternance */}
            {isPlayingAudio && activeSpeakerGender && (
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border animate-pulse ${
                activeSpeakerGender === 'female'
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-blue-50 text-blue-800 border-blue-300'
              }`}>
                <span>{activeSpeakerGender === 'female' ? '👩 Voix Chinoise (Femme)' : '👨 Voix Chinoise (Homme)'}</span>
              </span>
            )}

            {/* Sélecteur de voix Homme / Femme / Alterné */}
            <VoiceSelector compact />

            {/* Sélecteur de vitesse */}
            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200 text-[11px] font-bold">
              {[0.5, 0.75, 0.85, 1.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    playbackSpeed === speed
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title={speed === 0.5 ? 'Ultra-lent (0.5x)' : speed === 0.85 ? 'Vitesse de base ralentie' : `${speed}x`}
                >
                  {speed === 0.5 ? '🐢 0.5x' : `${speed}x`}
                </button>
              ))}
            </div>

            {/* Bouton de lecture audio intégrale de l'histoire */}
            <button
              onClick={handlePlayFullAudio}
              className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 border transition-all ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Arrêter l'histoire</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Raconter l'Histoire</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* GUIDE PÉDAGOGIQUE DU RYTHME VOCAL */}
        {showRhythmGuide && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-stone-800 space-y-2 animate-fadeIn shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-stone-900 font-serif">
                  Le Secret du Rythme Chinois : Ne plus Répéter Machinalement
                </h4>
              </div>
              <button 
                onClick={() => setShowRhythmGuide(false)} 
                className="text-stone-400 hover:text-stone-700 text-[11px] font-bold"
              >
                ✕ Fermer
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200">
                <strong className="block text-amber-950 font-bold mb-0.5">1. 意群 (Groupes de sens) :</strong>
                Ne lis jamais mot à mot. Les caractères d'une même capsule forment un seul souffle ininterrompu.
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200">
                <strong className="block text-amber-950 font-bold mb-0.5">2. 停顿 (Barres de souffle / ) :</strong>
                Respire uniquement aux séparateurs ( / pour micro-pause, // pour virgule). Entre deux barres, garde le même élan.
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200">
                <strong className="block text-amber-950 font-bold mb-0.5">3. 轻重音 (Accent tonique) :</strong>
                Fais glisser rapidement les particules légères (的, 了, 着) pour faire ressortir les verbes et adjectifs majeurs.
              </div>
            </div>
          </div>
        )}

        {/* 4. TEXTE DE L'HISTOIRE AVEC DÉCOUPAGE PROSODIQUE & SUIVI AUDIO EN DIRECT */}
        <div className="space-y-6 text-stone-900 leading-relaxed font-serif text-lg sm:text-xl py-2">
          {activeStory.paragraphs.map((paragraph, pIdx) => {
            return (
              <div key={pIdx} className="space-y-4">
                {paragraph.sentences.map((sentence, sIdx) => {
                  // Calcul de l'index global de phrase dans l'histoire
                  let globalIdx = 0;
                  for (let p = 0; p < pIdx; p++) {
                    globalIdx += activeStory.paragraphs[p].sentences.length;
                  }
                  globalIdx += sIdx;

                  const isCurrentAudioSentence = playingSentenceIndex === globalIdx;
                  const isCurrentSinglePlaying = playingSingleSentenceIdx === globalIdx;
                  const isCurrentRhythmPlaying = playingRhythmSentenceIdx === globalIdx;
                  const isShadowingActive = shadowingGlobalIdx === globalIdx;
                  const analysis = analyzeSentenceRhythm(sentence);

                  return (
                    <div 
                      key={sIdx} 
                      className={`space-y-3 p-4 sm:p-5 rounded-3xl transition-all border ${
                        isCurrentAudioSentence || isCurrentSinglePlaying || isCurrentRhythmPlaying
                          ? 'bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-amber-300'
                          : isShadowingActive
                          ? 'bg-white border-stone-900 shadow-[4px_4px_0px_#1c1917]'
                          : 'bg-white/80 hover:bg-white border-stone-200/90 hover:border-amber-300 shadow-2xs'
                      }`}
                    >
                      {/* BANDEAU SUPÉRIEUR DE PHRASE : NUMÉRO + ACTIONS D'ÉCOUTE & DE RYTHME */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5 text-xs font-sans">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isCurrentAudioSentence 
                              ? 'bg-amber-500 text-white animate-pulse' 
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            Phrase {globalIdx + 1}
                          </span>

                          {isCurrentAudioSentence && (
                            <span className="text-[11px] font-bold text-amber-800 flex items-center space-x-1 animate-pulse">
                              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                              <span>En cours de lecture vocale...</span>
                            </span>
                          )}
                        </div>

                        {/* Boutons d'action rapides pour cette phrase */}
                        <div className="flex items-center space-x-1.5">
                          {/* Écouter la phrase normalement */}
                          <button
                            onClick={() => handlePlaySingleSentence(sentence, globalIdx)}
                            className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all ${
                              isCurrentSinglePlaying
                                ? 'bg-stone-900 text-white shadow-2xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                            title="Écouter cette phrase avec son intonation naturelle"
                          >
                            {isCurrentSinglePlaying ? (
                              <VolumeX className="w-3 h-3 text-rose-300" />
                            ) : (
                              <Play className="w-3 h-3 fill-current text-stone-700" />
                            )}
                            <span className="text-[11px]">Écouter</span>
                          </button>

                          {/* Décomposer le rythme avec pauses de souffle */}
                          <button
                            onClick={() => handlePlaySentenceRhythmCadence(sentence, globalIdx)}
                            className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all ${
                              isCurrentRhythmPlaying
                                ? 'bg-amber-600 text-white shadow-2xs animate-pulse'
                                : 'bg-amber-100/70 hover:bg-amber-200 text-amber-900 border border-amber-300/60'
                            }`}
                            title="Décomposer le rythme : écoute avec micro-pauses entre chaque groupe de sens (意群)"
                          >
                            <Music className="w-3 h-3 text-amber-700" />
                            <span className="text-[11px]">Cadence & Pauses</span>
                          </button>

                          {/* Répéter / Calibrer ma voix (Shadowing) */}
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
                            className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all ${
                              isShadowingActive
                                ? 'bg-[#c23b22] text-white shadow-2xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                            title="Répéter cette phrase et calibrer ton rythme avec l'IA"
                          >
                            <Mic className="w-3 h-3 text-[#c23b22]" />
                            <span className="text-[11px]">{isShadowingActive ? 'Fermer studio' : 'Répéter'}</span>
                          </button>
                        </div>
                      </div>

                      {/* CORPS DE LA PHRASE : MODE RYTHME (意群) OU MOTS ISOLÉS */}
                      {readerMode === 'rhythm' ? (
                        /* MODE RYTHME & FLUX : CAPSULES DE SOUFFLE ET SÉPARATEURS PROSODIQUES */
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-3.5 py-1.5">
                          {analysis.chunks.map((chunk, cIdx) => {
                            const isChunkActive = isCurrentRhythmPlaying && activeRhythmChunkIdx === cIdx;

                            return (
                              <React.Fragment key={chunk.id || cIdx}>
                                <div
                                  className={`inline-flex flex-wrap items-end rounded-2xl p-1.5 px-2.5 transition-all border ${
                                    isChunkActive
                                      ? 'bg-amber-400 text-stone-950 border-stone-900 shadow-md scale-105 ring-2 ring-amber-300'
                                      : chunk.stressLevel === 'prominent'
                                      ? 'bg-amber-50/90 border-amber-300 shadow-2xs'
                                      : chunk.stressLevel === 'light'
                                      ? 'bg-stone-50/50 border-stone-200 text-stone-600'
                                      : 'bg-white border-stone-200'
                                  }`}
                                  title={chunk.stressLevel === 'prominent' ? "Groupe avec emphase ou intensité prosodique" : undefined}
                                >
                                  {/* Mots du chunk cliquables pour popup dictionnaire */}
                                  <div className="flex items-end gap-x-1">
                                    {chunk.words.map((word, wIdx) => {
                                      const isSelected = selectedWord?.hanzi === word.hanzi && selectedWordSentenceIdx === globalIdx;
                                      const inAnki = isWordInUserAnki(word.hanzi);

                                      return (
                                        <span
                                          key={wIdx}
                                          onClick={() => {
                                            if (selectedWord?.hanzi === word.hanzi && selectedWordSentenceIdx === globalIdx) {
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
                                              : word.isTarget
                                              ? 'border-b-2 border-amber-500 font-bold text-stone-900'
                                              : inAnki
                                              ? 'border-b-2 border-[#c23b22] text-stone-900'
                                              : 'hover:bg-stone-100 text-stone-900'
                                          }`}
                                        >
                                          {showPinyin && word.pinyin && (
                                            <span className="text-[11px] font-sans text-stone-500 font-normal tracking-normal leading-none mb-1 group-hover:text-stone-900">
                                              {word.pinyin}
                                            </span>
                                          )}
                                          <span className="chinese-text font-bold text-xl sm:text-2xl leading-none">
                                            {word.hanzi}
                                          </span>
                                        </span>
                                      );
                                    })}
                                  </div>

                                  {/* Badge de sandhi tonal si applicable */}
                                  {chunk.sandhiHint && (
                                    <span 
                                      className="ml-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-bold cursor-help"
                                      title={chunk.sandhiHint}
                                    >
                                      ⚡ ton
                                    </span>
                                  )}
                                </div>

                                {/* SÉPARATEUR PROSODIQUE ENTRE LES CAPSULES */}
                                {cIdx < analysis.chunks.length - 1 && (
                                  <span className="inline-flex items-center select-none" title={
                                    chunk.pauseType === 'comma' 
                                      ? 'Pause de virgule (pause respiratoire moyenne)' 
                                      : 'Micro-souffle respiratoire (/)'
                                  }>
                                    {chunk.pauseType === 'comma' ? (
                                      <span className="text-stone-400 font-mono font-black text-sm px-1">//</span>
                                    ) : (
                                      <span className="text-amber-500 font-mono font-black text-xs px-1">/</span>
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
                                  if (selectedWord?.hanzi === word.hanzi && selectedWordSentenceIdx === globalIdx) {
                                    setSelectedWord(null);
                                    setSelectedWordSentenceIdx(null);
                                  } else {
                                    setSelectedWord(word);
                                    setSelectedWordSentenceIdx(globalIdx);
                                  }
                                }}
                                className={`group inline-flex flex-col items-center cursor-pointer rounded-lg px-1 py-0.5 transition-all select-none ${
                                  isSelected
                                    ? 'bg-amber-300/80 text-stone-950 font-bold ring-2 ring-stone-900'
                                    : word.isTarget
                                    ? 'bg-amber-100/90 hover:bg-amber-200 border-b-2 border-amber-500 font-bold text-stone-900'
                                    : inAnki
                                    ? 'bg-rose-50 hover:bg-rose-100 border-b-2 border-[#c23b22] text-stone-900'
                                    : 'hover:bg-stone-200/70 text-stone-900'
                                }`}
                              >
                                {showPinyin && word.pinyin && (
                                  <span className="text-[11px] font-sans text-stone-500 font-normal tracking-normal leading-none mb-1 group-hover:text-stone-900">
                                    {word.pinyin}
                                  </span>
                                )}
                                <span className="chinese-text font-bold text-xl sm:text-2xl leading-none">
                                  {word.hanzi}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* CONSEIL DE RYTHME PROSODIQUE */}
                      {readerMode === 'rhythm' && analysis.rhythmAdvice && (
                        <p className="text-[11px] text-amber-900/90 bg-amber-50/70 px-3 py-1.5 rounded-xl border border-amber-200 font-sans font-medium flex items-center space-x-1.5">
                          <span>💡</span>
                          <span>{analysis.rhythmAdvice}</span>
                        </p>
                      )}

                      {/* TRADUCTION FRANÇAISE */}
                      {showTranslation && sentence.translation && (
                        <p className="text-xs sm:text-sm font-sans text-stone-500 italic pl-1 border-l-2 border-amber-300">
                          {sentence.translation}
                        </p>
                      )}

                      {/* POP-UP DICTIONNAIRE & PHRASES D'EXEMPLE DIRECTEMENT SOUS LA PHRASE */}
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

                      {/* 🎤 STUDIO INTERACTIF DE SHADOWING & CALIBRAGE DU RYTHME */}
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
                            <p className="text-xs text-stone-400 font-mono">
                              {sentence.pinyin}
                            </p>
                            <p className="text-xl sm:text-2xl font-black font-serif text-white chinese-text">
                              {sentence.hanzi}
                            </p>
                            <p className="text-xs text-stone-400 italic">
                              « {sentence.translation} »
                            </p>
                          </div>

                          {/* Boutons d'action : Écouter la cadence & Enregistrer */}
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

                            {/* Bouton Ajouter la phrase à Anki */}
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
                              <BookmarkCheck className={`w-3.5 h-3.5 ${isWordInUserAnki(sentence.hanzi) ? 'text-emerald-400' : 'text-stone-400'}`} />
                              <span>{isWordInUserAnki(sentence.hanzi) ? 'Dans Anki' : '+ Anki'}</span>
                            </button>
                          </div>

                          {/* Statut pendant enregistrement */}
                          {shadowingRecording && (
                            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-center text-xs text-rose-300 animate-pulse">
                              Micro actif... Parle avec le rythme naturel et enchaîne les blocs de souffle !
                            </div>
                          )}

                          {/* Résultat d'évaluation IA de la phrase */}
                          {shadowingEvaluation && (
                            <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2.5 animate-fadeIn text-xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Award className={`w-4 h-4 ${
                                    shadowingEvaluation.accuracyScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                                  }`} />
                                  <strong className="font-bold text-white">
                                    {shadowingEvaluation.accuracyScore >= 80 ? 'Excellente cadence !' : 'Ajustement du rythme'}
                                  </strong>
                                </div>
                                <span className={`font-mono font-black text-base ${
                                  shadowingEvaluation.accuracyScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                  {shadowingEvaluation.accuracyScore}%
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

                              {/* Alignement des caractères */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {shadowingEvaluation.matchedCharacters.map((mc: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono border font-bold ${
                                      mc.status === 'correct'
                                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                        : 'bg-rose-950 text-rose-300 border-rose-800'
                                    }`}
                                  >
                                    <span className="chinese-text font-serif mr-1">{mc.char}</span>
                                    <span>{mc.status === 'correct' ? '✓' : '⚠️'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 6. VOCABULAIRE CIBLE DE L'HISTOIRE */}
        <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Vocabulaire clé à ancrer dans cette histoire :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {activeStory.targetWords.map((word, idx) => {
              const inAnki = isWordInUserAnki(word.hanzi);
              return (
                <div
                  key={idx}
                  onClick={() => playNativeWordAudio(word.hanzi, 0.9)}
                  className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 cursor-pointer flex items-center justify-between text-xs transition-all shadow-2xs group"
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-base font-serif text-stone-900 group-hover:text-[#c23b22]">
                        {word.hanzi}
                      </span>
                      <span className="text-stone-500 font-mono text-[11px]">
                        {word.pinyin}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 truncate max-w-[140px]">
                      {word.translation}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveWordToAnki(word);
                      }}
                      className={`p-1.5 rounded-lg border transition-all ${
                        inAnki
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                          : 'bg-stone-50 hover:bg-emerald-50 text-stone-400 hover:text-emerald-700 border-stone-200'
                      }`}
                      title={inAnki ? 'Déjà dans ton Anki' : 'Ajouter à Anki'}
                    >
                      <BookmarkCheck className={`w-3.5 h-3.5 ${inAnki ? 'text-emerald-600' : 'text-stone-400'}`} />
                    </button>
                    <Volume2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#c23b22]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. QUIZ DE COMPRÉHENSION (TRADUCTION FRANÇAISE MASQUÉE PAR DÉFAUT) */}
        {activeStory.quiz && activeStory.quiz.length > 0 && (
          <div className="p-5 rounded-2xl bg-white border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-400 text-stone-950 font-bold">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm sm:text-base text-stone-900 font-serif">
                  Quiz de Compréhension
                </h3>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                {/* Bouton pour afficher / masquer les traductions françaises des réponses */}
                <button
                  onClick={() => setShowQuizTranslations(!showQuizTranslations)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    showQuizTranslations
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 shadow-2xs'
                  }`}
                  title={showQuizTranslations ? "Masquer les traductions françaises" : "Afficher les traductions françaises pour vérifier"}
                >
                  {showQuizTranslations ? <EyeOff className="w-3.5 h-3.5 text-stone-500" /> : <Eye className="w-3.5 h-3.5 text-[#c23b22]" />}
                  <span>{showQuizTranslations ? 'Masquer trad. FR' : 'Afficher trad. FR'}</span>
                </button>

                <span className="text-xs text-stone-500 font-bold">
                  {Object.keys(selectedAnswers).length}/{activeStory.quiz.length} répondu
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {activeStory.quiz.map((q, qIdx) => {
                const userAnswer = selectedAnswers[qIdx];
                const hasAnswered = userAnswer !== undefined;

                return (
                  <div key={qIdx} className="space-y-2.5 text-xs">
                    <p className="font-bold text-stone-900 text-sm">
                      {qIdx + 1}. {q.question}
                    </p>
                    {q.questionPinyin && (
                      <p className="text-[11px] text-stone-500 font-mono -mt-1">
                        {q.questionPinyin}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAnswer === optIdx;
                        const isCorrect = optIdx === q.correctIndex;

                        const match = opt.match(/^(.*?)\s*\((.*?)\)$/);
                        const chineseText = match ? match[1].trim() : opt;
                        const frenchTranslation = match ? match[2].trim() : null;

                        let style = 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100';
                        if (hasAnswered) {
                          if (isCorrect) {
                            style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          } else if (isChosen) {
                            style = 'bg-rose-100 border-rose-400 text-rose-950';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(qIdx, optIdx)}
                            className={`p-3 rounded-xl border text-left transition-all ${style}`}
                          >
                            <div className="flex flex-col items-start w-full">
                              <span className="font-serif chinese-text text-sm font-bold text-stone-900 leading-snug">
                                {chineseText}
                              </span>
                              {frenchTranslation && showQuizTranslations && (
                                <span className="text-[11px] text-stone-500 italic mt-0.5 animate-fadeIn">
                                  « {frenchTranslation} »
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <p className="p-2.5 rounded-xl bg-stone-100 text-[11px] text-stone-700 border border-stone-200">
                        💡 <strong>Explication :</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. DÉFI D'EXPRESSION ORALE / ÉCRITE (TRADUCTION CACHÉE PAR DÉFAUT) */}
        {activeStory.discussionPrompt && (
          <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-black text-sm text-stone-900 font-serif">
                  À toi de parler ! (Défi d'expression)
                </h3>
              </div>

              {activeStory.discussionPrompt.questionTranslation && (
                <button
                  onClick={() => setShowPromptTranslation(!showPromptTranslation)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                    showPromptTranslation
                      ? 'bg-amber-200 text-amber-900 border-amber-400'
                      : 'bg-white hover:bg-amber-100 text-stone-700 border-amber-300'
                  }`}
                  title={showPromptTranslation ? "Masquer la traduction française" : "Voir la traduction française"}
                >
                  {showPromptTranslation ? <EyeOff className="w-3.5 h-3.5 text-stone-600" /> : <Eye className="w-3.5 h-3.5 text-amber-700" />}
                  <span>{showPromptTranslation ? 'Masquer FR' : '👁️ Traduction française'}</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-stone-900 font-serif chinese-text leading-relaxed">
                {activeStory.discussionPrompt.question}
              </p>
              {activeStory.discussionPrompt.questionPinyin && (
                <p className="text-[11px] text-stone-500 font-mono">
                  {activeStory.discussionPrompt.questionPinyin}
                </p>
              )}
              {activeStory.discussionPrompt.questionTranslation && showPromptTranslation && (
                <p className="text-xs text-stone-700 italic bg-white/80 p-2.5 rounded-xl border border-amber-200 mt-1 animate-fadeIn">
                  « {activeStory.discussionPrompt.questionTranslation} »
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={writtenResponse}
                onChange={(e) => setWrittenResponse(e.target.value)}
                placeholder="Écris ou parle au micro en chinois..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-serif focus:outline-none focus:ring-2 focus:ring-[#c23b22]"
              />

              <button
                onClick={handleToggleVoiceRecording}
                className={`p-2.5 rounded-xl border-2 border-stone-900 font-bold transition-all shadow-xs shrink-0 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white hover:bg-stone-100 text-stone-900'
                }`}
                title="Parler au micro"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {storyRecordedAudioUrl && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs animate-fadeIn">
                <button
                  onClick={handleTogglePlayStoryUserAudio}
                  className={`px-3 py-1.5 rounded-lg border-2 border-stone-900 font-black text-xs flex items-center space-x-1.5 transition-all shadow-xs ${
                    isPlayingStoryUserAudio
                      ? 'bg-[#c23b22] text-white'
                      : 'bg-white hover:bg-stone-100 text-stone-900'
                  }`}
                >
                  {isPlayingStoryUserAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#c23b22] fill-[#c23b22]" />}
                  <span>{isPlayingStoryUserAudio ? 'Pause' : 'Écouter ma Réponse'}</span>
                </button>

                {writtenResponse && (
                  <button
                    onClick={() => playChineseAudio(writtenResponse, 1.0)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center space-x-1.5 border border-stone-300 transition-colors"
                    title="Écouter le modèle natif pour comparer ta prononciation"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Modèle Natif</span>
                  </button>
                )}
              </div>
            )}

            {speechEvaluation && (
              <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-emerald-800">
                  🎉 Expression captée : {speechEvaluation.spokenText}
                </span>
                <p className="text-[11px] text-stone-600">
                  Score de prononciation : <strong>{speechEvaluation.accuracyScore}%</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 9. BOUTON FINAL : VALIDER L'HISTOIRE (+1 JOUR DE STREAK) */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-stone-500 font-medium">
            Termine la lecture pour marquer ton jour de pratique.
          </span>

          <button
            onClick={handleMarkAsCompleted}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs shadow-md border-2 border-stone-900 transition-all flex items-center justify-center space-x-2 ${
              completedStoryIds.includes(activeStory.id)
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {completedStoryIds.includes(activeStory.id)
                ? 'Histoire validée (Pratique du jour enregistrée)'
                : 'Marquer l\'histoire comme lue (+1j Streak)'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
