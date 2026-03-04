import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface Props {
  key?: string | number;
  onNext: () => void;
}

const QUESTIONS = [
  {
    question: "ما مدى السعادة التي تجعلينني أشعر بها اليوم؟",
    answers: ["سعيد جداً", "في قمة السعادة", "سعادة لا توصف"],
    correct: 2
  },
  {
    question: "اختاري: أنا أم الشوكولاتة؟",
    answers: ["الشوكولاتة", "أنت", "أنت مغطى بالشوكولاتة"],
    correct: 2
  },
  {
    question: "من يصالح الآخر أولاً بعد أي شجار بيننا؟",
    answers: ["أنا", "أنتِ", "نتعانق وكأن شيئاً لم يكن"],
    correct: 2
  }
];

export default function Scene4_Quiz({ onNext }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setShowResult(true);
      triggerConfetti();
      setTimeout(() => {
        onNext();
      }, 5000);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff1493', '#ffd700', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff1493', '#ffd700', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a0b2e] relative overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500 text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            className="glass-panel p-8 md:p-14 rounded-3xl w-full max-w-3xl text-center relative z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-pink-400 text-lg tracking-widest uppercase mb-8 font-sans font-bold">
              السؤال {currentQ + 1} من {QUESTIONS.length}
            </h3>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-14 leading-relaxed">
              {QUESTIONS[currentQ].question}
            </h2>
            <div className="flex flex-col gap-5">
              {QUESTIONS[currentQ].answers.map((answer, idx) => (
                <motion.button
                  key={idx}
                  className="w-full py-5 px-6 rounded-2xl border-2 border-purple-500/30 bg-purple-900/20 text-white font-sans text-xl font-bold hover:bg-pink-600/40 hover:border-pink-500 transition-all"
                  whileHover={{ scale: 1.02, x: -10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnswer}
                >
                  {answer}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="text-center z-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
          >
            <h2 className="font-serif text-5xl md:text-7xl text-white text-glow mb-6 leading-relaxed">
              مستوى الحب: <br/>
              <span className="text-pink-500 text-7xl md:text-9xl font-bold mt-8 block">1000000% 💖</span>
            </h2>
            <p className="text-2xl text-pink-200 mt-12 font-sans tracking-widest uppercase">
              جاري حساب المرحلة التالية...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
