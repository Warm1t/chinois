import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTestQuestion } from '../types/fluent';
import { playChineseAudio } from '../utils/speechUtils';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  Puzzle, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface ActiveNuanceQuizProps {
  testQuestion: ActiveTestQuestion;
  onPassed: () => void;
  alreadyPassed: boolean;
}

interface SlotSegment {
  slotLetter: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  prefixText: string;
}

export const ActiveNuanceQuiz: React.FC<ActiveNuanceQuizProps> = ({
  testQuestion,
  onPassed,
  alreadyPassed,
}) => {
  // Mode actif : 'placement' (Placer dans la phrase - ludique) ou 'choice' (QCM classique)
  const [quizMode, setQuizMode] = useState<'placement' | 'choice'>('placement');

  // États mode Placement
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSlotSubmitted, setIsSlotSubmitted] = useState<boolean>(false);
  const [isSlotCorrect, setIsSlotCorrect] = useState<boolean>(false);

  // États mode QCM classique
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isChoiceSubmitted, setIsChoiceSubmitted] = useState<boolean>(false);
  const [isChoiceCorrect, setIsChoiceCorrect] = useState<boolean>(false);

  // Le mot cible à placer (l'option correcte)
  const targetWord = useMemo(() => {
    if (!testQuestion || !Array.isArray(testQuestion.options)) return '';
    return testQuestion.options[testQuestion.correctIndex] || testQuestion.options[0] || '';
  }, [testQuestion]);

  // Découpage intelligent de la phrase en segments et slots (A, B, C, D)
  const placementData = useMemo(() => {
    if (testQuestion?.placement && Array.isArray(testQuestion.placement.segments) && testQuestion.placement.segments.length > 0) {
      const p = testQuestion.placement;
      const w = p.word || targetWord;
      const punc = p.punctuation ?? '。';
      let full = '';
      p.segments.forEach((seg, i) => {
        if (i === p.correctGap) full += w;
        full += seg;
      });
      if (p.correctGap === p.segments.length) full += w;
      full += punc;

      return {
        isPlacementConfigured: true,
        word: w,
        segments: p.segments,
        correctGap: p.correctGap,
        punctuation: punc,
        fullCorrectSentence: full,
        prefixChunks: ['', '', '', ''],
        correctSlot: 'A' as const
      };
    }

    const raw = testQuestion?.sentenceWithBlank || '';
    if (!raw) {
      return {
        isPlacementConfigured: false,
        word: targetWord,
        segments: [],
        correctGap: 0,
        punctuation: '。',
        prefixChunks: ['', '', '', ''],
        correctSlot: 'A' as const,
        fullCorrectSentence: targetWord
      };
    }
    const parts = raw.split(/_{2,}/);
    const beforeBlank = parts[0] || '';
    const afterBlank = parts[1] || '';

    // Décomposer la partie avant le blanc en 2-3 morceaux naturels
    const cleanBefore = beforeBlank.trim();
    const cleanAfter = afterBlank.trim();

    // Si le blanc est à la toute fin (ex: "我在北京住了两个月_____。")
    if (!cleanAfter || cleanAfter === '。' || cleanAfter === '？' || cleanAfter === '！') {
      const punc = cleanAfter || '。';
      // Découpage en 3 slots avant et le slot final correct
      const len = cleanBefore.length;
      const mid1 = Math.max(1, Math.floor(len * 0.35));
      const mid2 = Math.max(mid1 + 1, Math.floor(len * 0.7));

      return {
        isPlacementConfigured: false,
        word: targetWord,
        segments: [],
        correctGap: 2,
        punctuation: punc,
        prefixChunks: [
          cleanBefore.slice(0, mid1),
          cleanBefore.slice(mid1, mid2),
          cleanBefore.slice(mid2),
          punc
        ],
        correctSlot: 'C' as const, // position du blanc avant la ponctuation finale
        fullCorrectSentence: `${cleanBefore}${targetWord}${punc}`
      };
    }

    // Si le blanc est au milieu (ex: "我从来没有吃_____北京烤鸭。")
    const lenBefore = cleanBefore.length;
    const splitBefore = Math.max(1, Math.floor(lenBefore / 2));

    const chunk1 = cleanBefore.slice(0, splitBefore);
    const chunk2 = cleanBefore.slice(splitBefore);
    const chunk3 = cleanAfter;

    return {
      isPlacementConfigured: false,
      word: targetWord,
      segments: [],
      correctGap: 1,
      punctuation: '',
      prefixChunks: [
        chunk1,
        chunk2,
        chunk3,
        ''
      ],
      correctSlot: 'B' as const, // position du blanc entre chunk2 et chunk3
      fullCorrectSentence: `${cleanBefore}${targetWord}${cleanAfter}`
    };
  }, [testQuestion, targetWord]);

  // Réinitialiser les états lors du changement de question
  useEffect(() => {
    setSelectedSlot(null);
    setIsSlotSubmitted(false);
    setIsSlotCorrect(false);

    setSelectedChoiceIdx(null);
    setIsChoiceSubmitted(false);
    setIsChoiceCorrect(false);
  }, [testQuestion]);

  // Clic sur un slot dans la phrase
  const handleSelectSlot = (slotKey: string, gapIdx?: number) => {
    if (isSlotSubmitted && isSlotCorrect) return;

    setSelectedSlot(slotKey);
    setIsSlotSubmitted(true);
    const correct = placementData.isPlacementConfigured
      ? gapIdx === placementData.correctGap
      : slotKey === placementData.correctSlot;
    setIsSlotCorrect(correct);

    if (correct) {
      playChineseAudio(placementData.fullCorrectSentence, 0.95);
      onPassed();
    }
  };

  // Clic sur une option du QCM classique
  const handleSelectChoice = (idx: number) => {
    if (isChoiceSubmitted && isChoiceCorrect) return;

    setSelectedChoiceIdx(idx);
    setIsChoiceSubmitted(true);
    const correct = idx === testQuestion.correctIndex;
    setIsChoiceCorrect(correct);

    if (correct) {
      onPassed();
    }
  };

  const handleRetry = () => {
    setSelectedSlot(null);
    setIsSlotSubmitted(false);
    setIsSlotCorrect(false);

    setSelectedChoiceIdx(null);
    setIsChoiceSubmitted(false);
    setIsChoiceCorrect(false);
  };

  const isAnyPassed = alreadyPassed || isSlotCorrect || isChoiceCorrect;

  // Fonction de rendu d'un slot interactif (A), (B), (C), (D)
  const renderSlotButton = (slotKey: string, gapIdx?: number) => {
    const isThisSlotSelected = selectedSlot === slotKey;
    const isThisSlotCorrect = placementData.isPlacementConfigured
      ? gapIdx === placementData.correctGap
      : slotKey === placementData.correctSlot;
    const wordToDisplay = placementData.isPlacementConfigured ? placementData.word : targetWord;

    // Si la réponse correcte a été trouvée, le bon slot affiche le mot inséré fièrement
    if (isSlotSubmitted && isSlotCorrect && isThisSlotCorrect) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-emerald-500 text-white font-bold shadow-xs animate-bounce-short ring-2 ring-emerald-300 mx-1">
          {wordToDisplay}
        </span>
      );
    }

    // Si ce slot a été cliqué et était faux
    if (isSlotSubmitted && !isSlotCorrect && isThisSlotSelected) {
      return (
        <button
          onClick={() => handleSelectSlot(slotKey, gapIdx)}
          className="inline-flex items-center justify-center px-3 py-1 rounded-xl text-xs font-mono font-black bg-rose-600 text-white border-2 border-rose-700 shadow-xs mx-1 animate-shake"
          title={`Emplacement (${slotKey}) erroné`}
        >
          ✕ ({slotKey})
        </button>
      );
    }

    // État normal : bouton slot interactif
    return (
      <button
        onClick={() => handleSelectSlot(slotKey, gapIdx)}
        disabled={isSlotSubmitted && isSlotCorrect}
        className="inline-flex items-center justify-center px-3 py-1 rounded-xl text-xs font-mono font-black border-2 border-dashed border-amber-500 hover:border-amber-600 bg-amber-50/80 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:scale-105 transition-all shadow-2xs mx-1 cursor-pointer active:scale-95"
        title={`Insérer « ${wordToDisplay} » à l'emplacement (${slotKey})`}
      >
        ({slotKey})
      </button>
    );
  };

  if (!testQuestion || !Array.isArray(testQuestion.options)) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] space-y-5 animate-fadeIn">
      
      {/* En-tête : Titre et Bascule de Mode Ludique */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-amber-400 text-stone-950 font-black text-xs">
              <Puzzle className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#c23b22] dark:text-amber-400">
              Défi Actif de Grammaire & Syntaxe
            </span>
            {isAnyPassed && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Validé</span>
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100 font-serif">
            {quizMode === 'placement' ? 'Place le mot au bon endroit dans la phrase' : 'Choisis la particule exacte'}
          </h3>
        </div>

        {/* Sélecteur de mode : Placer dans la phrase (Ludique) vs QCM */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 self-start sm:self-auto">
          <button
            onClick={() => setQuizMode('placement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              quizMode === 'placement'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5 text-amber-600" />
            <span>🧩 Placer dans la phrase</span>
          </button>
          <button
            onClick={() => setQuizMode('choice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              quizMode === 'choice'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>QCM</span>
          </button>
        </div>
      </div>

      {/* Intitulé de la situation en français */}
      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-start space-x-2">
        <span className="text-base shrink-0 mt-0.5">🎯</span>
        <p>{testQuestion.promptFrench}</p>
      </div>

      {/* ========================================================= */}
      {/* MODE 1 : PLACER DANS LA PHRASE (LE DÉFI LUDIQUE PAR EXCELLENCE) */}
      {/* ========================================================= */}
      {quizMode === 'placement' && (
        <div className="space-y-4">
          
          {/* Badge héro du mot à placer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Mot à insérer en mandarin :</span>
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Où ce mot s'insère-t-il naturellement dans la structure chinoise ?
              </p>
            </div>

            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#c23b22] to-amber-600 text-white font-serif font-black text-2xl tracking-wider shadow-md shrink-0 justify-center">
              <span>{targetWord}</span>
            </div>
          </div>

          {/* Phrase interactive avec slots cliquables (A), (B), (C), (D) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#fdfbf7] dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-800 text-center font-serif text-xl sm:text-2xl font-bold leading-relaxed flex flex-wrap items-center justify-center gap-2">
            {placementData.isPlacementConfigured ? (
              <>
                {placementData.segments.map((seg, idx) => (
                  <React.Fragment key={idx}>
                    {renderSlotButton(['A', 'B', 'C', 'D', 'E'][idx] || `${idx + 1}`, idx)}
                    <span className="text-stone-900 dark:text-stone-100">{seg}</span>
                  </React.Fragment>
                ))}
                {renderSlotButton(
                  ['A', 'B', 'C', 'D', 'E'][placementData.segments.length] || `${placementData.segments.length + 1}`,
                  placementData.segments.length
                )}
                {placementData.punctuation && (
                  <span className="text-stone-900 dark:text-stone-100">{placementData.punctuation}</span>
                )}
              </>
            ) : (
              <>
                {/* Morceau 1 */}
                {placementData.prefixChunks[0] && (
                  <span className="text-stone-900 dark:text-stone-100">{placementData.prefixChunks[0]}</span>
                )}

                {/* Slot A */}
                {renderSlotButton('A')}

                {/* Morceau 2 */}
                {placementData.prefixChunks[1] && (
                  <span className="text-stone-900 dark:text-stone-100">{placementData.prefixChunks[1]}</span>
                )}

                {/* Slot B */}
                {renderSlotButton('B')}

                {/* Morceau 3 */}
                {placementData.prefixChunks[2] && (
                  <span className="text-stone-900 dark:text-stone-100">{placementData.prefixChunks[2]}</span>
                )}

                {/* Slot C */}
                {renderSlotButton('C')}

                {/* Morceau 4 (Ponctuation ou fin) */}
                {placementData.prefixChunks[3] && (
                  <span className="text-stone-900 dark:text-stone-100">{placementData.prefixChunks[3]}</span>
                )}
              </>
            )}
          </div>

          {/* Aide textuelle sous les boutons */}
          <p className="text-center text-[11px] text-stone-500 dark:text-stone-400">
            Clique directement sur l'un des boutons {placementData.isPlacementConfigured ? <strong>(A), (B), (C)...</strong> : <><strong>(A)</strong>, <strong>(B)</strong> ou <strong>(C)</strong></>} pour positionner le mot.
          </p>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2 : QCM CLASSIQUE (DISCRIMINATION RAPIDE) */}
      {/* ========================================================= */}
      {quizMode === 'choice' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-wider">
            {testQuestion.sentenceWithBlank}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {testQuestion.options.map((option, idx) => {
              let btnStyle = "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700";

              if (isChoiceSubmitted) {
                if (idx === testQuestion.correctIndex) {
                  btnStyle = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-300";
                } else if (idx === selectedChoiceIdx) {
                  btnStyle = "bg-rose-50 dark:bg-rose-950/80 border-rose-300 text-rose-800 dark:text-rose-200 line-through opacity-80";
                } else {
                  btnStyle = "bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-600 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectChoice(idx)}
                  disabled={isChoiceSubmitted && isChoiceCorrect}
                  className={`p-3.5 rounded-xl border text-xl font-bold font-serif transition-all transform active:scale-95 shadow-2xs flex flex-col items-center justify-center space-y-1 ${btnStyle}`}
                >
                  <span>{option}</span>
                  <span className="text-[10px] font-mono text-stone-400">Option {idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RETOUR & FEEDBACK EXPLICATIF */}
      {/* ========================================================= */}
      {(isSlotSubmitted || isChoiceSubmitted) && (
        <div className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2.5 animate-fadeIn ${
          (isSlotCorrect || isChoiceCorrect)
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
            : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center space-x-2">
              {(isSlotCorrect || isChoiceCorrect) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>太棒了 ! Emplacement parfaitement exact !</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Mauvais emplacement :</span>
                </>
              )}
            </span>

            {!(isSlotCorrect || isChoiceCorrect) && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white dark:bg-stone-800 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs font-bold hover:bg-rose-50 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réessayer</span>
              </button>
            )}
          </div>

          <p className="font-medium">
            {(isSlotCorrect || isChoiceCorrect)
              ? testQuestion.explanation
              : (selectedChoiceIdx !== null && testQuestion.distractorExplanations?.[selectedChoiceIdx]) ||
                "En mandarin, l'ordre des constituants suit des règles rigoureuses (le temps et les adverbes avant le verbe, les compléments après). Réessaie un autre emplacement !"}
          </p>

          {(isSlotCorrect || isChoiceCorrect) && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Règle syntaxique assimilée ! Écoute la phrase complète :</span>
              </div>

              <button
                onClick={() => playChineseAudio(placementData.fullCorrectSentence, 0.95)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Écouter la phrase</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
