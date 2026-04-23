'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

/* ─── Glass Slab Component ──────────────────────────────────────────────── */
interface LiquidCardProps {
  className?: string;
  children: React.ReactNode;
  imageSrc?: string;
}

function LiquidCard({ className, children, imageSrc }: LiquidCardProps) {
  const [isTapped, setIsTapped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleTapped = () => {
    // Only toggle on mobile/touch devices or small screens
    if (window.innerWidth < 768) {
      setIsTapped(!isTapped);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={toggleTapped}
      initial="initial"
      whileHover="hover"
      animate={isTapped ? "hover" : "rest"}
      className={`group relative rounded-[2rem] p-[1px] bg-[#0a0a0a]/40 shadow-sm border border-white/5 transition-all duration-300 cursor-pointer ${className}`}
    >

      {/* Inner Glass Slab - Dark Mode inside */}
      <div className="relative z-10 w-full h-full rounded-[calc(2rem-1px)] bg-black/40 backdrop-blur-3xl shadow-[inset_0_0_1px_rgba(255,255,255,0.15)] p-8 sm:p-10 md:p-12 overflow-hidden flex flex-col items-start border border-white/10">
        
        {/* Background Image Layer - Normal Blending, Highly Visible */}
        {imageSrc && (
          <motion.div 
            className="absolute inset-0 z-0 pointer-events-none"
            variants={{
              initial: { opacity: 0.4 },
              hover: { opacity: 0.7 }
            }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={imageSrc}
              alt="Expertise Background"
              fill
              className="object-cover"
            />
            {/* Dark gradient overlays to create depth and protect white text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/60 to-[#050505]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
          </motion.div>
        )}


        {/* Content Container (Elevated via 3D transform for parallax) */}
        <div 
          className="relative z-10 h-full w-full flex flex-col pointer-events-auto"
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Expertise Matrix Section ─────────────────────────────────────────── */
const contentVariants = {
  initial: { opacity: 0, height: 0, marginTop: 0 },
  hover: { 
    opacity: 1, 
    height: "auto", 
    marginTop: 40,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ExpertiseMatrix() {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 px-6 sm:px-10 lg:px-[4vw] bg-white overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-genolcare-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto mb-16 md:mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-mono text-xs md:text-sm tracking-[0.4em] text-gray-400 uppercase">
            [ THE_CONSULTATION_AXIS ]
          </h2>
        </motion.div>
      </div>

      {/* Grid Flow */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 w-full max-w-7xl mx-auto relative z-10 perspective-1000">
          
          {/* ─── Card 01: Chronic Management (The Hero) ─── */}
          <LiquidCard imageSrc="/ChronicOversight.png" className="md:col-span-8 md:row-span-2 min-h-[450px] md:min-h-[600px]">
            <div className="flex flex-col h-full w-full justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#4F7CFF] bg-[#1A3B8B]/30 px-3 py-1.5 rounded-full border border-[#1A3B8B]/40">
                  Primary Node
                </span>
                {/* White text since the card is dark */}
                <h3 className="font-satoshi font-black text-4xl sm:text-5xl md:text-7xl text-white mt-8 leading-[0.9] tracking-tighter uppercase">
                  Chronic Disease<br />Management
                </h3>
                
                {/* Initial state helper text */}
                <motion.div variants={{ initial: { opacity: 1, y: 0 }, hover: { opacity: 0, y: -10 } }} className="mt-8 absolute">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/70 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-genolcare-green rounded-full animate-pulse" />
                    Initialize Diagnostic ↘
                  </span>
                </motion.div>
              </div>

              {/* Hover Expansion */}
              <motion.div variants={contentVariants} className="mt-20 flex flex-col gap-6">
                <motion.p variants={itemVariants} className="text-white/80 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl">
                  Long-term oversight of hypertension, diabetes, and infectious diseases. We architect personalized therapeutic pathways for sustained clinical stability.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-4">
                  {['Hypertension', 'Diabetes', 'Infectious Diseases', 'Biochemical Tracking'].map((tag, i) => (
                    <span key={i} className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/90 shadow-sm backdrop-blur-md">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </LiquidCard>

          {/* ─── Card 02: MTM (Medication Therapy Management) ─── */}
          <LiquidCard imageSrc="/PolypharmacyReview.png" className="md:col-span-4 md:row-span-1 min-h-[300px]">
            <div className="flex flex-col h-full w-full justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#6DBE45] bg-[#6DBE45]/20 px-3 py-1.5 rounded-full border border-[#6DBE45]/30">
                  Protocol 02
                </span>
                <h3 className="font-satoshi font-black text-3xl md:text-5xl text-white mt-6 leading-[0.9] tracking-tighter uppercase">
                  MTM
                </h3>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/60 mt-3">Medication Therapy Mgt</p>
                
                <motion.div variants={{ initial: { opacity: 1, y: 0 }, hover: { opacity: 0, y: -10 } }} className="mt-6 absolute">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-white/50">
                    Reveal ↘
                  </span>
                </motion.div>
              </div>

              <motion.div variants={contentVariants} className="mt-16">
                <motion.p variants={itemVariants} className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                  Optimization and cross-checking of complex polypharmacy regimens to eliminate contraindications and maximize efficacy.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-4">
                  {['Regimen Optimization', 'Contraindications'].map((tag, i) => (
                    <span key={i} className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </LiquidCard>

          {/* ─── Card 03: Precision Nutrition ─── */}
          <LiquidCard imageSrc="/BiochemicalNutrition.png" className="md:col-span-4 md:row-span-1 min-h-[300px]">
            <div className="flex flex-col h-full w-full justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  Protocol 03
                </span>
                <h3 className="font-satoshi font-black text-3xl md:text-5xl text-white mt-6 leading-[0.9] tracking-tighter uppercase">
                  Nutrition
                </h3>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/60 mt-3">Biochemical Alignment</p>
                
                <motion.div variants={{ initial: { opacity: 1, y: 0 }, hover: { opacity: 0, y: -10 } }} className="mt-6 absolute">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-white/50">
                    Reveal ↘
                  </span>
                </motion.div>
              </div>

              <motion.div variants={contentVariants} className="mt-16">
                <motion.p variants={itemVariants} className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                  Biochemical alignment of diet and therapeutic plans. Precision nutrition to support cellular recovery and drug metabolism.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-4">
                  {['Dietary Alignment', 'Metabolism'].map((tag, i) => (
                    <span key={i} className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </LiquidCard>

      </div>
    </section>
  );
}
