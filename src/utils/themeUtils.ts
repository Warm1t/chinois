export type AppTheme = 'ink' | 'dark';

const THEME_STORAGE_KEY = 'fluent_app_theme';

/**
 * Récupérer le thème actuel ('ink' par défaut pour le style Encre & Papier, ou 'dark' pour Mode Sombre)
 */
export const getAppTheme = (): AppTheme => {
  if (typeof window === 'undefined') return 'ink';
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'ink') {
    return saved;
  }
  return 'ink';
};

/**
 * Appliquer les classes CSS sur <html>
 */
export const applyThemeToDocument = (theme: AppTheme): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('ink');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.classList.add('ink');
    root.setAttribute('data-theme', 'ink');
  }
};

/**
 * Définir le thème et diffuser l'événement global
 */
export const setAppTheme = (theme: AppTheme): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyThemeToDocument(theme);
  window.dispatchEvent(new CustomEvent('fluent_theme_changed', { detail: theme }));
};

/**
 * Basculer entre Mode Encre et Mode Sombre
 */
export const toggleAppTheme = (): AppTheme => {
  const current = getAppTheme();
  const next: AppTheme = current === 'dark' ? 'ink' : 'dark';
  setAppTheme(next);
  return next;
};
