import React, { useState } from 'react';
import { NuanceCard, AnchoringRecord } from '../types/fluent';
import { ActiveNuanceQuiz } from './ActiveNuanceQuiz';
import { playChineseAudio } from '../utils/speechUtils';
import { recordTestSuccess, recordVoiceScore } from '../utils/anchoringUtils';
import { 
  Anchor, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  ChevronRight, 
  Award,
  Calendar,
  Flame
} from 'lucide-react';

interface DailyAnchorModalProps {
  dueCards: NuanceCard[];
  onClose: () => void;
  onRefreshRecords: () => void;
  onSelectCardForDeepPractice: (cardId: string) => void;
}

export const DailyAnchorModal: React.FC<DailyAnchorModalProps> = ({
  dueCards,
  onClose,
  onRefreshRecords,
  onSelectCardForDeepPractice,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedInSession, setCompletedInSession] = useState<string[]>([]);

  const currentCard = dueCards[currentIndex];
  const isFinished = dueCards.length === 0 || completedInSession.length === dueCards.length;

  const handleTestPassed = () => {
    if (!currentCard) return;
    recordTestSuccess(currentCard.id);
    if (!completedInSession.includes(currentCard.id)) {
      setCompletedInSession([...completedInSession, currentCard.id]);
    }
    onRefreshRecords();
  };

  const handleNext = () => {
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fcfaf7] border border-stone-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête de la session */}
        <div className="flex items-center space-x-3 border-b border-stone-200 pb-4">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 shadow-2xs">
            <Anchor className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
              Session d'Ancrage Quotidien (Répétition Espacée)
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Système de répétition espacée (SRS) : consolide les automatismes avant qu'ils ne s'effacent.
            </p>
          </div>
        </div>

        {/* Contenu selon l'état */}
        {isFinished ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">
                🎉 Toutes les nuances d'aujourd'hui sont ancrées !
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Tu as réactivé tes connexions synaptiques pour aujourd'hui. Ton prochain créneau de révision sera espacé pour consolider ta mémoire à long terme.
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md"
            >
              Fermer et retourner au labo
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Indicateur de progression dans la session */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-800">
                Nuance à rafraîchir {currentIndex + 1} sur {dueCards.length}
              </span>
              <span className="font-mono text-[#c23b22] font-bold">
                {currentCard.level} • {currentCard.title}
              </span>
            </div>

            {/* Rappel express de la formule */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-1 border border-stone-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Formule Clé de Réflexe :
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-amber-200">
                {currentCard.structuralFormula}
              </span>
            </div>

            {/* Test de discrimination active */}
            <ActiveNuanceQuiz
              testQuestion={currentCard.activeTest}
              onPassed={handleTestPassed}
              alreadyPassed={completedInSession.includes(currentCard.id)}
            />

            {/* Action barre : passer à la suivante ou approfondir à l'oral */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={() => {
                  onSelectCardForDeepPractice(currentCard.id);
                  onClose();
                }}
                className="text-xs font-bold text-[#c23b22] hover:text-[#9e2f1b] transition-colors underline underline-offset-4"
              >
                🎙️ Pratiquer cette phrase au micro dans le Labo
              </button>

              <button
                onClick={handleNext}
                disabled={!completedInSession.includes(currentCard.id) && currentIndex === dueCards.length - 1}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Nuance suivante</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
