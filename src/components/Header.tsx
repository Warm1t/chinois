import React from 'react';
import { Mic, Sparkles, Layers, Home, Compass, BookOpen, Bot } from 'lucide-react';
import { HeaderMenuDropdown } from './HeaderMenuDropdown';
import { ThemeToggle } from './ThemeToggle';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  currentView: 'home' | 'stories' | 'lab' | 'chat' | 'curriculum';
  onNavigate: (view: 'home' | 'stories' | 'lab' | 'chat' | 'curriculum') => void;
  currentStreak: number;
  completedExercisesCount: number;
  syncedAnkiWordsCount: number;
  onOpenAnkiModal: () => void;
  onOpenPinnedWordsModal?: () => void;
  onOpenCalendarModal: () => void;
  onOpenProfileSyncModal: () => void;
  onOpenAppleSyncModal?: () => void;
  onOpenAuthModal?: () => void;
  currentUser?: User | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentStreak,
  completedExercisesCount,
  syncedAnkiWordsCount,
  onOpenAnkiModal,
  onOpenPinnedWordsModal,
  onOpenCalendarModal,
  onOpenProfileSyncModal,
  onOpenAppleSyncModal,
  onOpenAuthModal,
  currentUser,
}) => {

  return (
    <header className="bg-[#fdfcf9]/90 backdrop-blur-md border-b-2 border-stone-200/90 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Section Gauche : Logo & Sceau interactif + Capsule Statistiques */}
          <div className="flex items-center justify-between md:justify-start space-x-3 sm:space-x-4 shrink-0">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#c23b22] flex items-center justify-center text-white shadow-[2px_2px_0px_#1c1917] font-serif border-2 border-stone-900 group-hover:-rotate-3 group-hover:scale-105 transition-all">
                <span className="font-bold text-xl chinese-text leading-none">语</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-stone-900 dark:text-stone-100 font-serif">
                  Fluent
                </h1>
              </div>
            </div>

            {/* Capsule Statistiques Quotidiennes Récapitulative (basculée à gauche pour équilibrer la barre) */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold select-none shadow-2xs">
              <span className="flex items-center space-x-1" title={`Série de ${currentStreak} jours consécutifs`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-stone-900 dark:text-stone-100">{currentStreak}j</span>
              </span>
              <span className="text-stone-300 dark:text-stone-600">•</span>
              <span className="flex items-center space-x-1" title={`${completedExercisesCount} nuances sur 18 maîtrisées à l'oral`}>
                <Mic className="w-3.5 h-3.5 text-[#c23b22]" />
                <span className="text-stone-900 dark:text-stone-100">{completedExercisesCount}/18</span>
              </span>
              {syncedAnkiWordsCount > 0 && (
                <>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <span 
                    onClick={() => {
                      if (onOpenPinnedWordsModal) onOpenPinnedWordsModal();
                      else onOpenAnkiModal();
                    }}
                    className="flex items-center space-x-1 cursor-pointer hover:text-[#c23b22] transition-colors" 
                    title={`${syncedAnkiWordsCount} mots épinglés (cliquer pour voir la liste & exporter vers Anki)`}
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-stone-900 dark:text-stone-100 font-mono">{syncedAnkiWordsCount}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Section Centrale : Navigation 5 Onglets parfaitement centrée */}
          <div className="flex-1 flex justify-center w-full md:w-auto my-1 md:my-0">
            <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800/90 p-1 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-bold shadow-inner overflow-x-auto max-w-full">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                  currentView === 'home'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </button>

              <button
                onClick={() => onNavigate('stories')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                  currentView === 'stories'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Histoires</span>
              </button>

              <button
                onClick={() => onNavigate('lab')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                  currentView === 'lab'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>Labo Vocal</span>
              </button>

              <button
                onClick={() => onNavigate('chat')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                  currentView === 'chat'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Partenaire IA</span>
              </button>

              <button
                onClick={() => onNavigate('curriculum')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                  currentView === 'curriculum'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Modules</span>
              </button>
            </div>
          </div>

          {/* Section Droite : Statut Compte (Invité / Connecté), Thème & Menu Outils Déroulant */}
          <div className="flex items-center justify-end space-x-2 text-xs shrink-0 self-end md:self-auto">
            
            {/* Statut d'Authentification Visible Directement : Invité vs Connecté */}
            {onOpenAuthModal && (
              currentUser ? (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 border-2 border-emerald-500/80 dark:border-emerald-600 text-emerald-950 dark:text-emerald-100 font-bold text-xs transition-all shadow-xs group cursor-pointer"
                  title={`Connecté : ${currentUser.email} • Synchronisation Cloud automatique active (cliquer pour gérer le compte)`}
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200">
                    Connecté
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border-2 border-amber-400/90 dark:border-amber-600 text-amber-950 dark:text-amber-100 font-bold text-xs transition-all shadow-xs group cursor-pointer"
                  title="Vous êtes actuellement en Mode Invité (données sauvegardées localement). Cliquez pour vous connecter et synchroniser !"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                  <span className="font-extrabold text-amber-900 dark:text-amber-200">
                    Invité
                  </span>
                </button>
              )
            )}

            {/* Basculeur de Mode Encre / Mode Sombre */}
            <ThemeToggle />

            {/* Menu Déroulant Unique pour tous les outils & synchronisations */}
            <HeaderMenuDropdown
              syncedAnkiWordsCount={syncedAnkiWordsCount}
              onOpenAnkiModal={onOpenAnkiModal}
              onOpenPinnedWordsModal={onOpenPinnedWordsModal}
              onOpenCalendarModal={onOpenCalendarModal}
              onOpenProfileSyncModal={onOpenProfileSyncModal}
              onOpenAppleSyncModal={onOpenAppleSyncModal}
              onOpenAuthModal={onOpenAuthModal}
              currentUser={currentUser}
            />

          </div>

        </div>
      </div>
    </header>
  );
};
