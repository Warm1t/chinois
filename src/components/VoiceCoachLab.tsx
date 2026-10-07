import React, { useState, useEffect, useRef } from 'react';
import { 
  EVERYDAY_PHRASES, 
  EVERYDAY_CATEGORIES, 
  EverydayPhrase 
} from '../data/everydayPhrasesData';
import { 
  playChineseAudio, 
  stopChineseAudio, 
  evaluatePronunciation, 
  isSpeechRecognitionSupported,
  getVoiceGenderPreference,
  VoiceGenderPreference
} from '../utils/speechUtils';
import { analyzePronunciationWithAi, AiPronunciationFeedback } from '../utils/aiPronunciationCoach';
import { VoiceSelector } from './VoiceSelector';
import { VoiceEvaluationResult } from '../types/fluent';
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
  Sparkles,
  Search,
  Shuffle,
  Headphones,
  ArrowRightLeft,
  Play,
  Pause,
  HelpCircle,
  Award,
  Zap,
  Gauge
} from 'lucide-react';

interface VoiceCoachLabProps {
  onPracticeCompleted?: (phraseId: string, score: number) => void;
}

export const VoiceCoachLab: React.FC<VoiceCoachLabProps> = ({
  onPracticeCompleted,
}) => {
  // Catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Index de la phrase active dans la liste filtrée
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);

  // Vitesse de lecture audio : 0.5 (Ultra-lente), 0.85 (Base ralentie recommandée), 1.0 (Normale)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);

  // Affichage du pinyin (masqué par défaut pour stimuler les sinogrammes)
  const [showPinyin, setShowPinyin] = useState(false);
  const [showPhoneticGuide, setShowPhoneticGuide] = useState(false);

  // États audio & enregistrement
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<VoiceEvaluationResult | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AiPronunciationFeedback | null>(null);

  // Auto-écoute (MediaRecorder)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isPlayingMirror, setIsPlayingMirror] = useState(false);
  const [mirrorStage, setMirrorStage] = useState<'native' | 'pause' | 'user' | null>(null);

  // Scores sauvegardés dans le stockage local
  const [phraseScores, setPhraseScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('fluent_voice_lab_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const isSupported = isSpeechRecognitionSupported();

  // Filtrage des phrases
  const filteredPhrases = EVERYDAY_PHRASES.filter(phrase => {
    const matchesCategory = selectedCategory === 'all' || phrase.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      phrase.hanzi.includes(query) ||
      phrase.pinyin.toLowerCase().includes(query) ||
      phrase.french.toLowerCase().includes(query) ||
      phrase.situation.toLowerCase().includes(query)
    );
  });

  // Phrase courante
  const currentPhrase: EverydayPhrase = filteredPhrases[activePhraseIndex] || filteredPhrases[0] || EVERYDAY_PHRASES[0];

  // Nettoyage audio et micro
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

  const resetPhraseSession = () => {
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
    resetPhraseSession();
    return () => {
      cleanupRecording();
      stopAllPlayback();
    };
  }, [currentPhrase?.id]);

  // Si le filtre change et réduit la taille de la liste
  useEffect(() => {
    if (activePhraseIndex >= filteredPhrases.length) {
      setActivePhraseIndex(0);
    }
  }, [filteredPhrases.length]);

  // Écouter l'audio Putonghua avec vitesse choisie
  const handlePlayAudio = async (text: string, speedOverride?: number) => {
    if (isPlayingAudio || isPlayingMirror) {
      stopAllPlayback();
      return;
    }
    stopAllPlayback();
    setIsPlayingAudio(true);
    const speed = speedOverride ?? playbackSpeed;
    await playChineseAudio(text, speed);
    setIsPlayingAudio(false);
  };

  // Lancement de l'enregistrement micro
  const startRecording = async () => {
    if (!isSupported) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Essaie sur Google Chrome, Edge ou Safari !");
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

    // MediaRecorder pour la capture audio brute
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

    // SpeechRecognition pour l'alignement textuel
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
      }, 3500);
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

  // Évaluation de la prononciation avec le moteur IA d'alignement phonétique
  const finalizeRecording = () => {
    const spoken = accumulatedTranscriptRef.current || liveTranscript;
    cleanupRecording();

    if (!spoken.trim()) {
      setAiFeedback(null);
      setEvaluation({
        spokenText: '',
        accuracyScore: 0,
        matchedCharacters: [],
        feedbackMessage: "Aucun son capté. Autorise le micro et prononce la phrase distinctement.",
        isPerfect: false,
      });
      return;
    }

    // Analyse IA de la prononciation (Needleman-Wunsch + détection des tons & confusions)
    const feedback = analyzePronunciationWithAi(spoken, currentPhrase.hanzi);
    setAiFeedback(feedback);

    const evalResult: VoiceEvaluationResult = {
      spokenText: feedback.spokenText,
      accuracyScore: feedback.accuracyScore,
      matchedCharacters: feedback.characterBreakdown
        .filter(b => b.targetChar || b.spokenChar)
        .map(b => ({
          char: b.targetChar || b.spokenChar || '',
          status: b.status === 'exact' ? 'correct' : 'incorrect',
        })),
      feedbackMessage: feedback.aiDiagnosis,
      isPerfect: feedback.isPassed,
    };
    setEvaluation(evalResult);

    // Enregistrer la réussite uniquement si le test IA est validé sans complaisance
    if (feedback.isPassed) {
      const currentBest = phraseScores[currentPhrase.id] || 0;
      if (feedback.accuracyScore > currentBest) {
        const updatedScores = {
          ...phraseScores,
          [currentPhrase.id]: feedback.accuracyScore
        };
        setPhraseScores(updatedScores);
        try {
          localStorage.setItem('fluent_voice_lab_scores', JSON.stringify(updatedScores));
        } catch {}
      }

      if (onPracticeCompleted) {
        onPracticeCompleted(currentPhrase.id, feedback.accuracyScore);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      finalizeRecording();
    } else {
      startRecording();
    }
  };

  // Réécouter sa propre voix
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

  // Miroir Phonétique Comparatif
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
      await playChineseAudio(currentPhrase.hanzi, playbackSpeed);
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

  // Navigation dans les phrases
  const nextPhrase = () => {
    if (activePhraseIndex < filteredPhrases.length - 1) {
      setActivePhraseIndex(prev => prev + 1);
    } else {
      setActivePhraseIndex(0);
    }
  };

  const prevPhrase = () => {
    if (activePhraseIndex > 0) {
      setActivePhraseIndex(prev => prev - 1);
    } else {
      setActivePhraseIndex(filteredPhrases.length - 1);
    }
  };

  const pickRandomPhrase = () => {
    if (filteredPhrases.length <= 1) return;
    let randomIndex = activePhraseIndex;
    while (randomIndex === activePhraseIndex) {
      randomIndex = Math.floor(Math.random() * filteredPhrases.length);
    }
    setActivePhraseIndex(randomIndex);
  };

  // Statistiques du Labo Vocal
  const masteredCount = Object.values(phraseScores).filter(s => s >= 80).length;
  const currentBestScore = phraseScores[currentPhrase?.id] || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* 1. HEADER DU LABO VOCAL */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-[#c23b22]/10 text-[#c23b22]">
                <Mic className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#c23b22]">
                Labo Vocal • Entraînement Oral Direct
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif leading-tight">
              Phrases Courantes & Correction Instantanée
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Lis à voix haute les phrases de la vie de tous les jours en Chine, réécoute-toi et affine tes tons.
            </p>
          </div>

          {/* Jauge des phrases maîtrisées */}
          <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl flex items-center space-x-3 shrink-0 self-start sm:self-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shadow-2xs">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">
                {masteredCount} / {EVERYDAY_PHRASES.length} maîtrisées (≥ 80%)
              </span>
              <span className="text-[10px] text-stone-500">
                Pratique orale spontanée
              </span>
            </div>
          </div>
        </div>

        {/* 2. CONTRÔLES VOCAUX : VOIX HOMME/FEMME & VITESSE (0.5x, 0.85x, 1.0x) */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Sélecteur de Voix Naturelle */}
          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-bold text-[11px] uppercase tracking-wider">
              Voix :
            </span>
            <VoiceSelector compact />
          </div>

          {/* Sélecteur de Vitesse avec 0.5x Ultra-lent et 0.85x Vitesse de base ralentie */}
          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-stone-400" />
              <span>Vitesse de lecture :</span>
            </span>

            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
              <button
                onClick={() => setPlaybackSpeed(0.5)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs flex items-center space-x-1 ${
                  playbackSpeed === 0.5
                    ? 'bg-amber-400 text-stone-950 shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Vitesse ultra-lente : décompose chaque ton et consonne"
              >
                <Snail className="w-3 h-3 text-stone-900" />
                <span>0.5x (Ultra-lente)</span>
              </button>

              <button
                onClick={() => setPlaybackSpeed(0.85)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs flex items-center space-x-1 ${
                  playbackSpeed === 0.85
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Vitesse de base ralentie : rythme d'apprentissage confortable"
              >
                <span>0.85x (Base)</span>
              </button>

              <button
                onClick={() => setPlaybackSpeed(1.0)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs flex items-center space-x-1 ${
                  playbackSpeed === 1.0
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Vitesse normale fluide d'un locuteur natif"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>1.0x (Normale)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 3. FILTRES THÉMATIQUES & RECHERCHE */}
      <div className="space-y-3">
        
        {/* Pilules de catégories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {EVERYDAY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActivePhraseIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Barre de recherche et bouton Aléatoire */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActivePhraseIndex(0);
              }}
              placeholder="Rechercher une situation (ex: resto, taxi, wifi, commander, mal de tête...)"
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-2xs"
            />
          </div>

          <button
            onClick={pickRandomPhrase}
            className="inline-flex items-center space-x-1 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 shadow-2xs transition-colors shrink-0"
            title="Tirer une phrase au sort pour tester tes réflexes"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-600" />
            <span>Aléatoire</span>
          </button>
        </div>

      </div>

      {/* 4. CARTE PRINCIPALE DE LA PHRASE À PRATIQUER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-6 animate-fadeIn">
        
        {/* Navigation & Thème */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-base">{currentPhrase.categoryIcon}</span>
            <span className="font-bold text-xs text-stone-900">
              {currentPhrase.categoryLabel}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 text-xs">
              {currentPhrase.situation}
            </span>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <span className="text-xs font-mono font-bold text-stone-400">
              {activePhraseIndex + 1} / {filteredPhrases.length}
            </span>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={prevPhrase}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="Phrase précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextPhrase}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="Phrase suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Phrase Chinoise (Pinyin + Hanzi + Français) */}
        <div className="space-y-4 py-2 text-center">
          
          {/* Pinyin (Optionnel / Masquable) */}
          <div className="min-h-[28px] flex items-center justify-center">
            {showPinyin ? (
              <p className="text-sm sm:text-base font-medium text-stone-700 tracking-wide bg-stone-50 px-4 py-1.5 rounded-xl border border-stone-200 inline-block">
                {currentPhrase.pinyin}
              </p>
            ) : (
              <span className="text-xs text-stone-400 italic">
                (Pinyin masqué • Clique sur « Révéler Pinyin » si besoin)
              </span>
            )}
          </div>

          {/* Grands Sinogrammes Calligraphiques */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-stone-900 chinese-text leading-relaxed select-all py-1 font-serif">
            {currentPhrase.hanzi}
          </div>

          {/* Traduction Française */}
          <p className="text-sm sm:text-base text-stone-700 italic max-w-xl mx-auto">
            « {currentPhrase.french} »
          </p>

          {/* Astuce de locuteur natif si disponible */}
          {currentPhrase.tip && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{currentPhrase.tip}</span>
            </div>
          )}

          {/* Barre d'outils audio & affichage */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors"
            >
              {showPinyin ? <EyeOff className="w-3.5 h-3.5 text-stone-500" /> : <Eye className="w-3.5 h-3.5 text-[#c23b22]" />}
              <span>{showPinyin ? 'Masquer Pinyin' : 'Révéler Pinyin'}</span>
            </button>

            {/* Écouter à la vitesse active */}
            <button
              onClick={() => handlePlayAudio(currentPhrase.hanzi)}
              disabled={isPlayingAudio}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>Écouter ({playbackSpeed}x)</span>
            </button>

            {/* Raccourci direct 0.5x ultra-lent */}
            <button
              onClick={() => handlePlayAudio(currentPhrase.hanzi, 0.5)}
              disabled={isPlayingAudio}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors shadow-2xs"
              title="Écouter au ralenti ultra-lent pour bien dissocier les tons"
            >
              <Snail className="w-3.5 h-3.5 text-amber-600" />
              <span>Ultra-lent (0.5x)</span>
            </button>
          </div>

        </div>

        {/* 5. MICROPHONE INTERACTIF : ENREGISTREMENT & RECONNAISSANCE */}
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
                title={isRecording ? 'Terminer et évaluer' : 'Activer le micro et lire la phrase'}
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

          <div className="text-center space-y-1 max-w-md">
            <p className="text-xs sm:text-sm font-semibold text-stone-700">
              {isRecording ? (
                <span className="text-[#c23b22] flex items-center justify-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c23b22] animate-ping" />
                  <span>Micro ouvert — Lis la phrase à voix haute !</span>
                </span>
              ) : (
                <span>Appuie sur <strong>Parler</strong> et lis la phrase en mandarin.</span>
              )}
            </p>

            {liveTranscript && (
              <div className="text-xs text-stone-800 font-mono bg-stone-100 px-3.5 py-1.5 rounded-xl border border-stone-200 inline-block shadow-2xs">
                <span className="text-stone-400 mr-1.5">Capté en direct :</span>
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
                  <span>1/2 : Modèle Natif en écoute... Mémorise la hauteur des tons !</span>
                </span>
              )}
              {mirrorStage === 'pause' && (
                <span className="flex items-center space-x-2 text-stone-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span>Transition acoustique...</span>
                </span>
              )}
              {mirrorStage === 'user' && (
                <span className="flex items-center space-x-2 text-[#c23b22]">
                  <Headphones className="w-4 h-4 text-[#c23b22] animate-bounce" />
                  <span>2/2 : Ta Voix réelle... Repère la différence avec le modèle !</span>
                </span>
              )}
            </div>
          )}

          {/* 6. AUTO-ÉCOUTE & MIROIR PHONÉTIQUE (S'ÉCOUTER SOI-MÊME) */}
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
                        Enregistrement prêt
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-600">
                      Écoute ton timbre réel pour dépasser l'illusion osseuse et vérifier tes tons.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPhoneticGuide(!showPhoneticGuide)}
                  className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-stone-600 hover:text-stone-900 transition-colors self-start sm:self-auto bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showPhoneticGuide ? 'Masquer' : 'Repères des tons'}</span>
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
                      <span>Pause</span>
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
                  title="Joue d'abord le modèle natif puis ta voix pour repérer le décalage"
                >
                  <ArrowRightLeft className="w-4 h-4 text-amber-300" />
                  <span>Miroir : Natif ➔ Toi</span>
                </button>

                {/* 3. Comparaison Correction : Toi ➔ Natif */}
                <button
                  onClick={() => handlePlayMirrorComparison('user-then-native')}
                  className="p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs transition-all shadow-2xs flex items-center justify-center space-x-2 hover:-translate-y-0.5"
                  title="Joue ta voix puis le modèle pour entendre la correction"
                >
                  <Volume2 className="w-4 h-4 text-stone-600" />
                  <span>Correction : Toi ➔ Natif</span>
                </button>

              </div>

              {/* Guide des tons */}
              {showPhoneticGuide && (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 text-stone-900 font-bold font-serif">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pourquoi a-t-on l'impression de bien prononcer ?</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Par la conduction osseuse du crâne, on entend sa voix plus grave et on compense inconsciemment ses erreurs. En s'écoutant dans le miroir, on entend exactement la mélodie que perçoit un locuteur natif !
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="block text-stone-900 font-serif">1er Ton (55)</strong>
                      <span className="text-stone-500 text-[10px]">Haut et plat, ne chute pas !</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="block text-stone-900 font-serif">2ème Ton (35)</strong>
                      <span className="text-stone-500 text-[10px]">Monte franc (« Hein ?! »).</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="block text-stone-900 font-serif">3ème Ton (214)</strong>
                      <span className="text-stone-500 text-[10px]">Plonge bien dans les graves.</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="block text-stone-900 font-serif">4ème Ton (51)</strong>
                      <span className="text-stone-500 text-[10px]">Chute sèche comme un ordre !</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* 7. DIAGNOSTIC IA & CORRECTION PHONÉTIQUE INTELLIGENTE */}
        {(aiFeedback || evaluation) && (
          <div className="mt-4 pt-4 border-t border-stone-200 space-y-4 animate-fadeIn">
            
            {/* Carte Diagnostic Coach IA */}
            <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 ${
              (aiFeedback?.isPassed ?? evaluation!.accuracyScore >= 80)
                ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950'
                : (evaluation!.accuracyScore >= 50)
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950'
            }`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded-lg bg-stone-900 text-white text-[10px] font-bold font-mono uppercase">
                      🤖 Diagnostic IA
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {aiFeedback?.summaryTitle || "Analyse de la prononciation"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {aiFeedback?.aiDiagnosis || evaluation!.feedbackMessage}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-auto">
                  <div className="text-right">
                    <span className={`text-2xl sm:text-3xl font-black ${
                      (aiFeedback?.isPassed ?? evaluation!.accuracyScore >= 80)
                        ? 'text-emerald-700'
                        : (evaluation!.accuracyScore >= 50)
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}>
                      {evaluation!.accuracyScore}%
                    </span>
                    <span className="text-[10px] text-stone-500 block font-bold uppercase">
                      {(aiFeedback?.isPassed ?? evaluation!.accuracyScore >= 80) ? 'Validé ✓' : 'Précision'}
                    </span>
                  </div>

                  <button
                    onClick={startRecording}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 transition-colors shadow-2xs"
                    title="Réessayer immédiatement"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conseil ciblé du Coach IA */}
              {aiFeedback?.actionableTip && (
                <div className="flex items-start space-x-2 text-xs font-medium bg-white/80 p-3 rounded-2xl border border-stone-200/80">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-bold">Conseil du Coach IA pour progresser :</strong>
                    <span className="text-stone-700">{aiFeedback.actionableTip}</span>
                  </div>
                </div>
              )}

              {/* Comparatif Cible vs Capté */}
              {evaluation?.spokenText && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-white/70 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Phrase Cible Attendue :</span>
                    <strong className="text-stone-900 font-serif chinese-text text-sm">{currentPhrase.hanzi}</strong>
                    <span className="text-stone-500 font-mono text-[11px] ml-1.5">({currentPhrase.pinyin})</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Capté par le micro :</span>
                    <strong className="text-stone-900 font-serif chinese-text text-sm">« {evaluation.spokenText} »</strong>
                  </div>
                </div>
              )}

            </div>

            {/* Décomposition Phonétique Détaillée */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Alignement phonétique caractère par caractère :</span>
                </span>
                <span className="text-[11px] text-stone-400">
                  Vert = Exact • Orange = Confusion de ton • Rouge = Omis
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {(aiFeedback?.characterBreakdown || evaluation!.matchedCharacters.map(m => ({
                  targetChar: m.char,
                  status: m.status === 'correct' ? ('exact' as const) : ('substituted' as const),
                  explanation: undefined as string | undefined,
                }))).map((charItem, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                      charItem.status === 'exact'
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                        : charItem.status === 'substituted'
                        ? 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs'
                        : charItem.status === 'omitted'
                        ? 'bg-rose-50 text-rose-950 border-rose-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black font-serif chinese-text">
                        {charItem.targetChar || '—'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md font-mono">
                        {charItem.status === 'exact' && '✓ Exact'}
                        {charItem.status === 'substituted' && '⚠️ Confondu'}
                        {charItem.status === 'omitted' && '❌ Omis'}
                        {charItem.status === 'extra' && '+ Ajout'}
                      </span>
                    </div>

                    {'explanation' in charItem && charItem.explanation && (
                      <p className="text-[10px] mt-1 text-stone-600 leading-tight">
                        {charItem.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Célébration si score >= 80% ET validé par l'IA */}
            {(aiFeedback?.isPassed ?? evaluation!.accuracyScore >= 80) && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-xs">
                <div className="flex items-center space-x-2.5">
                  <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-sm font-black block font-serif">太棒了 ! Phrase Validée sans Complaisance !</strong>
                    <span className="text-xs text-emerald-800">Rythme, articulation et tons conformes au mandarin authentique.</span>
                  </div>
                </div>

                <button
                  onClick={nextPhrase}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0 hover:translate-x-0.5"
                >
                  <span>Phrase suivante</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 8. NAVIGATION BASSE */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
        <button
          onClick={prevPhrase}
          className="inline-flex items-center space-x-1 hover:text-stone-900 transition-colors font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Phrase précédente</span>
        </button>

        <span className="text-[11px] text-stone-400 hidden sm:inline">
          💡 Écoute à 0.5x pour décomposer les tons ➔ Répète au micro ➔ Compare dans le miroir
        </span>

        <button
          onClick={nextPhrase}
          className="inline-flex items-center space-x-1 hover:text-stone-900 transition-colors font-bold"
        >
          <span>Phrase suivante</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
