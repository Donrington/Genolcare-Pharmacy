'use client';

import { useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion';

/* ─── Data ──────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'prescription',
    index: '01',
    label: 'Prescription Filling',
    title: 'Precision Fulfillment',
    subtitle: 'Rigorous specialist-led processing of specialist prescriptions.',
    hero: true,
    image: '/prescription_filling.png',
    colSpan: 'md:col-span-8',
    rowSpan: 'md:row-span-2',
  },
  {
    id: 'consultation',
    index: '02',
    label: 'Health Consultations',
    title: 'Clinical Consulting',
    subtitle: 'Expert advice from WAPCP Fellows.',
    hero: false,
    image: '/pov_health_consultation.png',
    colSpan: 'md:col-span-4',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'otc',
    index: '03',
    label: 'OTC Medications',
    title: 'Immediate Care',
    subtitle: 'Genuine OTC medications for daily health.',
    hero: false,
    image: '/otc_medications.png',
    colSpan: 'md:col-span-4',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'wellness',
    index: '04',
    label: 'Wellness Products',
    title: 'Holistic Health',
    subtitle: 'Curated vitamins and premium wellness essentials.',
    hero: false,
    image: '/wellness_products.png',
    colSpan: 'md:col-span-4',
    rowSpan: 'md:row-span-1',
  },
];

/* ─── Card variants ─────────────────────────────────────────────── */
const cardVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 0.98,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

const arrowVariants = {
  rest: { x: -8, opacity: 0 },
  hover: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

const accentVariants = {
  rest: { scaleX: 0 },
  hover: {
    scaleX: 1,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

/* ─── Spotlight-card ─────────────────────────────────────────────── */
interface SpotlightCardProps {
  service: (typeof SERVICES)[number];
  index: number;
}

function SpotlightCard({ service, index }: SpotlightCardProps) {
  const mouseX = useMotionValue(-999);
  const mouseY = useMotionValue(-999);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-999);
    mouseY.set(-999);
  }, [mouseX, mouseY]);

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(109,190,69,0.12), transparent 70%)`;

  return (
    <motion.div
      ref={cardRef}
      className={`${service.colSpan} ${service.rowSpan} col-span-1 relative`}
      initial={{ opacity: 0, y: 24, scale: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      viewport={{ once: true, amount: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card shell */}
      <div className="relative h-full bg-[#FAFAFA] border border-gray-200/50 rounded-[2rem] overflow-hidden shadow-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,1)] flex flex-col">

        {/* Spotlight layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[2rem]"
          style={{ background: spotlight }}
        />

        {/* ── HERO CARD ───────────────────────────────────────── */}
        {service.hero ? (
          <>
            {/* Image Placeholder or Actual Image */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-50 rounded-t-[2rem] overflow-hidden flex-shrink-0 group">
              {'image' in service && service.image ? (
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200/70 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h.008v.008H3V9.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  </div>
                  {/* Subtle grid pattern for placeholder */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                    }}
                  />
                </>
              )}
            </div>

            {/* Text block */}
            <div className="relative z-10 flex flex-col flex-1 p-8 md:p-10 justify-between items-center sm:items-start text-center sm:text-left">
              <div className="w-full">
                <p className="font-satoshi text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold mb-3">
                  {service.label}
                </p>
                <motion.h3
                  className="font-satoshi text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                  variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  {service.title}
                </motion.h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between w-full mt-6 gap-4 sm:gap-0">
                <motion.p
                  className="font-satoshi text-sm md:text-base text-gray-500 leading-relaxed max-w-sm text-center sm:text-left"
                  variants={{ rest: { opacity: 0.6 }, hover: { opacity: 1 } }}
                  transition={{ duration: 0.2 }}
                >
                  {service.subtitle}
                </motion.p>

                {/* Arrow */}
                <motion.div
                  variants={arrowVariants}
                  className="flex-shrink-0 ml-6 w-10 h-10 rounded-full bg-genolcare-blue flex items-center justify-center shadow-md"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </motion.div>
              </div>

              {/* Accent line */}
              <motion.div
                variants={accentVariants}
                className="mt-5 h-[2px] bg-gradient-to-r from-genolcare-blue to-genolcare-green rounded-full"
                style={{ originX: 0 }}
              />
            </div>
          </>
        ) : (

          /* ── SMALL CARDS ──────────────────────────────────────── */
          <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-10 min-h-56 overflow-hidden items-center sm:items-start text-center sm:text-left">

            {/* Background Content */}
            {'image' in service && service.image ? (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/20" />
              </div>
            ) : (
              <span className="absolute -bottom-4 -right-2 font-satoshi font-black text-[7rem] leading-none text-gray-100 select-none pointer-events-none z-0">
                {service.index}
              </span>
            )}

            {/* Card content */}
            <div className="relative z-10 w-full">
              <p className={`font-satoshi text-[10px] tracking-[0.25em] uppercase font-semibold mb-3 ${'image' in service && service.image ? 'text-gray-300' : 'text-gray-400'}`}>
                {service.label}
              </p>
              <motion.h3
                className={`font-satoshi text-2xl md:text-3xl font-black leading-tight ${'image' in service && service.image ? 'text-white' : 'text-gray-900'}`}
                variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {service.title}
              </motion.h3>
            </div>

            <div className="relative z-10 mt-4 w-full">
              <motion.p
                className={`font-satoshi text-sm leading-relaxed text-center sm:text-left ${'image' in service && service.image ? 'text-gray-200' : 'text-gray-500'}`}
                variants={{ rest: { opacity: 0.8 }, hover: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
              >
                {service.subtitle}
              </motion.p>

              <div className="flex items-center justify-center sm:justify-between mt-4 gap-4 sm:gap-0">
                {/* Accent line */}
                <motion.div
                  variants={accentVariants}
                  className="h-[2px] w-12 bg-gradient-to-r from-genolcare-blue to-genolcare-green rounded-full"
                  style={{ originX: 0 }}
                />

                {/* Arrow */}
                <motion.div
                  variants={arrowVariants}
                  className="w-9 h-9 rounded-full bg-genolcare-green flex items-center justify-center shadow-md"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function ServicesShowcase() {
  return (
    <section className="relative w-full bg-white py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="w-full max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          className="mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <p className="font-satoshi text-[10px] tracking-[0.3em] text-gray-400 uppercase font-semibold mb-4 text-center sm:text-left">
            [ What We Offer ]
          </p>
          <h2 className="font-satoshi text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-none tracking-tight text-center sm:text-left">
            Services
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {SERVICES.map((service, i) => (
            <SpotlightCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
