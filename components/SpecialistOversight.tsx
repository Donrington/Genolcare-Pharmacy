'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Hexagonal molecular bond shape ────────────────────────────── */
function HexMolecule({ size }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.42;

  const verts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Outer ring */}
      <polygon
        points={verts.map((v) => `${v.x},${v.y}`).join(' ')}
        stroke="#1A3B8B" strokeWidth="1.5" opacity="0.04"
      />
      {/* Vertex atoms */}
      {verts.map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r={size * 0.022}
          fill="#1A3B8B" opacity="0.04" />
      ))}
      {/* Alternating spokes to centre */}
      {[0, 2, 4].map((i) => (
        <line key={i} x1={cx} y1={cy} x2={verts[i].x} y2={verts[i].y}
          stroke="#1A3B8B" strokeWidth="1" opacity="0.025" />
      ))}
      {/* Centre nucleus */}
      <circle cx={cx} cy={cy} r={size * 0.04}
        fill="#6DBE45" opacity="0.045" />
    </svg>
  );
}

interface MolConf {
  size: number; duration: number; init: number;
  left?: string; right?: string; top?: string; bottom?: string;
}

const MOLS: MolConf[] = [
  { size: 520, left: '-9%',  top: '8%',    duration: 65, init: 0  },
  { size: 370, right: '-6%', top: '38%',   duration: 80, init: 30 },
  { size: 290, left: '36%',  bottom: '-7%', duration: 55, init: 15 },
  { size: 225, right: '20%', top: '-9%',   duration: 72, init: 45 },
];

/* ─── Word-by-word reveal variants ─────────────────────────────── */
const CONTAINER_V = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.062, delayChildren: 0.05 } },
};
const WORD_V = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE },
  },
};

const QUOTE = 'Algorithms calculate. But it is the human eye that truly accounts for every molecule.';

/* ─── Main export ────────────────────────────────────────────────── */
export default function SpecialistOversight() {
  const sectionRef = useRef<HTMLElement>(null);
  const [imgHovered, setImgHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 md:py-40 overflow-hidden bg-[#FAFAFA]"
    >
      {/* ── Floating molecular background ── */}
      {MOLS.map((m, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: m.left, right: m.right, top: m.top, bottom: m.bottom }}
          initial={{ rotate: m.init }}
          animate={{ rotate: m.init + 360 }}
          transition={{ duration: m.duration, repeat: Infinity, ease: 'linear' }}
        >
          <HexMolecule size={m.size} />
        </motion.div>
      ))}

      {/* ── 12-col overlapping grid ── */}
      <div className="relative grid grid-cols-1 md:grid-cols-12 px-6 sm:px-10 lg:px-[4vw] items-center gap-y-10 md:gap-y-0">

        {/* ── Image block · cols 1–6 · row 1 ── */}
        <motion.div
          className="md:col-start-1 md:col-span-6 md:row-start-1 relative z-0"
          onHoverStart={() => setImgHovered(true)}
          onHoverEnd={() => setImgHovered(false)}
          whileHover={{ scale: 1.02, y: -10 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Scroll parallax wrapper — separate from hover to avoid y conflict */}
          <motion.div style={{ y: imageY }}>
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              animate={{
                boxShadow: imgHovered
                  ? '0 36px 90px rgba(0,0,0,0.18), 0 10px 28px rgba(0,0,0,0.10)'
                  : '0 18px 60px rgba(0,0,0,0.11), 0 5px 18px rgba(0,0,0,0.06)',
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/status_verified_macro.png"
                  alt="Specialist Verification — STATUS: VERIFIED"
                  fill
                  className="object-cover saturate-[1.1] contrast-[1.05]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Editorial gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                {/* Corner watermark */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="font-mono text-[8px] tracking-[0.32em] text-white/38 uppercase">
                    Eugene Apasi Eromosele &nbsp;·&nbsp; FPCPharm
                  </span>
                </div>
                {/* Top-right credential badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
                  className="absolute top-5 right-5 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/15"
                  style={{ background: 'rgba(0,0,0,0.30)' }}
                >
                  <span className="font-mono text-[7px] tracking-[0.18em] text-white/50 uppercase block">
                    Fellowship
                  </span>
                  <span className="font-satoshi font-semibold text-white text-xs leading-tight">
                    WAPCP
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Typography block · cols 5–11 · row 1 (overlaps image) ── */}
        <motion.div
          className="md:col-start-5 md:col-span-7 md:row-start-1 relative z-10
            md:pl-12 lg:pl-16 md:py-14"
          animate={imgHovered ? { x: 14 } : { x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ backgroundColor: 'rgba(250,250,250,0.94)' }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-genolcare-green animate-pulse flex-shrink-0" />
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.24em] text-gray-400 uppercase">
              [ WAPCP_FELLOWSHIP // HUMAN_VALIDATION ]
            </span>
          </motion.div>

          {/* Serif hero quote — word-by-word reveal */}
          <motion.blockquote
            variants={CONTAINER_V}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mb-10"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 'clamp(1.7rem, 3.8vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.015em',
              lineHeight: 1.24,
            }}
          >
            {QUOTE.split(' ').map((word, i) => (
              <motion.span
                key={i}
                variants={WORD_V}
                className="inline-block"
                style={{ marginRight: '0.27em' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.blockquote>

          {/* Gradient rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="h-px max-w-[260px] mb-8"
            style={{
              originX: 0,
              background: 'linear-gradient(90deg, #6DBE45 0%, #1A3B8B 50%, transparent 100%)',
            }}
          />

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="font-satoshi text-gray-500 text-base sm:text-[17px] leading-relaxed max-w-lg mb-10"
          >
            Every prescription flag, interaction alert, and dosage anomaly is
            reviewed manually by Eugene Apasi Eromosele — FPCPharm, WAPCP Fellow. No algorithm
            issues a final clearance. Human intelligence remains the last and most
            critical gate in our process.
          </motion.p>

          {/* Credential pills */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap gap-2"
          >
            {['WAPCP Fellow', 'FPCPharm', '15+ Years', 'Infectious Disease'].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[0.18em] uppercase
                  px-3 py-1.5 rounded-full border border-gray-200/80
                  text-gray-400 bg-white/80"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
