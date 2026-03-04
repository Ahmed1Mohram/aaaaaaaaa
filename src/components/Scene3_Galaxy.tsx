import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface Props {
  key?: string | number;
  onNext: () => void;
  herName: string;
}

const MEMORIES = [
  { id: 1, text: "منذ اللحظة الأولى التي رأيتكِ فيها، عرفت أنكِ مميزة.", x: 20, y: 30 },
  { id: 2, text: "تلك المحادثة في وقت متأخر من الليل حيث تحدثنا عن كل شيء.", x: 70, y: 20 },
  { id: 3, text: "طريقتكِ في الابتسام عندما تكونين سعيدة حقاً.", x: 80, y: 70 },
  { id: 4, text: "كل لحظة صغيرة معكِ تبدو وكأنها سحر.", x: 30, y: 80 },
  { id: 5, text: "ضحكتكِ هي الصوت المفضل لدي في هذا العالم.", x: 15, y: 50 },
  { id: 6, text: "أحب الطريقة التي تنظرين بها إليّ.", x: 85, y: 45 },
];

export default function Scene3_Galaxy({ onNext, herName }: Props) {
  const [activeMemory, setActiveMemory] = useState<string | null>(null);
  const [centerClicked, setCenterClicked] = useState(false);

  const handleCenterClick = () => {
    if (centerClicked) return;
    setCenterClicked(true);
    
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

    setTimeout(() => {
      onNext();
    }, 6000);
  };

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden bg-[#020005] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-50"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Memory Stars */}
      {MEMORIES.map((memory) => (
        <motion.div
          key={memory.id}
          className="absolute w-5 h-5 bg-pink-300 rounded-full cursor-pointer shadow-[0_0_20px_rgba(255,192,203,0.9)]"
          style={{
            left: `${memory.x}%`,
            top: `${memory.y}%`,
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={() => setActiveMemory(memory.text)}
          whileHover={{ scale: 1.5, backgroundColor: "#ff1493" }}
        />
      ))}

      {/* Center Planet */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center cursor-pointer"
        onClick={handleCenterClick}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
      >
        <div className={`w-56 h-56 rounded-full flex items-center justify-center transition-all duration-1000 ${centerClicked ? 'bg-pink-500 shadow-[0_0_120px_rgba(255,20,147,1)]' : 'bg-purple-900 shadow-[0_0_50px_rgba(128,0,128,0.7)]'}`}>
          <span className="font-serif text-5xl text-white text-glow tracking-widest">{herName}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {centerClicked && (
          <motion.div
            className="absolute bottom-24 text-center w-full z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <h2 className="font-serif text-4xl md:text-6xl text-white text-glow-gold tracking-widest font-light leading-relaxed">
              أنتِ مركز كوني.
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Modal */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.div
              className="glass-panel p-8 md:p-14 rounded-3xl max-w-2xl text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-serif text-3xl md:text-4xl text-pink-100 leading-relaxed italic">
                "{activeMemory}"
              </p>
              <button 
                className="mt-12 px-8 py-3 border-2 border-pink-500/50 rounded-full text-pink-300 text-lg font-bold hover:bg-pink-500/20 transition-colors"
                onClick={() => setActiveMemory(null)}
              >
                إغلاق الذكرى
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </motion.div>
  );
}
