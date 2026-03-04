import { useState, useRef, useEffect } from 'react';
import { Music, Music2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Using a reliable public domain romantic piano piece (Chopin - Nocturne Op 9 No 2)
    audioRef.current = new Audio('https://upload.wikimedia.org/wikipedia/commons/c/c8/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.ogg');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const playOnInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          document.removeEventListener('click', playOnInteraction);
        }).catch(err => console.log("Auto-play failed:", err));
      }
    };

    document.addEventListener('click', playOnInteraction);
    
    return () => {
      document.removeEventListener('click', playOnInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full glass-panel text-white hover:text-pink-400 transition-colors flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isPlaying ? (
        <Music size={24} className="animate-pulse text-pink-500" />
      ) : (
        <Music2 size={24} />
      )}
    </motion.button>
  );
}
