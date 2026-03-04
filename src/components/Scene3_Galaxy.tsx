import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface Props {
  key?: string | number;
  onNext: () => void;
  herName: string;
}

const START_DATE = new Date('2026-02-21T08:42:00');

const MEMORIES = [
  { id: 1, text: "منذ اللحظة الأولى التي رأيتكِ فيها، عرفت أنكِ مميزة.", x: 18, y: 28 },
  { id: 2, text: "تلك المحادثة في وقت متأخر من الليل حيث تحدثنا عن كل شيء.", x: 72, y: 18 },
  { id: 3, text: "طريقتكِ في الابتسام عندما تكونين سعيدة حقاً.", x: 82, y: 68 },
  { id: 4, text: "كل لحظة صغيرة معكِ تبدو وكأنها سحر.", x: 28, y: 78 },
  { id: 5, text: "ضحكتكِ هي الصوت المفضل لدي في هذا العالم.", x: 12, y: 52 },
  { id: 6, text: "أحب الطريقة التي تنظرين بها إليّ.", x: 88, y: 42 },
];

// Generate stars once (stable)
const BG_STARS = Array.from({ length: 160 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 0.5,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 4,
  opacity: 0.3 + Math.random() * 0.7,
}));

function useTimer() {
  const [elapsed, setElapsed] = useState(() => Date.now() - START_DATE.getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - START_DATE.getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = Math.floor(elapsed / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  return { years, months: remMonths, days, hours, minutes, seconds };
}

export default function Scene3_Galaxy({ onNext, herName }: Props) {
  const [activeMemory, setActiveMemory] = useState<string | null>(null);
  const [centerClicked, setCenterClicked] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timer = useTimer();

  // Moon shimmer canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 220;
    canvas.height = 220;

    let animFrame: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, 220, 220);
      const cx = 110, cy = 110, r = 80;

      // Outer glow layers
      for (let g = 5; g >= 1; g--) {
        const grd = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + g * 14);
        grd.addColorStop(0, `rgba(255, 240, 180, ${0.06 * g})`);
        grd.addColorStop(1, 'rgba(255, 240, 180, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r + g * 14, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Moon base
      const moonGrad = ctx.createRadialGradient(cx - 18, cy - 20, 10, cx, cy, r);
      moonGrad.addColorStop(0, '#fffbe6');
      moonGrad.addColorStop(0.4, '#f5e6a0');
      moonGrad.addColorStop(0.75, '#c8a84b');
      moonGrad.addColorStop(1, '#8b6914');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();

      // Craters
      const craters = [
        { x: cx + 22, y: cy - 28, r: 10 },
        { x: cx - 30, y: cy + 18, r: 7 },
        { x: cx + 10, y: cy + 35, r: 5 },
        { x: cx - 15, y: cy - 40, r: 4 },
        { x: cx + 40, y: cy + 10, r: 6 },
      ];
      craters.forEach(c => {
        const cg = ctx.createRadialGradient(c.x - 2, c.y - 2, 1, c.x, c.y, c.r);
        cg.addColorStop(0, 'rgba(139, 105, 20, 0.5)');
        cg.addColorStop(1, 'rgba(200, 168, 75, 0.1)');
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      });

      // Shimmer overlay
      const shimmer = ctx.createRadialGradient(
        cx - 20 + Math.sin(t * 0.02) * 5,
        cy - 25 + Math.cos(t * 0.015) * 5,
        5,
        cx, cy, r
      );
      shimmer.addColorStop(0, `rgba(255,255,255,${0.08 + Math.sin(t * 0.05) * 0.04})`);
      shimmer.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      shimmer.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shimmer;
      ctx.fill();

      // Shadow side
      const shadow = ctx.createRadialGradient(cx + 40, cy, 10, cx + 60, cy, r + 20);
      shadow.addColorStop(0, 'rgba(0,0,0,0.35)');
      shadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shadow;
      ctx.fill();

      t++;
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const handleCenterClick = () => {
    if (centerClicked) return;
    setCenterClicked(true);
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff1493', '#ffd700', '#ffffff'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff1493', '#ffd700', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setTimeout(() => onNext(), 6000);
  };

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 60% 20%, #0d0520 0%, #020008 60%, #000005 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {BG_STARS.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              left: `${star.x}%`,
              top: `${star.y}%`,
              background: star.size > 1.8
                ? `radial-gradient(circle, #fff 0%, #ffeebb 50%, transparent 100%)`
                : 'white',
              boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px rgba(255,240,180,0.8)` : 'none',
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ${star.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Nebula clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ width: '500px', height: '300px', top: '5%', left: '5%', background: 'radial-gradient(ellipse, rgba(120,40,180,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute" style={{ width: '400px', height: '250px', bottom: '10%', right: '5%', background: 'radial-gradient(ellipse, rgba(180,20,100,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute" style={{ width: '350px', height: '200px', top: '40%', left: '30%', background: 'radial-gradient(ellipse, rgba(60,20,120,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Memory Stars with hint */}
      {!showHint && MEMORIES.map((memory) => (
        <motion.div
          key={memory.id}
          className="absolute cursor-pointer flex flex-col items-center gap-1"
          style={{ left: `${memory.x}%`, top: `${memory.y}%` }}
          onClick={() => setActiveMemory(memory.text)}
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -12, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 3 + memory.id * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.8 }}
          >
            {/* Star shape */}
            <div className="w-6 h-6 relative flex items-center justify-center">
              <div className="absolute w-6 h-6 bg-pink-300 rounded-full opacity-30 animate-ping" style={{ animationDuration: '2s' }} />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <polygon
                  points="12,2 14.9,9 22.5,9.3 16.8,14.5 18.8,22 12,17.8 5.2,22 7.2,14.5 1.5,9.3 9.1,9"
                  fill="#f9a8d4"
                  stroke="#ff69b4"
                  strokeWidth="0.5"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(255,105,180,0.9))' }}
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Hint overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHint(false)}
          >
            {/* Hint text */}
            <motion.div
              className="text-center px-6"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-pink-200 text-2xl md:text-3xl font-light tracking-widest mb-2" style={{ fontFamily: 'serif', textShadow: '0 0 20px rgba(255,100,180,0.8)' }}>
                ✨ اضغطي على النجوم ✨
              </p>
              <p className="text-pink-300/60 text-sm tracking-wider">كل نجمة تحمل ذكرى</p>
            </motion.div>

            {/* Timer */}
            <motion.div
              className="rounded-3xl px-6 py-5 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,150,200,0.2)', backdropFilter: 'blur(10px)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-pink-200/70 text-xs tracking-[0.3em] mb-3 uppercase">معاً منذ</p>
              <div className="flex gap-3 md:gap-5 items-center justify-center flex-wrap">
                {timer.years > 0 && (
                  <TimeUnit value={timer.years} label="سنة" />
                )}
                <TimeUnit value={timer.months} label="شهر" />
                <TimeUnit value={timer.days} label="يوم" />
                <TimeUnit value={timer.hours} label="ساعة" />
                <TimeUnit value={timer.minutes} label="دقيقة" />
                <TimeUnit value={timer.seconds} label="ثانية" pulse />
              </div>
              <p className="text-pink-300/40 text-xs mt-3 tracking-wider">21 فبراير 2026 · 8:42 صباحاً 💕</p>
            </motion.div>

            <motion.div
              className="text-pink-300/40 text-sm"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              اضغطي للمتابعة →
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moon (center) */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center cursor-pointer"
        onClick={showHint ? () => setShowHint(false) : handleCenterClick}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative">
          <canvas ref={canvasRef} width={220} height={220} className="rounded-full" />
          {!showHint && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-serif text-3xl text-yellow-100 tracking-widest"
                style={{ textShadow: '0 0 20px rgba(255,240,150,0.9), 0 0 40px rgba(255,200,100,0.5)' }}
              >
                {herName}
              </span>
            </div>
          )}
          {centerClicked && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,100,180,0.3) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
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
            <h2 className="font-serif text-4xl md:text-6xl text-white tracking-widest font-light leading-relaxed"
              style={{ textShadow: '0 0 30px rgba(255,215,0,0.7)' }}>
              أنتِ مركز كوني.
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Modal */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.div
              className="p-8 md:p-14 rounded-3xl max-w-2xl text-center"
              style={{ background: 'rgba(20,5,40,0.85)', border: '1px solid rgba(255,100,180,0.3)', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(180,0,100,0.2)' }}
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-6">✨</div>
              <p className="font-serif text-2xl md:text-3xl text-pink-100 leading-relaxed italic">
                "{activeMemory}"
              </p>
              <button
                className="mt-10 px-8 py-3 border border-pink-500/50 rounded-full text-pink-300 text-base hover:bg-pink-500/20 transition-colors"
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
          0% { opacity: 0.15; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </motion.div>
  );
}

function TimeUnit({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  return (
    <div className="flex flex-col items-center min-w-[48px]">
      <motion.span
        key={value}
        className="text-2xl md:text-3xl font-bold text-white"
        style={{ textShadow: '0 0 15px rgba(255,150,200,0.8)', fontFamily: 'monospace' }}
        initial={pulse ? { scale: 1.2, color: '#ff69b4' } : {}}
        animate={pulse ? { scale: 1, color: '#ffffff' } : {}}
        transition={{ duration: 0.3 }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="text-pink-300/60 text-xs mt-1 tracking-wider">{label}</span>
    </div>
  );
}
