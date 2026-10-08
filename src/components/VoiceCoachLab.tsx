import React, { useState, useEffect, useRef } from 'react';
import { 
  EVERYDAY_PHRASES, 
  EVERYDAY_CATEGORIES, 
  EverydayPhrase,
  getCustomVoicePhrases,
  saveCustomVoicePhrase,
  deleteCustomVoicePhrase,
  convertAnkiWordToVoicePhrase
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
import { saveWordToLocalAnki, isWordInLocalAnki, getLocalAnkiWords } from '../utils/ankiConnect';
import { triggerAutoSyncToCloud } from '../utils/cloudSyncUtils';
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
  Gauge,
  Plus,
  BookmarkCheck,
  Trash2,
  X,
  BookOpen
} from 'lucide-react';

interface VoiceCoachLabProps {
  onPracticeCompleted?: (phraseId: string, score: number) => void;
  customPracticePhrase?: EverydayPhrase | null;
  onClearCustomPhrase?: () => void;
}

export const VoiceCoachLab: React.FC<VoiceCoachLabProps> = ({
  onPracticeCompleted,
  customPracticePhrase,
  onClearCustomPhrase,
}) => {
  // Phrases personnalisées ajoutées par l'utilisateur
  const [customPhrases, setCustomPhrases] = useState<EverydayPhrase[]>(() => getCustomVoicePhrases());
  // Cartes Anki converties en phrases pour le labo vocal
  const [ankiPhrases, setAnkiPhrases] = useState<EverydayPhrase[]>(() => {
    return getLocalAnkiWords().map(convertAnkiWordToVoicePhrase);
  });

  // Modal d'ajout de phrase / mot
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newHanzi, setNewHanzi] = useState<string>('');
  const [newPinyin, setNewPinyin] = useState<string>('');
  const [newFrench, setNewFrench] = useState<string>('');
  const [newSituation, setNewSituation] = useState<string>('');
  const [newTip, setNewTip] = useState<string>('');
  const [addToAnkiToo, setAddToAnkiToo] = useState<boolean>(true);

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

  const isRecordingRef = useRef<boolean>(false);
  const isStartingRef = useRef<boolean>(false);

  // État Anki pour la phrase courante
  const [isInAnki, setIsInAnki] = useState<boolean>(false);
  const [ankiToast, setAnkiToast] = useState<string | null>(null);

  const isSupported = isSpeechRecognitionSupported();

  // Écouter les changements des phrases personnalisées
  useEffect(() => {
    const handleCustomChange = () => {
      setCustomPhrases(getCustomVoicePhrases());
    };
    window.addEventListener('fluent_custom_voice_phrases_changed', handleCustomChange);
    return () => window.removeEventListener('fluent_custom_voice_phrases_changed', handleCustomChange);
  }, []);

  // Écouter les changements de cartes Anki
  useEffect(() => {
    const handleAnkiCardsChange = () => {
      setAnkiPhrases(getLocalAnkiWords().map(convertAnkiWordToVoicePhrase));
    };
    window.addEventListener('fluent_anki_words_changed', handleAnkiCardsChange);
    return () => window.removeEventListener('fluent_anki_words_changed', handleAnkiCardsChange);
  }, []);

  // Liste source selon la catégorie sélectionnée
  const sourcePhrases = React.useMemo(() => {
    const allList = [...customPhrases, ...EVERYDAY_PHRASES];
    if (selectedCategory === 'mastered') {
      return allList.filter(phrase => (phraseScores[phrase.id] || 0) >= 80);
    }
    if (selectedCategory === 'to_practice') {
      return allList.filter(phrase => (phraseScores[phrase.id] || 0) < 80);
    }
    if (selectedCategory === 'custom') {
      return customPhrases;
    }
    if (selectedCategory === 'anki') {
      return ankiPhrases;
    }
    if (selectedCategory === 'all') {
      return allList;
    }
    return allList.filter(phrase => phrase.category === selectedCategory);
  }, [selectedCategory, customPhrases, ankiPhrases, phraseScores]);

  // Filtrage des phrases avec recherche
  const filteredPhrases = React.useMemo(() => {
    if (!searchQuery.trim()) return sourcePhrases;
    const query = searchQuery.toLowerCase().trim();
    return sourcePhrases.filter(phrase => {
      return (
        phrase.hanzi.includes(query) ||
        phrase.pinyin.toLowerCase().includes(query) ||
        phrase.french.toLowerCase().includes(query) ||
        phrase.situation.toLowerCase().includes(query)
      );
    });
  }, [sourcePhrases, searchQuery]);

  // Phrase courante
  const currentPhrase: EverydayPhrase | null = customPracticePhrase 
    || filteredPhrases[activePhraseIndex] 
    || filteredPhrases[0] 
    || (EVERYDAY_PHRASES[0] as EverydayPhrase);

  useEffect(() => {
    if (currentPhrase) {
      setIsInAnki(isWordInLocalAnki(currentPhrase.hanzi));
    }
  }, [currentPhrase?.hanzi]);

  useEffect(() => {
    const handleAnkiChange = () => {
      if (currentPhrase) {
        setIsInAnki(isWordInLocalAnki(currentPhrase.hanzi));
      }
    };
    window.addEventListener('fluent_anki_words_changed', handleAnkiChange);
    return () => window.removeEventListener('fluent_anki_words_changed', handleAnkiChange);
  }, [currentPhrase?.hanzi]);

  useEffect(() => {
    const handleScoresChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ scores?: Record<string, number> }>;
      if (customEvent.detail && customEvent.detail.scores) {
        setPhraseScores(customEvent.detail.scores);
      } else {
        const saved = localStorage.getItem('fluent_voice_lab_scores');
        if (saved) {
          try {
            setPhraseScores(JSON.parse(saved));
          } catch {}
        }
      }
    };
    window.addEventListener('fluent_voice_lab_scores_changed', handleScoresChange);
    return () => window.removeEventListener('fluent_voice_lab_scores_changed', handleScoresChange);
  }, []);

  const handleSaveToAnki = () => {
    if (!currentPhrase) return;
    const res = saveWordToLocalAnki({
      hanzi: currentPhrase.hanzi,
      pinyin: currentPhrase.pinyin,
      translation: currentPhrase.french,
      deckName: 'Fluent',
      source: 'fluent_to_anki',
    });
    setIsInAnki(true);
    setAnkiToast(res.isNew ? `✨ Phrase ajoutée à ton paquet Anki "Fluent" (${res.totalCount} cartes) !` : `✓ Déjà dans ton Anki !`);
    setTimeout(() => setAnkiToast(null), 3000);
  };

  const handleCreateCustomPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHanzi.trim()) return;

    const saved = saveCustomVoicePhrase({
      hanzi: newHanzi.trim(),
      pinyin: newPinyin.trim(),
      french: newFrench.trim() || 'Pratique orale personnalisée',
      situation: newSituation.trim() || 'Ajouté par toi au labo vocal',
      tip: newTip.trim() || undefined,
    });

    if (addToAnkiToo) {
      saveWordToLocalAnki({
        hanzi: newHanzi.trim(),
        pinyin: newPinyin.trim(),
        translation: newFrench.trim() || 'Pratique orale personnalisée',
        deckName: 'Fluent',
        source: 'fluent_to_anki',
      });
    }

    triggerAutoSyncToCloud();
    setSelectedCategory('custom');
    setSearchQuery('');
    setActivePhraseIndex(0);
    setIsAddModalOpen(false);
    setNewHanzi('');
    setNewPinyin('');
    setNewFrench('');
    setNewSituation('');
    setNewTip('');
    setAnkiToast(`✨ "${saved.hanzi}" ajouté à tes phrases du Labo Vocal !`);
    setTimeout(() => setAnkiToast(null), 3500);
  };

  const handleDeleteCurrentPhrase = () => {
    if (!currentPhrase?.isCustom) return;
    if (window.confirm(`Supprimer "${currentPhrase.hanzi}" de tes phrases personnalisées ?`)) {
      deleteCustomVoicePhrase(currentPhrase.id);
      triggerAutoSyncToCloud();
      setActivePhraseIndex(0);
      setAnkiToast(`Phrase supprimée de tes ajouts.`);
      setTimeout(() => setAnkiToast(null), 2500);
    }
  };

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

  const getSupportedVoiceMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac'];
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return '';
  };

  const cleanupRecording = () => {
    isRecordingRef.current = false;
    isStartingRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    let wasRecording = false;
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          wasRecording = true;
          mediaRecorderRef.current.stop();
        }
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current && !wasRecording) {
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
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }
    setEvaluation(null);
    setAiFeedback(null);
    setLiveTranscript('');
    accumulatedTranscriptRef.current = '';
    audioChunksRef.current = [];
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

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      if (userAudioPlayerRef.current) {
        try {
          userAudioPlayerRef.current.pause();
        } catch (e) {}
      }
    };
  }, [recordedAudioUrl]);

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

  // Lancement de l'enregistrement micro avec protection anti-crash et verrouillage
  const startRecording = async () => {
    if (!isSupported) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Essaie sur Google Chrome, Edge ou Safari !");
      return;
    }

    if (isStartingRef.current || isRecordingRef.current) {
      return;
    }
    isStartingRef.current = true;

    try {
      cleanupRecording();
      stopAllPlayback();

      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
        setRecordedAudioUrl(null);
      }

      setLiveTranscript('');
      setEvaluation(null);
      setAiFeedback(null);
      accumulatedTranscriptRef.current = '';
      audioChunksRef.current = [];

      // MediaRecorder pour la capture audio brute
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          const mimeType = getSupportedVoiceMimeType();
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
            if (mediaStreamRef.current) {
              try {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
              } catch (e) {}
              mediaStreamRef.current = null;
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
      if (!SpeechRecognition) {
        throw new Error("SpeechRecognition non supporté");
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }
        const combined = fullTranscript.trim();
        setLiveTranscript(combined);
        accumulatedTranscriptRef.current = combined;

        // Marge de confort : 8 secondes complètes de silence avant finalisation automatique,
        // ou l'utilisateur clique sur le bouton pour évaluer quand il est prêt.
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (isRecordingRef.current) {
            finalizeRecording();
          }
        }, 8000);
      };

      recognition.onerror = (err: any) => {
        console.warn("SpeechRecognition event:", err);
        // Si c'est juste une pause respiratoire ('no-speech'), NE PAS couper l'enregistrement !
        if (err?.error === 'no-speech') {
          return;
        }
        if (err?.error === 'not-allowed' || err?.error === 'service-not-allowed') {
          cleanupRecording();
        }
      };

      recognition.onend = () => {
        // Dans Chrome, la reconnaissance s'arrête parfois dès un silence d'une seconde.
        // On la relance en douceur pour laisser le temps de réfléchir et parler sans stress.
        if (isRecordingRef.current && recognitionRef.current) {
          setTimeout(() => {
            if (isRecordingRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Ignore si déjà actif ou en transition audio
              }
            }
          }, 120);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      isRecordingRef.current = true;
      setIsRecording(true);
    } catch (err) {
      console.error("Erreur lancement enregistrement:", err);
      cleanupRecording();
    } finally {
      isStartingRef.current = false;
    }
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
          window.dispatchEvent(new CustomEvent('fluent_voice_lab_scores_changed', { detail: { scores: updatedScores } }));
          triggerAutoSyncToCloud();
        } catch {}
      }

      setAnkiToast(`🎉 Phrase validée à l'oral (${feedback.accuracyScore}%) ! 太棒了 !`);
      setTimeout(() => setAnkiToast(null), 3500);

      if (onPracticeCompleted) {
        onPracticeCompleted(currentPhrase.id, feedback.accuracyScore);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecordingRef.current || isRecording) {
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

  const jumpToNextUnmastered = () => {
    if (filteredPhrases.length <= 1) return;
    const nextIdx = filteredPhrases.findIndex((p, idx) => idx > activePhraseIndex && (phraseScores[p.id] || 0) < 80);
    if (nextIdx !== -1) {
      setActivePhraseIndex(nextIdx);
      return;
    }
    const fromStartIdx = filteredPhrases.findIndex((p, idx) => idx < activePhraseIndex && (phraseScores[p.id] || 0) < 80);
    if (fromStartIdx !== -1) {
      setActivePhraseIndex(fromStartIdx);
      return;
    }
  };

  const hasUnmasteredRemaining = filteredPhrases.some(p => (phraseScores[p.id] || 0) < 80);

  // Statistiques du Labo Vocal
  const masteredCount = Object.values(phraseScores).filter(s => s >= 80).length;
  const currentBestScore = phraseScores[currentPhrase?.id] || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification Anki */}
      {ankiToast && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{ankiToast}</span>
        </div>
      )}

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
                {masteredCount} / {EVERYDAY_PHRASES.length + customPhrases.length} maîtrisées (≥ 80%)
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
        
        {/* Pilules de catégories + Bouton Ajouter */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <div className="flex items-center space-x-1.5 shrink-0">
            {EVERYDAY_CATEGORIES.map(cat => {
              const allList = [...customPhrases, ...EVERYDAY_PHRASES];
              let count: number | null = null;
              if (cat.id === 'all') count = allList.length;
              else if (cat.id === 'mastered') count = allList.filter(p => (phraseScores[p.id] || 0) >= 80).length;
              else if (cat.id === 'to_practice') count = allList.filter(p => (phraseScores[p.id] || 0) < 80).length;
              else if (cat.id === 'custom') count = customPhrases.length;
              else if (cat.id === 'anki') count = ankiPhrases.length;
              else count = allList.filter(p => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActivePhraseIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-black'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat.id ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 bg-[#c23b22] hover:bg-[#a9301a] text-white border border-[#c23b22] font-black shadow-xs active:scale-95 shrink-0"
            title="Ajouter un mot ou une phrase au labo vocal"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Ajouter au labo</span>
          </button>
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

      {/* 4. CARTE PRINCIPALE DE LA PHRASE OU ÉTAT VIDE */}
      {filteredPhrases.length === 0 || !currentPhrase ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-2xl border border-amber-200">
            {selectedCategory === 'custom' ? '✍️' : selectedCategory === 'anki' ? '⭐' : '🔍'}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black font-serif text-stone-900">
              {selectedCategory === 'custom'
                ? "Aucune phrase personnalisée pour l'instant"
                : selectedCategory === 'anki'
                ? "Aucune carte Anki trouvée"
                : "Aucune phrase trouvée"}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {selectedCategory === 'custom'
                ? "Ajoute tes propres phrases ou mots pour t'entraîner à les prononcer avec analyse IA instantanée."
                : selectedCategory === 'anki'
                ? "Enregistre des cartes dans Anki depuis les histoires ou le chat pour pouvoir les travailler à l'oral ici !"
                : "Essaie un autre terme de recherche ou explore une autre catégorie."}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {selectedCategory === 'custom' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#c23b22] hover:bg-[#a9301a] text-white text-xs font-black shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ajouter une phrase au labo</span>
              </button>
            )}

            {selectedCategory !== 'all' && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                Voir toutes les phrases standards
              </button>
            )}
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-6 animate-fadeIn">
        
        {/* Bannière Phrase Spéciale Mot Épinglé */}
        {customPracticePhrase && (
          <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-400 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-bold">
                🎯 Mode Entraînement : Phrase personnalisée générée à partir de ton mot épinglé !
              </span>
            </div>
            {onClearCustomPhrase && (
              <button
                onClick={onClearCustomPhrase}
                className="text-xs font-black text-stone-900 hover:underline bg-white px-3 py-1 rounded-lg border border-amber-300 self-start sm:self-auto shadow-2xs"
              >
                Revenir aux phrases standards
              </button>
            )}
          </div>
        )}

        {/* Navigation & Thème */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-base">{currentPhrase.categoryIcon}</span>
            <span className="font-bold text-xs text-stone-900">
              {currentPhrase.categoryLabel}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 text-xs">
              {currentPhrase.situation}
            </span>

            {/* Statut de validation orale */}
            {currentBestScore >= 80 ? (
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Validée ({currentBestScore}%)</span>
              </span>
            ) : currentBestScore > 0 ? (
              <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>En cours ({currentBestScore}%)</span>
              </span>
            ) : (
              <span className="text-[10px] bg-stone-100 text-stone-600 font-semibold px-2 py-0.5 rounded-full border border-stone-200">
                🎯 À valider
              </span>
            )}

            {/* Badges d'état personnalisé / Anki */}
            {currentPhrase.isCustom && (
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                ✍️ Mon ajout
              </span>
            )}
            {currentPhrase.category === 'anki' && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                ⭐ Carte Anki
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto flex-wrap">
            {currentPhrase.isCustom && (
              <button
                onClick={handleDeleteCurrentPhrase}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors mr-1"
                title="Supprimer cette phrase de mes ajouts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            )}

            {!customPracticePhrase ? (
              <>
                {hasUnmasteredRemaining && (
                  <button
                    onClick={jumpToNextUnmastered}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs transition-colors flex items-center space-x-1 shadow-2xs mr-1"
                    title="Sauter directement à la prochaine phrase non validée"
                  >
                    <span>🎯 Suivante à valider</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

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
              </>
            ) : (
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Phrase Épinglée
              </span>
            )}
          </div>
        </div>

        {/* Phrase Chinoise (Pinyin + Hanzi + Français) */}
        <div className="space-y-4 py-2 text-center">
          
          {/* Bannière de validation si score >= 80% */}
          {currentBestScore >= 80 && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-xl mx-auto text-xs animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  Phrase validée à l'oral avec un score de {currentBestScore}% !
                </span>
              </div>
              {hasUnmasteredRemaining && (
                <button
                  onClick={jumpToNextUnmastered}
                  className="font-black text-emerald-800 hover:text-emerald-950 underline text-xs shrink-0"
                >
                  Suivante non validée ➔
                </button>
              )}
            </div>
          )}
          
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

          {/* Mots / Découpage rapide pour Anki */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
              Sauvegarder un terme dans Anki :
            </span>
            {currentPhrase.hanzi
              .replace(/[，。？！、；：“”‘’]/g, ' ')
              .split(/\s+/)
              .filter(segment => segment.trim().length > 0)
              .map((seg, sIdx) => {
                const segInAnki = isWordInLocalAnki(seg);
                return (
                  <button
                    key={sIdx}
                    onClick={() => {
                      const res = saveWordToLocalAnki({
                        hanzi: seg,
                        pinyin: seg === currentPhrase.hanzi ? currentPhrase.pinyin : undefined,
                        translation: currentPhrase.french,
                        deckName: 'Fluent',
                        source: 'fluent_to_anki',
                      });
                      setAnkiToast(res.isNew ? `✨ "${seg}" ajouté à ton paquet Anki "Fluent" !` : `✓ "${seg}" est déjà dans Anki !`);
                      setTimeout(() => setAnkiToast(null), 3000);
                    }}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all border ${
                      segInAnki
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border-stone-200'
                    }`}
                    title={segInAnki ? `Déjà dans Anki` : `Ajouter "${seg}" à Anki`}
                  >
                    <span>{seg}</span>
                    <BookmarkCheck className={`w-3 h-3 ${segInAnki ? 'text-emerald-600' : 'text-stone-400'}`} />
                  </button>
                );
              })}
          </div>

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

            {/* Ajouter à Anki */}
            <button
              onClick={handleSaveToAnki}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isInAnki
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                  : 'bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 border-stone-300 hover:border-emerald-300 shadow-2xs'
              }`}
              title="Ajouter cette phrase directement à Anki (Desktop AnkiConnect ou deck local)"
            >
              <BookmarkCheck className={`w-3.5 h-3.5 ${isInAnki ? 'text-emerald-600' : 'text-stone-400 group-hover:text-emerald-600'}`} />
              <span>{isInAnki ? 'Dans ton Anki' : 'Ajouter à Anki'}</span>
            </button>
          </div>

        </div>

        {/* 5. MICROPHONE INTERACTIF : ENREGISTREMENT & RECONNAISSANCE */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center space-y-4">
          
          <div className="flex flex-wrap items-center justify-center gap-3">
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

            {recordedAudioUrl && !isRecording && (
              <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                <button
                  onClick={handleTogglePlayUserAudio}
                  className={`px-4 py-2.5 rounded-xl border-2 border-stone-900 font-bold text-xs flex items-center space-x-2 transition-all shadow-xs ${
                    isPlayingUserAudio && !isPlayingMirror
                      ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30 ring-2 ring-blue-400'
                      : 'bg-white hover:bg-stone-100 text-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 dark:border-stone-700'
                  }`}
                  title="Écouter mon enregistrement"
                >
                  {isPlayingUserAudio && !isPlayingMirror ? (
                    <>
                      <Pause className="w-4 h-4 text-white" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-blue-600 fill-blue-600 dark:text-blue-400 dark:fill-blue-400" />
                      <span>Écouter mon enregistrement</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handlePlayAudio(currentPhrase.hanzi)}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center space-x-1.5 border border-stone-300 dark:border-stone-700 transition-colors shadow-2xs"
                  title="Écouter le modèle natif pour comparer ta prononciation"
                >
                  <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Modèle Natif</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-center space-y-1 max-w-md">
            <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
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
              <div className="text-xs text-stone-800 dark:text-stone-200 font-mono bg-stone-100 dark:bg-stone-800 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 inline-block shadow-2xs">
                <span className="text-stone-400 dark:text-stone-500 mr-1.5">Capté en direct :</span>
                <strong className="text-stone-900 dark:text-stone-100">{liveTranscript}</strong>
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
            <div className="w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-stone-50 via-white to-amber-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] space-y-4 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-xs shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                      <span>Miroir Phonétique & Auto-Écoute</span>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        Enregistrement prêt
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      Écoute ton timbre réel pour dépasser l'illusion osseuse et vérifier tes tons.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPhoneticGuide(!showPhoneticGuide)}
                  className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors self-start sm:self-auto bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{showPhoneticGuide ? 'Masquer' : 'Repères des tons'}</span>
                </button>
              </div>

              {/* 3 Actions Audio : Écouter sa voix / Comparer Miroir / Écouter Correction */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. Écouter son enregistrement réel */}
                <button
                  onClick={handleTogglePlayUserAudio}
                  className={`p-3 rounded-2xl border-2 border-stone-900 dark:border-stone-700 font-black text-xs transition-all shadow-xs flex items-center justify-center space-x-2 ${
                    isPlayingUserAudio && !isPlayingMirror
                      ? 'bg-[#c23b22] text-white shadow-[#c23b22]/30 scale-102'
                      : 'bg-white hover:bg-stone-100 text-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 hover:-translate-y-0.5'
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
                  className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition-all shadow-2xs flex items-center justify-center space-x-2 hover:-translate-y-0.5"
                  title="Joue ta voix puis le modèle pour entendre la correction"
                >
                  <Volume2 className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                  <span>Correction : Toi ➔ Natif</span>
                </button>

              </div>

              {/* Guide des tons */}
              {showPhoneticGuide && (
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 text-stone-900 dark:text-stone-100 font-bold font-serif">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pourquoi a-t-on l'impression de bien prononcer ?</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    Par la conduction osseuse du crâne, on entend sa voix plus grave et on compense inconsciemment ses erreurs. En s'écoutant dans le miroir, on entend exactement la mélodie que perçoit un locuteur natif !
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                      <strong className="block text-stone-900 dark:text-stone-100 font-serif">1er Ton (55)</strong>
                      <span className="text-stone-500 dark:text-stone-400 text-[10px]">Haut et plat, ne chute pas !</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                      <strong className="block text-stone-900 dark:text-stone-100 font-serif">2ème Ton (35)</strong>
                      <span className="text-stone-500 dark:text-stone-400 text-[10px]">Monte franc (« Hein ?! »).</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                      <strong className="block text-stone-900 dark:text-stone-100 font-serif">3ème Ton (214)</strong>
                      <span className="text-stone-500 dark:text-stone-400 text-[10px]">Plonge bien dans les graves.</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                      <strong className="block text-stone-900 dark:text-stone-100 font-serif">4ème Ton (51)</strong>
                      <span className="text-stone-500 dark:text-stone-400 text-[10px]">Chute sèche comme un ordre !</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* 7. DIAGNOSTIC IA & CORRECTION PHONÉTIQUE INTELLIGENTE */}
        {(aiFeedback || evaluation) && (
          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-fadeIn">
            
            {/* Carte Diagnostic Coach IA */}
            <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 ${
              (aiFeedback?.isPassed ?? (evaluation?.accuracyScore ?? 0) >= 80)
                ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-100'
                : ((evaluation?.accuracyScore ?? aiFeedback?.accuracyScore ?? 0) >= 50)
                ? 'bg-amber-50/70 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-100'
                : 'bg-rose-50/70 border-rose-300 text-rose-950 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-100'
            }`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 dark:border-stone-700/60 pb-3">
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
                    {aiFeedback?.aiDiagnosis || evaluation?.feedbackMessage || "Prononciation analysée."}
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
                  <div className="text-right mr-1">
                    <span className={`text-2xl sm:text-3xl font-black ${
                      (aiFeedback?.isPassed ?? (evaluation?.accuracyScore ?? 0) >= 80)
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : ((evaluation?.accuracyScore ?? aiFeedback?.accuracyScore ?? 0) >= 50)
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}>
                      {evaluation?.accuracyScore ?? aiFeedback?.accuracyScore ?? 0}%
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold uppercase">
                      {(aiFeedback?.isPassed ?? (evaluation?.accuracyScore ?? 0) >= 80) ? 'Validé ✓' : 'Précision'}
                    </span>
                  </div>

                  {/* Réécouter sa voix depuis la carte résultat */}
                  {recordedAudioUrl && (
                    <button
                      onClick={handleTogglePlayUserAudio}
                      className={`p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 transition-colors shadow-2xs flex items-center space-x-1.5 text-xs font-bold ${
                        isPlayingUserAudio && !isPlayingMirror
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-stone-100 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200'
                      }`}
                      title="Réécouter mon enregistrement vocal"
                    >
                      {isPlayingUserAudio && !isPlayingMirror ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 text-blue-600 fill-blue-600 dark:text-blue-400 dark:fill-blue-400" />
                      )}
                      <span className="hidden sm:inline">Réécouter</span>
                    </button>
                  )}

                  <button
                    onClick={startRecording}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 transition-colors shadow-2xs flex items-center space-x-1.5 text-xs font-bold"
                    title="Réessayer immédiatement"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Réessayer</span>
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
              {(evaluation?.spokenText || aiFeedback?.spokenText) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-white/70 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Phrase Cible Attendue :</span>
                    <strong className="text-stone-900 font-serif chinese-text text-sm">{currentPhrase.hanzi}</strong>
                    <span className="text-stone-500 font-mono text-[11px] ml-1.5">({currentPhrase.pinyin})</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Capté par le micro :</span>
                    <strong className="text-stone-900 font-serif chinese-text text-sm">« {evaluation?.spokenText || aiFeedback?.spokenText} »</strong>
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
                {(aiFeedback?.characterBreakdown || evaluation?.matchedCharacters?.map(m => ({
                  targetChar: m.char,
                  status: m.status === 'correct' ? ('exact' as const) : ('substituted' as const),
                  explanation: undefined as string | undefined,
                })) || []).map((charItem, idx) => (
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
            {(aiFeedback?.isPassed ?? (evaluation ? evaluation.accuracyScore >= 80 : false)) && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-xs">
                <div className="flex items-center space-x-2.5">
                  <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-sm font-black block font-serif">太棒了 ! Phrase Validée sans Complaisance !</strong>
                    <span className="text-xs text-emerald-800">Rythme, articulation et tons conformes au mandarin authentique.</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {hasUnmasteredRemaining && (
                    <button
                      onClick={jumpToNextUnmastered}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs shadow-sm transition-all flex items-center justify-center space-x-1"
                    >
                      <span>🎯 Suivante à valider</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={nextPhrase}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 hover:translate-x-0.5"
                  >
                    <span>Phrase suivante</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
      )}

      {/* 8. NAVIGATION BASSE */}
      {filteredPhrases.length > 0 && currentPhrase && (
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 flex-wrap gap-2">
          <button
            onClick={prevPhrase}
            className="inline-flex items-center space-x-1 hover:text-stone-900 transition-colors font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Phrase précédente</span>
          </button>

          {hasUnmasteredRemaining ? (
            <button
              onClick={jumpToNextUnmastered}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs transition-colors border border-amber-300"
            >
              <span>🎯 Aller à la prochaine phrase à valider</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-800" />
            </button>
          ) : (
            <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Toutes les phrases de cette section sont validées !</span>
            </span>
          )}

          <button
            onClick={nextPhrase}
            className="inline-flex items-center space-x-1 hover:text-stone-900 transition-colors font-bold"
          >
            <span>Phrase suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODAL : AJOUTER UNE PHRASE OU UN MOT AU LABO VOCAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-stone-900 shadow-[6px_6px_0px_#1c1917] max-w-lg w-full p-6 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-red-100 text-[#c23b22]">
                  <Plus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif font-black text-lg text-stone-900">
                    Ajouter au Labo Vocal
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Entraîne-toi sur tes propres mots ou phrases avec le coach vocal IA.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPhrase} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
                  Sinogrammes (Hanzi) <span className="text-[#c23b22]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newHanzi}
                  onChange={(e) => setNewHanzi(e.target.value)}
                  placeholder="ex: 我想喝一杯奶茶"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-200 focus:border-stone-900 focus:outline-none text-base font-serif font-bold text-stone-900 placeholder-stone-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pinyin (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newPinyin}
                    onChange={(e) => setNewPinyin(e.target.value)}
                    placeholder="ex: Wǒ xiǎng hē yì bēi nǎichá"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none text-xs font-mono text-stone-800 placeholder-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Contexte / Situation
                  </label>
                  <input
                    type="text"
                    value={newSituation}
                    onChange={(e) => setNewSituation(e.target.value)}
                    placeholder="ex: Au salon de thé"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none text-xs text-stone-800 placeholder-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Traduction française
                </label>
                <input
                  type="text"
                  value={newFrench}
                  onChange={(e) => setNewFrench(e.target.value)}
                  placeholder="ex: Je voudrais boire un thé au lait."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none text-xs text-stone-800 placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Conseil de prononciation ou ton (optionnel)
                </label>
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="ex: Attention au 3ème ton sur 想 et 奶"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none text-xs text-stone-800 placeholder-stone-400"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToAnkiToo}
                    onChange={(e) => setAddToAnkiToo(e.target.checked)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span>Ajouter aussi directement à mon paquet Anki "Fluent"</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!newHanzi.trim()}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-black shadow-md transition-all active:scale-95"
                >
                  Enregistrer et Pratiquer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
