'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';

const EASE  = [0.22, 1, 0.36, 1] as const;
const GREEN = '#6DBE45';
const BLUE  = '#1A3B8B';

const CERT_NODES = [
  { id: 'N01', label: 'BATCH_ID',   value: '#GC-992-ABJ', side: 'left'  as const, yRatio: 0.12 },
  { id: 'N02', label: 'PURITY',     value: '99.8%',       side: 'right' as const, yRatio: 0.27 },
  { id: 'N03', label: 'ORIGIN',     value: 'NAFDAC_VRF',  side: 'left'  as const, yRatio: 0.44 },
  { id: 'N04', label: 'MFG_DATE',   value: '2025-01-12',  side: 'right' as const, yRatio: 0.59 },
  { id: 'N05', label: 'CHECKSUM',   value: '0xA4F2C8',    side: 'left'  as const, yRatio: 0.73 },
  { id: 'N06', label: 'SHELF_LIFE', value: '36 MONTHS',   side: 'right' as const, yRatio: 0.87 },
];

/* ─── Data node revealed by the scan ──────────────────────────────────── */
function ScanNode({
  label, value, side, yRatio, laserY,
}: {
  label: string; value: string; side: 'left' | 'right'; yRatio: number; laserY: number;
}) {
  const dist   = laserY - yRatio;
  const active = dist >= 0 && dist < 0.1;

  return (
    <div
      className={`absolute flex items-center gap-2 ${
        side === 'left' ? 'left-4 flex-row' : 'right-4 flex-row-reverse'
      }`}
      style={{ top: `${yRatio * 100}%`, transform: 'translateY(-50%)' }}
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: active ? GREEN : 'rgba(109,190,69,0.5)' }}
        animate={active ? { scale: [1, 1.9, 1], opacity: [1, 0.35, 1] } : {}}
        transition={{ duration: 0.65, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
      />
      <div
        className="h-px w-5 flex-shrink-0"
        style={{
          background:
            side === 'left'
              ? 'linear-gradient(to right, rgba(109,190,69,0.75), transparent)'
              : 'linear-gradient(to left,  rgba(109,190,69,0.75), transparent)',
        }}
      />
      <div className={`flex flex-col ${side === 'right' ? 'items-end' : 'items-start'}`}>
        <span className="font-mono text-[7px] tracking-[0.2em] text-[#6DBE45]/70 uppercase leading-none">
          {label}
        </span>
        <span className="font-mono text-[9px] tracking-[0.06em] text-white/88 font-semibold leading-tight mt-0.5">
          {value}
        </span>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function AuthenticityMesh() {
  const sectionRef = useRef<HTMLElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const laserYRef  = useRef(0.45);
  const velRef     = useRef(0);

  const [laserY,      setLaserY]      = useState(0.45);
  const [isHover,     setIsHover]     = useState(false);
  const [chromaFilter, setChromaFilter] = useState('none');

  /* ── Parallax ── */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const textY  = useTransform(scrollYProgress, [0, 1], [40,  -40]);
  const imageY = useTransform(scrollYProgress, [0, 1], [18,  -18]);

  /* ── Scroll velocity → chromatic aberration ── */
  const { scrollY } = useScroll();
  const vel  = useVelocity(scrollY);
  const sVel = useSpring(vel, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const unsub = sVel.on('change', v => {
      velRef.current = v;
      const intensity = Math.min(Math.abs(v) / 2500, 1);
      setChromaFilter(
        intensity > 0.05
          ? `drop-shadow(${(intensity * 3).toFixed(1)}px 0 0 rgba(255,0,60,0.4)) drop-shadow(-${(intensity * 3).toFixed(1)}px 0 0 rgba(0,90,255,0.4))`
          : 'none'
      );
    });
    return unsub;
  }, [sVel]);

  /* ── Auto-scan when idle ── */
  useEffect(() => {
    if (isHover) return;
    let raf: number;
    const t0 = Date.now();
    function tick() {
      const t = (Date.now() - t0) / 1000;
      const y = 0.5 + Math.sin(t * 0.38) * 0.3;
      setLaserY(y);
      laserYRef.current = y;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHover]);

  /* ── Canvas render loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    function draw() {
      if (!canvas || !ctx) return;

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const w      = canvas.width;
      const h      = canvas.height;
      const y      = laserYRef.current * h;
      const absVel = Math.abs(velRef.current);

      ctx.clearRect(0, 0, w, h);

      /* Chromatic aberration lines on high velocity */
      if (absVel > 400) {
        const ab = Math.min((absVel - 400) / 1400, 1) * 5;
        ctx.globalAlpha = 0.4;

        const drawAb = (offset: number, r: number, g: number, b: number) => {
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0,    'transparent');
          grad.addColorStop(0.1,  `rgba(${r},${g},${b},0.8)`);
          grad.addColorStop(0.9,  `rgba(${r},${g},${b},0.8)`);
          grad.addColorStop(1,    'transparent');
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, y + offset);
          ctx.lineTo(w, y + offset);
          ctx.stroke();
        };

        drawAb(-ab, 255, 30,  30);
        drawAb(+ab, 30,  80, 255);
        ctx.globalAlpha = 1;
      }

      /* Broad ambient glow */
      const glowGrad = ctx.createLinearGradient(0, y - 22, 0, y + 22);
      glowGrad.addColorStop(0,   'transparent');
      glowGrad.addColorStop(0.5, 'rgba(109,190,69,0.11)');
      glowGrad.addColorStop(1,   'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, y - 22, w, 44);

      /* Core laser line */
      const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
      lineGrad.addColorStop(0,    'transparent');
      lineGrad.addColorStop(0.04, 'rgba(109,190,69,0.5)');
      lineGrad.addColorStop(0.5,  'rgba(109,190,69,1)');
      lineGrad.addColorStop(0.96, 'rgba(109,190,69,0.5)');
      lineGrad.addColorStop(1,    'transparent');

      ctx.save();
      ctx.shadowBlur  = 20;
      ctx.shadowColor = GREEN;
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.restore();

      /* Left progress rail */
      const progGrad = ctx.createLinearGradient(0, 0, 0, y);
      progGrad.addColorStop(0, 'transparent');
      progGrad.addColorStop(1, 'rgba(26,59,139,0.3)');
      ctx.fillStyle = progGrad;
      ctx.fillRect(0, 0, 3, y);

      /* Right scan cursor tick */
      ctx.fillStyle = 'rgba(109,190,69,0.9)';
      ctx.fillRect(w - 3, y - 8, 3, 16);

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = scannerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clamped = Math.max(0.02, Math.min(0.97, (e.clientY - rect.top) / rect.height));
    setLaserY(clamped);
    laserYRef.current = clamped;
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white overflow-hidden py-24 md:py-36"
      aria-label="Authenticity Mesh — Medication Verification"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,59,139,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(26,59,139,0.07) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[900px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(26,59,139,0.06) 0%, transparent 68%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Section header ──────────────────────────────────────── */}
        <motion.div style={{ y: textY }} className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-mono text-[9px] sm:text-[10px] tracking-[0.42em] text-[#1A3B8B]/60 uppercase mb-6"
          >
            TRUST_SYS_003 // AUTHENTICITY MESH
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-satoshi font-black uppercase tracking-tighter text-[#0F1830]"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 7rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
            }}
          >
            ZERO.<br />COMPROMISE.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.25, ease: EASE }}
            className="mt-6 font-satoshi font-light text-[#0F1830]/60 max-w-md"
            style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)', lineHeight: 1.7 }}
          >
            Every product passes cryptographic batch verification against the NAFDAC national
            registry. Hover the scanner to inspect the molecular certificate embedded in each item.
          </motion.p>
        </motion.div>

        {/* ── Two-column layout ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-20 items-start">

          {/* LEFT: Verification checklist */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="flex flex-col gap-7"
          >
            {[
              {
                code: 'VRF_01',
                title: 'Batch Traceability',
                body:  'Each SKU carries a unique batch hash cross-referenced against the NAFDAC national registry in real time.',
              },
              {
                code: 'VRF_02',
                title: 'Purity Certification',
                body:  'Independent assay confirms active ingredient concentrations within ±0.2% of declared specification per batch.',
              },
              {
                code: 'VRF_03',
                title: 'Cold-Chain Integrity',
                body:  'Temperature excursion logs accompany every consignment. Compromised batches are quarantined automatically.',
              },
              {
                code: 'VRF_04',
                title: 'Zero-Counterfeit Rate',
                body:  '48-point physical inspection on every shelf rotation. Any suspect item is rejected and flagged for return.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 * i, ease: EASE }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className="w-7 h-7 rounded border flex items-center justify-center"
                    style={{ background: 'rgba(26,59,139,0.12)', borderColor: 'rgba(26,59,139,0.25)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke={GREEN} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] tracking-[0.22em] text-[#6DBE45]/65 uppercase mb-1">
                    {item.code}
                  </div>
                  <div className="font-satoshi font-semibold text-[#0F1830]/85 text-sm mb-1.5">
                    {item.title}
                  </div>
                  <div className="font-satoshi text-[#0F1830]/55 text-sm leading-relaxed">
                    {item.body}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
              className="flex items-center gap-3 px-4 py-3 rounded-full border w-fit"
              style={{ background: 'rgba(26,59,139,0.08)', borderColor: 'rgba(26,59,139,0.22)' }}
            >
              <motion.div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: GREEN }}
                animate={{ scale: [1, 1.55, 1], opacity: [1, 0.45, 1] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="font-mono text-[8px] tracking-[0.2em] text-[#0F1830]/65 uppercase">
                NAFDAC Approved · Batch Verified · Anti-Counterfeit Active
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT: Interactive scanner */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            style={{ y: imageY }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="font-mono text-[8px] tracking-[0.2em] text-[#1A3B8B]/55 uppercase">
                MOLECULAR_CERT_SCAN v2.4
              </span>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: GREEN }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="font-mono text-[7px] tracking-[0.18em] text-[#6DBE45]/70 uppercase">
                  {isHover ? 'MANUAL_MODE' : 'AUTO_SCAN'}
                </span>
              </div>
            </div>

            {/* Scanner window */}
            <div
              ref={scannerRef}
              className="relative overflow-hidden rounded-xl border cursor-crosshair"
              style={{
                aspectRatio: '3 / 2',
                background: '#060A14',
                borderColor: 'rgba(26,59,139,0.25)',
                filter: chromaFilter,
              }}
              onMouseMove={onMouseMove}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {/* Base image */}
              <div className="absolute inset-0">
                <Image
                  src="/authenticity.png"
                  alt="Genolcare Authenticity HUD — medication scan verification"
                  fill
                  quality={95}
                  className="object-cover object-center"
                />
              </div>

              {/* Holographic reveal layer — clips up to laser position */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ clipPath: `inset(0 0 ${(1 - laserY) * 100}% 0)` }}
              >
                {/* Blue tint */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(26,59,139,0.52) 0%, rgba(6,10,20,0.68) 100%)',
                  }}
                />
                {/* CRT scanlines */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(109,190,69,0.05) 3px, rgba(109,190,69,0.05) 4px)',
                  }}
                />
                {/* Holographic grid */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(109,190,69,0.14) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(109,190,69,0.14) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                    opacity: 0.65,
                  }}
                />
                {/* Data nodes */}
                {CERT_NODES.map(node => (
                  <ScanNode
                    key={node.id}
                    label={node.label}
                    value={node.value}
                    side={node.side}
                    yRatio={node.yRatio}
                    laserY={laserY}
                  />
                ))}
              </div>

              {/* Laser canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Corner brackets */}
              {(
                [
                  'top-2 left-2 border-t border-l',
                  'top-2 right-2 border-t border-r',
                  'bottom-2 left-2 border-b border-l',
                  'bottom-2 right-2 border-b border-r',
                ] as const
              ).map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-5 h-5 ${cls}`}
                  style={{ borderColor: 'rgba(109,190,69,0.5)' }}
                />
              ))}

              {/* Scan mode label floating at laser */}
              <div
                className="absolute right-3 pointer-events-none"
                style={{ top: `${laserY * 100}%`, transform: 'translateY(-50%)' }}
              >
                <span className="font-mono text-[6px] tracking-[0.18em] text-[#6DBE45]/80 uppercase">
                  {isHover ? '■ MANUAL' : '▶ SCAN'}
                </span>
              </div>
            </div>

            {/* Hint */}
            <p className="mt-3 text-center font-mono text-[8px] tracking-[0.2em] text-[#0F1830]/35 uppercase">
              Move cursor over scan field to inspect molecular certificate
            </p>
          </motion.div>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-20 grid grid-cols-3 divide-x divide-[#1A3B8B]/12 border border-[#1A3B8B]/12 rounded-xl overflow-hidden"
          style={{ background: '#F8F9FB' }}
        >
          {[
            { stat: '100%',  label: 'Batch Verified',    sub: 'Per NAFDAC registry' },
            { stat: '99.8%', label: 'Avg. Purity Index', sub: 'Independent assay' },
            { stat: '0.00%', label: 'Counterfeit Rate',  sub: 'Lifetime record' },
          ].map(({ stat, label, sub }) => (
            <div key={label} className="py-8 px-6 flex flex-col gap-1.5">
              <div
                className="font-satoshi font-black"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', color: GREEN }}
              >
                {stat}
              </div>
              <div className="font-satoshi font-semibold text-[#0F1830]/80 text-sm">{label}</div>
              <div className="font-mono text-[8px] tracking-[0.15em] text-[#0F1830]/45 uppercase">{sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
