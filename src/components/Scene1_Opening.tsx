import { motion } from 'motion/react';

interface Props {
  key?: string | number;
  onNext: () => void;
}

export default function Scene1_Opening({ onNext }: Props) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* Subtle background particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div 
        className="z-10 text-center px-6 max-w-3xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        <h1 className="font-serif text-3xl md:text-5xl leading-relaxed text-gray-300 mb-12 tracking-wide font-light">
          تحذير... <br/>
          <span className="text-white text-glow mt-4 block">دخولكِ لهذا الموقع قد يغير مشاعركِ للأبد...</span>
        </h1>

        <motion.button
          onClick={onNext}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-sans font-bold text-xl shadow-[0_0_20px_rgba(255,20,147,0.5)] hover:shadow-[0_0_30px_rgba(255,20,147,0.8)] transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          ابدئي الرحلة ❤️
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
