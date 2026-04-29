'use client';

import { useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import ContactModal from './ContactModal';

const EASE = [0.22, 1, 0.36, 1] as const;
const GREEN = '#6DBE45';
const BLUE  = '#1A3B8B';

/* ─── Types ────────────────────────────────────────────────────────── */
interface Particle {
  id: number;
  angle: number;
  dist: number;
  size: number;
  green: boolean;
}

/* ─── Helpers ──────────────────────────────────────────────────────── */
function mkParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    angle: (360 / n) * i + (Math.random() - 0.5) * 20,
    dist: 60 + Math.random() * 120,
    size: 3 + Math.random() * 9,
    green: Math.random() > 0.4,
  }));
}

/* ─── Atmospheric orb ──────────────────────────────────────────────── */
function Orb({ x, y, r, dur, delay }: { x: string; y: string; r: number; dur: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none select-none"
      style={{
        left: x, top: y,
        width: r * 2, height: r * 2,
        marginLeft: -r, marginTop: -r,
        background: `radial-gradient(circle, rgba(109,190,69,0.09) 0%, transparent 68%)`,
      }}
      animate={{ y: [0, -26, 0], opacity: [0.3, 0.65, 0.3] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Headline data ────────────────────────────────────────────────── */
const LINES = ['The journey ends.', 'Your fulfilment', 'begins.'];

/* ─── Main component ───────────────────────────────────────────────── */
export default function DigitalBridgeCTA() {
  const magnetRef  = useRef<HTMLDivElement>(null);
  const clickedRef = useRef(false);

  const [isHovered,  setIsHovered]  = useState(false);
  const [particles,  setParticles]  = useState<Particle[]>([]);
  const [exploding,  setExploding]  = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Spring-driven magnetic pull */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const btnX = useSpring(rawX, { stiffness: 190, damping: 18 });
  const btnY = useSpring(rawY, { stiffness: 190, damping: 18 });

  const onMagnetMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetRef.current) return;
    const r = magnetRef.current.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width  / 2)) * 0.38);
    rawY.set((e.clientY - (r.top  + r.height / 2)) * 0.38);
  }, [rawX, rawY]);

  const onMagnetLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  }, [rawX, rawY]);

  const handleClick = useCallback(() => {
    if (clickedRef.current) return;
    clickedRef.current = true;
    setExploding(true);
    setParticles(mkParticles(28));
    setTimeout(() => {
      clickedRef.current = false;
      setExploding(false);
      setParticles([]);
      setIsModalOpen(true);
    }, 760);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '90vh',
        background: 'linear-gradient(175deg, #1c2848 0%, #0F1830 38%, #070d1a 100%)',
      }}
    >
      {/* ── Atmospheric orbs ── */}
      <Orb x="10%"  y="28%" r={200} dur={9}   delay={0}   />
      <Orb x="76%"  y="60%" r={260} dur={12}  delay={2.2} />
      <Orb x="52%"  y="15%" r={130} dur={7.5} delay={1.1} />
      <Orb x="88%"  y="22%" r={90}  dur={10}  delay={3.5} />

      {/* ── Faint vertical grid lines ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={i}
            x1={`${(i + 1) * (100 / 12)}%`} y1="0%"
            x2={`${(i + 1) * (100 / 12)}%`} y2="100%"
            stroke="rgba(255,255,255,0.022)" strokeWidth="1"
          />
        ))}
        {/* Single horizontal bisect */}
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      </svg>

      {/* ── Main grid ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 min-h-[90vh] px-6 sm:px-10 lg:px-[4vw] items-center gap-y-14 md:gap-y-0">

        {/* ────────────────── LEFT: Narrative ────────────────── */}
        <div className="md:col-span-7 py-24 md:py-0 md:pr-10">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-2.5 mb-10"
          >
            <motion.span
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="inline-block w-1 h-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: GREEN }}
            />
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.28em] text-white/25 uppercase">
              SERVICE_001 // CLOSING SEQUENCE
            </span>
          </motion.div>

          {/* Serif headline — line by line blur-up */}
          <div className="mb-7">
            {LINES.map((line, li) => (
              <motion.span
                key={li}
                className="block"
                initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, delay: li * 0.16, ease: EASE }}
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: 'clamp(2.2rem, 5.2vw, 5.2rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.10,
                  color: 'rgba(255,255,255,0.90)',
                }}
              >
                {line}
              </motion.span>
            ))}
          </div>

          {/* Sub-headline — mono green */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="font-mono text-sm tracking-[0.2em] uppercase mb-12"
            style={{ color: GREEN }}
          >
            Initiate the human algorithm.
          </motion.p>

          {/* Gradient rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.62, ease: EASE }}
            className="h-px max-w-[280px] mb-10"
            style={{
              originX: 0,
              background: `linear-gradient(90deg, ${GREEN} 0%, ${BLUE} 45%, transparent 100%)`,
            }}
          />

          {/* Credential micro-tags */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.78 }}
            className="flex flex-wrap gap-2"
          >
            {['WAPCP Certified', 'FPCPharm', 'Tamper-Proof', 'Cold-Chain Verified'].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[8px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.28)' }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ────────────────── RIGHT: Magnetic CTA ────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.25 }}
          className="md:col-span-5 flex items-center justify-center py-16 md:py-0"
        >
          {/* ── Magnetic field ── */}
          <div
            ref={magnetRef}
            className="relative flex items-center justify-center select-none"
            style={{ width: 360, height: 360 }}
            onMouseMove={onMagnetMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={onMagnetLeave}
          >

            {/* Outer counter-rotating orbit rings */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ width: 316, height: 316, border: '1px solid rgba(109,190,69,0.11)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ width: 254, height: 254, border: '1px solid rgba(26,59,139,0.16)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />

            {/* Tick marks on outer ring */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i / 12) * 360;
              const rad   = (angle * Math.PI) / 180;
              const R     = 158;
              return (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    width: 3, height: 3,
                    borderRadius: '50%',
                    backgroundColor: i % 3 === 0 ? GREEN : 'rgba(255,255,255,0.15)',
                    left: '50%', top: '50%',
                    marginLeft: -1.5, marginTop: -1.5,
                    transform: `translate(${Math.cos(rad) * R}px, ${Math.sin(rad) * R}px)`,
                    opacity: i % 3 === 0 ? 0.5 : 0.2,
                  }}
                  animate={i % 3 === 0 ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                />
              );
            })}

            {/* Particle explosion */}
            <AnimatePresence>
              {exploding && particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: p.size, height: p.size,
                    backgroundColor: p.green ? GREEN : 'rgba(255,255,255,0.9)',
                    left: '50%', top: '50%',
                    marginLeft: -(p.size / 2), marginTop: -(p.size / 2),
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
                    y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
                    opacity: 0,
                    scale: 0.15,
                  }}
                  transition={{ duration: 0.7, ease: [0.15, 1, 0.3, 0] }}
                />
              ))}
            </AnimatePresence>

            {/* ── The Button ── */}
            <motion.button
              style={{ x: btnX, y: btnY, background: 'rgba(255,255,255,0.045)' }}
              animate={{
                scale: isHovered ? 1.06 : 1,
                boxShadow: isHovered
                  ? '0 0 55px rgba(109,190,69,0.24), 0 0 120px rgba(109,190,69,0.10), inset 0 0 48px rgba(109,190,69,0.08)'
                  : '0 10px 50px rgba(0,0,0,0.5), inset 0 0 24px rgba(255,255,255,0.02)',
              }}
              whileTap={{ scale: 0.93 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={handleClick}
              className="relative px-10 py-[1.4rem] rounded-full cursor-pointer overflow-hidden backdrop-blur-3xl border border-white/[0.16]"
              aria-label="Initiate Fulfillment — go to contact"
            >
              {/* Liquid bloom on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute pointer-events-none"
                    style={{
                      inset: '-30%',
                      borderRadius: '50%',
                      background: 'radial-gradient(ellipse at 50% 55%, rgba(109,190,69,0.20) 0%, transparent 62%)',
                    }}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.52, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              {/* Burst flash on click */}
              <AnimatePresence>
                {exploding && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${GREEN}55 0%, transparent 70%)` }}
                    initial={{ opacity: 1, scale: 0.6 }}
                    animate={{ opacity: 0, scale: 2.4 }}
                    exit={{}}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>

              <span className="relative z-10 flex items-center gap-3">
                <span
                  className="font-mono font-bold tracking-[0.22em] uppercase whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(0.65rem, 1.4vw, 0.82rem)',
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  Initiate Fulfillment
                </span>

                {/* Arrow-up-right: draws on hover */}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                  <motion.path
                    d="M2.5 12.5L12.5 2.5M12.5 2.5H5.5M12.5 2.5V9.5"
                    stroke={GREEN}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isHovered ? 1 : 0,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </svg>
              </span>
            </motion.button>

            {/* Hover caption beneath */}
            <motion.p
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute font-mono text-[7px] tracking-[0.22em] uppercase text-center pointer-events-none"
              style={{
                bottom: '14%',
                left: 0, right: 0,
                color: 'rgba(255,255,255,0.22)',
              }}
            >
              Secure · Specialist-Reviewed · 24h Response
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom strip ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 lg:px-[4vw] pb-7 flex justify-between items-end">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1 }}
          className="font-mono text-[7px] tracking-[0.22em] uppercase"
          style={{ color: 'rgba(255,255,255,0.10)' }}
        >
          Genolcare Pharmacy · Dakwo, Lokogoma, Abuja FCT
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="font-mono text-[7px] tracking-[0.22em] uppercase"
          style={{ color: 'rgba(255,255,255,0.10)' }}
        >
          © 2025 · All rights reserved
        </motion.span>
      </div>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
