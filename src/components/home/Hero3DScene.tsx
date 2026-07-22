import { PointerEvent, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import hero3d from '@/assets/hero/hero-beco-3d.png';

export const Hero3DScene = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 22, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 22, mass: 0.6 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [18, -18]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={sceneRef}
      className="scene-3d relative mx-auto w-full max-w-[820px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY, y: parallaxY }}
        className="relative aspect-[16/13] transform-gpu [transform-style:preserve-3d]"
      >
        <div className="absolute inset-[7%] rounded-[2rem] border border-white/10 bg-[#0b1a12]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_40px_90px_rgba(2,16,9,0.48)] backdrop-blur-xl" />
        <div className="absolute inset-[2%] rounded-[2.4rem] border border-emerald-200/10 [transform:translateZ(-40px)]" />
        <div className="absolute -right-[3%] top-[8%] h-[48%] w-[48%] rounded-full border border-emerald-200/15 [transform:translateZ(-20px)]" />
        <div className="absolute -bottom-[2%] left-[4%] h-[42%] w-[42%] rounded-full border border-white/10 [transform:translateZ(20px)]" />

        <motion.div
          style={reduceMotion ? undefined : { x: imageX, y: imageY }}
          animate={reduceMotion ? undefined : { translateY: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-[9%] overflow-hidden rounded-[1.7rem] [transform:translateZ(56px)]"
        >
          <img
            src={hero3d}
            alt="Bộ đĩa lá B-ECO trong không gian trưng bày 3D"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(3,12,8,0.24),transparent_45%,rgba(8,31,20,0.08))]" />
        </motion.div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="glass-3d absolute bottom-[3%] left-[1%] max-w-[190px] p-4 [transform:translateZ(90px)] sm:p-5"
        >
          <strong className="block text-2xl font-extrabold tracking-[-0.05em] text-emerald-200 sm:text-3xl">45 ngày</strong>
          <span className="mt-1 block text-xs leading-5 text-white/64">trở về với tự nhiên trong điều kiện phù hợp</span>
        </motion.div>

        <div className="glass-3d absolute right-0 top-[2%] hidden px-4 py-3 text-xs font-semibold text-white/72 [transform:translateZ(78px)] sm:block">
          Ép từ lá rụng tự nhiên
        </div>
      </motion.div>
    </div>
  );
};
