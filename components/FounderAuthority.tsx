'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

/* ─── Authority blocks ───────────────────────────────────────────── */
const BLOCKS = [
  {
    tag: '[ EXPERTISE ]',
    heading: '15+ Years of Clinical Excellence',
    body: 'Over a decade and a half at the intersection of pharmaceutical science and direct patient care — building a practice defined by precision, rigour, and evidence-based outcomes.',
  },
  {
    tag: '[ FELLOWSHIP ]',
    heading: 'FPCPharm — WAPCP Certified',
    body: 'Certified by the West African Postgraduate College of Pharmacists. Fellowship status represents the highest tier of pharmaceutical specialisation on the continent.',
  },
  {
    tag: '[ SPECIALTY ]',
    heading: 'Infectious Disease Pharmacology',
    body: 'Deep subspecialty focus in antimicrobial stewardship and infectious disease therapeutics — translating complex clinical protocols into accessible, community-level care.',
  },
  {
    tag: '[ PHILOSOPHY ]',
    heading: 'Precision for Every Patient',
    body: 'Every prescription, every consultation, every recommendation at Genolcare carries the weight of specialist knowledge. There is no standard treatment here — only optimal treatment.',
  },
] as const;

/* ─── Stagger variants ──────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const blockVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Component ──────────────────────────────────────────────────── */
export default function FounderAuthority() {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Parallax mouse tracking */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const imgX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const imgY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const imgScale = useTransform(
    smoothX,
    [-1, 0, 1],
    [1.06, 1.04, 1.06]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="about" className="relative w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">

        {/* ── LEFT: Sticky Editorial Portrait ─────────────────── */}
        <div
          ref={panelRef}
          className="md:col-span-5 relative h-[80vw] sm:h-[65vw] md:h-screen md:sticky md:top-0 overflow-hidden cursor-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Parallax image layer */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ x: imgX, y: imgY, scale: imgScale }}
          >
            <Image
              src="/founder.png"
              alt="Eugene Apasi Eromosele — FPCPharm, Genolcare Founder"
              fill
              className="object-cover object-top"
              priority
              quality={100}
            />
            {/* Editorial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          </motion.div>

          {/* Film grain — static, sits above parallax layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
            style={{ mixBlendMode: 'overlay', opacity: 0.28 }}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <filter id="founder-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#founder-grain)" />
          </svg>

          {/* Watermark — fixed, does NOT move with parallax */}
          <div className="absolute inset-0 flex items-end justify-start p-8 pointer-events-none z-10">
            <p
              className="font-satoshi text-[10px] tracking-[0.45em] text-white/20 uppercase font-semibold rotate-90 origin-bottom-left translate-y-[-1rem]"
              style={{ writingMode: 'vertical-lr' }}
            >
              Eugene Apasi Eromosele · FPCPharm · Genolcare
            </p>
          </div>

          {/* Bottom name badge */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="font-satoshi text-[10px] tracking-[0.3em] text-white/50 uppercase mb-1">
                Founder & Chief Pharmacist
              </p>
              <p className="font-satoshi text-2xl font-black text-white tracking-tight leading-none">
                Eugene Apasi Eromosele
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT: Scrollable Editorial Text ────────────────── */}
        <div className="md:col-span-7 flex flex-col justify-start px-8 sm:px-12 md:px-16 lg:px-24 py-20 md:py-32 lg:py-40">

          {/* Eyebrow */}
          <motion.p
            className="font-satoshi text-[10px] tracking-[0.35em] text-gray-400 uppercase font-semibold mb-10 text-center sm:text-left"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            [ Clinical Leadership ]
          </motion.p>

          {/* Opening statement — large editorial serif */}
          <motion.h2
            className="font-satoshi text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6 text-center sm:text-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.4 }}
          >
            Led by rigorous,{' '}
            <span className="italic font-light text-genolcare-blue">specialized</span>{' '}
            pharmaceutical expertise.
          </motion.h2>

          {/* Divider */}
          <motion.div
            className="w-16 h-[2px] bg-gradient-to-r from-genolcare-blue to-genolcare-green mb-14 mx-auto sm:mx-0"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
            style={{ originX: 0 }}
          />

          {/* Authority blocks */}
          <motion.div
            className="flex flex-col gap-12 md:gap-14"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {BLOCKS.map((block) => (
              <motion.div key={block.tag} variants={blockVariants} className="group">
                {/* Tag */}
                <p className="font-satoshi text-[10px] tracking-[0.3em] text-genolcare-green uppercase font-semibold mb-3 text-center sm:text-left">
                  {block.tag}
                </p>

                {/* Heading */}
                <h3 className="font-satoshi text-xl md:text-2xl font-black text-gray-900 mb-3 tracking-tight leading-snug text-center sm:text-left">
                  {block.heading}
                </h3>

                {/* Body */}
                <p className="font-satoshi text-sm md:text-base text-gray-500 leading-relaxed max-w-lg text-center sm:text-left">
                  {block.body}
                </p>

                {/* Separator */}
                <motion.div
                  className="mt-8 h-px bg-gray-100"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.8 }}
                  style={{ originX: 0 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Closing credential strip */}
          <motion.div
            className="mt-16 flex flex-wrap gap-3 justify-center sm:justify-start"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {['FPCPharm', 'WAPCP Fellow', 'Infectious Disease', '15+ Years'].map((badge) => (
              <span
                key={badge}
                className="font-satoshi text-[11px] tracking-[0.18em] text-genolcare-blue uppercase font-semibold px-4 py-2 border border-genolcare-blue/20 rounded-full bg-genolcare-blue/5"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
