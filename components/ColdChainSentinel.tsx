'use client';

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const GREEN = '#6DBE45';

const GRAPH_W = 1000;
const GRAPH_H = 120;
const LINE_Y  = 68;

const DATA_POINTS = [82, 193, 312, 428, 543, 656, 768, 876, 967].map((x) => ({
  x,
  y: LINE_Y,
  label: '4.0°C',
}));

function buildLinePath() {
  const xs = [0, ...DATA_POINTS.map((p) => p.x), GRAPH_W];
  return `M ${xs.map((x) => `${x},${LINE_Y}`).join(' L ')}`;
}

/* ─── Temperature counting hook ─────────────────────────────────── */
function useTempCount(triggered: boolean) {
  const [display, setDisplay] = useState('24.8');

  useEffect(() => {
    if (!triggered) return;
    let cancelled = false;
    const FROM = 24.8, TO = 4.0, DURATION = 2500;
    let startTs: number | null = null;

    const tick = (ts: number) => {
      if (cancelled) return;
      if (!startTs) startTs = ts;
      const t = Math.min((ts - startTs) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay((FROM + (TO - FROM) * eased).toFixed(1));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, [triggered]);

  return display;
}

/* ─── Sensor readout widget ─────────────────────────────────────── */
function Sensor({
  label, value, align = 'left', delay = 0,
}: {
  label: string; value: string; align?: 'left' | 'right'; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay }}
      className={`flex flex-col gap-0.5 ${align === 'right' ? 'items-end' : 'items-start'}`}
    >
      <span className="font-mono text-[7px] tracking-[0.22em] text-white/20 uppercase">
        [ {label} ]
      </span>
      <span className="font-mono text-[9px] tracking-[0.14em] text-white/45 uppercase">
        {value}
      </span>
    </motion.div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */
export default function ColdChainSentinel() {
  const sectionRef = useRef<HTMLElement>(null);
  const tempRef    = useRef<HTMLDivElement>(null);
  const tempInView = useInView(tempRef, { once: true, margin: '-15%' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* Frost glow follows vertical scroll position */
  const glowY = useTransform(scrollYProgress, [0, 1], ['15%', '78%']);

  /* Scanner moves L→R as user scrolls through section */
  const scanLeft = useTransform(scrollYProgress, [0.15, 0.85], ['0%', '100%']);

  const temp     = useTempCount(tempInView);
  const linePath = buildLinePath();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: '#0A0A0A' }}
      aria-label="Cold Chain Storage"
    >
      {/* ── Frost glow ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: glowY,
          left: '50%',
          translateX: '-50%',
          translateY: '-50%',
          width: '90vw',
          height: '90vw',
          maxWidth: 1200,
          maxHeight: 1200,
          background:
            'radial-gradient(ellipse at center, rgba(26,59,139,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ── Atmospheric watermark ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="text-center font-mono font-black"
          style={{
            fontSize: 'clamp(3rem, 13vw, 14rem)',
            letterSpacing: '0.14em',
            lineHeight: 0.88,
            color: 'rgba(255,255,255,0.025)',
          }}
        >
          ATMOSPHERIC<br />INTEGRITY
        </div>
      </div>

      {/* ── Corner sensor readouts ── */}
      <div className="absolute top-8 sm:top-10 left-5 sm:left-10 z-20">
        <Sensor label="HUMIDITY" value="35%" delay={0.6} />
      </div>
      <div className="absolute top-8 sm:top-10 right-5 sm:right-10 z-20">
        <Sensor label="SENSOR_ID" value="FCT-WUSE-09" align="right" delay={0.7} />
      </div>
      <div className="absolute bottom-8 sm:bottom-10 left-5 sm:left-10 z-20">
        <Sensor label="POWER" value="AUX_BACKUP_ACTIVE" delay={0.8} />
      </div>
      <div className="absolute bottom-8 sm:bottom-10 right-5 sm:right-10 z-20">
        <Sensor label="CHAIN_STATUS" value="VERIFIED · STABLE" align="right" delay={0.9} />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 sm:px-10 lg:px-[6vw] py-24 text-center">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-10"
        >
          <motion.span
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="inline-block w-1 h-1 rounded-full bg-genolcare-green"
          />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/25 uppercase">
            SERVICE_003 // COLD CHAIN
          </span>
        </motion.div>

        {/* Serif headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
          className="text-white/80 mb-14 max-w-2xl"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(1.4rem, 3.2vw, 2.8rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            lineHeight: 1.35,
          }}
        >
          &ldquo;Stabilized at the molecular level.&rdquo;
        </motion.h2>

        {/* Temperature display */}
        <div ref={tempRef}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(24px)' }}
            animate={tempInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.3, ease: EASE }}
          >
            <motion.span
              className="block font-mono font-black text-white tabular-nums leading-none"
              animate={{ opacity: [0.88, 1, 0.88] }}
              transition={{ duration: 3.2, repeat: Infinity }}
              style={{
                fontSize: 'clamp(4.5rem, 17vw, 15rem)',
                letterSpacing: '-0.03em',
                textShadow: `0 0 80px rgba(109,190,69,0.28), 0 0 180px rgba(109,190,69,0.1)`,
              }}
            >
              {temp}&deg;C
            </motion.span>
          </motion.div>
        </div>

        {/* Status row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={tempInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 2.9 }}
          className="flex items-center gap-4 mt-6 mb-16"
        >
          {['STABLE', 'VERIFIED', 'OPTIMAL'].map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              {i > 0 && <span className="w-px h-3 bg-white/10" />}
              <span className="font-mono text-[9px] tracking-[0.22em] text-genolcare-green uppercase">
                {s}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Stability graph */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="w-full max-w-4xl"
        >
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="font-mono text-[7px] tracking-[0.2em] text-white/20 uppercase">
              COLD CHAIN LOG · REALTIME
            </span>
            <span className="font-mono text-[7px] tracking-[0.2em] text-white/20 uppercase">
              INTEGRITY 100%
            </span>
          </div>

          {/* Graph container — scanner overlay uses absolute positioning */}
          <div
            className="relative rounded-2xl overflow-hidden border border-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.018)' }}
          >
            {/* SVG graph — stretches to fill with preserveAspectRatio none */}
            <svg
              viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
              className="w-full block"
              style={{ height: 110 }}
              preserveAspectRatio="none"
            >
              {/* Faint grid */}
              {[28, 56, 84].map((y) => (
                <line key={y} x1="0" y1={y} x2={GRAPH_W} y2={y}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              ))}

              {/* Flatline glow layer */}
              <path d={linePath} fill="none" stroke={GREEN}
                strokeWidth="5" strokeOpacity="0.07"
                style={{ filter: 'blur(4px)' }}
              />

              {/* Crisp flatline */}
              <path d={linePath} fill="none" stroke={GREEN}
                strokeWidth="1" strokeOpacity="0.4"
              />

              {/* Data point groups — staggered reveal on scroll */}
              {DATA_POINTS.map((pt, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.11 }}
                >
                  {/* Pulse ring */}
                  <motion.circle cx={pt.x} cy={pt.y} r="5"
                    fill="none" stroke={GREEN} strokeWidth="0.6"
                    animate={{ r: [4, 10, 4], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.8, delay: i * 0.22, repeat: Infinity }}
                  />
                  <circle cx={pt.x} cy={pt.y} r="2.5"
                    fill={GREEN} fillOpacity="0.75"
                  />
                  <text
                    x={pt.x} y={pt.y - 10}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '7px',
                      fill: 'rgba(109,190,69,0.5)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {pt.label}
                  </text>
                </motion.g>
              ))}
            </svg>

            {/* Scroll-driven scanner — absolute overlay div (avoids SVG coordinate mismatch) */}
            <motion.div
              className="absolute inset-y-0 w-px pointer-events-none"
              style={{ left: scanLeft }}
            >
              {/* Crisp line */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${GREEN}88 20%, ${GREEN}88 80%, transparent 100%)`,
                }}
              />
              {/* Soft glow */}
              <div
                className="absolute inset-y-0 -left-3 w-6 blur-md"
                style={{ background: `${GREEN}14` }}
              />
              {/* Top cap dot */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }}
              />
            </motion.div>
          </div>

          <div className="flex justify-between mt-2 px-1">
            <span className="font-mono text-[7px] tracking-[0.15em] text-white/12 uppercase">
              T+0:00
            </span>
            <span className="font-mono text-[7px] tracking-[0.15em] text-white/12 uppercase">
              LIVE
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
