'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const GREEN = '#6DBE45';
const BLUE = '#1A3B8B';
const CONIC = 'conic-gradient(from 0deg, transparent 30%, #1A3B8B 50%, #6DBE45 70%, transparent 90%)';

/* ─── Icons ─────────────────────────────────────────────────────── */
function IconScan({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h2a2 2 0 0 1 2 2v2" />
      <path d="M5 20h2a2 2 0 0 0 2-2v-2" />
      <path d="M19 4h-2a2 2 0 0 0-2 2v2" />
      <path d="M19 20h-2a2 2 0 0 1-2-2v-2" />
      <line x1="3" y1="12" x2="21" y2="12" strokeOpacity="0.4" />
      <rect x="8" y="7" width="8" height="10" rx="1" strokeOpacity="0.35" />
    </svg>
  );
}

function IconNetwork({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <circle cx="4"  cy="6"  r="1.5" />
      <circle cx="20" cy="6"  r="1.5" />
      <circle cx="4"  cy="18" r="1.5" />
      <circle cx="20" cy="18" r="1.5" />
      <line x1="5.4"  y1="6.9"  x2="10.5" y2="11.1" strokeOpacity="0.4" />
      <line x1="18.6" y1="6.9"  x2="13.5" y2="11.1" strokeOpacity="0.4" />
      <line x1="5.4"  y1="17.1" x2="10.5" y2="12.9" strokeOpacity="0.4" />
      <line x1="18.6" y1="17.1" x2="13.5" y2="12.9" strokeOpacity="0.4" />
    </svg>
  );
}

function IconPerson({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3.5" />
      <path d="M4 21c0-4 3.582-7 8-7" />
      <circle cx="18" cy="17" r="3" />
      <line x1="20.1" y1="19.1" x2="22.5" y2="21.5" />
    </svg>
  );
}

function IconShield({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l7 3v6c0 5.25-3.5 9.74-7 11C8.5 20.74 5 16.25 5 11V5l7-3z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  );
}

/* ─── Spinning conic border (same technique as EthosSection) ────── */
function SpinBorder({ duration }: { duration: number }) {
  return (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
        style={{ background: CONIC }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] blur-xl opacity-50"
        style={{ background: CONIC }}
      />
    </>
  );
}

/* ─── Status badge ───────────────────────────────────────────────── */
function StatusBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.span
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="inline-block w-1 h-1 rounded-full bg-genolcare-green flex-shrink-0"
      />
      <span className="font-mono text-[8px] tracking-[0.2em] text-gray-400 uppercase">
        {label}
      </span>
    </div>
  );
}

function StepLabel({ n }: { n: string }) {
  return (
    <span className="font-mono text-[8px] tracking-[0.2em] text-gray-300 uppercase">
      {n}
    </span>
  );
}

/* ─── Card shell ─────────────────────────────────────────────────── */
interface MeshCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  spinDuration?: number;
  parallaxY?: MotionValue<number>;
}

function MeshCard({ children, className = '', delay = 0, spinDuration = 5, parallaxY }: MeshCardProps) {
  return (
    /* Outer: only handles parallax translation */
    <motion.div
      className={className}
      style={parallaxY ? { y: parallaxY } : {}}
    >
      {/* Entrance animation wrapper */}
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 44, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay, ease: EASE }}
      >
        {/* Spinning conic border wrapper — same as EthosSection */}
        <div className="relative overflow-hidden rounded-3xl p-[2px] h-full">
          <SpinBorder duration={spinDuration} />

          {/* Inner glass card */}
          <div className="relative z-10 h-full rounded-[22px] bg-white/85 backdrop-blur-2xl p-6 md:p-7">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Card 01 · Digital Intake ───────────────────────────────────── */
function Card01() {
  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-2">
          <StepLabel n="01 / 04" />
          <StatusBadge label="STATUS: SCANNING" />
        </div>
        <motion.div
          className="text-genolcare-green"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <IconScan size={24} />
        </motion.div>
      </div>

      {/* Scan visualisation */}
      <div className="relative rounded-2xl bg-gray-900 border border-gray-100 overflow-hidden mb-5"
        style={{ minHeight: 140 }}>
        <img
          src="/prescription_filling.png"
          alt="Clinical Intake Process"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-around px-4 py-3 gap-1 z-10">
          {[88, 62, 74, 46, 55].map((w, i) => (
            <motion.div
              key={i}
              className="h-px bg-white/40 rounded-full"
              style={{ width: `${w}%` }}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2, delay: i * 0.28, repeat: Infinity }}
            />
          ))}
        </div>
        {/* Animated scan beam */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 pointer-events-none z-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
            boxShadow: `0 0 12px ${GREEN}`,
          }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mt-auto">
        <h3 className="font-satoshi font-bold text-gray-900 text-lg leading-tight mb-2">
          Digital Intake
        </h3>
        <p className="font-satoshi text-[13px] text-gray-400 leading-relaxed">
          Patient data, prescription details, and dosage instructions captured and timestamped with a full immutable audit trail.
        </p>
      </div>
    </div>
  );
}

