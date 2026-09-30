import React, { useEffect, useState } from 'react';
import { Moon, Sun, Feather, Sparkles } from 'lucide-react';
import { AppTheme, getAppTheme, setAppTheme, toggleAppTheme } from '../utils/themeUtils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'button';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'pill'
}) => {
  const [theme, setTheme] = useState<AppTheme>(getAppTheme());

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setTheme(e.detail as AppTheme);
    };

    window.addEventListener('fluent_theme_changed', handleThemeChange);
    return () => {
      window.removeEventListener('fluent_theme_changed', handleThemeChange);
    };
  }, []);

  if (variant === 'button') {
    return (
      <button
        onClick={() => toggleAppTheme()}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all shadow-2xs hover:-translate-y-0.5 ${className}`}
        title={theme === 'dark' ? "Passer au Mode Encre (Papier clair)" : "Passer au Mode Sombre (Nuit d'Encre)"}
      >
        {theme === 'dark' ? (
          <>
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Sombre</span>
          </>
        ) : (
          <>
            <Feather className="w-3.5 h-3.5 text-[#c23b22]" />
            <span>Mode Encre</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className={`flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-bold shadow-inner ${className}`}>
      <button
        onClick={() => setAppTheme('ink')}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-all ${
          theme === 'ink'
            ? 'bg-white text-stone-900 shadow-2xs'
            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
        }`}
        title="Mode Encre & Papier traditionnel (idéal en journée, ambiance estampe et papier de Xuan)"
      >
        <Feather className="w-3 h-3 text-[#c23b22]" />
        <span className="hidden sm:inline">Encre</span>
      </button>

      <button
        onClick={() => setAppTheme('dark')}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-all ${
          theme === 'dark'
            ? 'bg-stone-900 text-amber-300 shadow-2xs'
            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
        }`}
        title="Mode Sombre & Pierre à Encre (confort nocturne, contraste élevé et repos des yeux)"
      >
        <Moon className="w-3 h-3 text-amber-400" />
        <span className="hidden sm:inline">Sombre</span>
      </button>
    </div>
  );
};
