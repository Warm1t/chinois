import React, { useState, useMemo } from 'react';
import { CurriculumModule, NuanceCard, AnchoringRecord, AnkiWord } from '../types/fluent';
import { ModuleLessonView } from './ModuleLessonView';
import { ErrorBoundary } from './ErrorBoundary';
import { 
  Compass, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Repeat, 
  Boxes, 
  Volume2, 
  Link2,
  Award,
  Search,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CurriculumOverviewProps {
  modules: CurriculumModule[];
  cards: NuanceCard[];
  anchoringRecords?: Record<string, AnchoringRecord>;
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
  anchoringRecords = {},
  currentCardId,
  onSelectCard,
  onClose,
  syncedAnkiWords = [],
  onExerciseCompleted = () => {},
  onOpenAnchorSession,
}) => {
  // État local : leçon ouverte en détail
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Catégorie sélectionnée pour le filtrage
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtrage des modules et cartes (doit impérativement être appelé AVANT tout return conditionnel !)
  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      // 1. Filtre par catégorie
      if (selectedCategory !== 'all' && module.category !== selectedCategory) {
        return false;
      }

      // 2. Filtre par recherche textuelle
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const moduleMatch = module.title.toLowerCase().includes(q) || 
                            module.subtitle.toLowerCase().includes(q) || 
                            module.description.toLowerCase().includes(q);

        const cardMatch = cards
          .filter(c => c.moduleId === module.id)
          .some(c => 
            c.title.toLowerCase().includes(q) ||
            c.structuralFormula.toLowerCase().includes(q) ||
            c.targetChinese.toLowerCase().includes(q) ||
            c.situationFrench.toLowerCase().includes(q) ||
            c.level.toLowerCase().includes(q)
          );

        return moduleMatch || cardMatch;
      }

      return true;
    });
  }, [modules, cards, selectedCategory, searchQuery]);

  // Si une leçon est sélectionnée, on affiche la leçon complète protégée par ErrorBoundary
  if (activeLessonId) {
    return (
      <ErrorBoundary
        fallbackTitle="Impossible de charger cette leçon"
        onReset={() => setActiveLessonId(null)}
      >
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
      </ErrorBoundary>
    );
  }

  // Sécurité enregistrements d'ancrage
  const safeRecords = anchoringRecords || {};

  // Calcul des statistiques globales
  const totalCards = cards.length;
  const masteredCount = Object.values(safeRecords).filter(r => r?.stage === 'ancre').length;
  const learningCount = Object.values(safeRecords).filter(r => r?.stage === 'assimilation').length;
  const globalProgress = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  // Liste des catégories avec libellés et icônes
  const CATEGORIES = [
    { id: 'all', label: 'Tous les modules', icon: Layers, count: totalCards },
    { id: 'aspect_temps', label: '⏳ Temps & Aspect', icon: Clock, count: cards.filter(c => c.category === 'aspect_temps').length },
    { id: 'recurrence_frequence', label: '🔁 Récurrence & Fréquence', icon: Repeat, count: cards.filter(c => c.category === 'recurrence_frequence').length },
    { id: 'structures_speciales', label: '🏗️ Structures Clés (把 / 被)', icon: Boxes, count: cards.filter(c => c.category === 'structures_speciales').length },
    { id: 'complements', label: '🎯 Compléments de Résultat', icon: Volume2, count: cards.filter(c => c.category === 'complements').length },
    { id: 'connecteurs_fluidite', label: '🔗 Connecteurs & Discours', icon: Link2, count: cards.filter(c => c.category === 'connecteurs_fluidite').length },
  ];

  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'aspect_temps':
        return <Clock className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'recurrence_frequence':
        return <Repeat className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'structures_speciales':
        return <Boxes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'complements':
        return <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-6 animate-fadeIn transition-colors duration-200">
      
      {/* En-tête : Trame pédagogique & Jauge d'ancrage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-[#c23b22]/10 dark:bg-amber-400/10 text-[#c23b22] dark:text-amber-400">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c23b22] dark:text-amber-400">
              Trame Pédagogique (Syllabus Complet)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-serif">
            Les Modules d'Élocution & Nuances Clés
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            18 nuances stratégiques pour transformer tes mots isolés en pensées natives structurées.
          </p>
        </div>

        {/* Jauge d'avancement globale */}
        <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3.5 rounded-2xl flex items-center space-x-4 min-w-[220px]">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-stone-200 dark:text-stone-700"
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
                className="text-[#c23b22] dark:text-amber-400 transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-black text-stone-900 dark:text-stone-100 font-mono">
              {globalProgress}%
            </span>
          </div>

          <div className="text-xs space-y-0.5">
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{masteredCount} / {totalCards} ancrées</span>
            </div>
            <div className="text-stone-500 dark:text-stone-400 text-[11px]">
              {learningCount} en cours d'assimilation
            </div>
          </div>
        </div>
      </div>

      {/* BARRE DE CATÉGORIES & RECHERCHE */}
      <div className="space-y-3">
        
        {/* Champ de recherche rapide */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une nuance (ex: 把, 了, encore, durée, résultat, HSK 3...)"
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c23b22]/30 dark:focus:ring-amber-500/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Pilules de Catégorisation */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300 dark:text-amber-600' : 'text-stone-400'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected 
                    ? 'bg-stone-800 dark:bg-stone-200 text-stone-200 dark:text-stone-800' 
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grille des Modules Filtrés */}
      <div className="space-y-6">
        {filteredModules.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              Aucun module ne correspond à ta recherche « {searchQuery} ».
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-[#c23b22] dark:text-amber-400 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredModules.map((module) => {
            const moduleCards = cards.filter(c => c.moduleId === module.id);
            const moduleMastered = moduleCards.filter(c => safeRecords[c.id]?.stage === 'ancre').length;
            const modulePercent = Math.round((moduleMastered / moduleCards.length) * 100);

            return (
              <div
                key={module.id}
                className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-[#fdfbf7] dark:bg-stone-900/60 p-5 sm:p-6 space-y-4 hover:border-stone-300 dark:hover:border-stone-700 transition-colors shadow-2xs"
              >
                {/* Header du Module */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/70 dark:border-stone-800 pb-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs mt-0.5">
                      {getModuleIcon(module.category)}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                        {module.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                        {module.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                    <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                      {moduleMastered} / {moduleCards.length} fiches ({modulePercent}%)
                    </span>
                  </div>
                </div>

                {/* Description pédagogique courte */}
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {module.description}
                </p>

                {/* Liste interactive des fiches de ce module */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {moduleCards.map((card) => {
                    const rec = safeRecords[card.id];
                    const isCurrent = card.id === currentCardId;

                    let stageBadge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                        🌱 Découverte
                      </span>
                    );

                    if (rec?.stage === 'ancre') {
                      stageBadge = (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                          <span>🌳 Ancré ({rec.voiceBestScore}%)</span>
                        </span>
                      );
                    } else if (rec?.stage === 'assimilation') {
                      stageBadge = (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
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
                        className={`text-left p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                          isCurrent
                            ? 'bg-white dark:bg-stone-800 border-[#c23b22] dark:border-amber-500 shadow-sm ring-2 ring-[#c23b22]/20'
                            : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-2xs'
                        }`}
                      >
                        <div className="space-y-1.5 pr-2 min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                              {card.level}
                            </span>
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate block">
                              {card.title}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                            {card.structuralFormula}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {stageBadge}
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
