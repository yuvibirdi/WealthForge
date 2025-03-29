export default function playSound(url: string) {
  try {
    const audio = new Audio(url);
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
    audio.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully');
    });
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Audio playback failed:', error);
      });
    }
  } catch (error) {
    console.error('Failed to create audio:', error);
  }
}