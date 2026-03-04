import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  key?: string | number;
  onNext: () => void;
  herName: string;
}

export default function Scene2_Scan({ onNext, herName }: Props) {
  const [phase, setPhase] = useState<'scanning' | 'results' | 'reveal'>('scanning');
  const [thoughts, setThoughts] = useState(0);
  const [loveLevel, setLoveLevel] = useState(0);
  const [smiles, setSmiles] = useState(0);

  useEffect(() => {
    if (phase === 'scanning') {
      const timer = setTimeout(() => setPhase('results'), 3000);
      return () => clearTimeout(timer);
    }
    
    if (phase === 'results') {
      const interval = setInterval(() => {
        setThoughts(prev => (prev < 999 ? prev + 33 : 999));
        setLoveLevel(prev => (prev < 999999 ? prev + 33333 : 999999));
        setSmiles(prev => (prev < 100 ? prev + 2 : 100));
      }, 50);

      const timer = setTimeout(() => setPhase('reveal'), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [phase]);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-[#05000a] relative overflow-hidden font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2 } }}
    >
      <AnimatePresence mode="wait">
        {phase === 'scanning' && (
          <motion.div 
            key="scanning"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
          >
            <div className="w-48 h-48 border-2 border-pink-500/30 rounded-full flex items-center justify-center relative mb-8 mx-auto">
              <motion.div 
                className="absolute inset-0 border-t-2 border-pink-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-4 border-b-2 border-purple-500 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-pink-400 text-xl font-bold tracking-widest animate-pulse">جاري المسح...</span>
            </div>
            <p className="text-gray-400 text-lg tracking-widest uppercase">الوصول إلى بيانات قلبي وعقلكِ</p>
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div 
            key="results"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1 }}
          >
            <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center justify-center">
              <span className="text-gray-300 text-sm md:text-base tracking-widest uppercase mb-4">مرات تفكيري بكِ اليوم</span>
              <span className="text-5xl font-bold text-pink-400">+{thoughts}</span>
            </div>
            <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center justify-center border-pink-500/40 shadow-[0_0_30px_rgba(255,20,147,0.2)]">
              <span className="text-gray-300 text-sm md:text-base tracking-widest uppercase mb-4">مستوى الحب</span>
              <span className="text-6xl font-bold text-white text-glow">%{loveLevel}</span>
            </div>
            <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center justify-center">
              <span className="text-gray-300 text-sm md:text-base tracking-widest uppercase mb-4">الابتسامات التي رسمتِها</span>
              <span className="text-5xl font-bold text-purple-400">%{smiles}</span>
            </div>
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div 
            key="reveal"
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            onClick={onNext}
          >
            <motion.h2 
              className="font-serif text-7xl md:text-9xl text-white text-glow tracking-widest"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            >
              {herName}
            </motion.h2>
            <motion.p
              className="absolute bottom-16 text-gray-400 text-xl tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              اضغط في أي مكان للمتابعة
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
