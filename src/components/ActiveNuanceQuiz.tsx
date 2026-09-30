import React, { useState, useEffect } from 'react';
import { ActiveTestQuestion } from '../types/fluent';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface ActiveNuanceQuizProps {
  testQuestion: ActiveTestQuestion;
  onPassed: () => void;
  alreadyPassed: boolean;
}

export const ActiveNuanceQuiz: React.FC<ActiveNuanceQuizProps> = ({
  testQuestion,
  onPassed,
  alreadyPassed,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Réinitialiser l'état quand la question change
  useEffect(() => {
    setSelectedIndex(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [testQuestion]);

  const handleSelectOption = (index: number) => {
    if (isAnswered && isCorrect) return; // Ne plus changer si déjà réussi

    setSelectedIndex(index);
    setIsAnswered(true);

    const correct = index === testQuestion.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      onPassed();
    }
  };

  const handleRetry = () => {
    setSelectedIndex(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-4">
      
      {/* En-tête du test */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-md bg-amber-100 text-amber-900">
            <HelpCircle className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Test Actif de Discrimination (Testing Effect)
          </span>
        </div>

        {alreadyPassed && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Test Validé</span>
          </span>
        )}
      </div>

      {/* Question / Défi */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm font-semibold text-stone-800">
          🎯 {testQuestion.promptFrench}
        </p>

        {/* Phrase à trou */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-center font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-wider chinese-text">
          {testQuestion.sentenceWithBlank}
        </div>
      </div>

      {/* Grille des 4 options de réponse */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {testQuestion.options.map((option, idx) => {
          let btnStyle = "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100 hover:border-stone-300";

          if (isAnswered) {
            if (idx === testQuestion.correctIndex) {
              btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-300";
            } else if (idx === selectedIndex) {
              btnStyle = "bg-rose-50 border-rose-300 text-rose-800 line-through opacity-80";
            } else {
              btnStyle = "bg-stone-50 border-stone-200 text-stone-400 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered && isCorrect}
              className={`p-3 rounded-xl border text-base font-bold chinese-text transition-all transform active:scale-95 shadow-2xs flex flex-col items-center justify-center space-y-1 ${btnStyle}`}
            >
              <span className="text-xl sm:text-2xl">{option}</span>
              <span className="text-[10px] font-mono text-stone-400">Option {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Explicatif */}
      {isAnswered && (
        <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 animate-fadeIn ${
          isCorrect 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
            : 'bg-rose-50/80 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center space-x-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Excellente déduction !</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Attention au piège :</span>
                </>
              )}
            </span>

            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-800 text-[11px] font-semibold hover:bg-rose-100 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réessayer</span>
              </button>
            )}
          </div>

          <p className="font-medium">
            {isCorrect 
              ? testQuestion.explanation 
              : (selectedIndex !== null && testQuestion.distractorExplanations?.[selectedIndex]) || testQuestion.explanation}
          </p>

          {isCorrect && (
            <div className="pt-2 flex items-center space-x-2 text-emerald-800 font-semibold border-t border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nuance assimilée dans ton esprit ! Passe maintenant à la pratique vocale ci-dessous.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
