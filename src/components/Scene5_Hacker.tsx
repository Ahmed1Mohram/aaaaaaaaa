import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  key?: string | number;
  onNext: () => void;
}

const TERMINAL_LINES = [
  "جاري تهيئة اتصال آمن بقلبكِ...",
  "تجاوز جدران الحماية...",
  "الوصول إلى قطاعات الذاكرة العميقة...",
  "فك تشفير بيانات القلب...",
  "تحليل الرنين العاطفي بيننا...",
  "تم العثور على تطابق: 100%",
  "تحذير: تم اكتشاف مستويات حب حرجة.",
  "تنفيذ التسلسل النهائي..."
];

export default function Scene5_Hacker({ onNext }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'terminal' | 'message'>('terminal');

  useEffect(() => {
    if (phase === 'terminal') {
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine < TERMINAL_LINES.length) {
          setLines(prev => [...prev, TERMINAL_LINES[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase('message'), 1500);
        }
      }, 600);
      return () => clearInterval(interval);
    } else {
      setTimeout(() => onNext(), 8000);
    }
  }, [phase, onNext]);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2 } }}
    >
      <AnimatePresence mode="wait">
        {phase === 'terminal' && (
          <motion.div 
            key="terminal"
            className="w-full max-w-3xl p-8 font-mono text-green-500 text-lg md:text-2xl text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            dir="ltr"
          >
            <div dir="rtl">
              {lines.map((line, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-3"
                >
                  <span className="text-green-700 ml-3">{'<'}</span>
                  {line}
                </motion.div>
              ))}
              <motion.div 
                className="w-3 h-6 bg-green-500 inline-block mr-2 animate-pulse align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            </div>
          </motion.div>
        )}

        {phase === 'message' && (
          <motion.div 
            key="message"
            className="text-center px-6 max-w-5xl z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-relaxed font-light">
              أنا لا أحبكِ فقط... <br/>
              <motion.span 
                className="text-pink-500 font-bold mt-8 block text-glow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 2 }}
              >
                أنا أحتاجكِ.
              </motion.span>
            </h2>
            <motion.p 
              className="mt-14 text-2xl md:text-4xl text-gray-300 font-serif italic leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration: 2 }}
            >
              أنتِ أماني، حبي، وكل شيء في حياتي.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
