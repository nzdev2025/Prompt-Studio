
import { useEffect, useCallback } from 'react';

export const useKeyboardShortcut = (keys: string[], callback: () => void) => {
  const handler = useCallback((event: KeyboardEvent) => {
    const [mainKey, ...modifiers] = keys.reverse();
    const ctrl = modifiers.includes('Control');
    const shift = modifiers.includes('Shift');
    const alt = modifiers.includes('Alt');
    const meta = modifiers.includes('Meta');

    if (
      event.key.toLowerCase() === mainKey.toLowerCase() &&
      event.ctrlKey === ctrl &&
      event.shiftKey === shift &&
      event.altKey === alt &&
      event.metaKey === meta
    ) {
      event.preventDefault();
      callback();
    }
  }, [keys, callback]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handler]);
};
