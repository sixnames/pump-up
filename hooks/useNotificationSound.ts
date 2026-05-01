'use client';

import { useToast } from '@/hooks/use-toast';
import { TOAST_WARNING } from '@/lib/constants';

export const useNotificationSound = () => {
  const { toast } = useToast();
  const play = (message: string) => {
    const audio = new Audio('/notify.wav');
    toast({
      variant: TOAST_WARNING,
      title: message,
      duration: 100000,
    });
    audio.play().catch((error) => {
      console.error('Playback failed (usually requires user interaction first):', error);
    });
  };

  return { play };
};
