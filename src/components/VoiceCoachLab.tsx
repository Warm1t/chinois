import React, { useState, useEffect, useRef } from 'react';
import { NuanceCard, VoiceEvaluationResult, AnkiWord, AnchoringRecord } from '../types/fluent';
import { NUANCE_CARDS, CURRICULUM_MODULES } from '../data/curriculumData';
import { playChineseAudio, evaluatePronunciation, isSpeechRecognitionSupported } from '../utils/speechUtils';
import { ActiveNuanceQuiz } from './ActiveNuanceQuiz';
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
  AlertTriangle
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
  
  // NOTE : Pinyin masqué par défaut selon la consigne d'apprentissage
  const [showPinyin, setShowPinyin] = useState(false);
  
  // Fiche leçon bien visible par défaut
  const [isLessonExpanded, setIsLessonExpanded] = useState(true);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<VoiceEvaluationResult | null>(null);
  
  // Enregistrements d'ancrage cognitif (SRS)
  const [anchoringRecords, setAnchoringRecords] = useState<Record<string, AnchoringRecord>>(() => {
    return getAnchoringRecords();
  });

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  const currentCard = NUANCE_CARDS[currentIndex];
  const isSupported = isSpeechRecognitionSupported();
  const currentRecord = anchoringRecords[currentCard.id];

  // Cartes en attente de révision aujourd'hui
  const dueCards = getCardsDueForReview(NUANCE_CARDS);

  // Arrêter l'enregistrement et nettoyer le timer
  const cleanupRecording = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {
        // Déjà arrêté
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Réinitialisation au changement d'exercice
  useEffect(() => {
    cleanupRecording();
    setEvaluation(null);
    setLiveTranscript('');
    accumulatedTranscriptRef.current = '';
    setIsLessonExpanded(true);
  }, [currentIndex]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  // Lecture audio
  const handlePlayAudio = async (rate: number = 1.0) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await playChineseAudio(currentCard.targetChinese, rate);
    setIsPlayingAudio(false);
  };

  // Validation du test actif de discrimination
  const handleTestPassed = () => {
    const updated = recordTestSuccess(currentCard.id);
    setAnchoringRecords(prev => ({ ...prev, [currentCard.id]: updated }));
  };

  // Finaliser et évaluer la prononciation captée
  const finalizeRecording = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);

    const spokenText = accumulatedTranscriptRef.current.trim();
    if (spokenText) {
      const result = evaluatePronunciation(spokenText, currentCard.targetChinese);
      setEvaluation(result);

      // Enregistrer le score et mettre à jour le stade d'ancrage
      const updatedRecord = recordVoiceScore(currentCard.id, result.accuracyScore);
      setAnchoringRecords(prev => ({ ...prev, [currentCard.id]: updatedRecord }));

      if (result.accuracyScore >= 80) {
        onExerciseCompleted(currentCard.id);
      }
    } else {
      setEvaluation({
        spokenText: '',
        accuracyScore: 0,
        matchedCharacters: currentCard.targetChinese.replace(/[^\u4e00-\u9fa5]/g, '').split('').map(char => ({ char, status: 'missing' })),
        feedbackMessage: "Aucun son capté. Clique sur 'Parler', prononce la phrase à voix haute puis clique sur 'Terminer'.",
        isPerfect: false,
      });
    }
  };

  // Démarrer la reconnaissance avec mode continu (tolérance aux pauses)
  const startRecording = () => {
    if (!isSupported) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale Web Speech. Utilise Google Chrome ou Microsoft Edge.");
      return;
    }

    cleanupRecording();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    accumulatedTranscriptRef.current = '';
    setLiveTranscript('');
    setEvaluation(null);
    setIsRecording(true);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const totalTranscript = finalTranscript + interimTranscript;
      accumulatedTranscriptRef.current = totalTranscript;
      setLiveTranscript(totalTranscript);

      // Timer de silence bienveillant : 3.5 secondes de pause continue après les paroles
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        finalizeRecording();
      }, 3500);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone refusé : autorise l'accès au micro dans les paramètres du navigateur.");
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      if (accumulatedTranscriptRef.current.trim().length > 0) {
        finalizeRecording();
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Erreur au lancement du micro:", e);
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      finalizeRecording();
    } else {
      startRecording();
    }
  };

  const nextCard = () => {
    if (currentIndex < NUANCE_CARDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Détection des cartes Anki synchronisées présentes dans la phrase cible
  const matchedAnkiWords = syncedAnkiWords.filter((w) =>
    currentCard.targetChinese.includes(w.hanzi)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Barre de navigation & Déclencheurs Rapides */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-stone-200/90 shadow-xs text-xs">
        
        {/* Module actuel & Sélecteur rapide */}
        <div className="flex items-center space-x-2.5">
          <span className="font-mono px-2 py-0.5 rounded-md bg-[#c23b22]/10 text-[#c23b22] font-bold border border-[#c23b22]/20">
            {currentCard.level}
          </span>
          <div>
            <div className="font-bold text-stone-900 flex items-center space-x-1.5">
              <span>Fiche {currentIndex + 1} / {NUANCE_CARDS.length}</span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 font-normal truncate max-w-[200px] sm:max-w-xs">
                {currentCard.moduleTitle}
              </span>
            </div>
            <div className="text-[11px] text-stone-700 font-semibold truncate">
              {currentCard.title}
            </div>
          </div>
        </div>

        {/* Boutons d'Action : Trame globale & Ancrage du jour */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          
          {/* Bouton Session d'Ancrage du jour */}
          <button
            onClick={onOpenAnchorSession}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              dueCards.length > 0
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 ring-2 ring-amber-300/60'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
            title="Session de révision espacée"
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>Ancrage du jour</span>
            {dueCards.length > 0 && (
              <span className="bg-stone-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {dueCards.length}
              </span>
            )}
          </button>

          {/* Bouton Voir le Syllabus / Trame */}
          <button
            onClick={onOpenCurriculum}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-semibold text-xs transition-colors shadow-2xs"
            title="Voir les 5 modules et la progression globale"
          >
            <Compass className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Trame des 5 Modules</span>
          </button>

          {/* Flèches Précédent / Suivant */}
          <div className="flex items-center space-x-1 pl-1 border-l border-stone-200">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Fiche précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex === NUANCE_CARDS.length - 1}
              className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Fiche suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 2. STATUT D'ANCRAGE COGNITIF DE LA FICHE (SRS) */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#c23b22]/10 text-[#c23b22] flex items-center justify-center font-bold font-serif text-sm shrink-0">
            印
          </div>
          <div>
            <div className="font-bold text-stone-900 flex items-center space-x-2">
              <span>Niveau d'Ancrage de cette nuance :</span>
              {currentRecord?.stage === 'ancre' ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>🌳 Ancré en mémoire durable</span>
                </span>
              ) : currentRecord?.stage === 'assimilation' ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  🌿 En cours d'assimilation
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold border border-stone-200">
                  🌱 En découverte
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {currentRecord?.stage === 'ancre'
                ? `Prochain rappel espacé : ${currentRecord.nextReviewDate} (Intervalle : +${currentRecord.intervalDays} jours)`
                : "Pour ancrer : réussis le test actif ci-dessous + obtiens au moins 80% à l'oral."}
            </p>
          </div>
        </div>

        {currentRecord?.voiceBestScore ? (
          <div className="text-right shrink-0">
            <span className="text-[10px] text-stone-400 block font-bold uppercase">Record Oral</span>
            <span className="font-mono text-base font-black text-[#c23b22]">
              {currentRecord.voiceBestScore}%
            </span>
          </div>
        ) : null}
      </div>

      {/* 3. ÉTAPE 1 : FICHE LEÇON & STRUCTURE GRAMMATICALE */}
      <div className="bg-[#fcfaf7] rounded-3xl p-6 sm:p-7 border border-stone-300/80 shadow-sm space-y-4 relative overflow-hidden transition-all">
        
        {/* Header avec bouton Réduire/Déplier */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-200/80 pb-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-[#c23b22]/10 text-[#c23b22]">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#c23b22]">
                Étape 1 : Fiche Leçon & Structure Grammaticale
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {currentCard.title}
            </h3>
          </div>

          <button
            onClick={() => setIsLessonExpanded(!isLessonExpanded)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 transition-colors shadow-2xs shrink-0"
          >
            <span>{isLessonExpanded ? 'Réduire' : 'Déplier'}</span>
            {isLessonExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Contenu Développé */}
        {isLessonExpanded && (
          <div className="space-y-4 pt-1 animate-fadeIn">
            
            {/* Formule Grammaticale Clé (Highlight Encre & Sceau Cinnabre) */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white border border-stone-800 shadow-sm space-y-1">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Formule de Pensée Chinoise (À mémoriser) :</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-amber-200 tracking-wide">
                {currentCard.structuralFormula}
              </div>
            </div>

            {/* Décryptage de la nuance */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-800">
                💡 Pourquoi cette nuance fait toute la différence :
              </span>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium bg-white/70 p-3.5 rounded-xl border border-stone-200/70">
                {currentCard.keyNuanceExplanation}
              </p>
            </div>

            {/* Le Piège Français Typique */}
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/70 flex items-start space-x-2.5 text-xs text-rose-950">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-900">Le piège de la traduction mot-à-mot : </strong>
                <span>{currentCard.commonTrap}</span>
              </div>
            </div>

            {/* Situation concrète & Astuce native */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/70 border border-stone-200/70 space-y-1">
                <span className="font-bold text-stone-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c23b22]" />
                  <span>Situation concrète :</span>
                </span>
                <p className="text-stone-600 leading-relaxed pl-3.5">
                  {currentCard.situationFrench}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-2 text-amber-950">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900">Astuce native : </strong>
                  <span>{currentCard.culturalNote}</span>
                </div>
              </div>
            </div>

            {/* Vocabulaire Anki lié si détecté */}
            {matchedAnkiWords.length > 0 && (
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900">
                <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Vocabulaire de ton Anki réinvesti dans cette leçon : </strong>
                  {matchedAnkiWords.map(w => `${w.hanzi} (${w.translation || ''})`).join(' • ')}
                </span>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 4. ÉTAPE 2 : TEST ACTIF DE DISCRIMINATION (TESTING EFFECT) */}
      <div className="space-y-2">
        <ActiveNuanceQuiz
          testQuestion={currentCard.activeTest}
          onPassed={handleTestPassed}
          alreadyPassed={!!currentRecord?.testPassed}
        />
      </div>

      {/* 5. ÉTAPE 3 : ENTRAÎNEMENT ORAL & PRATIQUE DU PATTERN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        
        {/* Titre d'étape */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            🎯 Étape 3 : Phrase Modèle & Pratique Vocale
          </span>
          <span className="text-xs text-stone-400 italic">
            Articule à voix haute la pensée complète
          </span>
        </div>

        {/* Phrase Modèle */}
        <div className="space-y-4 py-2 text-center">
          
          {/* Pinyin (Masqué par défaut pour stimuler la reconnaissance des caractères) */}
          <div className="min-h-[28px] flex items-center justify-center">
            {showPinyin ? (
              <p className="text-sm sm:text-base font-medium text-stone-700 tracking-wide bg-stone-50 px-3.5 py-1 rounded-lg border border-stone-200">
                {currentCard.targetPinyin}
              </p>
            ) : (
              <span className="text-xs text-stone-400 italic">
                (Pinyin masqué pour lire directement les caractères — clique ci-dessous pour révéler)
              </span>
            )}
          </div>

          {/* Grands Caractères Chinois (Hanzi) - Style Encre calligraphique */}
          <div className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-stone-900 chinese-text leading-tight sm:leading-snug select-all py-1 font-serif">
            {currentCard.targetChinese}
          </div>

          {/* Traduction Française */}
          <p className="text-sm text-stone-600 italic">
            « {currentCard.translationFrench} »
          </p>

          {/* Barre d'outils d'écoute & affichage */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors"
            >
              {showPinyin ? <EyeOff className="w-3.5 h-3.5 text-stone-500" /> : <Eye className="w-3.5 h-3.5 text-[#c23b22]" />}
              <span>{showPinyin ? 'Masquer Pinyin' : 'Révéler Pinyin'}</span>
            </button>

            <button
              onClick={() => handlePlayAudio(1.0)}
              disabled={isPlayingAudio}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-300" />
              <span>Écouter (1.0x)</span>
            </button>

            <button
              onClick={() => handlePlayAudio(0.8)}
              disabled={isPlayingAudio}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors shadow-xs"
            >
              <Snail className="w-3.5 h-3.5 text-amber-600" />
              <span>Ralenti (0.8x)</span>
            </button>
          </div>

        </div>

        {/* Micro avec mode continu & tolérance aux pauses */}
        <div className="pt-6 border-t border-stone-200 flex flex-col items-center justify-center space-y-4">
          
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
                className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 ${
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
                <span>Terminer & Évaluer</span>
              </button>
            )}

          </div>

          <div className="text-center space-y-2 max-w-md">
            <p className="text-xs sm:text-sm font-semibold text-stone-700">
              {isRecording ? (
                <span className="text-[#c23b22] flex items-center justify-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c23b22] animate-ping" />
                  <span>
                    Micro actif — Parle à ton rythme ! Les pauses sont tolérées sans coupure.
                  </span>
                </span>
              ) : (
                <span>
                  Clique sur <strong>Parler</strong> et lis la phrase en mandarin à voix haute.
                </span>
              )}
            </p>

            {liveTranscript && (
              <div className="text-xs text-stone-800 font-mono bg-stone-100 px-3.5 py-1.5 rounded-xl border border-stone-200 inline-block shadow-2xs">
                <span className="text-stone-400 mr-1.5">Capté :</span>
                <strong className="text-stone-900">{liveTranscript}</strong>
              </div>
            )}
          </div>

        </div>

        {/* Résultat d'évaluation caractère par caractère */}
        {evaluation && (
          <div className="mt-6 pt-6 border-t border-stone-200 space-y-4 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Résultat de ton essai oral
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
                  <span className="text-[10px] text-stone-500 block">Précision vocale</span>
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

            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-600 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Analyse détaillée (Vert = bien prononcé / Rouge = son escamoté) :</span>
              </span>

              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
                {evaluation.matchedCharacters.map((mc, idx) => (
                  <div
                    key={idx}
                    className={`w-9 h-11 rounded-lg flex flex-col items-center justify-center font-bold chinese-text text-base border transition-all ${
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

          </div>
        )}

      </div>

      {/* 6. Navigation Basse */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="inline-flex items-center space-x-1 hover:text-stone-900 disabled:opacity-20 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Fiche précédente</span>
        </button>

        <span className="text-[11px] text-stone-400 hidden sm:inline">
          💡 Objectif : Test Actif validé + Précision vocale ≥ 80% pour ancrer la fiche
        </span>

        <button
          onClick={nextCard}
          disabled={currentIndex === NUANCE_CARDS.length - 1}
          className="inline-flex items-center space-x-1 hover:text-stone-900 disabled:opacity-20 transition-colors font-medium"
        >
          <span>Fiche suivante</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
