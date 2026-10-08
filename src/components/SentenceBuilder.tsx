import React, { useState, useEffect } from 'react';
import { SentenceBuilderExercise } from '../types/fluent';
import { playChineseAudio } from '../utils/speechUtils';
import { 
  Puzzle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface SentenceBuilderProps {
  exercise: SentenceBuilderExercise;
  onCompleted?: () => void;
  alreadyCompleted?: boolean;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  exercise,
  onCompleted,
  alreadyCompleted = false
}) => {
  // Blocs placés dans la zone de construction
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  // Blocs disponibles dans la banque (avec IDs uniques pour gérer les doublons éventuels)
  const [availableTokens, setAvailableTokens] = useState<{ id: string; text: string }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Initialisation à chaque changement d'exercice
  useEffect(() => {
    if (!exercise || !Array.isArray(exercise.tokens)) return;

    // Si déjà validé auparavant, pré-remplir avec l'ordre correct
    if (alreadyCompleted) {
      setSelectedTokens(exercise.correctTokens || []);
      setAvailableTokens([]);
      setIsSubmitted(true);
      setIsCorrect(true);
    } else {
      // Mélanger les tokens
      const initialTokens = (exercise.tokens || []).map((text, idx) => ({
        id: `token-${idx}-${text}`,
        text
      }));
      // Fisher-Yates shuffle
      const shuffled = [...initialTokens].sort(() => Math.random() - 0.5);
      setAvailableTokens(shuffled);
      setSelectedTokens([]);
      setIsSubmitted(false);
      setIsCorrect(false);
    }
    setShowHint(false);
  }, [exercise, alreadyCompleted]);

  // Ajouter un bloc à la zone de construction
  const handleSelectToken = (tokenObj: { id: string; text: string }) => {
    if (isSubmitted && isCorrect) return;

    setSelectedTokens(prev => [...prev, tokenObj.text]);
    setAvailableTokens(prev => prev.filter(t => t.id !== tokenObj.id));
    setIsSubmitted(false);
  };

  // Retirer un bloc de la zone de construction
  const handleRemoveToken = (index: number) => {
    if (isSubmitted && isCorrect) return;

    const removedText = selectedTokens[index];
    const newSelected = selectedTokens.filter((_, idx) => idx !== index);
    setSelectedTokens(newSelected);

    // Rajouter aux disponibles
    setAvailableTokens(prev => [...prev, { id: `token-readded-${Date.now()}-${removedText}`, text: removedText }]);
    setIsSubmitted(false);
  };

  // Réinitialiser la zone
  const handleReset = () => {
    const initialTokens = exercise.tokens.map((text, idx) => ({
      id: `token-${idx}-${text}`,
      text
    }));
    setAvailableTokens([...initialTokens].sort(() => Math.random() - 0.5));
    setSelectedTokens([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  // Vérifier la réponse
  const handleCheck = () => {
    if (selectedTokens.length === 0) return;

    const assembledString = selectedTokens.join('');
    const expectedString = exercise.correctTokens.join('');

    const correct = assembledString === expectedString;
    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      playChineseAudio(expectedString, 0.95);
      if (onCompleted) {
        onCompleted();
      }
    }
  };

  if (!exercise || !Array.isArray(exercise.tokens)) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-5 animate-fadeIn">
      
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-200">
              <Puzzle className="w-4 h-4 text-indigo-700" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900">
              Atelier d'Architecture de Pensée
            </span>
            {isCorrect && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-0.5" /> Réussi
              </span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-black text-stone-900 font-serif">
            Reconstitution de Phrase : Place les blocs dans l'ordre chinois natif
          </h4>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
          title="Mélanger à nouveau"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Consigne en français */}
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span><strong>Objectif : </strong>« {exercise.promptFrench} »</span>
      </div>

      {/* Zone d'assemblage de la phrase */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
          <span>Ta phrase en cours d'assemblage (clique pour retirer un bloc) :</span>
          <span className="font-mono text-stone-400">{selectedTokens.length} / {exercise.tokens.length} blocs</span>
        </div>

        <div className={`min-h-[64px] p-3 rounded-2xl border-2 transition-all flex flex-wrap items-center gap-2 ${
          isSubmitted && isCorrect
            ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
            : isSubmitted && !isCorrect
            ? 'bg-rose-50/70 border-rose-400'
            : selectedTokens.length > 0
            ? 'bg-amber-50/40 border-stone-900'
            : 'bg-stone-100/70 border-dashed border-stone-300'
        }`}>
          {selectedTokens.length === 0 ? (
            <span className="text-xs text-stone-400 italic mx-auto">
              Clique sur les blocs ci-dessous pour construire ta phrase dans l'ordre chinois...
            </span>
          ) : (
            selectedTokens.map((token, idx) => (
              <button
                key={`selected-${idx}`}
                onClick={() => handleRemoveToken(idx)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold font-serif text-base shadow-sm border border-stone-900 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                title="Cliquer pour retirer ce bloc"
              >
                <span>{token}</span>
                <span className="text-[10px] text-stone-400 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">✕</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Banque de blocs disponibles */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
          Blocs disponibles :
        </div>

        <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-2xl bg-stone-50 border border-stone-200">
          {availableTokens.length === 0 ? (
            <span className="text-xs text-stone-400 italic mx-auto">
              Tous les blocs ont été placés ! Vérifie maintenant ta phrase.
            </span>
          ) : (
            availableTokens.map((tokenObj) => (
              <button
                key={tokenObj.id}
                onClick={() => handleSelectToken(tokenObj)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-stone-900 font-bold font-serif text-base border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {tokenObj.text}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Barre d'action : Bouton de vérification */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-stone-500 hover:text-stone-800 font-semibold flex items-center space-x-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showHint ? "Masquer l'indice" : "Besoin d'un indice sur la structure ?"}</span>
        </button>

        <button
          onClick={handleCheck}
          disabled={selectedTokens.length === 0}
          className={`px-6 py-3 rounded-2xl font-black text-xs border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] transition-all flex items-center justify-center space-x-2 ${
            isCorrect
              ? 'bg-emerald-500 text-white'
              : selectedTokens.length === exercise.tokens.length
              ? 'bg-[#c23b22] hover:bg-[#d64126] text-white hover:-translate-y-0.5 cursor-pointer'
              : 'bg-stone-200 text-stone-500 cursor-not-allowed opacity-70'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Bravo ! Phrase Validée</span>
            </>
          ) : (
            <>
              <span>Vérifier l'Ordre Syntaxique</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Indice optionnel */}
      {showHint && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 animate-fadeIn">
          💡 <em>Indice :</em> En chinois, la structure impose de poser le cadre (Sujet + Outil de manipulation) avant d'exprimer le verbe et son résultat définitif.
        </div>
      )}

      {/* Résultat et Explication Syntaxique détaillée */}
      {isSubmitted && (
        <div className={`p-4 rounded-2xl border-2 space-y-2 animate-fadeIn ${
          isCorrect 
            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
            : 'bg-rose-50 border-rose-400 text-rose-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Ordre syntaxique parfait !</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Ordre incorrect — Réajuste les blocs !</span>
                </>
              )}
            </div>

            {isCorrect && (
              <button
                onClick={() => playChineseAudio(exercise.correctTokens.join(''), 0.9)}
                className="p-1.5 rounded-lg bg-emerald-200 hover:bg-emerald-300 text-emerald-900 transition-colors"
                title="Écouter la phrase"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-xs leading-relaxed font-medium">
            {exercise.explanation}
          </p>

          {!isCorrect && (
            <div className="pt-1">
              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-900 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recommencer pour trouver le bon ordre</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

