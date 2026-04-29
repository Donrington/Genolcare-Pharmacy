'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Data ──────────────────────────────────────────────────────── */
const FAQS = [
  {
    id: 'precision',
    q: 'How does Precision Fulfillment differ from standard dispensing?',
    a: 'Our precision model involves rigorous, multi-tier verification led by specialist pharmacists to ensure zero margin for error and optimal therapeutic outcomes.',
  },
  {
    id: 'consultation',
    q: 'Can I schedule a private clinical consultation?',
    a: 'Yes. We offer dedicated consultation blocks with Eugene Apasi Eromosele for comprehensive medication therapy management and chronic disease oversight.',
  },
  {
    id: 'support',
    q: 'Is 24/7 support available to all patients?',
    a: 'Continuous monitoring and immediate clinical support are core tenets of the Genolcare experience, accessible to all our registered patients.',
  },
  {
    id: 'specialty',
    q: 'Do you source specialty or cold-chain medications?',
    a: 'Absolutely. Our supply chain is strictly vetted, allowing us to securely procure, store, and dispense highly sensitive therapeutics.',
  },
] as const;

/* ─── Accordion Item ────────────────────────────────────────────── */
interface AccordionItemProps {
  faq: (typeof FAQS)[number];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function AccordionItem({ faq, isOpen, onToggle, index }: AccordionItemProps) {
  return (
    <motion.div
      className="border-b border-gray-200/60"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 py-8 text-left group"
        aria-expanded={isOpen}
      >
        {/* Index + question */}
        <div className="flex items-start gap-5">
          <span className="font-satoshi text-[10px] tracking-[0.3em] text-gray-300 uppercase font-semibold pt-1 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            className={`font-satoshi text-xl sm:text-2xl md:text-2xl lg:text-3xl font-medium leading-snug tracking-tight transition-colors duration-300 ${
              isOpen ? 'text-genolcare-blue' : 'text-gray-900 group-hover:text-gray-700'
            }`}
          >
            {faq.q}
          </h3>
        </div>

        {/* Toggle icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className={`shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${
            isOpen
              ? 'border-genolcare-blue/30 bg-genolcare-blue/5'
              : 'border-gray-200 bg-transparent group-hover:border-gray-300'
          }`}
        >
          <svg
            className={`w-3.5 h-3.5 transition-colors duration-300 ${isOpen ? 'text-genolcare-blue' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
          </svg>
        </motion.div>
      </button>

      {/* Answer reveal */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pl-11 pb-8 pr-12">
              <p className="font-satoshi text-base md:text-lg text-gray-500 font-light leading-relaxed max-w-prose">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="faq" className="relative w-full bg-[#FAFAFA] py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* ── LEFT: Sticky Title Panel ──────────────────────── */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <motion.p
                className="font-satoshi text-[10px] tracking-[0.35em] text-gray-400 uppercase font-semibold mb-6 text-center md:text-left"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                [ Inquiries ]
              </motion.p>

              <motion.h2
                className="font-satoshi text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight mb-6 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.4 }}
              >
                Finding{' '}
                <span className="italic font-light text-genolcare-blue">Clarity.</span>
              </motion.h2>

              <motion.div
                className="w-12 h-[2px] bg-gradient-to-r from-genolcare-blue to-genolcare-green mb-8 mx-auto md:mx-0"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true, amount: 0.5 }}
                style={{ originX: 0 }}
              />

              <motion.p
                className="font-satoshi text-sm text-gray-400 leading-relaxed text-center md:text-left"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                Answers to the most common questions about our clinical process, services, and standards.
              </motion.p>

              {/* Progress tracker */}
              <motion.div
                className="hidden md:flex flex-col gap-2 mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {FAQS.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => toggle(faq.id)}
                    className="flex items-center gap-3 group text-left"
                  >
                    <motion.div
                      animate={{
                        width: openId === faq.id ? 24 : 8,
                        backgroundColor: openId === faq.id ? '#1A3B8B' : '#D1D5DB',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      className="h-[2px] rounded-full shrink-0"
                    />
                    <span
                      className={`font-satoshi text-[11px] tracking-[0.15em] uppercase font-semibold transition-colors duration-200 ${
                        openId === faq.id ? 'text-genolcare-blue' : 'text-gray-300 group-hover:text-gray-400'
                      }`}
                    >
                      {String(FAQS.indexOf(faq) + 1).padStart(2, '0')}
                    </span>
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT: Accordion ──────────────────────────────── */}
          <div className="md:col-span-8">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggle(faq.id)}
                index={i}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
