import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('tanyy_theme');
      if (saved) return saved;
    } catch (e) {
      console.warn('ThemeContext: could not read theme from localStorage:', e?.message);
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem('tanyy_theme', theme); }
    catch (e) { console.warn('ThemeContext: could not persist theme:', e?.message); }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }),
    [theme]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