/* ─── Card 02 · Cross-Reference Engine ──────────────────────────── */
const NET_CORE = { cx: 50, cy: 50 };
const NET_NODES = [
  { cx: 14, cy: 18 },
  { cx: 86, cy: 18 },
  { cx: 14, cy: 82 },
  { cx: 86, cy: 82 },
  { cx: 50, cy: 8  },
];

function NetworkViz() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      {NET_NODES.map((n, i) => (
        <g key={i}>
          <motion.line
            x1={NET_CORE.cx} y1={NET_CORE.cy}
            x2={n.cx} y2={n.cy}
            stroke={GREEN} strokeWidth="0.7"
            animate={{ strokeOpacity: [0.12, 0.38, 0.12] }}
            transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, delay: i * 0.18 }}
          />
          <motion.circle
            cx={n.cx} cy={n.cy}
            fill={GREEN}
            animate={{ r: [2.2, 3.2, 2.2], fillOpacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 1.9 + i * 0.25, repeat: Infinity, delay: i * 0.15 }}
          />
        </g>
      ))}
      {/* Core pulse rings */}
      {[0, 1].map((i) => (
        <motion.circle
          key={`ring-${i}`}
          cx={NET_CORE.cx} cy={NET_CORE.cy}
          fill="none" stroke={BLUE} strokeWidth="0.5"
          animate={{ r: [5, 12, 5], strokeOpacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, delay: i * 1.2, repeat: Infinity }}
        />
      ))}
      {/* Core node */}
      <motion.circle
        cx={NET_CORE.cx} cy={NET_CORE.cy}
        fill={BLUE}
        animate={{ r: [5, 6.5, 5], fillOpacity: [0.75, 0.95, 0.75] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx={NET_CORE.cx} cy={NET_CORE.cy} r="2.5" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

function Card02() {
  const checks = [
    'Drug–Drug Interactions',
    'Allergy Cross-Reference',
    'Therapeutic Duplication',
    'Contraindication Flags',
  ];

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-2">
          <StepLabel n="02 / 04" />
          <StatusBadge label="ENGINE: ACTIVE" />
        </div>
        <motion.div
          className="text-genolcare-blue"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.1, repeat: Infinity }}
        >
          <IconNetwork size={24} />
        </motion.div>
      </div>

      {/* Network visualisation */}
      <div className="relative rounded-2xl bg-gray-900 border border-gray-100 overflow-hidden mb-5 flex items-center"
        style={{ minHeight: 140 }}>
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
          alt="High-tech Clinical Network"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 z-20">
          <NetworkViz />
        </div>
      </div>

      <div>
        <h3 className="font-satoshi font-bold text-gray-900 text-lg leading-tight mb-2">
          Cross-Reference Engine
        </h3>
        <p className="font-satoshi text-[13px] text-gray-400 leading-relaxed mb-4">
          Every prescription simultaneously cross-checked across pharmacological databases in real time.
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {checks.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-genolcare-green flex-shrink-0" />
              <span className="font-mono text-[8.5px] tracking-[0.09em] text-gray-400 uppercase leading-tight">
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Card 03 · Specialist Review ────────────────────────────────── */
function Card03() {
  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-2">
          <StepLabel n="03 / 04" />
          <StatusBadge label="WAPCP: OVERSIGHT" />
        </div>
        <motion.div
          className="text-genolcare-green"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          <IconPerson size={24} />
        </motion.div>
      </div>

      {/* Specialist imagery */}
      <div className="relative rounded-2xl border border-gray-100 overflow-hidden mb-3" style={{ minHeight: 120 }}>
         <img 
           src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80" 
           alt="Specialist Review" 
           className="w-full h-full absolute inset-0 object-cover opacity-90 contrast-[1.1] saturate-[0.8]" 
         />
      </div>

      {/* Credential card */}
      <div className="relative rounded-2xl overflow-hidden mb-5 p-4 flex items-center gap-4
        bg-white/80 backdrop-blur-md
        border border-gray-100 shadow-sm">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-genolcare-blue/10 border border-genolcare-blue/20
          flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={BLUE} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-satoshi font-semibold text-gray-800 text-sm leading-tight">
            Eugene Apasi Eromosele
          </div>
          <div className="font-mono text-[8px] tracking-[0.15em] text-genolcare-blue/60 uppercase mt-0.5">
            WAPCP · FPCPharm
          </div>
          <div className="font-mono text-[8px] tracking-[0.1em] text-gray-400 mt-0.5">
            15+ yrs · Infectious Disease
          </div>
        </div>

        {/* Verified pulse */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="w-8 h-8 rounded-full bg-genolcare-green/15 border border-genolcare-green/30
            flex items-center justify-center flex-shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
            stroke={GREEN} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,7 5,10 11,4" />
          </svg>
        </motion.div>
      </div>

      <div className="mt-auto">
        <h3 className="font-satoshi font-bold text-gray-900 text-lg leading-tight mb-2">
          Specialist Review
        </h3>
        <p className="font-satoshi text-[13px] text-gray-400 leading-relaxed">
          Eugene Apasi Eromosele (FPCPharm, WAPCP Fellow) personally audits every flagged prescription. No automation replaces this step.
        </p>
      </div>
    </div>
  );
}

/* ─── Card 04 · Final Authorization ─────────────────────────────── */
function Card04() {
  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-2">
          <StepLabel n="04 / 04" />
          <StatusBadge label="INTEGRITY: 100%" />
        </div>
        <motion.div
          className="text-genolcare-blue"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <IconShield size={24} />
        </motion.div>
      </div>

      {/* Seal visual */}
      <div className="relative rounded-2xl bg-slate-900 overflow-hidden mb-5
        flex items-center justify-center p-6 border border-gray-900" style={{ minHeight: 150 }}>
        
        {/* Background image: wellness_products.png */}
        <img
          src="/wellness_products.png"
          alt="Final Product Verification"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/20 z-0" />

        {/* Expanding pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-genolcare-green/40 z-10"
            animate={{ scale: [0.7, 2], opacity: [0.8, 0] }}
            transition={{ duration: 2.6, delay: i * 0.87, repeat: Infinity, ease: 'easeOut' }}
            style={{ width: 60, height: 60 }}
          />
        ))}
        {/* Centre shield */}
        <motion.div
          className="relative z-20 w-14 h-14 rounded-full bg-white border border-gray-100
            flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ width: 56, height: 56 }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke={BLUE} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 3v6c0 5.25-3.5 9.74-7 11C8.5 20.74 5 16.25 5 11V5l7-3z" />
            <polyline points="9,12 11,14 15,10" />
          </svg>
        </motion.div>
      </div>

      <div className="mt-auto">
        <h3 className="font-satoshi font-bold text-gray-900 text-lg leading-tight mb-2">
          Final Authorization
        </h3>
        <p className="font-satoshi text-[13px] text-gray-400 leading-relaxed">
          The clinical seal of approval. Every dispensed prescription carries the full accountability of our specialist team.
        </p>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────── */
export default function VerificationMesh() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const y2 = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const y3 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const y4 = useTransform(scrollYProgress, [0, 1], [32, -32]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-white overflow-hidden"
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(26,59,139,0.06) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Soft radial glow top-right */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[60vw] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 100% 0%, rgba(109,190,69,0.04) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-[6vw]">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-genolcare-green animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-gray-400 uppercase">
              PROCESS_02 // VERIFICATION
            </span>
          </div>
          <h2 className="font-satoshi font-black text-gray-900
            text-3xl sm:text-4xl md:text-5xl leading-[1.08] max-w-xl">
            The Verification<br />Mesh
          </h2>
          <p className="font-satoshi text-gray-400 text-base sm:text-lg mt-4 max-w-lg leading-relaxed">
            Four interlocking layers of clinical safety — from digital intake to the final clinical seal.
          </p>
        </motion.div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
          <MeshCard className="md:col-span-4" delay={0}   spinDuration={4.5} parallaxY={y1}>
            <Card01 />
          </MeshCard>
          <MeshCard className="md:col-span-8" delay={0.1} spinDuration={6}   parallaxY={y2}>
            <Card02 />
          </MeshCard>
          <MeshCard className="md:col-span-7" delay={0.2} spinDuration={5}   parallaxY={y3}>
            <Card03 />
          </MeshCard>
          <MeshCard className="md:col-span-5" delay={0.3} spinDuration={3.5} parallaxY={y4}>
            <Card04 />
          </MeshCard>
        </div>
      </div>
    </section>
  );
}
