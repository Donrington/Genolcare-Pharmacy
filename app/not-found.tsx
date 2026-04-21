'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

/* ─── Diagnostic log data ───────────────────────────────────────── */
const LOGS = [
  { id: 'l1',  prefix: '[ SYS ]', text: 'ANOMALY DETECTED',             color: '#ef4444' },
  { id: 'l2',  prefix: '[ ERR ]', text: 'PATH_DISPLACED :: 0x404',       color: '#ef4444' },
  { id: 'l3',  prefix: '[ GPS ]', text: '6.4654° N, 3.4064° E',          color: '#6DBE45' },
  { id: 'l4',  prefix: '[ NET ]', text: 'RE-ROUTING CLINICAL NODE',       color: '#f59e0b' },
  { id: 'l5',  prefix: '[ MEM ]', text: 'STACK_TRACE: null',              color: '#ef4444' },
  { id: 'l6',  prefix: '[ SYS ]', text: 'GENOLCARE_CORE: ONLINE',         color: '#6DBE45' },
  { id: 'l7',  prefix: '[ ERR ]', text: 'COORDINATES UNMAPPED',           color: '#ef4444' },
  { id: 'l8',  prefix: '[ NET ]', text: 'SEARCHING KNOWN NODES...',       color: '#f59e0b' },
  { id: 'l9',  prefix: '[ SYS ]', text: 'PATIENT RECORD: NOT FOUND',      color: '#ef4444' },
  { id: 'l10', prefix: '[ GPS ]', text: 'RECALIBRATING ROUTE',            color: '#f59e0b' },
  { id: 'l11', prefix: '[ MEM ]', text: 'DISPENSARY MODULE: ACTIVE',      color: '#6DBE45' },
  { id: 'l12', prefix: '[ SYS ]', text: 'RECOVERY PROTOCOL INITIATED',    color: '#6DBE45' },
] as const;

/* ─── Background Capsule SVG ────────────────────────────────────── */
function CapsuleSVG({ glitching }: { glitching: boolean }) {
  const fragments = [
    { d: 'M 160 60 Q 220 60 220 100 L 220 140 Q 220 180 160 180 L 100 180 Q 40 180 40 140 L 40 100 Q 40 60 100 60 Z', dx: 0,   dy: 0   },
    { d: 'M 80 75 L 130 75 L 130 115 L 80 115 Z',  dx: -55,  dy: -40 },
    { d: 'M 140 75 L 190 75 L 190 105 L 140 105 Z', dx: 60,   dy: -30 },
    { d: 'M 80 125 L 120 125 L 120 165 L 80 165 Z', dx: -50,  dy: 50  },
    { d: 'M 135 130 L 185 130 L 185 165 L 135 165 Z', dx: 55, dy: 45  },
    { d: 'M 105 85 L 155 85 L 155 155 L 105 155 Z', dx: 0,    dy: 0   },
  ];

  return (
    <svg
      viewBox="0 0 260 240"
      fill="none"
      className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[420px] md:h-[420px] opacity-[0.06] pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A3B8B" />
          <stop offset="100%" stopColor="#6DBE45" />
        </linearGradient>
      </defs>

      {fragments.map((f, i) => (
        <motion.path
          key={i}
          d={f.d}
          fill={i === 0 ? 'none' : 'url(#capsuleGrad)'}
          stroke="url(#capsuleGrad)"
          strokeWidth={i === 0 ? 3 : 1}
          animate={
            glitching
              ? { x: f.dx, y: f.dy, opacity: i === 0 ? 0 : 1, scale: 0.8 + Math.random() * 0.4 }
              : { x: 0, y: 0, opacity: i === 0 ? 1 : 0, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: i * 0.04 }}
        />
      ))}

      {/* Cross-hairs overlay */}
      <motion.g
        animate={glitching ? { opacity: 0.6 } : { opacity: 0.3 }}
        transition={{ duration: 0.2 }}
      >
        <line x1="130" y1="20" x2="130" y2="220" stroke="url(#capsuleGrad)" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="20" y1="120" x2="240" y2="120" stroke="url(#capsuleGrad)" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="130" cy="120" r="6" stroke="url(#capsuleGrad)" strokeWidth="1" fill="none" />
        <circle cx="130" cy="120" r="14" stroke="url(#capsuleGrad)" strokeWidth="0.5" fill="none" />
      </motion.g>
    </svg>
  );
}

