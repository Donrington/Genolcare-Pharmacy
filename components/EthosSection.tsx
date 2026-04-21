'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const AMBIENT_CARDS = [
  { label: 'Continuous Monitoring', stat: '99.9%', statLabel: 'System Uptime',   hasPulse: true,  glowDuration: 4 },
  { label: 'Precision Analytics',   stat: '15+',   statLabel: 'Years Of Data',   hasPulse: false, glowDuration: 5 },
  { label: 'Expert Network',        stat: '24/7',  statLabel: 'Expert Access',   hasPulse: true,  glowDuration: 6 },
] as const;

const CONIC = 'conic-gradient(from 0deg, transparent 30%, #1A3B8B 50%, #6DBE45 70%, transparent 90%)';

export default function EthosSection() {
  const missionText = "Driven by an unwavering commitment to clinical excellence, we deliver uncompromised precision in pharmaceutical care. We bridge the gap between advanced medical science and community well-being, ensuring every patient receives rigorous, specialist-led attention.";

  const visionText = "We are architecting a future where seamless access to verified therapeutics and specialized clinical consultation is a universal standard. We envision a healthcare ecosystem where proactive management is effortless and guided by strict expert oversight.";

  const missionCursiveIndices = [10, 11];
  const visionCursiveIndices = [6, 7];

  const missionWords = missionText.split(' ');
  const visionWords = visionText.split(' ');

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: custom * 0.1 }
    })
  };

  return (
    <section className="relative w-full bg-white py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Mission Text Block - 8 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-8 bg-gray-50/50 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 sm:p-8 md:p-12"
          >
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-4 sm:mb-6 md:mb-8 font-satoshi font-medium text-center sm:text-left">
              [ Mission ]
            </p>
            <p className="font-satoshi text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium text-gray-900 text-center sm:text-justify md:text-left">
              {missionWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.03 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className={`inline-block ${missionCursiveIndices.includes(idx) ? 'font-cursive italic text-genolcare-green font-light' : ''}`}
                  style={{ marginRight: '0.35em' }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* Trust Asset Card - 4 columns */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-4 bg-gray-50/50 backdrop-blur-xl border border-gray-200/60 rounded-3xl overflow-hidden"
          >
            <div className="relative h-64 md:h-80 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <Image
                  src="/trust-1.png"
                  alt="Clinical Excellence"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Stat Card - 4 columns — hero glow variant */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-4"
          >
            <div className="relative overflow-hidden rounded-3xl p-[3px] h-full">
              {/* Faster, fully opaque conic spin — makes this card the focal point */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
                style={{ background: 'conic-gradient(from 0deg, #1A3B8B 0%, #6DBE45 25%, #1A3B8B 50%, #6DBE45 75%, #1A3B8B 100%)' }}
              />
              {/* Diffused outer glow — stronger than the ambient cards */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] blur-2xl opacity-70"
                style={{ background: 'conic-gradient(from 0deg, #1A3B8B 0%, #6DBE45 25%, #1A3B8B 50%, #6DBE45 75%, #1A3B8B 100%)' }}
              />

              {/* Deep blue inner card — inverted from the white glass siblings */}
              <div
                className="relative z-10 rounded-[21px] h-full p-8 md:p-10 flex flex-col items-center justify-center min-h-80 gap-3 text-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1A3B8B 0%, #0f2460 60%, #112f70 100%)' }}
              >
                {/* Subtle radial shimmer */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: 'radial-gradient(circle at 30% 30%, #6DBE45 0%, transparent 60%)' }}
                />
                {/* Soft floating green orb */}
                <motion.div
                  animate={{ y: [0, -12, 0], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-genolcare-green/20 blur-3xl"
                />

                <p className="font-satoshi text-[10px] tracking-[0.25em] text-white/50 uppercase font-semibold relative z-10">
                  Legacy of Excellence
                </p>
                <p className="font-satoshi text-7xl md:text-8xl font-black text-white leading-none relative z-10">
                  15+
                </p>
                <p className="font-satoshi text-xs tracking-[0.2em] text-genolcare-green uppercase font-semibold relative z-10">
                  Years of Clinical Expertise
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vision Text Block - 8 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-8 bg-gray-50/50 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 sm:p-8 md:p-12"
          >
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-4 sm:mb-6 md:mb-8 font-satoshi font-medium text-center sm:text-left">
              [ Vision ]
            </p>
            <p className="font-satoshi text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium text-gray-900 text-center sm:text-justify md:text-left">
              {visionWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.03 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className={`inline-block ${visionCursiveIndices.includes(idx) ? 'font-cursive italic text-genolcare-green font-light' : ''}`}
                  style={{ marginRight: '0.35em' }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* Three Ambient Pulse Cards — full 12-col row */}
          {AMBIENT_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              custom={i + 2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="md:col-span-4"
            >
              {/* Glow border wrapper — overflow-hidden clips the spinning gradient */}
              <div className="relative overflow-hidden rounded-3xl p-[2px] h-full">

                {/* Spinning conic gradient that forms the glowing border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: card.glowDuration, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
                  style={{ background: CONIC }}
                />
                {/* Blurred diffusion layer — softens the glow */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: card.glowDuration, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] blur-xl opacity-50"
                  style={{ background: CONIC }}
                />

                {/* Inner glass card — full rounded */}
                <div className="relative z-10 bg-white/85 backdrop-blur-2xl rounded-[22px] h-full p-6 flex flex-col items-center justify-center min-h-72 gap-2 text-center">
                  <p className="font-satoshi text-[10px] tracking-[0.2em] text-genolcare-blue/60 uppercase font-semibold">
                    {card.label}
                  </p>
                  <p className="font-satoshi text-5xl font-black text-genolcare-blue leading-none mt-2">
                    {card.stat}
                  </p>
                  <p className="font-satoshi text-[10px] tracking-[0.15em] text-gray-400 uppercase">
                    {card.statLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
