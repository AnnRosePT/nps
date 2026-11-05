import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SeniorModeContextType {
  seniorMode: boolean;
  toggleSeniorMode: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({ seniorMode: false, toggleSeniorMode: () => {} });

export const useSeniorMode = () => useContext(SeniorModeContext);

export function SeniorModeProvider({ children }: { children: ReactNode }) {
  const [seniorMode, setSeniorMode] = useState(() => localStorage.getItem('seniorMode') === 'true');

  useEffect(() => {
    localStorage.setItem('seniorMode', String(seniorMode));
    if (seniorMode) {
      document.documentElement.classList.add('senior-mode');
    } else {
      document.documentElement.classList.remove('senior-mode');
    }
  }, [seniorMode]);

  return (
    <SeniorModeContext.Provider value={{ seniorMode, toggleSeniorMode: () => setSeniorMode(p => !p) }}>
      {children}
    </SeniorModeContext.Provider>
  );
}
