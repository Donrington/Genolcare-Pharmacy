'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const GREEN = '#6DBE45';
const BLUE  = '#1A3B8B';

const CATEGORIES = [
  { code: 'CAT_01', name: 'Pain Relief', count: '24 SKUs', symbol: '○' },
  { code: 'CAT_02', name: 'Digestive',   count: '18 SKUs', symbol: '◇' },
  { code: 'CAT_03', name: 'First Aid',   count: '31 SKUs', symbol: '+' },
  { code: 'CAT_04', name: 'Vitality',    count: '16 SKUs', symbol: '△' },
];

/* ─── Verified Genuine Seal ──────────────────────────────────────────── */
function VerifiedSeal() {
  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Outer aura rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/45"
          style={{ width: 192 + i * 52, height: 192 + i * 52 }}
          animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 3.8 + i * 0.9, delay: i * 0.65, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Rotating conic outer rim */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 20%, rgba(26,59,139,0.18) 40%, rgba(255,255,255,0.1) 50%, rgba(109,190,69,0.22) 60%, transparent 80%)',
          boxShadow: '0 0 72px rgba(26,59,139,0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      {/* Tick marks */}
      <svg className="absolute w-48 h-48 -rotate-90 pointer-events-none" viewBox="0 0 192 192">
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i / 48) * Math.PI * 2;
          const major = i % 4 === 0;
          const r1 = 92, r2 = major ? 86 : 89;
          const x1 = Math.round((96 + r1 * Math.cos(angle)) * 100) / 100;
          const y1 = Math.round((96 + r1 * Math.sin(angle)) * 100) / 100;
          const x2 = Math.round((96 + r2 * Math.cos(angle)) * 100) / 100;
          const y2 = Math.round((96 + r2 * Math.sin(angle)) * 100) / 100;
          return (
            <line
              key={i}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke={`rgba(${major ? '255,255,255' : '255,255,255'},${major ? 0.75 : 0.45})`}
              strokeWidth={major ? 1.6 : 0.8}
            />
          );
        })}
      </svg>

      {/* Main disc */}
      <motion.div
        className="relative w-40 h-40 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
          border: '1px solid rgba(255,255,255,0.35)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 48px rgba(255,255,255,0.15)',
        }}
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-1.5">
          {/* Shield icon */}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke={BLUE} strokeWidth={1.15} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 3v6c0 5.25-3.5 9.74-7 11C8.5 20.74 5 16.25 5 11V5l7-3z" />
            <polyline points="9,12 11,14 15,10" strokeWidth={1.6} stroke={GREEN} />
          </svg>
          <div className="text-center">
            <div className="font-mono text-[6.5px] tracking-[0.3em] text-[#1A3B8B]/75 uppercase leading-tight">
              Verified
            </div>
            <div className="font-mono text-[6.5px] tracking-[0.3em] text-[#1A3B8B]/75 uppercase leading-tight">
              Genuine
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Category Row ───────────────────────────────────────────────────── */
function CategoryRow({
  code, name, count, symbol, delay,
}: (typeof CATEGORIES)[0] & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="flex items-center gap-4 py-3.5 border-b border-white/[0.06] group"
    >
      <span className="font-mono text-[9px] tracking-[0.14em] text-white/65 w-14 flex-shrink-0">
        {code}
      </span>
      <span className="text-white/60 text-xs font-light w-4 flex-shrink-0 text-center">{symbol}</span>
      <span className="font-satoshi font-medium text-white/88 text-[13px] flex-1 group-hover:text-white transition-colors duration-200">
        {name}
      </span>
      <motion.span
        className="font-mono text-[8.5px] tracking-[0.1em] text-[#6DBE45]/85"
        animate={{ opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 2.6, delay: delay + 0.4, repeat: Infinity }}
      >
        {count}
      </motion.span>
      <motion.div
        className="w-1 h-1 rounded-full bg-[#6DBE45] flex-shrink-0"
        animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 2.1, delay, repeat: Infinity }}
      />
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function OTCShelfProvenance() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY   = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const sealY = useTransform(scrollYProgress, [0, 1], [32, -32]);
  const textY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#080B14]"
      aria-label="OTC Shelf Provenance — Verified Genuine"
    >
      {/* ── Background image with parallax ─────────────────────────── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <Image
          src="/verified_products.png"
          alt="Luxury pharmacy shelf — verified genuine Genolcare medications"
          fill
          quality={100}
          className="object-cover object-center"
        />
        {/* Radial DOF mask — sharp centre, cinematic fall-off */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 52% 56% at 56% 50%, transparent 0%, rgba(8,11,20,0.22) 38%, rgba(8,11,20,0.82) 68%, rgba(8,11,20,0.97) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-[#080B14]/65" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080B14]/80 to-transparent" />
      </motion.div>

      {/* ── Subtle film-grain overlay ────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex items-center px-6 sm:px-10 lg:px-[6vw] py-28">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 items-center">

          {/* ── Left: editorial copy ───────────────────────────────── */}
          <motion.div className="lg:col-span-5 flex flex-col" style={{ y: textY }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE }}
              className="flex items-center gap-3 mb-8"
            >
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-[#6DBE45] flex-shrink-0"
              />
              <span className="font-mono text-[8.5px] tracking-[0.4em] text-white/60 uppercase">
                PROVENANCE_001 // VERIFIED GENUINE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.88, delay: 0.1, ease: EASE }}
              className="font-satoshi font-black text-white uppercase leading-[0.9] mb-6"
              style={{
                fontSize: 'clamp(3rem, 6.5vw, 5.8rem)',
                letterSpacing: '-0.044em',
                textShadow: '0 8px 48px rgba(0,0,0,0.5)',
              }}
            >
              The<br />Standard<br />
              <em
                className="not-italic"
                style={{ color: GREEN, textShadow: `0 0 40px rgba(109,190,69,0.3)` }}
              >
                of Genuine.
              </em>
            </motion.h2>

            {/* Body copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
              className="font-satoshi font-light text-white/65 text-[15px] leading-relaxed mb-10 max-w-sm"
            >
              Every product on our shelf carries a verified provenance chain — from licensed distributor to the Genolcare dispensary. NAFDAC-sourced. Specialist-authenticated. No exceptions.
            </motion.p>

            {/* Category manifest */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
              className="border-t border-white/[0.07]"
            >
              {CATEGORIES.map((cat, i) => (
                <CategoryRow key={cat.code} {...cat} delay={0.32 + i * 0.08} />
              ))}
            </motion.div>

            {/* NAFDAC pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.68, ease: EASE }}
              className="mt-8 self-start inline-flex items-center gap-2.5
                bg-white/[0.04] backdrop-blur-xl border border-white/[0.07]
                rounded-full px-5 py-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#6DBE45] flex-shrink-0" />
              <span className="font-mono text-[8px] tracking-[0.22em] text-white/70 uppercase">
                NAFDAC Reg. · Licensed Distributor Network
              </span>
            </motion.div>
          </motion.div>

          {/* ── Right: seal + data ─────────────────────────────────── */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center justify-center gap-10"
            style={{ y: sealY }}
          >
            {/* Macro focus frame */}
            <div className="relative flex items-center justify-center">
              {/* Aperture bokeh vignette */}
              <div
                className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, transparent 28%, rgba(8,11,20,0.0) 35%, rgba(8,11,20,0.45) 65%, rgba(8,11,20,0.82) 100%)',
                  filter: 'blur(28px)',
                }}
              />
              {/* White aura */}
              <div
                className="absolute w-80 h-80 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
                }}
              />
              <VerifiedSeal />
            </div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.48, ease: EASE }}
              className="w-full max-w-md grid grid-cols-3 gap-px rounded-2xl overflow-hidden mt-20"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {[
                { label: 'Batch Verified',   value: '100%'  },
                { label: 'Avg. Shelf Life',  value: '18 mo' },
                { label: 'Counterfeit Rate', value: '0.00%' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="px-5 py-5 flex flex-col gap-1.5 text-center"
                  style={{ background: 'rgba(8,11,20,0.75)' }}
                >
                  <span
                    className="font-satoshi font-black text-white"
                    style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)' }}
                  >
                    {value}
                  </span>
                  <span className="font-mono text-[7.5px] tracking-[0.14em] text-white/60 uppercase leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Aperture annotation */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.62, ease: EASE }}
              className="font-mono text-[7.5px] tracking-[0.22em] text-white/45 uppercase text-center"
            >
              FOCUS_PLANE: FRONT_SEAL · f /1.4 · BOKEH_DEPTH: CINEMATIC
            </motion.p>
          </motion.div>

        </div>
      </div>

      {/* ── Fade to white for next section ──────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
    </section>
  );
}
