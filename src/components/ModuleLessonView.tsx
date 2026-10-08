import React, { useState, useEffect, useRef } from 'react';
import { NuanceCard, VoiceEvaluationResult, AnkiWord, AnchoringRecord } from '../types/fluent';
import { NUANCE_CARDS, CURRICULUM_MODULES } from '../data/curriculumData';
import { playChineseAudio, stopChineseAudio, evaluatePronunciation, isSpeechRecognitionSupported } from '../utils/speechUtils';
import { VoiceSelector } from './VoiceSelector';
import { ActiveNuanceQuiz } from './ActiveNuanceQuiz';
import { SentenceBuilder } from './SentenceBuilder';
import { 
  getAnchoringRecords, 
  recordTestSuccess, 
  recordVoiceScore,
  getCardsDueForReview 
} from '../utils/anchoringUtils';
import { 
  Mic, 
  Square, 
  Volume2, 
  Snail, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Sparkles,
  Info,
  Award,
  AlertTriangle,
  Puzzle,
  MessageSquareQuote,
  ArrowRight,
  Play,
  Pause,
  Headphones,
  ArrowRightLeft,
  HelpCircle,
  Anchor,
  Compass,
  ArrowLeft
} from 'lucide-react';

interface ModuleLessonViewProps {
  cardId: string;
  onSelectCard: (cardId: string) => void;
  onBackToModules: () => void;
  onExerciseCompleted: (exerciseId: string) => void;
  syncedAnkiWords: AnkiWord[];
  onOpenAnchorSession?: () => void;
}

