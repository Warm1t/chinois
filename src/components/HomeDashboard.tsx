import React from 'react';
import { NuanceCard, CurriculumModule, AnchoringRecord, AnkiWord, DailyHanzi } from '../types/fluent';
import { DailyHanziCard } from './DailyHanziCard';
import { 
  Play, 
  Anchor, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Compass, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Mic, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  Bell,
  MessageSquareQuote,
  Smile
} from 'lucide-react';

interface HomeDashboardProps {
  modules: CurriculumModule[];
  cards: NuanceCard[];
  anchoringRecords: Record<string, AnchoringRecord>;
  syncedAnkiWords: AnkiWord[];
  streakDays: number;
  dueCards: NuanceCard[];
  todayHanzi: DailyHanzi;
  onOpenAppleSyncModal: () => void;
  onStartGuidedAction: (cardId: string, actionType: 'card' | 'anchor') => void;
  onNavigateToView: (view: 'lab' | 'curriculum') => void;
  onOpenAnkiModal: () => void;
  onOpenCalendarModal: () => void;
  onSelectCard: (cardId: string) => void;
  onSelectPreviousHanzi?: () => void;
  onSelectNextHanzi?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  modules,
  cards,
  anchoringRecords,
  syncedAnkiWords,
  streakDays,
  dueCards,
  todayHanzi,
  onOpenAppleSyncModal,
  onStartGuidedAction,
  onNavigateToView,
  onOpenAnkiModal,
  onOpenCalendarModal,
  onSelectCard,
  onSelectPreviousHanzi,
  onSelectNextHanzi,
}) => {
  const totalCards = cards.length;
  const anchoredCount = Object.values(anchoringRecords).filter(r => r.stage === 'ancre').length;
  const learningCount = Object.values(anchoringRecords).filter(r => r.stage === 'assimilation').length;
  const progressPercent = Math.round((anchoredCount / totalCards) * 100);

  // Détermination intelligente de l'action recommandée du jour
  let nextAction: {
    type: 'anchor' | 'finish_oral' | 'new_card' | 'all_done';
    card?: NuanceCard;
    badge: string;
    title: string;
    formula?: string;
    description: string;
    buttonText: string;
    timeEstimate: string;
  };

  if (dueCards.length > 0) {
    nextAction = {
      type: 'anchor',
      badge: `Répétition Espacée (${dueCards.length} à rafraîchir)`,
      title: "Consolidation Mémoire : Session d'Ancrage du Jour",
      description: "Tes neurones sont prêts pour consolider les nuances précédentes selon la courbe de l'oubli. Un rappel express pour ne rien perdre !",
      buttonText: `Lancer l'Ancrage (${dueCards.length} nuances)`,
      timeEstimate: `${Math.max(3, dueCards.length * 2)} min`,
    };
  } else {
    const inProgressCard = cards.find(
      c => anchoringRecords[c.id]?.stage === 'assimilation' && (anchoringRecords[c.id]?.voiceBestScore || 0) < 80
    );

    if (inProgressCard) {
      nextAction = {
        type: 'finish_oral',
        card: inProgressCard,
        badge: `${inProgressCard.moduleTitle} • Étape Orale`,
        title: `Pratique Vocale : ${inProgressCard.title}`,
        formula: inProgressCard.structuralFormula,
        description: "Tu as validé le test de discrimination écrit ! Passe maintenant au micro pour sceller la prononciation et valider l'ancrage définitif.",
        buttonText: "Continuer vers le micro",
        timeEstimate: "3-4 min",
      };
    } else {
      const nextUndiscovered = cards.find(
        c => !anchoringRecords[c.id] || anchoringRecords[c.id]?.stage === 'decouvert'
      );

      if (nextUndiscovered) {
        nextAction = {
          type: 'new_card',
          card: nextUndiscovered,
          badge: `${nextUndiscovered.moduleTitle} • ${nextUndiscovered.level}`,
          title: `Nouvelle Nuance : ${nextUndiscovered.title}`,
          formula: nextUndiscovered.structuralFormula,
          description: `Découvre la formule clé et teste ta compréhension avec le test de discrimination avant la pratique orale.`,
          buttonText: "Commencer cette nuance",
          timeEstimate: "5-6 min",
        };
      } else {
        nextAction = {
          type: 'all_done',
          card: cards[0],
          badge: "🎉 Félicitations !",
          title: "Toutes les 18 nuances sont ancrées en mémoire durable !",
          description: "Tu as terminé la totalité du cursus HSK 3-4 ! Tu peux revisiter n'importe quel module ou faire une session de perfectionnement oral.",
          buttonText: "Session libre de perfectionnement",
          timeEstimate: "Libre",
        };
      }
    }
  }

  const handleLaunchMainAction = () => {
    if (nextAction.type === 'anchor') {
      onStartGuidedAction(dueCards[0]?.id || cards[0].id, 'anchor');
    } else if (nextAction.card) {
      onStartGuidedAction(nextAction.card.id, 'card');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* 1. CARTE HERO STYLE PONPON MANIA / BD INTERACTIVE (Avec Sceau/Disque Vinyle animé) */}
      <div className="bg-[#1c1917] text-white rounded-3xl p-6 sm:p-9 border-2 border-stone-900 shadow-[6px_6px_0px_#c23b22] relative overflow-hidden group">
        
        {/* Disque Calligraphique Vinyle Flottant (Inspiration Ponpon Mania Vinyl) */}
        <div className="absolute -right-12 -top-12 sm:right-6 sm:top-6 w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-stone-800 bg-[#252220] flex items-center justify-center pointer-events-none select-none animate-float shadow-2xl opacity-40 sm:opacity-90">
          {/* Sillons du vinyle */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-stone-700/60 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-stone-700/80 flex items-center justify-center">
              {/* Centre rouge sceau cinnabre qui tourne lentement */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#c23b22] border-2 border-amber-300 flex items-center justify-center animate-spin-slow">
                <span className="font-serif font-black text-sm text-white chinese-text">悟</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-2xl">
          
          {/* Header de la carte d'action */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#c23b22] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-white mr-1" />
              Mission du Jour • Pilote Automatique
            </span>

            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 text-stone-300 text-[11px] font-mono border border-white/10">
              <Clock className="w-3 h-3 text-amber-400 mr-1" />
              {nextAction.timeEstimate}
            </span>
          </div>

          {/* Corps de l'Action Recommandée */}
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold uppercase">
              {nextAction.badge}
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white leading-tight">
              {nextAction.title}
            </h2>

            {nextAction.formula && (
              <div className="p-3 rounded-2xl bg-black/60 border border-stone-800 font-mono text-xs sm:text-sm text-amber-200 font-bold shadow-inner inline-block">
                ✨ Formule Clé : <span className="text-white">{nextAction.formula}</span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              {nextAction.description}
            </p>
          </div>

          {/* Gros Bouton d'Action Pop BD 1-Clic */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={handleLaunchMainAction}
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#c23b22] to-amber-600 hover:from-[#d64126] hover:to-amber-500 text-white font-black text-sm sm:text-base border-2 border-amber-300 shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all group"
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>{nextAction.buttonText}</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-xs text-stone-400 text-center sm:text-left font-medium">
              💡 Zéro hésitation : clique pour démarrer ta progression optimale.
            </span>
          </div>

        </div>

      </div>

      {/* 2. CARACTÈRE DU JOUR (DAILY HANZI) & CONNEXION IPHONE APPLE */}
      <DailyHanziCard
        hanzi={todayHanzi}
        syncedAnkiWords={syncedAnkiWords}
        onOpenAppleSyncModal={onOpenAppleSyncModal}
        onOpenAnkiModal={onOpenAnkiModal}
        onSelectPreviousHanzi={onSelectPreviousHanzi}
        onSelectNextHanzi={onSelectNextHanzi}
      />

      {/* 3. NOUVELLE CARTE BANNIÈRE : CONNEXION CALENDRIER & RAPPELS EN 1 CLIC */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-5 sm:p-6 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-white border-2 border-stone-900 text-blue-600 shadow-[2px_2px_0px_#1c1917] shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                Ne manque aucune session
              </span>
              <span className="text-xs font-bold text-stone-500">15 min / jour</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-stone-900 mt-1 font-serif">
              Connecte ton Calendrier (Google, Apple, Outlook) & active tes alertes
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Reçois un rappel quotidien à l'heure de ton choix et synchronise ton emploi du temps en un clic.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCalendarModal}
          className="self-start sm:self-center inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-[2px_2px_0px_#1c1917] border border-stone-900 hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0"
        >
          <Bell className="w-4 h-4 text-amber-300" />
          <span>Configurer mes Rappels</span>
        </button>

      </div>

      {/* 3. LES 3 ÉTAPES DU PROGRAMME (Style Vignettes BD / Manhua) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-4">
        
        <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-stone-100 text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </span>
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider font-serif">
              La Trame Quotidienne en 3 Chapitres
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-400">10-15 min par jour</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Chapitre 1 : Ancrage */}
          <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
            dueCards.length > 0 
              ? 'bg-amber-50 border-stone-900 shadow-[3px_3px_0px_#1c1917]' 
              : 'bg-stone-50 border-stone-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-black text-stone-500 uppercase">Chapitre 01</span>
                <Anchor className={`w-4 h-4 ${dueCards.length > 0 ? 'text-amber-700' : 'text-emerald-600'}`} />
              </div>
              <h4 className="text-sm font-black text-stone-900 mb-1">Répétition Espacée</h4>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {dueCards.length > 0 
                  ? `${dueCards.length} nuance(s) arrivées à échéance cognitive aujourd'hui.` 
                  : "Toutes les révisions d'aujourd'hui sont à jour !"}
              </p>
            </div>
            {dueCards.length > 0 ? (
              <button
                onClick={() => onStartGuidedAction(dueCards[0].id, 'anchor')}
                className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs border border-stone-900 shadow-2xs transition-all"
              >
                Lancer ({dueCards.length})
              </button>
            ) : (
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Consolidé pour aujourd'hui
              </span>
            )}
          </div>

          {/* Chapitre 2 : Découverte & Test */}
          <div className="p-4 rounded-2xl border-2 bg-stone-50 border-stone-200 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-black text-stone-500 uppercase">Chapitre 02</span>
              <BookOpen className="w-4 h-4 text-[#c23b22]" />
            </div>
            <h4 className="text-sm font-black text-stone-900 mb-1">Leçon & Test Actif</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Formule de pensée, décryptage des pièges et test actif de discrimination par choix ciblé.
            </p>
          </div>

          {/* Chapitre 3 : Entraînement Vocal */}
          <div className="p-4 rounded-2xl border-2 bg-stone-50 border-stone-200 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-black text-stone-500 uppercase">Chapitre 03</span>
              <Mic className="w-4 h-4 text-rose-600" />
            </div>
            <h4 className="text-sm font-black text-stone-900 mb-1">Pratique Vocale</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Prononciation au micro sans coupure brutale, écoute 0.8x et validation de l'élocution native (≥ 80%).
            </p>
          </div>

        </div>

      </div>

      {/* 4. STATISTIQUES TACTILES STYLE STICKERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Streak */}
        <div className="bg-white p-5 rounded-2xl border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 border border-stone-900">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 font-serif">
              {streakDays} jours
            </div>
            <div className="text-xs text-stone-500 font-medium">
              Série d'assiduité active
            </div>
          </div>
        </div>

        {/* Nuances Ancrées */}
        <div className="bg-white p-5 rounded-2xl border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-stone-900">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 font-serif">
              {anchoredCount} / {totalCards}
            </div>
            <div className="text-xs text-stone-500 font-medium">
              Nuances ancrées ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* Cartes Anki */}
        <div 
          onClick={onOpenAnkiModal}
          className="bg-white p-5 rounded-2xl border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] flex items-center justify-between cursor-pointer hover:bg-amber-50/50 transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-stone-100 text-stone-800 border border-stone-900 group-hover:bg-amber-100 transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900 font-serif">
                {syncedAnkiWords.length}
              </div>
              <div className="text-xs text-stone-500 font-medium">
                Cartes Anki synchronisées
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
        </div>

      </div>

      {/* 5. VUE SUR LES 5 MODULES (Feuilleton) */}
      <div className="bg-[#fcfaf7] rounded-3xl p-6 sm:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-4">
        
        <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
          <div>
            <h3 className="text-base font-black text-stone-900 font-serif">
              Progression dans les 5 Modules
            </h3>
            <p className="text-xs text-stone-500">
              Chaque module t'apporte un réflexe de pensée automatique.
            </p>
          </div>

          <button
            onClick={() => onNavigateToView('curriculum')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 transition-colors shadow-2xs"
          >
            <span>Voir le Syllabus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {modules.map((mod, idx) => {
            const moduleCards = cards.filter(c => c.moduleId === mod.id);
            const masteredInMod = moduleCards.filter(c => anchoringRecords[c.id]?.stage === 'ancre').length;
            const modPercent = Math.round((masteredInMod / moduleCards.length) * 100);
            const isCompleted = masteredInMod === moduleCards.length;
            const isCurrent = !isCompleted && moduleCards.some(c => !anchoringRecords[c.id] || anchoringRecords[c.id]?.stage !== 'ancre');

            return (
              <div
                key={mod.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-white border-stone-900 shadow-[3px_3px_0px_#c23b22]'
                    : 'bg-white/80 border-stone-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
                      Tome {idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900">
                      {mod.title.split(' : ')[1] || mod.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#c23b22]/10 text-[#c23b22] border border-[#c23b22]/30">
                        En cours
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Terminé
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <div className="w-24 bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-300">
                    <div 
                      className="bg-[#c23b22] h-full transition-all duration-700"
                      style={{ width: `${modPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-black text-stone-800 min-w-[45px] text-right">
                    {masteredInMod}/{moduleCards.length}
                  </span>

                  <button
                    onClick={() => {
                      const target = moduleCards.find(c => anchoringRecords[c.id]?.stage !== 'ancre') || moduleCards[0];
                      onSelectCard(target.id);
                    }}
                    className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
                    title="Ouvrir ce module"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
