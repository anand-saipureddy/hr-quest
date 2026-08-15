import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { load, save, blank, type Progress } from './storage';

// One place that owns progress state. Every mutation: apply the progress.ts
// function, save, and push the inverse onto the UndoBar via setWithUndo.
type Ctx = {
  progress: Progress;
  blocked: boolean;
  hydrated: boolean;
  set: (next: Progress) => void;
};

const ProgressCtx = createContext<Ctx>({ progress: blank, blocked: false, hydrated: false, set: () => {} });

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ p: Progress; blocked: boolean }>({ p: blank, blocked: false });
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<ReturnType<typeof load>['store'] | null>(null);

  useEffect(() => {
    const { progress, blocked, store } = load();
    setState({ p: progress, blocked });
    setStore(store);
    setHydrated(true);
  }, []);

  const set = (next: Progress) => {
    setState((s) => {
      if (store) save(next, store);
      return { ...s, p: next };
    });
  };

  return (
    <ProgressCtx.Provider value={{ progress: state.p, blocked: state.blocked, hydrated, set }}>
      {children}
    </ProgressCtx.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressCtx);
}
