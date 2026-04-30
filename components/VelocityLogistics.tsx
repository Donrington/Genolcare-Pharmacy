'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  MotionValue,
} from 'framer-motion';

const EASE  = [0.22, 1, 0.36, 1] as const;
const GREEN = '#6DBE45';

/*
 * SVG viewBox is 1440 × 620.
 * Hub is placed at the exact centre (720, 310) so that on mobile
 * with preserveAspectRatio="xMidYMid slice" the hub stays visible
 * regardless of viewport aspect ratio.
 */
const H_LINES = [80, 160, 240, 320, 400, 480, 560];
const V_LINES = [80, 200, 320, 440, 560, 680, 800, 920, 1040, 1160, 1280, 1380];

const NODES = [
  { cx: 720,  cy: 310, r: 8,  label: 'FCT HUB',    hub: true  },
  { cx: 720,  cy: 78,  r: 5,  label: 'WUSE 2',     hub: false },
  { cx: 1062, cy: 154, r: 5,  label: 'CBD/GARKI',  hub: false },
  { cx: 1252, cy: 322, r: 5,  label: 'APO DIST.',  hub: false },
  { cx: 962,  cy: 512, r: 5,  label: 'LOKOGOMA',   hub: false },
  { cx: 618,  cy: 532, r: 5,  label: 'DAKWO',      hub: false },
  { cx: 192,  cy: 284, r: 5,  label: 'GWAGWALADA', hub: false },
];

/* ─── Single route path — hooks live at component level ────────────────── */
function RoutePath({
  d, p0, p1, scrollYProgress,
}: {
  d: string; p0: number; p1: number;
  scrollYProgress: MotionValue<number>;
}) {
  const pathLen = useTransform(scrollYProgress, [p0, Math.min(p1, 0.97)], [0, 1]);
  const opacity = useTransform(scrollYProgress, [Math.max(p0 - 0.05, 0), p0 + 0.05], [0, 1]);
  return (
    <motion.path
      d={d} fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round"
      style={{ pathLength: pathLen, opacity, filter: `drop-shadow(0 0 8px ${GREEN})` }}
    />
  );
}

