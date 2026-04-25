// src/lib/optimize.ts
import { memo, ComponentType } from 'react';

// Memo with display name preserved
export function smartMemo<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (a: Readonly<P>, b: Readonly<P>) => boolean
) {
  const Memoized = memo(Component, propsAreEqual);
  Memoized.displayName = `Memo(${Component.displayName || Component.name})`;
  return Memoized;
}

// Superficial comparison for arrays
export function shallowEqualArrays<T>(a: T[], b: T[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}
