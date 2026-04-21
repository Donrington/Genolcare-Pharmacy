'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ─── Step data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'licensed-pharmacists',
    number: '01',
    label: 'Licensed Pharmacists',
    description:
      'Our team of certified, licensed pharmacists ensures that every interaction provides expert and safe medical guidance.',
  },
  {
    id: 'genuine-products',
    number: '02',
    label: 'Genuine Products',
    description:
      'We supply only rigorously verified, genuine medications and health products for your complete safety and peace of mind.',
  },
  {
    id: 'trusted-community',
    number: '03',
    label: 'Trusted by the Community',
    description:
      'A deeply trusted pharmacy partner committed to providing reliable, personalized healthcare to everyone in our community.',
  },
] as const;

type Activation = 'active' | 'activating' | 'faded';

/* ─── Per-activation visual config ─────────────────────────────── */
const CONFIG: Record<Activation, {
  nodeOpacity: number;
  glowSize: string;
  glowColor: string;
  pulseScale: number[];
  pulseOpacity: number[];
  labelOpacity: number;
  iconOpacity: number;
  borderColor: string;
  bgColor: string;
}> = {
  active: {
    nodeOpacity: 1,
    glowSize: '0 0 40px 8px',
    glowColor: 'rgba(26,59,139,0.35)',
    pulseScale: [1, 1.35, 1],
    pulseOpacity: [0.4, 0, 0.4],
    labelOpacity: 1,
    iconOpacity: 1,
    borderColor: 'rgba(26,59,139,0.6)',
    bgColor: 'rgba(255,255,255,0.65)',
  },
  activating: {
    nodeOpacity: 0.75,
    glowSize: '0 0 20px 3px',
    glowColor: 'rgba(109,190,69,0.25)',
    pulseScale: [1, 1.2, 1],
    pulseOpacity: [0.25, 0, 0.25],
    labelOpacity: 0.7,
    iconOpacity: 0.7,
    borderColor: 'rgba(109,190,69,0.4)',
    bgColor: 'rgba(255,255,255,0.45)',
  },
  faded: {
    nodeOpacity: 0.35,
    glowSize: '0 0 0px 0px',
    glowColor: 'transparent',
    pulseScale: [1, 1, 1],
    pulseOpacity: [0, 0, 0],
    labelOpacity: 0.35,
    iconOpacity: 0.3,
    borderColor: 'rgba(200,200,200,0.4)',
    bgColor: 'rgba(255,255,255,0.25)',
  },
};

