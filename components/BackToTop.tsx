'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion';

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Page scroll progress */
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [CIRCUMFERENCE, 0]);

  /* Visibility — show after 400px */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Magnetic pull */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magX = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 180, damping: 22 });
  const magY = useSpring(useTransform(my, [-1, 1], [-10, 10]), { stiffness: 180, damping: 22 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          ref={btnRef}
          onClick={scrollToTop}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{ x: magX, y: magY }}
          initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.4, rotate: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 w-14 h-14 flex items-center justify-center focus:outline-none"
        >
          {/* Outer glow pulse */}
          <motion.span
            className="absolute inset-0 rounded-full bg-genolcare-blue/20"
            animate={hovered ? { scale: [1, 1.5, 1.3], opacity: [0.5, 0, 0] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />

          {/* SVG: track ring + progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 56 56"
            fill="none"
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx="28"
              cy="28"
              r={RADIUS}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2.5"
            />
            {/* Animated progress */}
            <motion.circle
              cx="28"
              cy="28"
              r={RADIUS}
              stroke="url(#btg)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{ strokeDashoffset }}
            />
            <defs>
              <linearGradient id="btg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6DBE45" />
                <stop offset="100%" stopColor="#1A3B8B" />
              </linearGradient>
            </defs>
          </svg>

          {/* Button face */}
          <motion.span
            className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center
              bg-[#0F2660]
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),_0_8px_24px_rgba(15,38,96,0.6)]"
            animate={hovered ? { backgroundColor: '#1A3B8B' } : { backgroundColor: '#0F2660' }}
            transition={{ duration: 0.2 }}
          >
            {/* Arrow — slides up on hover */}
            <motion.svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              animate={hovered ? { y: -2 } : { y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </motion.svg>
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