/* ─── Glitch "404" ──────────────────────────────────────────────── */
function GlitchText({ onGlitch }: { onGlitch: (v: boolean) => void }) {
  const [hovered, setHovered] = useState(false);

  /* Subtle permanent jitter */
  const jX = useSpring(useMotionValue(0), { stiffness: 400, damping: 10 });
  const jY = useSpring(useMotionValue(0), { stiffness: 400, damping: 10 });

  useEffect(() => {
    const id = setInterval(() => {
      jX.set((Math.random() - 0.5) * 2);
      jY.set((Math.random() - 0.5) * 2);
      setTimeout(() => { jX.set(0); jY.set(0); }, 80);
    }, 2400 + Math.random() * 1600);
    return () => clearInterval(id);
  }, [jX, jY]);

  const handleEnter = () => { setHovered(true); onGlitch(true); };
  const handleLeave = () => { setHovered(false); onGlitch(false); };

  const glitchTransition = { duration: 0.12, repeat: Infinity, repeatType: 'mirror' as const };

  return (
    <div
      className="relative select-none cursor-default"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Red chromatic layer */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 font-satoshi font-black text-red-500/70"
        style={{
          fontSize: 'clamp(7rem, 22vw, 18rem)',
          lineHeight: 1,
          mixBlendMode: 'multiply',
          clipPath: 'inset(0 0 55% 0)',
        }}
        animate={hovered ? { x: [-5, 5, -3, 4, -2], opacity: [0.7, 0.4, 0.8, 0.3, 0.6] } : { x: 0, opacity: 0 }}
        transition={hovered ? glitchTransition : { duration: 0.15 }}
      >
        404
      </motion.span>

      {/* Blue chromatic layer */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 font-satoshi font-black text-blue-500/70"
        style={{
          fontSize: 'clamp(7rem, 22vw, 18rem)',
          lineHeight: 1,
          mixBlendMode: 'multiply',
          clipPath: 'inset(45% 0 0 0)',
        }}
        animate={hovered ? { x: [4, -4, 3, -5, 2], opacity: [0.5, 0.8, 0.3, 0.7, 0.4] } : { x: 0, opacity: 0 }}
        transition={hovered ? { ...glitchTransition, delay: 0.04 } : { duration: 0.15 }}
      >
        404
      </motion.span>

      {/* Horizontal slice offset */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 font-satoshi font-black text-gray-900"
        style={{
          fontSize: 'clamp(7rem, 22vw, 18rem)',
          lineHeight: 1,
          clipPath: 'inset(30% 0 40% 0)',
        }}
        animate={hovered ? { x: [8, -8, 6, -6, 0] } : { x: 0 }}
        transition={hovered ? { duration: 0.1, repeat: Infinity, repeatType: 'mirror' } : { duration: 0.2 }}
      >
        404
      </motion.span>

      {/* Main visible text */}
      <motion.span
        className="relative z-10 font-satoshi font-black text-gray-900"
        style={{ fontSize: 'clamp(7rem, 22vw, 18rem)', lineHeight: 1, x: jX, y: jY }}
        animate={hovered ? { x: [-1, 1, -2, 2, 0], y: [1, -1, 0, 1, -1] } : {}}
        transition={hovered ? { duration: 0.08, repeat: Infinity } : {}}
      >
        404
      </motion.span>
    </div>
  );
}

/* ─── Diagnostic Log Feed ───────────────────────────────────────── */
function DiagnosticFeed() {
  return (
    <div className="hidden lg:flex flex-col gap-2 font-mono">
      {LOGS.map((log, i) => (
        <motion.div
          key={log.id}
          className="flex items-start gap-2 text-[10px] tracking-wider"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Flicker animation on individual logs */}
          <motion.div
            className="flex items-start gap-2 w-full"
            animate={{ opacity: [1, 0.6, 1, 0.8, 1] }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            <span style={{ color: log.color }} className="shrink-0 font-semibold">
              {log.prefix}
            </span>
            <span className="text-gray-400">{log.text}</span>
          </motion.div>
        </motion.div>
      ))}

      {/* Blinking cursor at end */}
      <motion.div
        className="flex items-center gap-2 text-[10px] tracking-wider mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-genolcare-green font-semibold">[ SYS ]</span>
        <motion.span
          className="text-gray-300"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ▮
        </motion.span>
      </motion.div>
    </div>
  );
}

/* ─── Magnetic CTA ──────────────────────────────────────────────── */
function MagneticCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 160, damping: 18 });
  const y = useSpring(rawY, { stiffness: 160, damping: 18 });
  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-60, 60], [-8, 8]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 110) {
      const strength = (110 - dist) / 110;
      rawX.set(dx * strength * 0.55);
      rawY.set(dy * strength * 0.55);
    } else {
      rawX.set(0);
      rawY.set(0);
    }
  }, [rawX, rawY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div ref={ref} style={{ perspective: '600px' }}>
      <motion.div style={{ x, y, rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <Link href="/" aria-label="Return to Genolcare homepage">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="group relative inline-flex items-center gap-3
              px-10 py-4 rounded-full
              bg-white/40 backdrop-blur-2xl
              border border-gray-200/80
              shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.8)]
              hover:shadow-[0_8px_32px_rgba(26,59,139,0.12),inset_0_0_0_1px_rgba(255,255,255,0.9)]
              hover:border-genolcare-blue/20
              transition-shadow duration-300"
          >
            {/* Hover glow fill */}
            <motion.span
              className="absolute inset-0 rounded-full bg-gradient-to-r from-genolcare-blue/5 to-genolcare-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Grid icon */}
            <svg className="w-4 h-4 text-genolcare-blue relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>

            <span className="font-satoshi font-semibold text-sm text-gray-700 tracking-wide relative z-10">
              Return to Core Grid
            </span>

            <motion.svg
              className="w-4 h-4 text-genolcare-blue relative z-10"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </motion.svg>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function NotFound() {
  const [glitching, setGlitching] = useState(false);

  return (
    <AnimatePresence>
      <motion.main
        className="relative h-screen w-full overflow-hidden bg-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Digital noise overlay ───────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            opacity: 0.028,
          }}
        />

        {/* ── Subtle grid ─────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* ── Background capsule ──────────────────────────── */}
        <CapsuleSVG glitching={glitching} />

        {/* ── Ambient orb ─────────────────────────────────── */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-genolcare-blue/[0.03] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-genolcare-green/[0.04] blur-[80px] pointer-events-none" />

        {/* ── Left: Diagnostic feed ───────────────────────── */}
        <motion.div
          className="absolute left-8 xl:left-16 top-1/2 -translate-y-1/2 w-56"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* Feed header */}
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-red-400"
            />
            <span className="font-mono text-[9px] tracking-[0.25em] text-gray-300 uppercase">
              System Diagnostic
            </span>
          </div>
          <DiagnosticFeed />
        </motion.div>

        {/* ── Center content ──────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6 px-4">

          {/* Eyebrow */}
          <motion.p
            className="font-mono text-[10px] tracking-[0.5em] text-gray-300 uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            [ GENOLCARE · CLINICAL SYSTEM ]
          </motion.p>

          {/* Glitch 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlitchText onGlitch={setGlitching} />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p className="font-satoshi text-xl md:text-2xl font-semibold text-gray-700 tracking-tight">
              Coordinates Unmapped
            </p>
            <p className="font-satoshi text-sm text-gray-400 max-w-xs leading-relaxed">
              The clinical node you're seeking has been displaced. Our systems are re-routing.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="w-12 h-px bg-gradient-to-r from-genolcare-blue to-genolcare-green"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ originX: 0.5 }}
          />

          {/* Magnetic CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <MagneticCTA />
          </motion.div>

          {/* Bottom status strip */}
          <motion.div
            className="flex items-center gap-4 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="font-mono text-[9px] tracking-widest text-gray-300 uppercase">
              ERR · 0x404
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="font-mono text-[9px] tracking-widest text-gray-300 uppercase">
              Wuse District · Abuja
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <motion.span
              className="font-mono text-[9px] tracking-widest text-genolcare-green uppercase"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              Rerouting…
            </motion.span>
          </motion.div>
        </div>

        {/* ── Bottom hover hint ─────────────────────────────── */}
        <motion.p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-gray-200 uppercase pointer-events-none"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Hover 404 to trigger diagnostic
        </motion.p>
      </motion.main>
    </AnimatePresence>
  );
}
