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
  const [elapsed, setElapsed] = useState(() => Math.max(0, Date.now() - START_DATE.getTime()));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.max(0, Date.now() - START_DATE.getTime()));
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 250;
    canvas.height = 250;

    let animFrame: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, 250, 250);
      const cx = 125, cy = 125, r = 85;

      // Outer glow layers (White/Silver glow)
      for (let g = 6; g >= 1; g--) {
        const grd = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + g * 12 + 5);
        grd.addColorStop(0, `rgba(240, 248, 255, ${0.08 * g})`);
        grd.addColorStop(1, 'rgba(240, 248, 255, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r + g * 12 + 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Bright halo directly around the moon
      const halo = ctx.createRadialGradient(cx, cy, r - 2, cx, cy, r + 4);
      halo.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Moon base (White & Silver)
      const moonGrad = ctx.createRadialGradient(cx - 25, cy - 25, 10, cx, cy, r);
      moonGrad.addColorStop(0, '#ffffff'); // Pure white at highlight
      moonGrad.addColorStop(0.3, '#f1f5f9'); // Light slate
      moonGrad.addColorStop(0.7, '#cbd5e1'); // Slate 300
      moonGrad.addColorStop(1, '#64748b'); // Slate 500 for the edge depth
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();

      // Craters (Grayish)
      const craters = [
        { x: cx + 22, y: cy - 28, r: 14 },
        { x: cx - 30, y: cy + 22, r: 9 },
        { x: cx + 12, y: cy + 40, r: 7 },
        { x: cx - 18, y: cy - 40, r: 6 },
        { x: cx + 45, y: cy + 10, r: 10 },
        { x: cx - 45, y: cy - 10, r: 5 },
      ];
      craters.forEach(c => {
        const cg = ctx.createRadialGradient(c.x - 2, c.y - 2, 1, c.x, c.y, c.r);
        cg.addColorStop(0, 'rgba(100, 116, 139, 0.45)'); // Darker inside
        cg.addColorStop(1, 'rgba(226, 232, 240, 0.1)'); // Blends out
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();

        // Inner rim highlight for crater 3D effect
        ctx.beginPath();
        ctx.arc(c.x - 1, c.y - 1, c.r - 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Shimmer overlay (atmospheric glimmer)
      const shimmer = ctx.createRadialGradient(
        cx - 20 + Math.sin(t * 0.02) * 8,
        cy - 25 + Math.cos(t * 0.015) * 8,
        5,
        cx, cy, r
      );
      shimmer.addColorStop(0, `rgba(255,255,255,${0.1 + Math.sin(t * 0.05) * 0.05})`);
      shimmer.addColorStop(0.5, 'rgba(255,255,255,0.03)');
      shimmer.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shimmer;
      ctx.fill();

      // Shadow side (Adds depth)
      const shadow = ctx.createRadialGradient(cx + 50, cy + 20, 10, cx + 70, cy + 20, r + 20);
      shadow.addColorStop(0, 'rgba(15, 23, 42, 0.35)'); // Dark slate for shadow
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
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 lg:p-0"
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
                ? `radial-gradient(circle, #fff 0%, #aaccff 50%, transparent 100%)`
                : 'white',
              boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px rgba(200,220,255,0.8)` : 'none',
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ${star.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Nebula clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ width: '500px', height: '300px', top: '5%', left: '5%', background: 'radial-gradient(ellipse, rgba(80,140,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute" style={{ width: '400px', height: '250px', bottom: '10%', right: '5%', background: 'radial-gradient(ellipse, rgba(180,20,100,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      {/* Persistent Beautiful Timer Overlay at Top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-30 pointer-events-none flex justify-center">
        <motion.div
          className="rounded-[2rem] px-5 py-5 md:px-8 md:py-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl pointer-events-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Decorative glow inside timer */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1" />
              <p className="text-white/90 text-sm md:text-base md:tracking-[0.2em] font-light uppercase px-2 shadow-sm whitespace-nowrap">معاً منذ بدأنــا</p>
              <div className="h-[1px] bg-gradient-to-l from-transparent via-white/30 to-transparent flex-1" />
            </div>

            <div className="flex gap-2 md:gap-3 items-center justify-center flex-wrap" dir="ltr">
              {timer.years > 0 && <TimeUnit value={timer.years} label="سنوات" />}
              <TimeUnit value={timer.months} label="شهر" />
              <TimeUnit value={timer.days} label="يوم" />
              <TimeUnit value={timer.hours} label="ساعة" />
              <TimeUnit value={timer.minutes} label="دقيقة" />
              <TimeUnit value={timer.seconds} label="ثانية" pulse />
            </div>

            <p className="text-white/40 text-xs mt-4 tracking-widest font-mono">21.02.2026 - 08:42 AM</p>
          </div>
        </motion.div>
      </div>

      {/* Memory Stars */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {(!showHint || true) && MEMORIES.map((memory) => (
          <motion.div
            key={memory.id}
            className="absolute flex flex-col items-center gap-1 pointer-events-auto cursor-pointer"
            style={{ left: `${memory.x}%`, top: `${memory.y}%` }}
            onClick={() => setActiveMemory(memory.text)}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3 + memory.id * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.5 }}
            >
              <div className="w-5 h-5 relative flex items-center justify-center">
                <div className="absolute w-5 h-5 bg-pink-300 rounded-full opacity-30 animate-ping" style={{ animationDuration: '2s' }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon
                    points="12,2 14.9,9 22.5,9.3 16.8,14.5 18.8,22 12,17.8 5.2,22 7.2,14.5 1.5,9.3 9.1,9"
                    fill="#f9a8d4"
                    stroke="#ff69b4"
                    strokeWidth="0.5"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(255,105,180,0.8))' }}
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Hint overlay at the bottom so it doesn't block center */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="absolute bottom-20 inset-x-0 z-30 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setShowHint(false)}
          >
            <motion.div
              className="text-center px-6 py-4 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-white md:text-2xl text-xl font-light tracking-widest mb-1" style={{ fontFamily: 'serif', textShadow: '0 0 15px rgba(255,255,255,0.7)' }}>
                ✨ اضغطي على النجوم ✨
              </p>
              <p className="text-white/60 text-sm tracking-wider">كل نجمة تحمل ذكرى منا</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moon (center) */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center cursor-pointer mt-12 md:mt-0"
        onClick={showHint ? () => setShowHint(false) : handleCenterClick}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative flex items-center justify-center">
          <canvas ref={canvasRef} width={250} height={250} className="rounded-full" />

          {/* Her Name etched on the moon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="font-serif text-4xl md:text-5xl tracking-widest font-bold"
              style={{
                color: '#e2e8f0', // Light silver
                textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 -1px 2px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                WebkitTextStroke: '1px rgba(100,116,139,0.3)', // Slight slate stroke for definition
              }}
            >
              {herName}
            </span>
          </div>

          {centerClicked && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>

      {/* Completion message */}
      <AnimatePresence>
        {centerClicked && (
          <motion.div
            className="absolute bottom-16 text-center w-full z-20 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-widest font-light leading-relaxed"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.8)' }}>
              أنتِ قمر حياتي.
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Modal */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.div
              className="p-8 md:p-12 rounded-[2rem] max-w-lg w-full text-center relative overflow-hidden"
              style={{
                background: 'rgba(20, 25, 40, 0.85)',
                border: '1px solid rgba(255,150,200,0.2)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="text-4xl mb-6 relative z-10 text-white shadow-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✨</div>
              <p className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed italic relative z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                "{activeMemory}"
              </p>

              <button
                className="mt-10 px-8 py-3 border border-pink-300/30 rounded-full text-pink-200 text-sm tracking-wider hover:bg-pink-500/20 transition-colors relative z-10 backdrop-blur-sm"
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

function TimeUnit({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/10 w-[3.5rem] h-[4rem] md:w-[4.5rem] md:h-[5rem] backdrop-blur-md shadow-inner">
      <motion.span
        key={value}
        className="text-xl md:text-[1.75rem] font-bold text-white tracking-widest"
        style={{ fontFamily: 'monospace', textShadow: '0 2px 10px rgba(255,255,255,0.4)' }}
        initial={pulse ? { scale: 1.15, textShadow: '0 0 15px rgba(255,255,255,0.8)' } : {}}
        animate={pulse ? { scale: 1, textShadow: '0 2px 10px rgba(255,255,255,0.4)' } : {}}
        transition={{ duration: 0.5 }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="text-white/60 text-[10px] md:text-xs mt-1 tracking-wider">{label}</span>
    </div>
  );
}

