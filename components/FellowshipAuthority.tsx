'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ─── Credential Item (Kinetic Scroll with Motion Blur & Stretch) ───────── */
interface CredentialItemProps {
  text: string;
  index: number;
  onHover: () => void;
  onLeave: () => void;
}

const CredentialItem = ({ text, index, onHover, onLeave }: CredentialItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track this element's position relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"] // Starts animating when 85% down the screen, ends at 15% from top
  });

  // Map scroll progress to GSAP-style editorial transforms
  // 0 -> 0.4: Entering (Blurred, Stretched, Transparent -> Sharp, Normal, Opaque)
  // 0.4 -> 0.6: Resting in the center of the screen
  // 0.6 -> 1: Exiting (Sharp, Normal, Opaque -> Blurred, Stretched, Transparent)
  const blurValue = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [15, 0, 0, 15]);
  const scaleY = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1.8, 1, 1, 1.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Framer Motion needs a template for the filter string
  const filter = useTransform(blurValue, (b) => `blur(${b}px)`);

  return (
    <motion.div 
      ref={ref}
      style={{ scaleY, opacity, filter }}
      className="origin-center cursor-pointer py-8 border-b border-white/5 last:border-0"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#6DBE45] uppercase">
          0{index + 1} // Verified
        </span>
        <h3 className="font-satoshi font-black text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl text-white uppercase leading-[0.9] tracking-tighter group transition-colors duration-500 hover:text-white">
          <span className="font-mono font-light text-white/20 mr-2 md:mr-4 transition-colors duration-300 group-hover:text-[#6DBE45]">{"["}</span>
          {text}
          <span className="font-mono font-light text-white/20 ml-2 md:ml-4 transition-colors duration-300 group-hover:text-[#6DBE45]">{"]"}</span>
        </h3>
      </div>
    </motion.div>
  );
};

/* ─── Locked Portrait Component (Right Side) ────────────────────────────── */
interface PortraitDisplayProps {
  activeHover: number | null;
}

function PortraitDisplay({ activeHover }: PortraitDisplayProps) {
  const isHovered = activeHover !== null;

  // We can subtly shift the color tone of the screen data based on WHICH credential is hovered
  const getGlowColor = () => {
    switch (activeHover) {
      case 0: return 'rgba(26,59,139,0.4)'; // Blue for WAPCP
      case 1: return 'rgba(109,190,69,0.4)'; // Green for Infectious Disease
      case 2: return 'rgba(255,255,255,0.2)'; // White for Council
      default: return 'rgba(26,59,139,0.1)';
    }
  };

  return (
    <div className="relative w-full h-full bg-[#020202] overflow-hidden">
      
      {/* 1. Base Large-Scale Grainy B&W Portrait */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image 
          src="/TheInsignia.png" 
          alt="Fellowship Authority" 
          fill 
          className="object-cover grayscale contrast-125 opacity-60"
          priority
        />
      </motion.div>
      
      {/* 2. The Depth-of-Field Screen Data Layer */}
      {/* When the user hovers a credential, the data "snaps into focus" (sharpens & brightens) */}
      <motion.div 
        className="absolute inset-0 z-10 mix-blend-screen"
        animate={{ 
          opacity: isHovered ? 0.35 : 0.05,
          filter: isHovered ? 'blur(0px) brightness(1)' : 'blur(8px) brightness(0.5)',
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image 
          src="/image_24.png"
          alt="Glowing Screen Data"
          fill
          className="object-cover object-center"
        />
        {/* Dynamic color tinting based on hovered item */}
        <motion.div 
          className="absolute inset-0 mix-blend-color"
          animate={{ backgroundColor: getGlowColor() }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      
      {/* 3. Shadow Vignettes for Editorial Blending */}
      {/* Left shadow to blend smoothly with the left-side text column */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-20 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
      {/* Bottom shadow for smooth section transitions */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 z-20 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
      {/* Top shadow */}
      <div className="absolute inset-x-0 top-0 h-1/4 z-20 bg-gradient-to-b from-[#050505] to-transparent opacity-80" />

      {/* Decorative Technical Crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/5 rounded-full z-30 pointer-events-none flex items-center justify-center">
        <div className="w-1 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
const credentials = [
  "WAPCP FELLOWSHIP",
  "INFECTIOUS DISEASE SPECIALTY",
  "CLINICAL PHARMACY COUNCIL CERTIFIED",
  "PHARMACOVIGILANCE EXPERT",
  "METABOLIC PATHWAY ARCHITECT"
];

export default function FellowshipAuthority() {
  const [activeHover, setActiveHover] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-[#050505] border-t border-white/5">
      {/* 
        The container uses flex-row. 
        Left side takes up physical height (py-[40vh]) so the user scrolls down for a while.
        Right side uses sticky top-0 h-screen to stay locked in place.
      */}
      <div className="flex flex-col md:flex-row w-full max-w-[100vw] mx-auto relative">
        
        {/* Mobile-only static portrait (shows up at the top on small screens) */}
        <div className="w-full h-[60vh] md:hidden relative z-0">
          <PortraitDisplay activeHover={activeHover} />
        </div>

        {/* LEFT: Scrolling Credentials */}
        <div className="w-full md:w-[45%] lg:w-[40%] relative z-20 py-20 md:py-[40vh] flex flex-col gap-[15vh] md:gap-[30vh] px-6 md:px-12 lg:px-20 xl:px-24">
           
           {/* Section Eyebrow */}
           <div className="mb-[10vh] md:mb-[20vh]">
             <h2 className="font-mono text-xs tracking-[0.4em] text-white/40 uppercase flex items-center gap-4">
               <span className="w-8 h-[1px] bg-white/20" />
               Clinical Authority
             </h2>
           </div>

           {/* The mapped credentials list */}
           <div className="flex flex-col gap-[15vh] md:gap-[30vh] pb-[20vh]">
             {credentials.map((cred, i) => (
               <CredentialItem 
                 key={i} 
                 index={i}
                 text={cred} 
                 onHover={() => setActiveHover(i)} 
                 onLeave={() => setActiveHover(null)} 
               />
             ))}
           </div>
           
        </div>

        {/* RIGHT: Locked Portrait (Desktop only) */}
        <div className="hidden md:block md:w-[55%] lg:w-[60%] h-screen sticky top-0 right-0 z-10 border-l border-white/5">
           <PortraitDisplay activeHover={activeHover} />
        </div>
        
      </div>
    </section>
  );
}
