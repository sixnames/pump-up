'use client';

import { useEffect } from 'react';

interface UseKeyboardShortcutProps {
  key: string;
  callbackAction: () => void;
  isWithShift?: boolean;
  skipShortcut?: boolean;
}

// codes shift + arrow up = 16 + 38 = 54

export function useKeyboardShortcut({ key, callbackAction, isWithShift, skipShortcut }: UseKeyboardShortcutProps) {
  useEffect(() => {
    if (skipShortcut) {
      return;
    }

    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (isWithShift) {
        if (e.shiftKey && e.key === key) {
          e.preventDefault();
          callbackAction();
        }
        return;
      } else {
        if (e.key === key && !e.shiftKey) {
          e.preventDefault();
          callbackAction();
        }
      }
    }

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [key, callbackAction, isWithShift, skipShortcut]);
}
