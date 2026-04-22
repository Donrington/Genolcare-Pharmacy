'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import ContactModal from './ContactModal';
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
  const [vals, setVals] = useState(META_FIELDS.map(() => '—'));

  useEffect(() => {
    setVals(META_FIELDS.map((f) => f.getValue()));
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

/* ─── Unified cycling TrueFocus for PRECISION + FULFILLMENT ────── */
interface PrecisionWordsProps {
  isRevealed: boolean;
  fillOpacity: ReturnType<typeof useTransform<number, number>>;
  outlineOpacity: ReturnType<typeof useTransform<number, number>>;
}

function PrecisionWords({ isRevealed, fillOpacity, outlineOpacity }: PrecisionWordsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const word0Ref = useRef<HTMLSpanElement>(null); // PRECISION
  const word1Ref = useRef<HTMLSpanElement>(null); // FULFILLMENT

  const [activeIndex, setActiveIndex] = useState(0);
  const [rects, setRects] = useState([
    { x: 0, y: 0, w: 0, h: 0 },
    { x: 0, y: 0, w: 0, h: 0 },
  ]);
  const [proximity, setProximity] = useState(1);
  const [fontsReady, setFontsReady] = useState(false);

  /* Magnetic tilt */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), { stiffness: 160, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-4, 4]), { stiffness: 160, damping: 24 });

  /* Wait for fonts before first measurement */
  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  /* Core measurement — uses offsetLeft/offsetTop traversal for accuracy across nested divs */
  const measure = useCallback(() => {
    const cont = containerRef.current;
    const els = [word0Ref.current, word1Ref.current];
    if (!cont || els.some((e) => !e)) return;

    const measured = els.map((el) => {
      if (!el) return { x: 0, y: 0, w: 0, h: 0 };
      // Walk offsetParent chain up to container for reliable nested positioning
      let x = 0, y = 0;
      let cur: HTMLElement | null = el;
      while (cur && cur !== cont) {
        x += cur.offsetLeft;
        y += cur.offsetTop;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    });
    setRects(measured);
  }, []);

  /* Re-measure when fonts load or reveal happens */
  useEffect(() => {
    if (!fontsReady || !isRevealed) return;
    measure();
  }, [fontsReady, isRevealed, measure]);

  /* ResizeObserver so any layout shift re-measures */
  useEffect(() => {
    if (!fontsReady) return;
    const obs = new ResizeObserver(measure);
    [word0Ref.current, word1Ref.current].forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [fontsReady, measure]);

  /* Resize */
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  /* Cycle every 2.4s */
  useEffect(() => {
    if (!isRevealed) return;
    const id = setInterval(() => setActiveIndex((p) => (p + 1) % 2), 2400);
    return () => clearInterval(id);
  }, [isRevealed]);

  /* Magnetic cursor */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cont = containerRef.current;
      if (!cont) return;
      const r = cont.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const norm = Math.min(Math.sqrt(dx * dx + dy * dy) / 320, 1);
      setProximity(norm);
      mouseX.set(dx / (r.width / 2));
      mouseY.set(dy / (r.height / 2));
    };
    const onLeave = () => { mouseX.set(0); mouseY.set(0); setProximity(1); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); };
  }, [mouseX, mouseY]);

  const BLUR = 8;
  const PAD = 16;
  const cornerColor = '#1A3B8B';
  const glow = `rgba(26,59,139,${0.5 + (1 - proximity) * 0.5})`;
  const fr = rects[activeIndex];

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      style={{ perspective: 900, rotateX, rotateY }}
    >
      {/* PRECISION — inline-block so offsetWidth = text width, not container width */}
      <div className="leading-none">
        <motion.span
          ref={word0Ref}
          className="inline-block font-satoshi font-black text-gray-900 leading-none select-none"
          style={{
            fontSize: 'clamp(2.2rem, 9vw, 8rem)',
            filter: activeIndex === 0 ? 'blur(0px)' : `blur(${BLUR}px)`,
            transition: 'filter 0.5s ease',
            willChange: 'filter',
          }}
          initial={{ opacity: 0, filter: 'blur(18px)' }}
          animate={isRevealed ? { opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          PRECISION
        </motion.span>
      </div>

      {/* FULFILLMENT — inline-block so offsetWidth = text width */}
      <div className="relative mt-1 md:mt-2 leading-none select-none">
        {/* Ref span: inline-block, always in DOM at full opacity for accurate measurement */}
        <span
          ref={word1Ref}
          className="inline-block font-satoshi font-black"
          style={{
            fontSize: 'clamp(2.2rem, 9vw, 8rem)', 
            WebkitTextStroke: '2px #374151',
            color: 'transparent',
            filter: activeIndex === 1 ? 'blur(0px)' : `blur(${BLUR}px)`,
            transition: 'filter 0.5s ease',
            willChange: 'filter',
          }}
        >
          FULFILLMENT
        </span>

        {/* Solid fill — scroll-driven */}
        <motion.span
          className="absolute top-0 left-0 inline-block font-satoshi font-black pointer-events-none"
          style={{
            fontSize: 'clamp(2.2rem, 9vw, 8rem)',
            WebkitTextStroke: '2px #374151',
            color: '#1A3B8B',
            filter: activeIndex === 1 ? 'blur(0px)' : `blur(${BLUR}px)`,
            transition: 'filter 0.5s ease',
            opacity: fillOpacity,
          }}
        >
          FULFILLMENT
        </motion.span>

        {/* Outline fade — scroll-driven */}
        <motion.span
          className="absolute top-0 left-0 inline-block font-satoshi font-black pointer-events-none"
          style={{
            fontSize: 'clamp(2.2rem, 9vw, 8rem)', 
            WebkitTextStroke: '2px #374151',
            color: 'transparent',
            filter: activeIndex === 1 ? 'blur(0px)' : `blur(${BLUR}px)`,
            transition: 'filter 0.5s ease',
            opacity: outlineOpacity,
          }}
        >
          FULFILLMENT
        </motion.span>

        {/* Entrance white wipe */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scaleX: 1 }}
          animate={isRevealed ? { scaleX: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          style={{ originX: 0, background: 'white' }}
        />
      </div>

      {/* Cycling focus frame — springs to active word's exact measured rect */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          x: fr.x - PAD,
          y: fr.y - PAD,
          width: fr.w + PAD * 2,
          height: fr.h + PAD * 2,
          opacity: isRevealed && fr.w > 0 ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        style={{ top: 0, left: 0 }}
      >
        {[
          { top: 0, left: 0, bT: true, bL: true },
          { top: 0, right: 0, bT: true, bR: true },
          { bottom: 0, left: 0, bB: true, bL: true },
          { bottom: 0, right: 0, bB: true, bR: true },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              ...(c.top    !== undefined ? { top: c.top }       : {}),
              ...(c.bottom !== undefined ? { bottom: c.bottom } : {}),
              ...(c.left   !== undefined ? { left: c.left }     : {}),
              ...(c.right  !== undefined ? { right: c.right }   : {}),
              width: 22, height: 22,
              borderTop:    c.bT ? `3px solid ${cornerColor}` : undefined,
              borderBottom: c.bB ? `3px solid ${cornerColor}` : undefined,
              borderLeft:   c.bL ? `3px solid ${cornerColor}` : undefined,
              borderRight:  c.bR ? `3px solid ${cornerColor}` : undefined,
              borderRadius: 3,
              filter: `drop-shadow(0 0 8px ${glow})`,
            }}
          />
        ))}
        <div
          className="absolute bottom-0 left-0 h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${cornerColor}, transparent)`,
            opacity: Math.max(0, 1 - proximity),
          }}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

          {/* PRECISION + FULFILLMENT — unified cycling TrueFocus */}
          <PrecisionWords
            isRevealed={isRevealed}
            fillOpacity={fillOpacity}
            outlineOpacity={outlineOpacity}
          />

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
            <motion.button
              onClick={() => setIsModalOpen(true)}
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
            </motion.button>

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

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
