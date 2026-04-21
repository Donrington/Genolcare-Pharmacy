'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from './ContactModal';
import Image from 'next/image';
import TrueFocus from './TrueFocus';

const cardVariants = {
  enter: {
    opacity: 0,
    y: 20,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
    },
  },
};

const trustPoints = [
  {
    text: 'Licensed pharmaceutical care provider',
    subtitle: 'Certified excellence in healthcare',
    image: '/trust-1.png',
  },
  {
    text: 'Expert clinical team with specialist credentials',
    subtitle: 'Trusted medical professionals',
    image: '/trust-2.png',
  },
  {
    text: '24/7 professional support available',
    subtitle: 'Always here when you need us',
    image: '/trust-3.png',
  },
];

function FloatingCardSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % trustPoints.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.4,
      }}
      className="w-full max-w-md"
    >
      {/* Cinematic Carousel Container */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl h-96">
        {/* Background Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${trustPoints[activeIndex].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between p-8 z-10">
          {/* Empty Top Space */}
          <div />

          {/* Bottom Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4 pt-8 sm:pt-0"
            >
              {/* Subtitle in Cursive */}
              <p className="font-cursive text-emerald-300 text-lg italic font-light">
                {trustPoints[activeIndex].subtitle}
              </p>

              {/* Main Text in Cursive */}
              <h3 className="font-cursive text-white text-3xl font-light leading-relaxed">
                {trustPoints[activeIndex].text}
              </h3>

              {/* Accent Line */}
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {trustPoints.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-8 bg-emerald-400'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Carousel item ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Hero Container - Full Width, Extreme Positioning */}
      <section className="relative w-full h-screen md:h-[125vh] overflow-x-hidden bg-white pt-20 md:pt-0">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-md"
        >
          <source src="/hero_vid2.mp4" type="video/mp4" />
        </video>

        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 50%, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Foreground Content - Full Screen Flex Layout */}
        <div className="relative z-10 w-full h-full flex flex-col justify-start md:justify-between py-6 sm:py-8 md:py-12 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
          {/* TOP: Logo & Massive H1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="space-y-6 sm:space-y-8 md:space-y-10 mb-20 sm:mb-16 md:mb-0 text-center sm:text-left"
          >
            {/* Logo */}
            <Image
              src="/genolcare_logo.png"
              alt="Genolcare Logo"
              width={100}
              height={100}
              className="h-20 sm:h-24 md:h-28 w-auto filter-none brightness-100 contrast-100 pt-6 sm:pt-0 mx-auto sm:mx-0"
              priority
              quality={100}
            />

            {/* Uppercase H1 - Balanced Scale with TrueFocus */}
            <h1 className="font-satoshi text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight sm:leading-tight md:leading-none tracking-tighter text-white uppercase max-w-6xl relative">
              <TrueFocus
                sentence="Clinical Excellence Precision Care"
                separator=" "
                manualMode={false}
                blurAmount={4}
                borderColor="#1A3B8B"
                glowColor="rgba(26, 59, 139, 0.5)"
                animationDuration={0.6}
                pauseBetweenAnimations={1.2}
                inline={true}
                className="justify-center sm:justify-start"
              />
            </h1>
          </motion.div>

          {/* BOTTOM: Responsive Layout - Better spacing on mobile */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4,
            }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-20 mt-6 sm:mt-8 md:mt-auto"
          >
            {/* Bottom Left: Subtext + CTA Button */}
            <div className="flex flex-col space-y-5 sm:space-y-6 md:space-y-7 max-w-md flex-shrink-0 text-center sm:text-left items-center sm:items-start">
              {/* Cursive Accent */}
              <p className="font-cursive text-blue-200 text-base sm:text-lg md:text-lg italic font-light tracking-wide">
                A legacy of trusted expertise
              </p>

              {/* Subtext */}
              <p className="font-satoshi text-base sm:text-lg md:text-lg text-gray-100 leading-relaxed font-light max-w-lg">
                Elevating community health in Abuja with{' '}
                <span className="font-medium text-cyan-200">15+ years</span> of specialist
                expertise. Genuine medications, expert consultations, and
                <span className="font-medium text-emerald-200"> seamless service.</span>
              </p>

              {/* CTA Button - Clean Pill Design */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center justify-center gap-3 px-7 sm:px-8 md:px-10 py-3 sm:py-4 bg-genolcare-blue text-white font-medium text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Contact Us</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>

            {/* Bottom Right: Floating Card Switcher */}
            <div className="hidden lg:block flex-shrink-0">
              <FloatingCardSwitcher />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div
          className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex-col items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          {/* Glassmorphic Container */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-center group-hover:bg-white/30 group-hover:border-white/60 transition-all duration-300"
          >
            {/* Animated Arrow */}
            <motion.svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </motion.div>

          {/* Subtle Text Label */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-xs font-satoshi font-medium text-white/60 group-hover:text-white/80 transition-colors duration-300 uppercase tracking-widest"
          >
            Scroll
          </motion.p>
        </motion.div>
      </section>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
