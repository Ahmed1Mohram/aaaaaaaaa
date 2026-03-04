import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface Props {
  key?: string | number;
  herName: string;
}

export default function Scene6_Proposal({ herName }: Props) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0005] relative overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2 } }}
    >
      {/* Soft glowing lights background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="proposal"
            className="text-center z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ duration: 1.5 }}
          >
            <h1 className="font-serif text-6xl md:text-8xl text-white mb-8 font-light">
              {herName}،
            </h1>
            <h2 className="font-serif text-5xl md:text-7xl text-pink-200 mb-20 text-glow leading-relaxed">
              هل ستبقين معي للأبد؟
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <motion.button
                className="px-14 py-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-sans font-bold text-2xl shadow-[0_0_30px_rgba(255,20,147,0.5)] hover:shadow-[0_0_50px_rgba(255,20,147,0.8)] transition-all border border-pink-400/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
              >
                نعم
              </motion.button>
              <motion.button
                className="px-14 py-6 rounded-full bg-white text-pink-600 font-sans font-bold text-2xl shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
              >
                بالتأكيد نعم
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            className="text-center z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, type: "spring" }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-9xl mb-10"
            >
              ❤️
            </motion.div>
            <h1 className="font-serif text-6xl md:text-8xl text-white text-glow-gold mb-8">
              أحبكِ.
            </h1>
            <p className="text-3xl md:text-4xl text-pink-200 font-serif italic">
              دائماً وإلى الأبد.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
