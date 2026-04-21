'use client';

import { motion } from 'framer-motion';

export default function FloatingAsset() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Animated floating container */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-80 h-80"
      >
        {/* Outer glow circle */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-genolcare-blue/20 to-genolcare-green/20 blur-3xl"
        />

        {/* Glassmorphism container */}
        <div className="absolute inset-8 rounded-3xl backdrop-blur-2xl bg-white/20 border border-white/30 shadow-2xl flex items-center justify-center">
          {/* Inner content - Cross & Leaf Design */}
          <svg
            viewBox="0 0 200 200"
            className="w-48 h-48"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1A3B8B" />
                <stop offset="100%" stopColor="#6DBE45" />
              </linearGradient>
            </defs>

            {/* Medical Cross */}
            <line x1="100" y1="40" x2="100" y2="160" />
            <line x1="40" y1="100" x2="160" y2="100" />

            {/* Decorative leaf elements */}
            <path d="M 140 60 Q 155 70 150 85 Q 145 95 130 90" />
            <path d="M 60 140 Q 45 130 50 115 Q 55 105 70 110" />

            {/* Accent circles */}
            <circle cx="100" cy="100" r="15" opacity="0.6" />
            <circle cx="100" cy="100" r="35" opacity="0.3" />
          </svg>
        </div>

        {/* Floating particles */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-10 left-10 w-2 h-2 bg-genolcare-blue/40 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [10, -10, 10],
            x: [0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-10 right-10 w-3 h-3 bg-genolcare-green/40 rounded-full blur-sm"
        />
      </motion.div>
    </div>
  );
}