/* ─── Glass metric card ─────────────────────────────────────────────────── */
function MetricCard({
  tag, headline, sub, x, skewX, compact = false,
}: {
  tag: string; headline: string; sub: string;
  x: MotionValue<number>; skewX: MotionValue<number>;
  compact?: boolean;
}) {
  return (
    <motion.div
      style={{
        x, skewX,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderRadius: '0.875rem',
        padding: compact ? '1.1rem 1.25rem' : '1.6rem 1.75rem',
        display: 'flex', flexDirection: 'column' as const, gap: '0.4rem',
        position: 'relative' as const, overflow: 'hidden' as const,
        minWidth: compact ? 0 : 255,
        flex: compact ? '1 1 0' : undefined,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: '6.5px', letterSpacing: '0.24em', color: `${GREEN}BB` }}
      >
        {tag}
      </span>
      <h3
        className="font-satoshi font-black text-white"
        style={{
          fontSize: compact ? 'clamp(1rem, 3.5vw, 1.25rem)' : 'clamp(1.15rem, 2vw, 1.5rem)',
          letterSpacing: '-0.02em', lineHeight: 1.05, whiteSpace: 'pre-line',
        }}
      >
        {headline}
      </h3>
      <p className="font-satoshi font-light text-white/50 leading-snug"
        style={{ fontSize: compact ? '0.72rem' : '0.8rem' }}>
        {sub}
      </p>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(to right, transparent, ${GREEN}65, transparent)`,
      }} />
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function VelocityLogistics() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const { scrollY } = useScroll();
  const rawVel   = useVelocity(scrollY);
  const velocity = useSpring(rawVel, { damping: 50, stiffness: 400 });

  /* Map drifts horizontally — reduced on mobile via clamp */
  const mapX = useTransform(scrollYProgress, [0, 1], [0, -70]);

  /* Glitch filter at high velocity */
  const glitchFilter = useTransform(velocity, v => {
    const t = Math.min(Math.abs(v) / 3000, 1);
    if (t < 0.06) return 'none';
    return `brightness(${(1 + t * 0.5).toFixed(2)}) hue-rotate(${(t * 15).toFixed(1)}deg)`;
  });

  /* Desktop card parallax (1.2× / 1.5×) */
  const cardAX = useTransform(scrollYProgress, [0, 1], [70,  -130]);
  const cardBX = useTransform(scrollYProgress, [0, 1], [-55,  145]);

  /* Mobile card parallax — much smaller range */
  const cardAXMobile = useTransform(scrollYProgress, [0, 1], [12, -18]);
  const cardBXMobile = useTransform(scrollYProgress, [0, 1], [-12, 18]);

  /* Velocity-skew */
  const skewA = useTransform(velocity, [-2500, 0, 2500], [-3,  0,  3]);
  const skewB = useTransform(velocity, [-2500, 0, 2500], [ 3,  0, -3]);

  /* Zero-skew constants for mobile (no skewX stress on small screens) */
  const zeroSkew = useTransform(velocity, () => 0);

  const headY = useTransform(scrollYProgress, [0, 1], [20, -55]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-end"
      aria-label="Velocity Logistics — Last-Mile Network"
    >

      {/* ── Layer 0: Photo background ───────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/rapid_response.png"
          alt="Genolcare Rapid Response delivery"
          fill priority quality={95}
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{
          background:
            'linear-gradient(to bottom, rgba(8,11,20,0.38) 0%, rgba(8,11,20,0.18) 25%, rgba(8,11,20,0.5) 60%, rgba(8,11,20,0.94) 100%)',
        }} />
      </div>

      {/* ── Layer 1: Vector map ─────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ x: mapX, filter: glitchFilter }}
      >
        <svg
          viewBox="0 0 1440 620"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {/* Background grid */}
          {H_LINES.map(y => (
            <line key={`h${y}`} x1="0" y1={y} x2="1440" y2={y}
              stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          ))}
          {V_LINES.map(x => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="620"
              stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          ))}

          {/* Routes — each component owns its hooks */}
          <RoutePath d="M 720 310 C 700 222 706 145 720 78"          p0={0.25} p1={0.54} scrollYProgress={scrollYProgress} />
          <RoutePath d="M 720 310 C 840 256 958 198 1062 154"        p0={0.30} p1={0.59} scrollYProgress={scrollYProgress} />
          <RoutePath d="M 720 310 C 930 312 1090 318 1252 322"       p0={0.33} p1={0.62} scrollYProgress={scrollYProgress} />
          <RoutePath d="M 720 310 C 820 392 898 462 962 512"         p0={0.36} p1={0.65} scrollYProgress={scrollYProgress} />
          <RoutePath d="M 720 310 C 700 404 660 474 618 532"         p0={0.39} p1={0.68} scrollYProgress={scrollYProgress} />
          <RoutePath d="M 720 310 C 554 305 375 294 192 284"         p0={0.42} p1={0.71} scrollYProgress={scrollYProgress} />

          {/* Nodes */}
          {NODES.map((node, i) => (
            <g key={i}>
              {node.hub && (
                <>
                  <circle cx={node.cx} cy={node.cy} r={38} fill="none"
                    stroke="rgba(109,190,69,0.07)" strokeWidth="1.2" strokeDasharray="5 8" />
                  <circle cx={node.cx} cy={node.cy} r={22} fill="none"
                    stroke="rgba(109,190,69,0.18)" strokeWidth="1.2" />
                  <circle cx={node.cx} cy={node.cy} r={14} fill="none"
                    stroke="rgba(109,190,69,0.28)" strokeWidth="1.2" />
                </>
              )}
              <circle
                cx={node.cx} cy={node.cy} r={node.r}
                fill={node.hub ? GREEN : 'rgba(109,190,69,0.8)'}
                style={{ filter: `drop-shadow(0 0 ${node.hub ? 14 : 6}px ${GREEN})` }}
              />
              <text
                x={node.cx}
                y={node.cy - node.r - 7}
                textAnchor="middle"
                fontSize={node.hub ? '11' : '9'}
                letterSpacing="2.5"
                fill={node.hub ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)'}
                fontFamily="monospace"
                fontWeight={node.hub ? 'bold' : 'normal'}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* ── Layer 2: Text narrative ──────────────────────────────── */}
      <motion.div
        style={{ y: headY }}
        className="relative z-20 px-5 sm:px-8 md:px-14 pb-6 md:pb-10 pt-20 flex flex-col gap-4 md:gap-5 max-w-3xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE }}
          className="font-mono uppercase"
          style={{ fontSize: 'clamp(7px, 2vw, 10px)', letterSpacing: '0.4em', color: GREEN }}
        >
          [ LOGISTICS_VELOCITY // DEPLOYMENT_ACTIVE ]
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
          className="font-satoshi font-black text-white"
          style={{
            fontSize: 'clamp(1.75rem, 5.5vw, 4.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            textShadow: '0 4px 40px rgba(0,0,0,0.5)',
          }}
        >
          Immediate Care is a<br />
          function of our{' '}
          <span style={{ color: GREEN }}>infrastructure.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          className="font-satoshi font-light text-white/55 max-w-lg"
          style={{ fontSize: 'clamp(0.82rem, 1.6vw, 1.05rem)', lineHeight: 1.7 }}
        >
          A kinetic network spanning FCT Abuja — from our central hub to every last-mile
          destination in under 60 minutes. Velocity is not a feature. It is the standard.
        </motion.p>

        {/* ── Mobile cards — inline after text, full-width ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="flex gap-3 mt-2 md:hidden"
        >
          <MetricCard
            tag="FULFILLMENT"
            headline={`60-Min\nService`}
            sub="Lagos/Abuja last-mile network"
            x={cardAXMobile}
            skewX={zeroSkew}
            compact
          />
          <MetricCard
            tag="COLD-CHAIN"
            headline={`Climate\nControlled`}
            sub="End-to-end integrity"
            x={cardBXMobile}
            skewX={zeroSkew}
            compact
          />
        </motion.div>
      </motion.div>

      {/* ── Layer 3: Desktop floating cards (md+) ───────────────── */}
      <div className="hidden md:block absolute inset-0 z-30 pointer-events-none">

        {/* Card A — left, ~26% from top */}
        <div className="absolute left-14" style={{ top: '24%' }}>
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <MetricCard
              tag="METRIC_01 // FULFILLMENT"
              headline={`60-Minute\nFulfillment`}
              sub="Optimized Lagos/Abuja Last-Mile Network"
              x={cardAX} skewX={skewA}
            />
          </motion.div>
        </div>

        {/* Card B — right, ~43% from top */}
        <div className="absolute right-14" style={{ top: '42%' }}>
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            <MetricCard
              tag="METRIC_02 // COLD-CHAIN"
              headline={`Cold-Chain\nLast Mile`}
              sub="Climate-Controlled integrity, end-to-end"
              x={cardBX} skewX={skewB}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Zone indicator ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-5 right-5 sm:bottom-7 sm:right-8 z-30 flex items-center gap-2.5"
      >
        <span className="font-mono text-[7px] tracking-[0.28em] text-white/25 uppercase">
          6 zones active
        </span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ background: GREEN }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.6, delay: i * 0.22, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
