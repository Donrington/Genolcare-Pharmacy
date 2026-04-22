'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion';
import Image from 'next/image';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Step data ──────────────────────────────────────────────────── */
const STEPS = [
  {
    number: '01',
    title: 'THE SEAL',
    description:
      'Application of the primary tamper-proof seal at stabilization temperature.',
    image: '/packaging_seal.png',
    overlay: 'linear-gradient(135deg, rgba(26,59,139,0.68) 0%, rgba(0,0,0,0.55) 100%)',
    accent: '#1A3B8B',
  },
  {
    number: '02',
    title: 'THE IDENTIFIER',
    description:
      'Affixing the custom-generated cryptographic QR code for end-to-end tracking.',
    image: '/identifier.png',
    overlay: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(15,24,48,0.45) 100%)',
    accent: '#6DBE45',
  },
  {
    number: '03',
    title: 'THE CASKET',
    description:
      'Encasing the verified therapeutic within the signature Genolcare matte white polymer casing.',
    image: '/casket.png',
    overlay: 'linear-gradient(135deg, rgba(10,10,10,0.80) 0%, rgba(26,59,139,0.35) 100%)',
    accent: '#1A3B8B',
  },
  {
    number: '04',
    title: 'THE FINAL AUTHENTICATOR',
    description:
      'Application of the holographic fellowship signature seal.',
    image: '/authenticator.png',
    overlay: 'linear-gradient(135deg, rgba(109,190,69,0.28) 0%, rgba(0,0,0,0.75) 100%)',
    accent: '#6DBE45',
  },
] as const;

/* ─── Individual step card ───────────────────────────────────────── */
interface CardProps {
  step: (typeof STEPS)[number];
  index: number;
  isActive: boolean;
  skewX: MotionValue<number>;
  scaleY: MotionValue<number>;
}

function StepCard({ step, index, isActive, skewX, scaleY }: CardProps) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const mouseX    = useMotionValue(0);
  const mouseY    = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), {
    stiffness: 140, damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-4, 4]), {
    stiffness: 140, damping: 22,
  });

  const words = step.description.split(' ');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left - r.width / 2) / (r.width / 2));
    mouseY.set((e.clientY - r.top - r.height / 2) / (r.height / 2));
  };

  return (
    <div
      ref={cardRef}
      className="h-screen flex-shrink-0 relative overflow-hidden"
      style={{ width: `${100 / STEPS.length}%` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      {/* Parallax-tilt image — inset to give tilt room */}
      <motion.div
        className="absolute inset-[-6%]"
        style={{ rotateX, rotateY, transformPerspective: 900 }}
      >
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover"
          priority={index === 0}
          sizes="100vw"
        />
      </motion.div>

      {/* Colour gradient overlay */}
      <div className="absolute inset-0" style={{ background: step.overlay }} />

      {/* Large ghost step number — deep background */}
      <div
        className="absolute -bottom-[5vw] -right-[2vw] font-mono font-black text-white
          pointer-events-none select-none leading-none"
        style={{ fontSize: '30vw', opacity: 0.04 }}
        aria-hidden="true"
      >
        {step.number}
      </div>

      {/* ── Glassmorphism text block ── */}
      <div className="absolute inset-0 flex items-end px-8 sm:px-12 md:px-16 pb-16 md:pb-20">
        <motion.div
          className="backdrop-blur-xl border border-white/20 rounded-2xl p-7 sm:p-9 md:p-10 w-full max-w-lg"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          initial={{ opacity: 0, y: 44 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {/* Counter + pulse */}
          <div className="flex items-center gap-3 mb-5">
            <motion.span
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="inline-block w-1 h-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: step.accent }}
            />
            <span className="font-mono text-[8px] tracking-[0.26em] text-white/38 uppercase">
              STEP {step.number} OF 04 // FINAL PREPARATION
            </span>
          </div>

          {/* Title — velocity-stretched typography */}
          <motion.h2
            className="font-mono font-black text-white leading-none mb-6"
            style={{
              fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
              letterSpacing: '0.04em',
              skewX,
              scaleY,
              transformOrigin: 'left center',
            }}
          >
            {step.title}
          </motion.h2>

          {/* Description — word-by-word reveal */}
          <p className="font-satoshi leading-relaxed text-sm sm:text-[15px]"
            style={{ color: 'rgba(255,255,255,0.70)' }}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={{ marginRight: '0.3em' }}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={
                  isActive
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 10, filter: 'blur(4px)' }
                }
                transition={{
                  duration: 0.4,
                  delay: isActive ? 0.5 + i * 0.048 : 0,
                  ease: EASE,
                }}
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */
export default function FinalPreparationCraft() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* Horizontal track translation — direct scroll-linked */
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  /* Velocity → typography stretch */
  const rawVelocity    = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(rawVelocity, { damping: 50, stiffness: 400 });
  const skewX  = useTransform(smoothVelocity, [-0.8, 0, 0.8], [-7, 0, 7]);
  const scaleY = useTransform(smoothVelocity, [-0.8, 0, 0.8], [0.88, 1, 0.88]);

  /* Track active card */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveCard(Math.min(Math.floor(v * 4), 3));
  });

  return (
    <div ref={containerRef} className="h-[400vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* ── Top progress bar ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] z-50"
          style={{
            scaleX: scrollYProgress,
            originX: 0,
            background: 'linear-gradient(90deg, #1A3B8B 0%, #6DBE45 100%)',
          }}
        />

        {/* ── Section label — top left ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-6 left-6 sm:left-10 z-40"
        >
          <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.28em] text-white/28 uppercase">
            SERVICE_001 // FINAL PREPARATION
          </span>
        </motion.div>

        {/* ── Active step label — top right ── */}
        <div className="absolute top-6 right-6 sm:right-10 z-40">
          <motion.span
            key={activeCard}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="font-mono text-[8px] tracking-[0.22em] text-white/28 uppercase"
          >
            {STEPS[activeCard].number} OF 04
          </motion.span>
        </div>

        {/* ── Horizontal card track ── */}
        <motion.div className="flex h-full" style={{ x, width: `${STEPS.length * 100}%` }}>
          {STEPS.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              isActive={activeCard === i}
              skewX={skewX}
              scaleY={scaleY}
            />
          ))}
        </motion.div>

        {/* ── Step indicator — pill dots ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              animate={{
                width: activeCard === i ? 22 : 6,
                height: 6,
                backgroundColor:
                  activeCard === i ? '#6DBE45' : 'rgba(255,255,255,0.22)',
              }}
              transition={{ duration: 0.32, ease: EASE }}
            />
          ))}
        </div>

        {/* ── Scroll hint (card 0 only) ── */}
        <motion.div
          className="absolute bottom-8 right-8 sm:right-12 z-40 flex items-center gap-2"
          animate={{ opacity: activeCard === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="font-mono text-[8px] tracking-[0.22em] text-white/28 uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path
                d="M1 5h12M8 1l5 4-5 4"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
