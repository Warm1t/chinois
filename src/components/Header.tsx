import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, Layers, Check, Home, Compass, BookOpen, Bot } from 'lucide-react';
import { HeaderMenuDropdown } from './HeaderMenuDropdown';
import { ThemeToggle } from './ThemeToggle';
import { getAppTheme, AppTheme } from '../utils/themeUtils';
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
  const [theme, setTheme] = useState<AppTheme>(getAppTheme());

  useEffect(() => {
    const handleTheme = (e: any) => {
      setTheme(e.detail as AppTheme);
    };
    window.addEventListener('fluent_theme_changed', handleTheme);
    return () => window.removeEventListener('fluent_theme_changed', handleTheme);
  }, []);

  return (
    <header className="bg-[#fdfcf9]/90 backdrop-blur-md border-b-2 border-stone-200/90 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Logo & Calligraphy Seal (Sceau interactif) */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#c23b22] flex items-center justify-center text-white shadow-[2px_2px_0px_#1c1917] font-serif border-2 border-stone-900 group-hover:-rotate-3 group-hover:scale-105 transition-all">
              <span className="font-bold text-xl chinese-text leading-none">语</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight text-stone-900 font-serif">
                  Fluent
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden md:inline transition-colors ${
                  theme === 'dark'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-[#c23b22]/10 text-[#c23b22] border-[#c23b22]/30'
                }`}>
                  {theme === 'dark' ? '🌙 Mode Sombre' : '📜 Mode Encre'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Passe du vocabulaire Anki aux pensées complètes
              </p>
            </div>
          </div>

          {/* Navigation Pill Capsule */}
          <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-full border border-stone-300 text-xs font-bold self-start sm:self-center shadow-inner">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === 'home'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => onNavigate('stories')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === 'stories'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Histoires</span>
            </button>

            <button
              onClick={() => onNavigate('lab')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === 'lab'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-rose-300" />
              <span>Labo Vocal</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === 'chat'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Partenaire IA</span>
            </button>

            <button
              onClick={() => onNavigate('curriculum')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === 'curriculum'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Modules</span>
            </button>
          </div>

          {/* Controls : Statistiques, Thème & Menu Outils Déroulant */}
          <div className="flex items-center space-x-2 text-xs self-end sm:self-center">
            
            {/* Capsule Statistiques Quotidiennes Récapitulative */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold select-none shadow-2xs">
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

            {/* Bouton Compte / Connexion Multi-Appareils */}
            {onOpenAuthModal && (
              currentUser ? (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-all shadow-2xs"
                  title={`Connecté : ${currentUser.email} • Synchro automatique active`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden md:inline font-mono text-[11px]">{currentUser.email?.split('@')[0]}</span>
                  <span className="text-[9px] bg-emerald-200/80 dark:bg-emerald-900 px-1 py-0.2 rounded font-bold">Lié</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-800 font-bold text-xs transition-all shadow-2xs"
                  title="Connecte-toi pour synchroniser ton PC et ton iPhone"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="hidden sm:inline">Connexion</span>
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
