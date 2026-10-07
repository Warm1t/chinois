import React, { useState } from 'react';
import { CurriculumModule, NuanceCard, AnchoringRecord, AnkiWord } from '../types/fluent';
import { ModuleLessonView } from './ModuleLessonView';
import { 
  Compass, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Repeat, 
  Boxes, 
  Volume2, 
  Link2,
  Award
} from 'lucide-react';

interface CurriculumOverviewProps {
  modules: CurriculumModule[];
  cards: NuanceCard[];
  anchoringRecords: Record<string, AnchoringRecord>;
  currentCardId?: string;
  onSelectCard?: (cardId: string) => void;
  onClose?: () => void;
  syncedAnkiWords?: AnkiWord[];
  onExerciseCompleted?: (cardId: string) => void;
  onOpenAnchorSession?: () => void;
}

export const CurriculumOverview: React.FC<CurriculumOverviewProps> = ({
  modules,
  cards,
  anchoringRecords,
  currentCardId,
  onSelectCard,
  onClose,
  syncedAnkiWords = [],
  onExerciseCompleted = () => {},
  onOpenAnchorSession,
}) => {
  // État local : si une fiche est ouverte en détail pour la leçon dans l'onglet Modules
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Si une leçon est sélectionnée, on affiche la leçon complète ici dans Modules
  if (activeLessonId) {
    return (
      <ModuleLessonView
        cardId={activeLessonId}
        onSelectCard={(id) => {
          setActiveLessonId(id);
          if (onSelectCard) onSelectCard(id);
        }}
        onBackToModules={() => setActiveLessonId(null)}
        onExerciseCompleted={onExerciseCompleted}
        syncedAnkiWords={syncedAnkiWords}
        onOpenAnchorSession={onOpenAnchorSession}
      />
    );
  }

  // Calcul des statistiques globales
  const totalCards = cards.length;
  const masteredCount = Object.values(anchoringRecords).filter(r => r.stage === 'ancre').length;
  const learningCount = Object.values(anchoringRecords).filter(r => r.stage === 'assimilation').length;
  const globalProgress = Math.round((masteredCount / totalCards) * 100);

  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'aspect_temps':
        return <Clock className="w-4 h-4 text-rose-600" />;
      case 'recurrence_frequence':
        return <Repeat className="w-4 h-4 text-amber-600" />;
      case 'structures_speciales':
        return <Boxes className="w-4 h-4 text-indigo-600" />;
      case 'complements':
        return <Volume2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Link2 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6 animate-fadeIn">
      
      {/* En-tête de la trame pédagogique */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-[#c23b22]/10 text-[#c23b22]">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c23b22]">
              Trame Pédagogique (Syllabus Complet)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 font-serif">
            Les Modules d'Élocution & Nuances Clés
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            18 nuances stratégiques pour transformer tes mots isolés en pensées natives structurées.
          </p>
        </div>

        {/* Jauge d'avancement globale */}
        <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl flex items-center space-x-4 min-w-[220px]">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-stone-200"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * globalProgress) / 100}
                className="text-[#c23b22] transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-black text-stone-900 font-mono">
              {globalProgress}%
            </span>
          </div>

          <div className="text-xs space-y-0.5">
            <div className="font-bold text-stone-900 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{masteredCount} / {totalCards} ancrées</span>
            </div>
            <div className="text-stone-500 text-[11px]">
              {learningCount} en cours d'assimilation
            </div>
          </div>
        </div>
      </div>

      {/* Grille des Modules */}
      <div className="space-y-6">
        {modules.map((module) => {
          const moduleCards = cards.filter(c => c.moduleId === module.id);
          const moduleMastered = moduleCards.filter(c => anchoringRecords[c.id]?.stage === 'ancre').length;
          const modulePercent = Math.round((moduleMastered / moduleCards.length) * 100);

          return (
            <div
              key={module.id}
              className="rounded-2xl border border-stone-200/90 bg-[#fdfbf7] p-5 sm:p-6 space-y-4 hover:border-stone-300 transition-colors shadow-2xs"
            >
              {/* Header du Module */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/70 pb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-2xs mt-0.5">
                    {getModuleIcon(module.category)}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
                      {module.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {module.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-stone-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    {moduleMastered} / {moduleCards.length} fiches ({modulePercent}%)
                  </span>
                </div>
              </div>

              {/* Description pédagogique courte */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {module.description}
              </p>

              {/* Liste interactive des fiches de ce module */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {moduleCards.map((card) => {
                  const rec = anchoringRecords[card.id];
                  const isCurrent = card.id === currentCardId;

                  let stageBadge = (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 border border-stone-200">
                      🌱 Découverte
                    </span>
                  );

                  if (rec?.stage === 'ancre') {
                    stageBadge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>🌳 Ancré ({rec.voiceBestScore}%)</span>
                      </span>
                    );
                  } else if (rec?.stage === 'assimilation') {
                    stageBadge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                        🌿 Assimilation
                      </span>
                    );
                  }

                  return (
                    <button
                      key={card.id}
                      onClick={() => {
                        setActiveLessonId(card.id);
                        if (onSelectCard) onSelectCard(card.id);
                        if (onClose) onClose();
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isCurrent
                          ? 'bg-white border-[#c23b22] shadow-sm ring-2 ring-[#c23b22]/20'
                          : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1 pr-2 min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-stone-900 truncate block">
                            {card.title}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-stone-500 truncate">
                          {card.structuralFormula}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {stageBadge}
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
