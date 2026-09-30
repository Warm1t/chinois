import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, Layers, Check, Home, Compass, Calendar, Cloud, BookOpen } from 'lucide-react';
import { VoiceSelector } from './VoiceSelector';
import { ThemeToggle } from './ThemeToggle';
import { getAppTheme, AppTheme } from '../utils/themeUtils';

interface HeaderProps {
  currentView: 'home' | 'stories' | 'lab' | 'curriculum';
  onNavigate: (view: 'home' | 'stories' | 'lab' | 'curriculum') => void;
  currentStreak: number;
  completedExercisesCount: number;
  syncedAnkiWordsCount: number;
  onOpenAnkiModal: () => void;
  onOpenCalendarModal: () => void;
  onOpenProfileSyncModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentStreak,
  completedExercisesCount,
  syncedAnkiWordsCount,
  onOpenAnkiModal,
  onOpenCalendarModal,
  onOpenProfileSyncModal,
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Logo & Calligraphy Seal (Style Ponpon Mania BD Sceau interactif) */}
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300">
                  HSK 3-4
                </span>
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

          {/* Navigation Pill Capsule (Inspiration Ponpon Mania) */}
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
              onClick={() => onNavigate('curriculum')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === 'curriculum'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>5 Modules</span>
            </button>
          </div>

          {/* Controls : Thème, Voix, Calendrier, Anki & Statistiques */}
          <div className="flex flex-wrap items-center space-x-2 text-xs self-end sm:self-center">
            
            {/* Basculeur de Mode Encre / Mode Sombre */}
            <ThemeToggle />

            {/* Sélecteur de Banque Vocale */}
            <VoiceSelector />

            {/* Bouton Connexion Calendrier & Rappels */}
            <button
              onClick={onOpenCalendarModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold shadow-2xs hover:-translate-y-0.5 transition-all"
              title="Connecter mon calendrier Google/Apple ou activer mes rappels"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Rappels & Calendrier</span>
              <span className="md:hidden">Rappels</span>
            </button>

            {/* Anki Sync Button */}
            <button
              onClick={onOpenAnkiModal}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                syncedAnkiWordsCount > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title="Lier ton application ou ton deck Anki"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Anki : </span>
              {syncedAnkiWordsCount > 0 ? (
                <span className="font-bold text-[#c23b22] flex items-center">
                  {syncedAnkiWordsCount} <Check className="w-3 h-3 ml-0.5" />
                </span>
              ) : (
                <span className="text-stone-400 font-medium">Lier</span>
              )}
            </button>

            {/* Bouton Sauvegarde & Synchro Profil */}
            <button
              onClick={onOpenProfileSyncModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold shadow-2xs hover:-translate-y-0.5 transition-all"
              title="Sauvegarder ou synchroniser ma progression sur tous mes appareils"
            >
              <Cloud className="w-3.5 h-3.5 text-[#c23b22]" />
              <span className="hidden md:inline">Profil & Synchro</span>
            </button>

            {/* Streak */}
            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span><strong className="text-stone-900">{currentStreak}j</strong></span>
            </div>

            {/* Mastered */}
            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700">
              <Mic className="w-3.5 h-3.5 text-[#c23b22]" />
              <span><strong className="text-stone-900">{completedExercisesCount}/18</strong></span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