export const ModuleLessonView: React.FC<ModuleLessonViewProps> = ({
  cardId,
  onSelectCard,
  onBackToModules,
  onExerciseCompleted,
  syncedAnkiWords,
  onOpenAnchorSession,
}) => {
  const currentIndex = Math.max(0, NUANCE_CARDS.findIndex(c => c.id === cardId));
  const currentCard = NUANCE_CARDS[currentIndex] || NUANCE_CARDS[0];

  const [activeTab, setActiveTab] = useState<'theory' | 'dialogue' | 'practice' | 'voice'>('theory');
  const [showPinyin, setShowPinyin] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<VoiceEvaluationResult | null>(null);

  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isPlayingMirror, setIsPlayingMirror] = useState(false);
  const [mirrorStage, setMirrorStage] = useState<'native' | 'pause' | 'user' | null>(null);
  const [showPhoneticTips, setShowPhoneticTips] = useState(false);

  const [sentenceBuilderCompleted, setSentenceBuilderCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('fluent_builder_completed');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  });

  const [anchoringRecords, setAnchoringRecords] = useState<Record<string, AnchoringRecord>>(() => {
    return getAnchoringRecords() || {};
  });

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const isSupported = isSpeechRecognitionSupported();
  const currentRecord = (anchoringRecords || {})[currentCard?.id];
  const dueCards = getCardsDueForReview(NUANCE_CARDS) || [];

  const isTestPassed = !!currentRecord?.testPassed;
  const isBuilderPassed = !!(sentenceBuilderCompleted || {})[currentCard?.id];
  const isVoicePassed = (currentRecord?.voiceBestScore || 0) >= 80;
  const isLessonFullyMastered = isTestPassed && isVoicePassed;

  const stopAllPlayback = () => {
    stopChineseAudio();
    setIsPlayingAudio(false);
    setIsPlayingMirror(false);
    setMirrorStage(null);
    if (userAudioPlayerRef.current) {
      try {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current.currentTime = 0;
      } catch (e) {}
      setIsPlayingUserAudio(false);
    }
  };

  const cleanupRecording = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
  };

  const resetCardSession = () => {
    cleanupRecording();
    stopAllPlayback();
    setEvaluation(null);
    setLiveTranscript('');
    setRecordedAudioUrl(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
  };

  useEffect(() => {
    resetCardSession();
    return () => {
      cleanupRecording();
      stopAllPlayback();
    };
  }, [currentCard.id]);

  const handlePlayAudio = async (text: string, rate: number = 0.85, gender?: 'female' | 'male') => {
    if (isPlayingAudio || isPlayingMirror) {
      stopAllPlayback();
      return;
    }
    stopAllPlayback();
    setIsPlayingAudio(true);
    await playChineseAudio(text, rate, gender);
    setIsPlayingAudio(false);
  };

  const handleTestPassed = () => {
    recordTestSuccess(currentCard.id);
    setAnchoringRecords(getAnchoringRecords());
  };

  const handleBuilderCompleted = () => {
    const updated = {
      ...sentenceBuilderCompleted,
      [currentCard.id]: true
    };
    setSentenceBuilderCompleted(updated);
    localStorage.setItem('fluent_builder_completed', JSON.stringify(updated));
  };

  const startRecording = async () => {
    if (!isSupported) {
      alert("La reconnaissance vocale n'est pas disponible sur ce navigateur. Essaie sur Google Chrome ou Edge !");
      return;
    }

    cleanupRecording();
    stopAllPlayback();

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    setLiveTranscript('');
    setEvaluation(null);
    accumulatedTranscriptRef.current = '';
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
            if (audioBlob.size > 0) {
              const url = URL.createObjectURL(audioBlob);
              setRecordedAudioUrl(url);
            }
          }
        };

        mediaRecorderRef.current = recorder;
        recorder.start(100);
      }
    } catch (err) {
      console.warn("Capture audio MediaRecorder non disponible :", err);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          accumulatedTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const combined = (accumulatedTranscriptRef.current + interim).trim();
      setLiveTranscript(combined);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        finalizeRecording();
      }, 4000);
    };

    recognition.onerror = () => cleanupRecording();
    recognition.onend = () => {
      if (isRecording) {
        try {
          recognition.start();
        } catch (e) {
          setIsRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;
    setIsRecording(true);
    recognition.start();
  };

  const finalizeRecording = () => {
    const spoken = accumulatedTranscriptRef.current || liveTranscript;
    cleanupRecording();

    if (!spoken.trim()) {
      setEvaluation({
        spokenText: '',
        accuracyScore: 0,
        matchedCharacters: [],
        feedbackMessage: "Aucun son capté. Assure-toi d'autoriser le micro et parle distinctement.",
        isPerfect: false,
      });
      return;
    }

    const evalResult = evaluatePronunciation(spoken, currentCard.targetChinese);
    setEvaluation(evalResult);

    recordVoiceScore(currentCard.id, evalResult.accuracyScore);
    setAnchoringRecords(getAnchoringRecords());

    if (evalResult.accuracyScore >= 80) {
      onExerciseCompleted(currentCard.id);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      finalizeRecording();
    } else {
      startRecording();
    }
  };

  const handleTogglePlayUserAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingUserAudio) {
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current.currentTime = 0;
      }
      setIsPlayingUserAudio(false);
      return;
    }

    stopAllPlayback();
    const audio = new Audio(recordedAudioUrl);
    userAudioPlayerRef.current = audio;
    setIsPlayingUserAudio(true);

    audio.onended = () => setIsPlayingUserAudio(false);
    audio.onerror = () => setIsPlayingUserAudio(false);
    audio.play().catch(() => setIsPlayingUserAudio(false));
  };

  const handlePlayMirrorComparison = async (mode: 'native-then-user' | 'user-then-native' = 'native-then-user') => {
    if (isPlayingMirror || !recordedAudioUrl) return;
    stopAllPlayback();
    setIsPlayingMirror(true);

    const playUserPiece = () => {
      return new Promise<void>((resolve) => {
        const audio = new Audio(recordedAudioUrl);
        userAudioPlayerRef.current = audio;
        setIsPlayingUserAudio(true);
        audio.onended = () => {
          setIsPlayingUserAudio(false);
          resolve();
        };
        audio.onerror = () => {
          setIsPlayingUserAudio(false);
          resolve();
        };
        audio.play().catch(() => {
          setIsPlayingUserAudio(false);
          resolve();
        });
      });
    };

    const playNativePiece = async () => {
      await playChineseAudio(currentCard.targetChinese, 0.85);
    };

    try {
      if (mode === 'native-then-user') {
        setMirrorStage('native');
        await playNativePiece();
        setMirrorStage('pause');
        await new Promise(r => setTimeout(r, 600));
        setMirrorStage('user');
        await playUserPiece();
      } else {
        setMirrorStage('user');
        await playUserPiece();
        setMirrorStage('pause');
        await new Promise(r => setTimeout(r, 600));
        setMirrorStage('native');
        await playNativePiece();
      }
    } catch (e) {
      console.warn("Erreur miroir phonétique :", e);
    } finally {
      setIsPlayingMirror(false);
      setMirrorStage(null);
      setIsPlayingUserAudio(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < NUANCE_CARDS.length - 1) {
      onSelectCard(NUANCE_CARDS[currentIndex + 1].id);
      setActiveTab('theory');
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      onSelectCard(NUANCE_CARDS[currentIndex - 1].id);
      setActiveTab('theory');
    }
  };

  const currentModule = CURRICULUM_MODULES.find(m => m.id === currentCard.moduleId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* BOUTON RETOUR VERS LA LISTE DES MODULES & NAVIGATION RAPIDE */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToModules}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold shadow-[2px_2px_0px_#1c1917] dark:shadow-[2px_2px_0px_#000] transition-all hover:-translate-x-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Tous les Modules</span>
        </button>

        <div className="flex items-center space-x-2">
          {onOpenAnchorSession && (
            <button
              onClick={onOpenAnchorSession}
              className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border-2 border-stone-900 dark:border-stone-700 transition-all shadow-[2px_2px_0px_#1c1917] dark:shadow-[2px_2px_0px_#000] cursor-pointer ${
                dueCards.length > 0
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <Anchor className="w-3.5 h-3.5 text-stone-900 dark:text-amber-400" />
              <span>Ancrage</span>
              {dueCards.length > 0 && (
                <span className="bg-stone-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {dueCards.length}
                </span>
              )}
            </button>
          )}

          <div className="flex items-center space-x-1">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Leçon précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex === NUANCE_CARDS.length - 1}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Leçon suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. HEADER DE LA LEÇON */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
              {currentModule?.title || 'Module'}
            </span>
            <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500">
              Leçon {currentIndex + 1} / {NUANCE_CARDS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif leading-tight">
            {currentCard.title}
          </h2>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono font-bold text-[#c23b22] dark:text-amber-400 bg-[#c23b22]/10 dark:bg-amber-400/10 px-3 py-1.5 rounded-xl border border-[#c23b22]/20 dark:border-amber-400/20">
            {currentCard.structuralFormula}
          </span>
        </div>
      </div>

      {/* 2. STATUT DE PROGRESSION (LES 3 JALONS) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-[3px_3px_0px_#1c1917] dark:shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-[#c23b22] dark:bg-amber-600 text-white flex items-center justify-center font-serif font-black text-base shadow-sm shrink-0">
            {isLessonFullyMastered ? '🌳' : isTestPassed ? '🌿' : '🌱'}
          </div>
          <div>
            <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
              <span>Validation de cette leçon :</span>
              {isLessonFullyMastered ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700 dark:text-emerald-400" /> Ancrée en mémoire durable !
                </span>
              ) : (
                <span className="text-stone-500 dark:text-stone-400 font-medium">
                  Complète les ateliers pour valider l'automatisme
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              <span className={`flex items-center space-x-1 ${isTestPassed ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3 h-3 ${isTestPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-300 dark:text-stone-600'}`} />
                <span>Quiz Discrimination</span>
              </span>
              <span className={`flex items-center space-x-1 ${isBuilderPassed ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3 h-3 ${isBuilderPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-300 dark:text-stone-600'}`} />
                <span>Ordre des Mots</span>
              </span>
              <span className={`flex items-center space-x-1 ${isVoicePassed ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3 h-3 ${isVoicePassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-300 dark:text-stone-600'}`} />
                <span>Défi Micro (≥ 80%)</span>
              </span>
            </div>
          </div>
        </div>

        {currentRecord?.voiceBestScore ? (
          <div className="text-right shrink-0">
            <span className="text-[10px] text-stone-400 dark:text-stone-500 block font-bold uppercase tracking-wider">Score Oral</span>
            <span className="font-mono text-base font-black text-[#c23b22] dark:text-amber-400">
              {currentRecord.voiceBestScore}%
            </span>
          </div>
        ) : null}
      </div>

      {/* 3. ONGLETS DE LA LEÇON */}
      <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl text-xs font-bold border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_#1c1917] dark:shadow-[2px_2px_0px_#000]">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'theory' ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. Théorie & Mindset</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'dialogue' ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
          <span>2. Exemples & Dialogue</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'practice' ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Puzzle className="w-3.5 h-3.5 text-indigo-400" />
          <span>3. Ateliers Pratiques</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'voice' ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-rose-400" />
          <span>4. Défi Vocal</span>
        </button>
      </div>

      {/* CONTENU ONGLET 1 : THÉORIE */}
      {activeTab === 'theory' && (
        <div className="bg-[#fcfaf7] dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] space-y-6 animate-fadeIn">
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 dark:bg-stone-950 text-white border-2 border-stone-800 dark:border-stone-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Formule Structurelle Clé</span>
              </span>
            </div>
            <div className="font-mono text-sm sm:text-base font-black text-amber-200 tracking-wide">
              {currentCard.structuralFormula}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200">
              💡 Déclic Mental : Pourquoi les Chinois pensent ainsi
            </h4>
            <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-medium bg-white dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
              {currentCard.keyNuanceExplanation}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm text-rose-950 dark:text-rose-200 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-rose-900 dark:text-rose-300 font-bold block">Le piège de la traduction mot-à-mot :</strong>
              <p className="leading-relaxed">{currentCard.commonTrap}</p>
            </div>
          </div>

          {currentCard.rulePoints && currentCard.rulePoints.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200">
                📌 Règles Essentielles & Cas d'Usage :
              </h4>
              <div className="space-y-3">
                {currentCard.rulePoints.map((rule, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 space-y-2 shadow-2xs">
                    <strong className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block font-serif">
                      {rule.pointTitle}
                    </strong>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                      {rule.explanation}
                    </p>
                    {rule.exampleChinese && (
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-serif font-black text-stone-900 dark:text-stone-100 text-sm mr-2">{rule.exampleChinese}</span>
                          <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px] mr-2">({rule.examplePinyin})</span>
                          <span className="text-stone-600 dark:text-stone-300 italic">→ {rule.exampleFrench}</span>
                        </div>
                        <button
                          onClick={() => rule.exampleChinese && handlePlayAudio(rule.exampleChinese, 0.85)}
                          className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors shrink-0 cursor-pointer"
                          title="Écouter cet exemple"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c23b22]" />
                <span>Contexte de communication :</span>
              </span>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed pl-3.5">
                {currentCard.situationFrench}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start space-x-2.5 text-amber-950 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 dark:text-amber-300 font-bold block mb-0.5">Astuce de locuteur natif :</strong>
                <p className="leading-relaxed">{currentCard.culturalNote}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('dialogue')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white font-bold text-xs shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Étape suivante : Exemples & Dialogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 2 : DIALOGUES & EXEMPLES */}
      {activeTab === 'dialogue' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] space-y-6 animate-fadeIn">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Immersion & Écoute Active
              </span>
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                Exemples en Situation Réelle & Dialogue Spontané
              </h3>
            </div>
            <VoiceSelector compact />
          </div>

          <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/30 border-2 border-stone-900 dark:border-stone-700 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">Phrase Modèle d'Élocution :</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePlayAudio(currentCard.targetChinese, 0.85)}
                  className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Écouter (0.85x)</span>
                </button>
                <button
                  onClick={() => handlePlayAudio(currentCard.targetChinese, 0.5)}
                  className="px-2 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  title="Écouter au ralenti 0.5x"
                >
                  <Snail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>0.5x</span>
                </button>
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif chinese-text">
              {currentCard.targetChinese}
            </div>
            <div className="text-xs sm:text-sm font-mono text-stone-500 dark:text-stone-400">
              {currentCard.targetPinyin}
            </div>
            <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic border-t border-amber-200/60 dark:border-amber-800/40 pt-2">
              « {currentCard.translationFrench} »
            </div>
          </div>

          {currentCard.dialogue && currentCard.dialogue.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center space-x-1.5">
                <MessageSquareQuote className="w-4 h-4 text-[#c23b22] dark:text-amber-400" />
                <span>Mini-Dialogue Oral Spontané :</span>
              </h4>

              <div className="p-4 rounded-2xl bg-[#fcfaf7] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
                {currentCard.dialogue.map((line, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-2xs">
                    <span className="w-7 h-7 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {line.speaker}
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100 font-serif chinese-text">
                          {line.chinese}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handlePlayAudio(line.chinese, 0.85)}
                            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
                            title="Écouter cette réplique"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handlePlayAudio(line.chinese, 0.5)}
                            className="p-1 rounded-lg text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors text-[10px] font-bold cursor-pointer"
                            title="Ralenti 0.5x"
                          >
                            0.5x
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">{line.pinyin}</p>
                      <p className="text-xs text-stone-600 dark:text-stone-300 italic">« {line.translation} »</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => setActiveTab('theory')}
              className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
            >
              ← Revoir la théorie
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white font-bold text-xs shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Étape suivante : Ateliers Pratiques</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 3 : ATELIERS PRATIQUES */}
      {activeTab === 'practice' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                <Puzzle className="w-4 h-4 text-amber-500" />
                <span>Atelier 1 sur 2 : Défi de Placement dans la phrase 🧩</span>
              </span>
              {isTestPassed && (
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Validé
                </span>
              )}
            </div>
            <ActiveNuanceQuiz
              testQuestion={currentCard.activeTest}
              onPassed={handleTestPassed}
              alreadyPassed={isTestPassed}
            />
          </div>

          {currentCard.sentenceBuilder && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <Puzzle className="w-4 h-4 text-indigo-500" />
                  <span>Atelier 2 sur 2 : Reconstitution de Phrase</span>
                </span>
                {isBuilderPassed && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Validé
                  </span>
                )}
              </div>
              <SentenceBuilder
                exercise={currentCard.sentenceBuilder}
                onCompleted={handleBuilderCompleted}
                alreadyCompleted={isBuilderPassed}
              />
            </div>
          )}

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => setActiveTab('dialogue')}
              className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              ← Revoir les exemples
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#c23b22] hover:bg-[#d64126] text-white font-black text-xs shadow-md transition-all hover:-translate-y-0.5 border-2 border-amber-300"
            >
              <span>Dernière étape : Défi Vocal au Micro</span>
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 4 : DÉFI VOCAL */}
      {activeTab === 'voice' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#c23b22] flex items-center space-x-1.5">
              <Mic className="w-4 h-4" />
              <span>Validation Finale : Pratique de l'Élocution Native</span>
            </span>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              Score requis : ≥ 80%
            </span>
          </div>

          <div className="space-y-4 py-2 text-center">
            <div className="min-h-[28px] flex items-center justify-center">
              {showPinyin ? (
                <p className="text-sm sm:text-base font-medium text-stone-700 dark:text-stone-200 tracking-wide bg-stone-50 dark:bg-stone-800 px-3.5 py-1 rounded-xl border border-stone-200 dark:border-stone-700">
                  {currentCard.targetPinyin}
                </p>
              ) : (
                <span className="text-xs text-stone-400 dark:text-stone-500 italic">
                  (Pinyin masqué par défaut pour stimuler la lecture directe)
                </span>
              )}
            </div>

            <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-stone-900 dark:text-stone-100 chinese-text leading-tight select-all py-1 font-serif">
              {currentCard.targetChinese}
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 italic">
              « {currentCard.translationFrench} »
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-300 dark:border-stone-700 transition-colors"
              >
                {showPinyin ? <EyeOff className="w-3.5 h-3.5 text-stone-500" /> : <Eye className="w-3.5 h-3.5 text-[#c23b22]" />}
                <span>{showPinyin ? 'Masquer Pinyin' : 'Révéler Pinyin'}</span>
              </button>

              <VoiceSelector compact />

              <button
                onClick={() => handlePlayAudio(currentCard.targetChinese, 0.85)}
                disabled={isPlayingAudio}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                <span>Écouter (0.85x)</span>
              </button>

              <button
                onClick={() => handlePlayAudio(currentCard.targetChinese, 0.5)}
                disabled={isPlayingAudio}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-300 dark:border-stone-700 transition-colors shadow-xs"
                title="Écouter au ralenti très lent 0.5x"
              >
                <Snail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Ultra-lent (0.5x)</span>
              </button>
            </div>
          </div>

          {/* Micro Interactif */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {isRecording && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-[#c23b22] animate-ping opacity-30" />
                    <span className="absolute -inset-2 rounded-full border-2 border-[#c23b22] animate-pulse opacity-50" />
                  </>
                )}

                <button
                  onClick={toggleRecording}
                  className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 border-2 border-stone-900 ${
                    isRecording
                      ? 'bg-[#c23b22] text-white shadow-[#c23b22]/40 scale-105'
                      : 'bg-gradient-to-tr from-[#c23b22] to-amber-600 hover:from-[#a9301a] hover:to-amber-700 text-white shadow-[#c23b22]/20'
                  }`}
                  title={isRecording ? 'Terminer et analyser' : 'Activer le micro'}
                >
                  {isRecording ? <Square className="w-7 h-7 fill-white" /> : <Mic className="w-8 h-8" />}
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                    {isRecording ? 'Terminer' : 'Parler'}
                  </span>
                </button>
              </div>

              {isRecording && (
                <button
                  onClick={finalizeRecording}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 animate-fadeIn"
                >
                  <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  <span>Évaluer</span>
                </button>
              )}
            </div>

            <div className="text-center space-y-1.5 max-w-md">
              <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
                {isRecording ? (
                  <span className="text-[#c23b22] flex items-center justify-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c23b22] animate-ping" />
                    <span>Micro actif — Parle à ton rythme naturel !</span>
                  </span>
                ) : (
                  <span>Clique sur <strong>Parler</strong> et lis la phrase à voix haute.</span>
                )}
              </p>

              {liveTranscript && (
                <div className="text-xs text-stone-800 dark:text-stone-200 font-mono bg-stone-100 dark:bg-stone-800 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 inline-block shadow-2xs">
                  <span className="text-stone-400 mr-1.5">Capté :</span>
                  <strong className="text-stone-900 dark:text-stone-100">{liveTranscript}</strong>
                </div>
              )}
            </div>

            {/* Miroir Phonétique */}
            {recordedAudioUrl && (
              <div className="w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-stone-50 via-white to-amber-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800/60 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-stone-900 dark:text-stone-100" />
                    <h4 className="font-serif font-black text-sm text-stone-900 dark:text-stone-100">
                      Miroir Phonétique & Auto-Écoute
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowPhoneticTips(!showPhoneticTips)}
                    className="text-[11px] font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700"
                  >
                    {showPhoneticTips ? 'Masquer' : 'Repères des tons'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={handleTogglePlayUserAudio}
                    className="p-3 rounded-2xl border-2 border-stone-900 dark:border-stone-700 font-black text-xs transition-all shadow-xs flex items-center justify-center space-x-2 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100"
                  >
                    <Play className="w-4 h-4 text-[#c23b22] fill-[#c23b22]" />
                    <span>Écouter ma Voix</span>
                  </button>

                  <button
                    onClick={() => handlePlayMirrorComparison('native-then-user')}
                    className="p-3 rounded-2xl border-2 border-stone-900 dark:border-stone-600 font-black text-xs transition-all shadow-md flex items-center justify-center space-x-2 bg-stone-900 dark:bg-stone-700 text-white"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-amber-300" />
                    <span>Miroir : Natif ➔ Toi</span>
                  </button>

                  <button
                    onClick={() => handlePlayMirrorComparison('user-then-native')}
                    className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition-all flex items-center justify-center space-x-2"
                  >
                    <Volume2 className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    <span>Toi ➔ Natif</span>
                  </button>
                </div>

                {showPhoneticTips && (
                  <div className="p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    💡 En t'écoutant, compare la hauteur des tons avec la voix native pour corriger l'effet d'illusion crânienne !
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Évaluation */}
          {evaluation && (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-fadeIn">
              <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                evaluation.accuracyScore >= 80 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100' 
                  : 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-stone-900 dark:text-stone-100'
              }`}>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-white font-mono">
                      🤖 Diagnostic IA
                    </span>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      {evaluation.aiFeedback?.summaryTitle || (evaluation.accuracyScore >= 80 ? 'Prononciation Conforme' : 'Ajustement Requis')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug">
                    {evaluation.aiFeedback?.aiDiagnosis || evaluation.feedbackMessage}
                  </p>

                  {evaluation.aiFeedback?.actionableTip && (
                    <p className="text-xs text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/50 px-2.5 py-1 rounded-lg font-medium inline-block">
                      💡 <strong>Conseil :</strong> {evaluation.aiFeedback.actionableTip}
                    </p>
                  )}

                  {evaluation.spokenText && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                      Capté par le micro : « {evaluation.spokenText} »
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className={`text-2xl sm:text-3xl font-black ${
                      evaluation.accuracyScore >= 80 ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#c23b22]'
                    }`}>
                      {evaluation.accuracyScore}%
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">
                      {evaluation.accuracyScore >= 80 ? 'Objectif Validé' : 'Seuil : ≥80%'}
                    </span>
                  </div>

                  <button
                    onClick={startRecording}
                    className="p-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors shadow-xs"
                    title="Réessayer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alignement des caractères */}
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                {(evaluation.aiFeedback?.characterBreakdown || evaluation.matchedCharacters.map((mc: any) => ({
                  targetChar: mc.char,
                  status: mc.status === 'correct' ? 'exact' : 'substituted'
                }))).map((charItem: any, idx: number) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 border font-mono text-xs transition-all ${
                      charItem.status === 'exact'
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-bold'
                        : charItem.status === 'substituted'
                        ? 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-bold'
                        : charItem.status === 'omitted'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    <span className="chinese-text font-serif text-sm font-black">{charItem.targetChar || '—'}</span>
                    <span className="text-[10px]">
                      {charItem.status === 'exact' ? '✓' : charItem.status === 'substituted' ? '⚠️' : '❌'}
                    </span>
                  </div>
                ))}
              </div>

              {evaluation.accuracyScore >= 80 && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="text-sm font-black block font-serif">太棒了 ! Leçon Validée et Ancrée !</strong>
                      <span className="text-xs text-emerald-800 dark:text-emerald-300">Structure assimilée avec succès.</span>
                    </div>
                  </div>

                  {currentIndex < NUANCE_CARDS.length - 1 && (
                    <button
                      onClick={nextCard}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0"
                    >
                      <span>Leçon suivante</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation basse */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="inline-flex items-center space-x-1 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-20 transition-colors font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Leçon précédente</span>
        </button>

        <button
          onClick={onBackToModules}
          className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-semibold"
        >
          Retour au sommaire des modules
        </button>

        <button
          onClick={nextCard}
          disabled={currentIndex === NUANCE_CARDS.length - 1}
          className="inline-flex items-center space-x-1 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-20 transition-colors font-bold"
        >
          <span>Leçon suivante</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

