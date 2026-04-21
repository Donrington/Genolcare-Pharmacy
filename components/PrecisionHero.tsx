'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import Image from 'next/image';

/* ─── Easing ────────────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Live metadata ticker ──────────────────────────────────────── */
const META_FIELDS = [
  { label: 'TEMP',   getValue: () => `${(4.0 + Math.random() * 0.4).toFixed(1)}°C` },
  { label: 'STATUS', getValue: () => 'VERIFYING' },
  { label: 'BATCH',  getValue: () => `RX-${Math.floor(10000 + Math.random() * 90000)}` },
  { label: 'QUEUE',  getValue: () => `${Math.floor(1 + Math.random() * 5)} PENDING` },
];

function SystemMetadata() {
  const [vals, setVals] = useState(META_FIELDS.map((f) => f.getValue()));

  useEffect(() => {
    const id = setInterval(() => {
      setVals(META_FIELDS.map((f) => f.getValue()));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 1.4, ease: EASE }}
      className="absolute bottom-6 right-6 z-20
        backdrop-blur-2xl bg-black/40 border border-white/10
        rounded-2xl px-5 py-4 min-w-[190px]
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-genolcare-green"
        />
        <span className="font-mono text-[8px] tracking-[0.25em] text-white/40 uppercase">
          System Metadata
        </span>
      </div>
      <div className="space-y-1.5">
        {META_FIELDS.map((field, i) => (
          <div key={field.label} className="flex items-center justify-between gap-6">
            <span className="font-mono text-[9px] tracking-[0.18em] text-white/40 uppercase">
              {field.label}
            </span>
            <motion.span
              key={vals[i]}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[9px] tracking-[0.12em] text-genolcare-green font-semibold"
            >
              {vals[i]}
            </motion.span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Scroll indicator ──────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.8, ease: EASE }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3
        md:left-auto md:translate-x-0 md:bottom-12 md:left-[4vw]"
    >
      <span className="font-mono text-[8px] tracking-[0.3em] text-gray-400 uppercase rotate-0">
        Scroll
      </span>
      {/* Track */}
      <div className="relative w-px h-14 bg-gray-200 overflow-hidden rounded-full">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-genolcare-blue to-genolcare-green rounded-full"
          animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
        />
      </div>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-4 h-4 flex items-center justify-center"
      >
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path d="M5 1L5 13M1 9L5 13L9 9" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ─── Magnetic TrueFocus for "PRECISION" ────────────────────────── */
interface MagneticFocusProps {
  isRevealed: boolean;
}

function MagneticPrecision({ isRevealed }: MagneticFocusProps) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Magnetic tilt */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 180, damping: 22 });

  /* Focus frame position */
  const [frameRect, setFrameRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [proximity, setProximity] = useState(1); // 1 = far, 0 = close

  const updateFrameRect = useCallback(() => {
    const el = wordRef.current;
    const cont = containerRef.current;
    if (!el || !cont) return;
    const elRect = el.getBoundingClientRect();
    const contRect = cont.getBoundingClientRect();
    setFrameRect({
      x: elRect.left - contRect.left,
      y: elRect.top - contRect.top,
      w: elRect.width,
      h: elRect.height,
    });
  }, []);

  useEffect(() => {
    updateFrameRect();
    window.addEventListener('resize', updateFrameRect);
    return () => window.removeEventListener('resize', updateFrameRect);
  }, [updateFrameRect, isRevealed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = wordRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 240;
      const norm = Math.min(dist / maxDist, 1);
      setProximity(norm);
      if (norm < 1) {
        mouseX.set(dx / (rect.width / 2));
        mouseY.set(dy / (rect.height / 2));
      }
    };
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      setProximity(1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  const dynamicBlur = proximity * 0; // always sharp when focused
  const cornerColor = '#1A3B8B';
  const glowIntensity = `rgba(26,59,139,${0.3 + (1 - proximity) * 0.5})`;

  return (
    <motion.div
      ref={containerRef}
      className="relative inline-block"
      style={{ perspective: 800, rotateX, rotateY }}
    >
      <motion.span
        ref={wordRef}
        className="relative block font-satoshi font-black text-gray-900 leading-none select-none"
        style={{
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          filter: `blur(${dynamicBlur}px)`,
          transition: 'filter 0.3s ease',
        }}
        initial={{ filter: 'blur(18px)', opacity: 0 }}
        animate={isRevealed ? { filter: 'blur(0px)', opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
      >
        PRECISION
      </motion.span>

      {/* Magnetic focus frame */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          x: frameRect.x - 12,
          y: frameRect.y - 12,
          width: frameRect.w + 24,
          height: frameRect.h + 24,
          opacity: isRevealed ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ top: 0, left: 0 }}
      >
        {/* Corner brackets */}
        {[
          { top: 0, left: 0, borderTop: true, borderLeft: true },
          { top: 0, right: 0, borderTop: true, borderRight: true },
          { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
          { bottom: 0, right: 0, borderBottom: true, borderRight: true },
        ].map((corner, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{ opacity: isRevealed ? 1 : 0 }}
            transition={{ delay: 1.0 + i * 0.06 }}
            style={{
              ...(corner.top !== undefined ? { top: corner.top } : {}),
              ...(corner.bottom !== undefined ? { bottom: corner.bottom } : {}),
              ...(corner.left !== undefined ? { left: corner.left } : {}),
              ...(corner.right !== undefined ? { right: corner.right } : {}),
              width: 20,
              height: 20,
              borderTop: corner.borderTop ? `2.5px solid ${cornerColor}` : undefined,
              borderBottom: corner.borderBottom ? `2.5px solid ${cornerColor}` : undefined,
              borderLeft: corner.borderLeft ? `2.5px solid ${cornerColor}` : undefined,
              borderRight: corner.borderRight ? `2.5px solid ${cornerColor}` : undefined,
              borderRadius: 3,
              filter: `drop-shadow(0 0 6px ${glowIntensity})`,
              transition: 'filter 0.2s ease',
            }}
          />
        ))}

        {/* Proximity glow underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${cornerColor}, transparent)`,
            opacity: 1 - proximity,
          }}
          animate={{ width: frameRect.w + 24 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────────────── */
export default function PrecisionHero() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shutterDone, setShutterDone] = useState(false);

  /* Scroll-based transforms */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  /* Deep parallax: image moves slower than scroll */
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  /* FULFILLMENT outline → solid fill crossfade */
  const fillOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const outlineOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  /* Trigger reveal after mount */
  useEffect(() => {
    const t = setTimeout(() => setIsRevealed(true), 100);
    const t2 = setTimeout(() => setShutterDone(true), 1400);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen bg-white overflow-hidden"
      aria-label="Precision Fulfillment Hero"
    >
      {/* ── 12-col grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">

        {/* ── LEFT PANEL (cols 1-7) ──────────────────────────────── */}
        <div className="md:col-span-7 flex flex-col justify-center
          px-6 sm:px-10 md:px-[6vw] lg:px-[7vw]
          pt-28 pb-16 md:py-0
          relative z-10 order-2 md:order-1">

          {/* Clinical tracker label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="flex items-center gap-3 mb-8 md:mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-genolcare-green animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-gray-400 uppercase">
              SERVICE_001 // FULFILLMENT
            </span>
          </motion.div>

          {/* "PRECISION" — magnetic TrueFocus */}
          <MagneticPrecision isRevealed={isRevealed} />

          {/* "FULFILLMENT" — outline → solid on scroll */}
          <div className="relative mt-1 md:mt-2 leading-none select-none overflow-hidden">
            {/* Outline layer */}
            <motion.span
              className="block font-satoshi font-black text-transparent"
              style={{
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                WebkitTextStroke: '1.5px #d1d5db',
                opacity: outlineOpacity,
              }}
            >
              FULFILLMENT
            </motion.span>
            {/* Solid fill layer (absolute, same position) */}
            <motion.span
              className="absolute inset-0 block font-satoshi font-black"
              style={{
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                color: '#1A3B8B',
                opacity: fillOpacity,
              }}
              initial={{ opacity: 0 }}
              animate={isRevealed ? { opacity: 0 } : {}} // controlled by scroll
            >
              FULFILLMENT
            </motion.span>

            {/* Entrance animation underlay */}
            <motion.div
              className="absolute inset-0"
              initial={{ scaleX: 1 }}
              animate={isRevealed ? { scaleX: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
              style={{ originX: 0, background: 'white' }}
            />
          </div>

          {/* Descriptor text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mt-8 md:mt-10 max-w-md"
          >
            <div className="w-10 h-px bg-genolcare-green mb-5" />
            <p className="font-satoshi text-gray-500 text-base sm:text-lg leading-relaxed">
              Multi-tier verification by a WAPCP-certified Fellow. Every prescription
              processed with specialist precision — from intake to dispensing.
            </p>
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
            className="mt-10 flex items-center gap-6 flex-wrap"
          >
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-genolcare-blue text-white
                font-satoshi font-semibold text-sm px-7 py-4 rounded-2xl
                shadow-[0_8px_24px_rgba(26,59,139,0.35)]
                hover:shadow-[0_12px_32px_rgba(26,59,139,0.45)]
                transition-shadow duration-300"
            >
              Book a Consultation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </motion.a>

            <motion.a
              href="/#process"
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 font-satoshi text-sm font-semibold text-gray-400 hover:text-genolcare-blue transition-colors duration-200"
            >
              See our process
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {['WAPCP Certified', 'FPCPharm', 'Cold-Chain Capable', '15+ Years'].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[0.18em] uppercase
                  px-3 py-1.5 rounded-full border border-gray-100 text-gray-400
                  bg-gray-50/60"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT PANEL (cols 8-12) ───────────────────────────── */}
        <div className="md:col-span-5 relative flex items-center justify-end
          order-1 md:order-2 h-[55vw] sm:h-[45vw] md:h-auto">

          {/* Subtle left shadow split */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 z-10
            bg-gradient-to-r from-white to-transparent pointer-events-none" />

          {/* Image window */}
          <div
            ref={imageRef}
            className="relative w-full h-full md:h-[85vh] md:rounded-l-[3rem]
              overflow-hidden md:my-auto"
          >
            {/* Shutter reveal: two panels sliding away from center */}
            <AnimatePresence>
              {!shutterDone && (
                <>
                  <motion.div
                    key="shutter-top"
                    className="absolute inset-x-0 top-0 z-30 bg-white"
                    initial={{ height: '50%' }}
                    animate={isRevealed ? { height: '0%' } : { height: '50%' }}
                    exit={{ height: '0%' }}
                    transition={{ duration: 1.1, ease: EASE }}
                  />
                  <motion.div
                    key="shutter-bottom"
                    className="absolute inset-x-0 bottom-0 z-30 bg-white"
                    initial={{ height: '50%' }}
                    animate={isRevealed ? { height: '0%' } : { height: '50%' }}
                    exit={{ height: '0%' }}
                    transition={{ duration: 1.1, ease: EASE }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Parallax image */}
            <motion.div
              className="absolute inset-0 scale-110"
              style={{ y: imageY }}
            >
              <Image
                src="/prescription_filling.png"
                alt="Precision prescription fulfillment at Genolcare Pharmacy"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </motion.div>

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

            {/* System metadata card */}
            <SystemMetadata />

            {/* RX badge top-left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isRevealed ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
              className="absolute top-6 left-6 z-20
                backdrop-blur-xl bg-black/30 border border-white/10
                rounded-xl px-4 py-2"
            >
              <span className="font-mono text-[9px] tracking-[0.22em] text-white/60 uppercase block">
                Service
              </span>
              <span className="font-satoshi font-black text-white text-sm leading-tight">
                Rx Fulfillment
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