/* ─── Icons ─────────────────────────────────────────────────────── */
function ConsultationIcon({ opacity }: { opacity: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
      <circle cx="14" cy="10" r="5" stroke="#1A3B8B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 22c0-4 4-7 9-7s9 3 9 7" stroke="#1A3B8B" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="18" y="4" width="8" height="7" rx="2" stroke="#6DBE45" strokeWidth="1.3" />
      <path d="M20 7h4M20 9h2" stroke="#6DBE45" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function FulfillmentIcon({ opacity }: { opacity: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
      <rect x="8" y="4" width="12" height="20" rx="3" stroke="#1A3B8B" strokeWidth="1.5" />
      <ellipse cx="14" cy="4.5" rx="3" ry="1.5" stroke="#1A3B8B" strokeWidth="1.3" />
      <circle cx="14" cy="14" r="3.5" stroke="#6DBE45" strokeWidth="1.3" />
      <path d="M12.5 14l1.2 1.2 2-2.4" stroke="#6DBE45" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19h8" stroke="#1A3B8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function SupportIcon({ opacity }: { opacity: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
      <path d="M6 14a8 8 0 1116 0v2a3 3 0 01-3 3h-1" stroke="#1A3B8B" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="13" width="4" height="6" rx="2" stroke="#1A3B8B" strokeWidth="1.3" />
      <rect x="20" y="13" width="4" height="6" rx="2" stroke="#1A3B8B" strokeWidth="1.3" />
      <circle cx="20" cy="8" r="3" stroke="#6DBE45" strokeWidth="1.3" />
      <path d="M19 8h2M20 7v2" stroke="#6DBE45" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const ICONS = [ConsultationIcon, FulfillmentIcon, SupportIcon];

/* ─── Node ──────────────────────────────────────────────────────── */
function TimelineNode({ step, stepIndex, activeIndex, isInView }: {
  step: (typeof STEPS)[number];
  stepIndex: number;
  activeIndex: number;
  isInView: boolean;
}) {
  const activation: Activation =
    stepIndex === activeIndex ? 'active' :
    stepIndex === activeIndex + 1 ? 'activating' : 'faded';
  const cfg = CONFIG[activation];
  const Icon = ICONS[stepIndex];
  const delay = stepIndex * 0.15;

  return (
    <motion.div
      className="flex gap-6 md:gap-10 items-start cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Node sphere */}
      <div className="flex-shrink-0 relative flex items-center justify-center mt-1">
        {/* Pulse ring */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 72, height: 72 }}
          animate={{
            scale: cfg.pulseScale,
            opacity: cfg.pulseOpacity,
            borderColor: cfg.borderColor,
          }}
          transition={{
            scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            borderColor: { duration: 0.8, ease: 'easeInOut' },
          }}
          style={{ border: '1.5px solid', borderColor: cfg.borderColor }}
        />

        {/* Glass sphere */}
        <motion.div
          className="relative w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-xl"
          animate={{
            opacity: cfg.nodeOpacity,
            boxShadow: activation === 'active'
              ? [
                  `0 0 30px 4px rgba(26,59,139,0.25), inset 0 1px 0 rgba(255,255,255,0.8)`,
                  `0 0 48px 10px rgba(26,59,139,0.38), inset 0 1px 0 rgba(255,255,255,0.8)`,
                  `0 0 30px 4px rgba(26,59,139,0.25), inset 0 1px 0 rgba(255,255,255,0.8)`,
                ]
              : activation === 'activating'
              ? `0 0 20px 3px rgba(109,190,69,0.2), inset 0 1px 0 rgba(255,255,255,0.8)`
              : `0 0 0px 0px transparent, inset 0 1px 0 rgba(255,255,255,0.8)`,
            background: cfg.bgColor,
          }}
          transition={{
            opacity: { duration: 0.7, ease: 'easeInOut' },
            background: { duration: 0.7, ease: 'easeInOut' },
            boxShadow: activation === 'active'
              ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.7, ease: 'easeInOut' },
          }}
          style={{ border: `1.5px solid ${cfg.borderColor}` }}
        >
          <motion.div
            animate={{ opacity: cfg.iconOpacity }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <Icon opacity={1} />
          </motion.div>
        </motion.div>

        {/* Active core dot */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-genolcare-blue"
          style={{ bottom: 10, right: 10 }}
          animate={{
            scale: activation === 'active' ? [1, 1.6, 1] : 0,
            opacity: activation === 'active' ? [1, 0.4, 1] : 0,
          }}
          transition={
            activation === 'active'
              ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.5, ease: 'easeInOut' }
          }
        />
      </div>

      {/* Text content */}
      <motion.div
        className="flex-1 pb-12 md:pb-16"
        animate={{ opacity: cfg.labelOpacity }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <p className="font-satoshi text-[10px] tracking-[0.3em] text-gray-400 uppercase font-semibold mb-2">
          Step {step.number}
        </p>
        <motion.h3
          className="font-satoshi text-xl md:text-2xl font-black tracking-tight mb-3"
          animate={{
            color: activation === 'active'
              ? '#111827'
              : activation === 'activating'
              ? '#374151'
              : '#9CA3AF',
          }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {step.label.toUpperCase()}
        </motion.h3>
        <p className="font-satoshi text-sm md:text-base text-gray-500 leading-relaxed max-w-sm">
          {step.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────── */
export default function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Auto-cycle steps every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-white py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      {/* Subtle background depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(26,59,139,0.04) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(109,190,69,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-center md:text-left"
          >
            <p className="font-satoshi text-[10px] tracking-[0.3em] text-gray-400 uppercase font-semibold mb-4 text-center sm:text-left">
              [ Why Choose Us ]
            </p>
            <h2 className="font-satoshi text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-none tracking-tight mb-6 text-center sm:text-left">
              Why Choose<br />Genolcare?
            </h2>
            <p className="font-satoshi text-base md:text-lg text-gray-500 leading-relaxed max-w-sm text-center sm:text-left">
              We stand by our commitment to quality. Discover what makes us a trusted healthcare partner.
            </p>

            {/* Process Graphic — click to open lightbox */}
            <div
              className="hidden md:block relative mt-16 w-full max-w-sm ml-auto mr-auto sm:ml-0 aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <motion.img
                src="/process.jpg"
                alt="Why Choose Genolcare infographic"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-hard-light"
                style={{
                  background:
                    'radial-gradient(circle at 50% 0%, rgba(26,59,139,0.3) 0%, transparent 60%)',
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Zoom hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Timeline */}
          <div ref={ref} className="relative">
            {/* Animated vertical path */}
            <div className="absolute left-8 top-8 bottom-8 w-[1px] overflow-hidden">
              {/* Background track */}
              <div className="absolute inset-0 bg-gray-100" />
              {/* Animated fill */}
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{
                  background:
                    'linear-gradient(to bottom, #1A3B8B, #6DBE45, transparent)',
                }}
                initial={{ height: '0%' }}
                animate={isInView ? { height: '100%' } : {}}
                transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Travelling glow dot */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-genolcare-blue"
                style={{ filter: 'blur(2px)', boxShadow: '0 0 8px 3px rgba(26,59,139,0.5)' }}
                initial={{ top: '0%' }}
                animate={isInView ? { top: '98%' } : {}}
                transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Steps */}
            <div className="relative pl-4">
              {STEPS.map((step, i) => (
                <TimelineNode
                  key={step.id}
                  step={step}
                  stepIndex={i}
                  activeIndex={activeIndex}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Image */}
            <motion.div
              className="relative z-10 max-w-4xl w-full rounded-[2rem] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/process.jpg"
                alt="Why Choose Genolcare infographic"
                className="w-full h-auto object-contain"
              />
              {/* Close button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
