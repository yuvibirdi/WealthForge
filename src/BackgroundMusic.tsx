import { useEffect, useRef } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/ost.mp3');
    audioRef.current = audio;

    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });

    audio.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully');
      audio.loop = true;
      audio.volume = 0.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Audio playback failed:', error);
          // Try again after user interaction
          document.addEventListener('click', () => {
            audio.play().catch(console.error);
          }, { once: true });
        });
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return null;
} 