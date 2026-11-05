import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface SeniorModeContextType {
  seniorMode: boolean;
  toggleSeniorMode: () => void;
  setSeniorMode: (enabled: boolean) => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({
  seniorMode: false,
  toggleSeniorMode: () => {},
  setSeniorMode: () => {},
});

export const useSeniorMode = () => useContext(SeniorModeContext);

export function SeniorModeProvider({ children }: { children: ReactNode }) {
  const [seniorMode, setSeniorModeState] = useState(() => {
    try {
      return localStorage.getItem('seniorMode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSeniorMode = useCallback(() => {
    setSeniorModeState((prev) => !prev);
  }, []);

  const setSeniorMode = useCallback((enabled: boolean) => {
    setSeniorModeState(enabled);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('seniorMode', String(seniorMode));
    } catch {
      // Ignore storage errors in restricted contexts
    }

    if (seniorMode) {
      document.documentElement.classList.add('senior-mode');
      document.body.setAttribute('data-senior-mode', 'true');
    } else {
      document.documentElement.classList.remove('senior-mode');
      document.body.removeAttribute('data-senior-mode');
    }
  }, [seniorMode]);

  // Support accessibility shortcut: Alt + S to toggle Senior Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        toggleSeniorMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSeniorMode]);

  return (
    <SeniorModeContext.Provider value={{ seniorMode, toggleSeniorMode, setSeniorMode }}>
      {children}
    </SeniorModeContext.Provider>
  );
}
