// Type declarations for React hooks
// This fixes TypeScript errors when React types aren't properly resolved

import 'react';

declare module 'react' {
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.MutableRefObject<T | null>;
  export function useMemo<T>(factory: () => T, deps?: React.DependencyList): T;
}

