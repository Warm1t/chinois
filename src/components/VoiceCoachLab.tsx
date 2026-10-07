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
  Layers,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Anchor,
  Compass,
  AlertTriangle,
  Puzzle,
  MessageSquareQuote,
  Flame,
  ArrowRight,
  Play,
  Pause,
  Headphones,
  ArrowRightLeft,
  Radio
} from 'lucide-react';

interface VoiceCoachLabProps {
  onExerciseCompleted: (exerciseId: string) => void;
  syncedAnkiWords: AnkiWord[];
  selectedCardId?: string;
  onOpenCurriculum: () => void;
  onOpenAnchorSession: () => void;
}

export const VoiceCoachLab: React.FC<VoiceCoachLabProps> = ({
  onExerciseCompleted,
  syncedAnkiWords,
  selectedCardId,
  onOpenCurriculum,
  onOpenAnchorSession,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (selectedCardId) {
      const found = NUANCE_CARDS.findIndex(c => c.id === selectedCardId);
      if (found !== -1) return found;
    }
    return 0;
  });

  // Si selectedCardId change de l'extérieur (ex: depuis la vue Curriculum)
  useEffect(() => {
    if (selectedCardId) {
      const found = NUANCE_CARDS.findIndex(c => c.id === selectedCardId);
      if (found !== -1) setCurrentIndex(found);
    }
  }, [selectedCardId]);

  // Onglet actif dans le cours complet :
  // 'theory' = 1. Théorie & Mindset
  // 'dialogue' = 2. Exemples & Dialogue
  // 'practice' = 3. Ateliers Pratiques (Quiz + Sentence Builder)
  // 'voice' = 4. Défi Vocal au Micro
  const [activeTab, setActiveTab] = useState<'theory' | 'dialogue' | 'practice' | 'voice'>('theory');

  // Pinyin masqué par défaut selon la consigne d'immersion
  const [showPinyin, setShowPinyin] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<VoiceEvaluationResult | null>(null);

  // État de l'auto-écoute et du miroir phonétique
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isPlayingMirror, setIsPlayingMirror] = useState(false);
  const [mirrorStage, setMirrorStage] = useState<'native' | 'pause' | 'user' | null>(null);
  const [showPhoneticTips, setShowPhoneticTips] = useState(false);

  // État de validation des ateliers de la leçon
  const [sentenceBuilderCompleted, setSentenceBuilderCompleted] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('fluent_builder_completed');
    return saved ? JSON.parse(saved) : {};
  });

  // Enregistrements d'ancrage cognitif (SRS)
  const [anchoringRecords, setAnchoringRecords] = useState<Record<string, AnchoringRecord>>(() => {
    return getAnchoringRecords();
  });

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  // Références matérielles audio (MediaRecorder)
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const currentCard = NUANCE_CARDS[currentIndex];
  const isSupported = isSpeechRecognitionSupported();
  const currentRecord = anchoringRecords[currentCard.id];
  const dueCards = getCardsDueForReview(NUANCE_CARDS);

  // Vérifier si cette carte contient des mots Anki de l'utilisateur
  const matchedAnkiWords = syncedAnkiWords.filter(w => 
    currentCard.targetChinese.includes(w.hanzi) || 
    (currentCard.additionalExamples && currentCard.additionalExamples.some(ex => ex.chinese.includes(w.hanzi)))
  );

  const isTestPassed = !!currentRecord?.testPassed;
  const isBuilderPassed = !!sentenceBuilderCompleted[currentCard.id];
  const isVoicePassed = (currentRecord?.voiceBestScore || 0) >= 80;
  const isLessonFullyMastered = isTestPassed && isVoicePassed;

  // Arrêter toute lecture en cours (voix native ou audio utilisateur)
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

  // Arrêter l'enregistrement et nettoyer le micro
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
  }, [currentIndex]);

  // Écouter l'audio Putonghua
  const handlePlayAudio = async (text: string, rate: number = 1.0, gender?: 'female' | 'male') => {
    if (isPlayingAudio || isPlayingMirror) {
      stopAllPlayback();
      return;
    }
    stopAllPlayback();
    setIsPlayingAudio(true);
    await playChineseAudio(text, rate, gender);
    setIsPlayingAudio(false);
  };

  // Traiter la réussite du test actif
  const handleTestPassed = () => {
    recordTestSuccess(currentCard.id);
    setAnchoringRecords(getAnchoringRecords());
  };

  // Traiter la réussite de la reconstitution de phrase
  const handleBuilderCompleted = () => {
    const updated = {
      ...sentenceBuilderCompleted,
      [currentCard.id]: true
    };
    setSentenceBuilderCompleted(updated);
    localStorage.setItem('fluent_builder_completed', JSON.stringify(updated));
  };

  // Détecter le format mime audio optimal supporté par le navigateur
  const getSupportedAudioMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg'
    ];
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  };

  // Démarrer la capture vocale (Micro brut avec MediaRecorder + Détection textuelle SpeechRecognition)
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

    // 1. Initialiser MediaRecorder pour la réécoute et le miroir
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const mimeType = getSupportedAudioMimeType();
        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const blobType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
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

    // 2. Initialiser SpeechRecognition
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

    recognition.onerror = () => {
      cleanupRecording();
    };

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

  // Finaliser et évaluer la prononciation
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

    // Mettre à jour le record SRS
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

  // Écouter son propre enregistrement audio
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

    audio.onended = () => {
      setIsPlayingUserAudio(false);
    };
    audio.onerror = () => {
      setIsPlayingUserAudio(false);
    };

    audio.play().catch(e => {
      console.warn("Erreur lecture audio utilisateur :", e);
      setIsPlayingUserAudio(false);
    });
  };

  // Séquence Miroir Phonétique Comparatif (Natif ➔ Toi OU Toi ➔ Natif)
  const handlePlayMirrorComparison = async (mode: 'native-then-user' | 'user-then-native' = 'native-then-user') => {
    if (isPlayingMirror) {
      stopAllPlayback();
      return;
    }
    if (!recordedAudioUrl) return;

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
      await playChineseAudio(currentCard.targetChinese, 1.0);
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
      setCurrentIndex(prev => prev + 1);
      setActiveTab('theory');
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setActiveTab('theory');
    }
  };

  const currentModule = CURRICULUM_MODULES.find(m => m.id === currentCard.moduleId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* 1. HEADER DU COURS AVEC FIL D'ARIANE ET NAVIGATION */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300">
              {currentModule?.title || 'Cours HSK 3-4'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {currentCard.level}
            </span>
            <span className="text-xs font-mono font-bold text-stone-400">
              Leçon {currentIndex + 1} / {NUANCE_CARDS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif leading-tight">
            {currentCard.title}
          </h2>
        </div>

        {/* Boutons d'Action : Syllabus & Flèches de navigation */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
          
          <button
            onClick={onOpenAnchorSession}
            className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border-2 border-stone-900 transition-all shadow-[2px_2px_0px_#1c1917] ${
              dueCards.length > 0
                ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                : 'bg-white text-stone-700 hover:bg-stone-50'
            }`}
            title="Session d'ancrage espacé"
          >
            <Anchor className="w-3.5 h-3.5 text-stone-900" />
            <span>Ancrage</span>
            {dueCards.length > 0 && (
              <span className="bg-stone-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {dueCards.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCurriculum}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-900 text-xs font-bold shadow-[2px_2px_0px_#1c1917] transition-all"
            title="Voir le Syllabus complet des 5 modules"
          >
            <Compass className="w-3.5 h-3.5 text-stone-900" />
            <span className="hidden sm:inline">Syllabus</span>
          </button>

          {/* Navigation Précédent / Suivant */}
          <div className="flex items-center space-x-1 pl-1">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Leçon précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex === NUANCE_CARDS.length - 1}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Leçon suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 2. STATUT DE PROGRESSION DE LA LEÇON (LES 3 JALONS DE VALIDATION) */}
      <div className="p-4 rounded-3xl bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-[#c23b22] text-white flex items-center justify-center font-serif font-black text-base shadow-sm shrink-0">
            {isLessonFullyMastered ? '🌳' : isTestPassed ? '🌿' : '🌱'}
          </div>
          <div>
            <div className="flex items-center space-x-2 font-bold text-stone-900">
              <span>Validation de cette leçon :</span>
              {isLessonFullyMastered ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" /> Ancrée en mémoire durable !
                </span>
              ) : (
                <span className="text-stone-500 font-medium">
                  Valide les ateliers pour sceller l'ancrage
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-1 text-[11px] text-stone-500 font-medium">
              <span className={`flex items-center space-x-1 ${isTestPassed ? 'text-emerald-700 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3 h-3 ${isTestPassed ? 'text-emerald-600' : 'text-stone-300'}`} />
                <span>Quiz Discrimination</span>
              </span>
              <span className={`flex items-center space-x-1 ${isBuilderPassed ? 'text-emerald-700 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3 h-3 ${isBuilderPassed ? 'text-emerald-600' : 'text-stone-300'}`} />
                <span>Ordre des Mots</span>
              </span>
              <span className={`flex items-center space-x-1 ${isVoicePassed ? 'text-emerald-700 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3 h-3 ${isVoicePassed ? 'text-emerald-600' : 'text-stone-300'}`} />
                <span>Défi Micro (≥ 80%)</span>
              </span>
            </div>
          </div>
        </div>

        {currentRecord?.voiceBestScore ? (
          <div className="text-right shrink-0">
            <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Score Oral</span>
            <span className="font-mono text-base font-black text-[#c23b22]">
              {currentRecord.voiceBestScore}%
            </span>
          </div>
        ) : null}
      </div>

      {/* 3. ONGLETS DU COURS COMPLET */}
      <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl text-xs font-bold border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917]">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'theory'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. Théorie & Mindset</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'dialogue'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
          <span>2. Exemples & Dialogue</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'practice'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Puzzle className="w-3.5 h-3.5 text-indigo-400" />
          <span>3. Ateliers Pratiques</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'voice'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-rose-400" />
          <span>4. Défi Vocal</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ONGLET 1 : THÉORIE & MINDSET (LA LEÇON COMPLÈTE)                          */}
      {/* ========================================================================= */}
      {activeTab === 'theory' && (
        <div className="bg-[#fcfaf7] rounded-3xl p-6 sm:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-6 animate-fadeIn">
          
          {/* Formule de Pensée Chinoise */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white border-2 border-stone-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Formule Structurelle Clé (À mémoriser)</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">HSK 3-4</span>
            </div>
            <div className="font-mono text-sm sm:text-base font-black text-amber-200 tracking-wide">
              {currentCard.structuralFormula}
            </div>
          </div>

          {/* Déclic de Pensée Native */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center space-x-1.5">
              <span>💡 Déclic Mental : Pourquoi les Chinois pensent ainsi</span>
            </h4>
            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              {currentCard.keyNuanceExplanation}
            </div>
          </div>

          {/* Piège classique vs Pensée Chinoise */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-200 text-xs sm:text-sm text-rose-950 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-rose-900 font-bold block">Le piège de la traduction mot-à-mot depuis le français :</strong>
              <p className="leading-relaxed">{currentCard.commonTrap}</p>
            </div>
          </div>

          {/* Points de Grammaire Clés & Sous-Règles */}
          {currentCard.rulePoints && currentCard.rulePoints.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                📌 Règles Essentielles & Cas d'Usage Détaillés :
              </h4>
              <div className="space-y-3">
                {currentCard.rulePoints.map((rule, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
                    <strong className="text-xs sm:text-sm font-bold text-stone-900 block font-serif">
                      {rule.pointTitle}
                    </strong>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {rule.explanation}
                    </p>
                    {rule.exampleChinese && (
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-serif font-black text-stone-900 text-sm mr-2">{rule.exampleChinese}</span>
                          <span className="text-stone-500 font-mono text-[11px] mr-2">({rule.examplePinyin})</span>
                          <span className="text-stone-600 italic">→ {rule.exampleFrench}</span>
                        </div>
                        <button
                          onClick={() => rule.exampleChinese && handlePlayAudio(rule.exampleChinese, 0.95)}
                          className="p-1 rounded-lg text-stone-400 hover:text-stone-800 transition-colors shrink-0"
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

          {/* Astuce culturelle & Contexte de communication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
              <span className="font-bold text-stone-800 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c23b22]" />
                <span>Contexte de communication réel :</span>
              </span>
              <p className="text-stone-600 leading-relaxed pl-3.5">
                {currentCard.situationFrench}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start space-x-2.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 font-bold block mb-0.5">Astuce de locuteur natif :</strong>
                <p className="leading-relaxed">{currentCard.culturalNote}</p>
              </div>
            </div>
          </div>

          {/* Bouton pour avancer vers les exemples */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('dialogue')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>Étape suivante : Exemples & Dialogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 2 : EXEMPLES & DIALOGUE (EN CONDITIONS RÉELLES)                     */}
      {/* ========================================================================= */}
      {activeTab === 'dialogue' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-6 animate-fadeIn">
          
          {/* Header */}
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 block">
                Immersion & Écoute Active
              </span>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-serif">
                Exemples en Situation Réelle & Dialogue Spontané
              </h3>
            </div>
            <VoiceSelector compact />
          </div>

          {/* Phrase Modèle Principale */}
          <div className="p-5 rounded-3xl bg-amber-50/60 border-2 border-stone-900 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-bold uppercase tracking-wider text-stone-700">Phrase Modèle d'Élocution :</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePlayAudio(currentCard.targetChinese, 1.0)}
                  className="px-2.5 py-1 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center space-x-1 hover:bg-stone-800 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>1.0x</span>
                </button>
                <button
                  onClick={() => handlePlayAudio(currentCard.targetChinese, 0.8)}
                  className="px-2 py-1 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
                  title="Écouter au ralenti"
                >
                  <Snail className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-stone-900 font-serif chinese-text">
              {currentCard.targetChinese}
            </div>
            <div className="text-xs sm:text-sm font-mono text-stone-500">
              {currentCard.targetPinyin}
            </div>
            <div className="text-xs sm:text-sm text-stone-700 italic border-t border-amber-200/60 pt-2">
              « {currentCard.translationFrench} »
            </div>
          </div>

          {/* Dialogue Réaliste A/B */}
          {currentCard.dialogue && currentCard.dialogue.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center space-x-1.5">
                <MessageSquareQuote className="w-4 h-4 text-[#c23b22]" />
                <span>Mini-Dialogue Oral Spontané :</span>
              </h4>

              <div className="p-4 rounded-2xl bg-[#fcfaf7] border border-stone-200 space-y-3">
                {currentCard.dialogue.map((line, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-stone-100 shadow-2xs">
                    <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {line.speaker}
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-black text-stone-900 font-serif chinese-text">
                          {line.chinese}
                        </span>
                        <button
                          onClick={() => handlePlayAudio(line.chinese, 0.95)}
                          className="p-1 rounded-lg text-stone-400 hover:text-stone-800 transition-colors"
                          title="Écouter cette réplique"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-400 font-mono">{line.pinyin}</p>
                      <p className="text-xs text-stone-600 italic">« {line.translation} »</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exemples Complémentaires Gradués */}
          {currentCard.additionalExamples && currentCard.additionalExamples.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                📚 Autres Exemples Pratiques du Quotidien :
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {currentCard.additionalExamples.map((ex, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-stone-900 font-serif chinese-text">{ex.chinese}</span>
                        {ex.contextNote && (
                          <span className="text-[10px] px-2 py-0.2 rounded-md bg-stone-200 text-stone-700 font-medium">
                            {ex.contextNote}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 font-mono">{ex.pinyin}</p>
                      <p className="text-xs text-stone-600">→ {ex.translation}</p>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(ex.chinese, 0.95)}
                      className="p-2 rounded-xl bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors shrink-0"
                      title="Écouter"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton pour avancer vers les ateliers pratiques */}
          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => setActiveTab('theory')}
              className="text-xs font-bold text-stone-500 hover:text-stone-900"
            >
              ← Revoir la théorie
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>Étape suivante : Ateliers Pratiques</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 3 : ATELIERS PRATIQUES (DISCRIMINATION + PUZZLE SYNTAXIQUE)         */}
      {/* ========================================================================= */}
      {activeTab === 'practice' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Atelier A : Quiz Actif de Discrimination */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Atelier 1 sur 2 : Test de Discrimination Active</span>
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

          {/* Atelier B : Puzzle d'Ordre des Mots (Sentence Builder) */}
          {currentCard.sentenceBuilder && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
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

          {/* Navigation vers le défi oral */}
          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => setActiveTab('dialogue')}
              className="text-xs font-bold text-stone-500 hover:text-stone-900"
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

      {/* ========================================================================= */}
      {/* ONGLET 4 : DÉFI VOCAL AU MICRO (SPONTANÉITÉ ORALE ET VALIDATION)          */}
      {/* ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#c23b22] flex items-center space-x-1.5">
              <Mic className="w-4 h-4" />
              <span>Validation Finale : Pratique de l'Élocution Native</span>
            </span>
            <span className="text-xs font-bold text-stone-500">
              Score requis : ≥ 80%
            </span>
          </div>

          {/* Phrase Cible à Prononcer */}
          <div className="space-y-4 py-2 text-center">
            
            {/* Pinyin (Optionnel / Masqué) */}
            <div className="min-h-[28px] flex items-center justify-center">
              {showPinyin ? (
                <p className="text-sm sm:text-base font-medium text-stone-700 tracking-wide bg-stone-50 px-3.5 py-1 rounded-xl border border-stone-200">
                  {currentCard.targetPinyin}
                </p>
              ) : (
                <span className="text-xs text-stone-400 italic">
                  (Pinyin masqué par défaut pour stimuler la lecture directe des caractères)
                </span>
              )}
            </div>

            {/* Grands Sinogrammes Calligraphiques */}
            <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-stone-900 chinese-text leading-tight select-all py-1 font-serif">
              {currentCard.targetChinese}
            </div>

            {/* Traduction Française */}
            <p className="text-sm text-stone-600 italic">
              « {currentCard.translationFrench} »
            </p>

            {/* Barre d'outils audio & affichage */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors"
              >
                {showPinyin ? <EyeOff className="w-3.5 h-3.5 text-stone-500" /> : <Eye className="w-3.5 h-3.5 text-[#c23b22]" />}
                <span>{showPinyin ? 'Masquer Pinyin' : 'Révéler Pinyin'}</span>
              </button>

              <VoiceSelector compact />

              <button
                onClick={() => handlePlayAudio(currentCard.targetChinese, 1.0)}
                disabled={isPlayingAudio}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Écouter (1.0x)</span>
              </button>

              <button
                onClick={() => handlePlayAudio(currentCard.targetChinese, 0.8)}
                disabled={isPlayingAudio}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors shadow-xs"
              >
                <Snail className="w-3.5 h-3.5 text-amber-600" />
                <span>Ralenti (0.8x)</span>
              </button>
            </div>

          </div>

          {/* Micro Interactif */}
          <div className="pt-4 border-t border-stone-200 flex flex-col items-center justify-center space-y-4">
            
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
                  title={isRecording ? 'Terminer et analyser la prononciation' : 'Activer le micro et parler'}
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
              <p className="text-xs sm:text-sm font-semibold text-stone-700">
                {isRecording ? (
                  <span className="text-[#c23b22] flex items-center justify-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c23b22] animate-ping" />
                    <span>Micro actif — Parle à ton rythme naturel !</span>
                  </span>
                ) : (
                  <span>Clique sur <strong>Parler</strong> et lis la phrase à voix haute en mandarin.</span>
                )}
              </p>

              {liveTranscript && (
                <div className="text-xs text-stone-800 font-mono bg-stone-100 px-3.5 py-1.5 rounded-xl border border-stone-200 inline-block shadow-2xs">
                  <span className="text-stone-400 mr-1.5">Capté :</span>
                  <strong className="text-stone-900">{liveTranscript}</strong>
                </div>
              )}
            </div>

            {/* Bannière Active pendant la lecture miroir */}
            {isPlayingMirror && (
              <div className="w-full max-w-lg mx-auto p-3.5 rounded-2xl border-2 border-stone-900 shadow-md animate-pulse flex items-center justify-center space-x-3 text-xs font-black transition-all bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50">
                {mirrorStage === 'native' && (
                  <span className="flex items-center space-x-2 text-stone-900">
                    <Volume2 className="w-4 h-4 text-amber-600 animate-bounce" />
                    <span>Étape 1/2 : Modèle Natif en écoute... Assimile la courbe des tons !</span>
                  </span>
                )}
                {mirrorStage === 'pause' && (
                  <span className="flex items-center space-x-2 text-stone-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span>Transition acoustique... Prépare ton oreille !</span>
                  </span>
                )}
                {mirrorStage === 'user' && (
                  <span className="flex items-center space-x-2 text-[#c23b22]">
                    <Headphones className="w-4 h-4 text-[#c23b22] animate-bounce" />
                    <span>Étape 2/2 : Ton Enregistrement réel... Repère le contraste !</span>
                  </span>
                )}
              </div>
            )}

            {/* Miroir Phonétique & Réécoute de sa propre voix */}
            {recordedAudioUrl && (
              <div className="w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-stone-50 via-white to-amber-50/40 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-4 animate-fadeIn">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-xs shrink-0">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-sm sm:text-base text-stone-900 flex items-center space-x-2">
                        <span>Miroir Phonétique & Auto-Écoute</span>
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Prise de son prête
                        </span>
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        Écoute ton timbre réel pour dépasser l'illusion osseuse et perfectionner tes tons.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPhoneticTips(!showPhoneticTips)}
                    className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-stone-600 hover:text-stone-900 transition-colors self-start sm:self-auto bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{showPhoneticTips ? 'Masquer repères' : 'Repères des 4 tons'}</span>
                  </button>
                </div>

                {/* 3 Actions Audio : Écouter sa voix / Comparer Miroir / Écouter Correction */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  {/* 1. Écouter son enregistrement réel */}
                  <button
                    onClick={handleTogglePlayUserAudio}
                    className={`p-3 rounded-2xl border-2 border-stone-900 font-black text-xs transition-all shadow-xs flex items-center justify-center space-x-2 ${
                      isPlayingUserAudio && !isPlayingMirror
                        ? 'bg-[#c23b22] text-white shadow-[#c23b22]/30 scale-102'
                        : 'bg-white hover:bg-stone-100 text-stone-900 hover:-translate-y-0.5'
                    }`}
                  >
                    {isPlayingUserAudio && !isPlayingMirror ? (
                      <>
                        <Pause className="w-4 h-4 text-white" />
                        <span>Mettre en pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-[#c23b22] fill-[#c23b22]" />
                        <span>Écouter ma Voix</span>
                      </>
                    )}
                  </button>

                  {/* 2. Comparaison Miroir : Natif ➔ Toi */}
                  <button
                    onClick={() => handlePlayMirrorComparison('native-then-user')}
                    className={`p-3 rounded-2xl border-2 border-stone-900 font-black text-xs transition-all shadow-md flex items-center justify-center space-x-2 ${
                      isPlayingMirror
                        ? 'bg-amber-400 text-stone-950 scale-102 ring-2 ring-amber-500'
                        : 'bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 text-white hover:-translate-y-0.5'
                    }`}
                    title="Joue le modèle natif puis ta voix pour percevoir le décalage"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-amber-300" />
                    <span>Miroir : Natif ➔ Toi</span>
                  </button>

                  {/* 3. Comparaison Correction : Toi ➔ Natif */}
                  <button
                    onClick={() => handlePlayMirrorComparison('user-then-native')}
                    className="p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs transition-all shadow-2xs flex items-center justify-center space-x-2 hover:-translate-y-0.5"
                    title="Joue ta voix puis immédiatement le modèle natif pour entendre la correction"
                  >
                    <Volume2 className="w-4 h-4 text-stone-600" />
                    <span>Correction : Toi ➔ Natif</span>
                  </button>

                </div>

                {/* Explication pédagogique sur l'illusion osseuse et repères de tons */}
                {showPhoneticTips && (
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-center space-x-1.5 text-stone-900 font-bold font-serif">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pourquoi a-t-on l'impression de bien prononcer quand on parle ?</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Quand on parle, les vibrations se propagent par les os du crâne (<strong>conduction osseuse</strong>). Ce phénomène amplifie les basses et adoucit inconsciemment nos erreurs de tons. En réécoutant l'enregistrement (<strong>conduction aérienne</strong>), on entend exactement la mélodie que perçoit un natif chinois !
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                      <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                        <strong className="block text-stone-900 font-serif">1er Ton (55)</strong>
                        <span className="text-stone-500 text-[10px]">Haut et plat comme une note tenue. Ne baisse pas !</span>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                        <strong className="block text-stone-900 font-serif">2ème Ton (35)</strong>
                        <span className="text-stone-500 text-[10px]">Monte vite et franchement (« Hein ?! »).</span>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                        <strong className="block text-stone-900 font-serif">3ème Ton (214)</strong>
                        <span className="text-stone-500 text-[10px]">Plonge dans les graves avant de remonter.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                        <strong className="block text-stone-900 font-serif">4ème Ton (51)</strong>
                        <span className="text-stone-500 text-[10px]">Chute sèche et nette comme un ordre.</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Résultat d'analyse phonétique caractère par caractère */}
          {evaluation && (
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-4 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Résultat de ton élocution :
                  </span>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">
                    {evaluation.feedbackMessage}
                  </p>
                  {evaluation.spokenText && (
                    <p className="text-xs text-stone-500 mt-1 font-mono">
                      Prononcé : « {evaluation.spokenText} »
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#c23b22]">
                      {evaluation.accuracyScore}%
                    </span>
                    <span className="text-[10px] text-stone-500 block">Précision</span>
                  </div>

                  <button
                    onClick={startRecording}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors shadow-xs"
                    title="Réessayer immédiatement"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Badges de décomposition des caractères */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-stone-600 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Analyse détaillée (Vert = réussi / Rouge = à clarifier) :</span>
                </span>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  {evaluation.matchedCharacters.map((mc, idx) => (
                    <div
                      key={idx}
                      className={`w-9 h-11 rounded-xl flex flex-col items-center justify-center font-bold chinese-text text-base border transition-all ${
                        mc.status === 'correct'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      <span>{mc.char}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Si réussite >= 80% : Célébration et invitation à la suite */}
              {evaluation.accuracyScore >= 80 && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="text-sm font-black block font-serif">太棒了 ! Leçon Validée et Ancrée !</strong>
                      <span className="text-xs text-emerald-800">Tu as assimilé la structure avec fluidité.</span>
                    </div>
                  </div>

                  {currentIndex < NUANCE_CARDS.length - 1 && (
                    <button
                      onClick={nextCard}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0"
                    >
                      <span>Passer à la leçon suivante</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 4. NAVIGATION BASSE & RACCOURCIS */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="inline-flex items-center space-x-1 hover:text-stone-900 disabled:opacity-20 transition-colors font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Leçon précédente</span>
        </button>

        <span className="text-[11px] text-stone-400 hidden sm:inline">
          💡 Objectif : Théorie ➔ Dialogue ➔ Ateliers ➔ Défi Oral pour ancrer chaque automatisme
        </span>

        <button
          onClick={nextCard}
          disabled={currentIndex === NUANCE_CARDS.length - 1}
          className="inline-flex items-center space-x-1 hover:text-stone-900 disabled:opacity-20 transition-colors font-bold"
        >
          <span>Leçon suivante</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
