'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import TrueFocus from './TrueFocus';

export default function ConsultingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  
  // Lens Breathe effect on scroll
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.05]);
  const bgBlur = useTransform(scrollY, [0, 1000], [0, 8]); // subtle blur increase on scroll down

  useEffect(() => {
    if (!bgRef.current) return;

    const tl = gsap.timeline();

    // 1. "Focus-Shift" Background Animation
    // Initial state set via Tailwind (scale-110, blur-2xl)
    // Animate to scale-100, blur-0 over 2.5s with custom ease
    tl.to(bgRef.current, {
      scale: 1,
      filter: 'blur(0px)',
      duration: 2.5,
      ease: 'power3.inOut',
    }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* --- 1. The Cinematic Lens Background --- */}
      <motion.div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{ scale: bgScale }}
      >
        <motion.div 
          className="w-full h-full will-change-filter"
          style={{ filter: useTransform(bgBlur, blur => `blur(${blur}px)`) }}
        >
          <div 
            ref={bgRef}
            className="relative w-full h-full scale-110 blur-2xl origin-center"
          >
            <Image
              src="/pov_health_consultation.png"
              alt="Clinical Consultation"
              fill
              priority
              className="object-cover opacity-60"
              quality={100}
            />
            {/* Gradient overlay to ensure text contrast while maintaining depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-[#050505]/90 mix-blend-multiply" />
          </div>
        </motion.div>
      </motion.div>

      {/* --- 2. Content & Typography --- */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 w-full max-w-7xl mt-12">
        
        {/* The Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 md:mb-10 font-mono text-[10px] md:text-[11px] tracking-[0.4em] text-white/60 uppercase"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          [ EUGENE APASI EROMOSELE // WAPCP_FELLOWSHIP ]
        </motion.div>

        {/* The TextMask Headline */}
        <div className="relative mb-8 md:mb-12 w-full overflow-hidden px-4 md:px-10 flex justify-center">
          <h1
            className="font-satoshi font-black text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] xl:text-[10rem] leading-[0.85] tracking-tighter uppercase text-white"
            style={{
              filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))',
            }}
          >
            <TrueFocus 
              sentence="CLINICAL CONSULTING"
              separator=" "
              manualMode={false}
              blurAmount={6}
              borderColor="#ffffff"
              glowColor="rgba(255, 255, 255, 0.4)"
              animationDuration={0.8}
              pauseBetweenAnimations={1.5}
              inline={true}
              className="justify-center text-center"
            />
          </h1>
        </div>

        {/* The Lead */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl md:max-w-3xl mx-auto"
        >
          <p className="text-base md:text-xl text-white/70 font-light leading-relaxed tracking-wide">
            Architecting health through specialized pharmaceutical intelligence and diagnostic clarity.
          </p>
        </motion.div>
      </div>

      {/* --- 3. Navigation Anchor (Heartbeat Scroll Indicator) --- */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.5 }}
      >
        <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono">
          Scroll
        </span>
        <motion.div 
          className="w-[1px] bg-white/70"
          animate={{ 
            height: ['10px', '40px', '10px'],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

    </section>
  );
}
