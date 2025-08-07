import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Alt key combinations
      if (event.altKey) {
        const key = `Alt+${event.key}`;
        if (shortcuts[key]) {
          event.preventDefault();
          shortcuts[key]();
        }
      }
      
      // Check for other key combinations
      const key = event.key;
      if (shortcuts[key]) {
        event.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};