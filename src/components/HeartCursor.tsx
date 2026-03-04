import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function HeartCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
        scale: isClicking ? 0.8 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      <Heart 
        className="text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(255,20,147,0.8)]" 
        size={24} 
      />
    </motion.div>
  );
}
