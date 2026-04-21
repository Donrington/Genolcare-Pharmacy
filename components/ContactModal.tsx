'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Variants ──────────────────────────────────────────────────── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slabVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 320, staggerChildren: 0.055, delayChildren: 0.1 },
  },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.22, ease: 'easeIn' } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Floating Label Input ──────────────────────────────────────── */
interface FloatInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  required?: boolean;
}

function FloatInput({ label, name, type = 'text', value, onChange, textarea = false, required }: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const sharedClass =
    'w-full bg-transparent outline-none text-gray-900 text-sm pt-5 pb-2 px-4 peer';

  return (
    <motion.div variants={itemVariant}>
      <div
        className={`relative rounded-xl border transition-all duration-300 overflow-hidden
          ${lifted ? 'bg-white border-genolcare-blue shadow-[0_0_0_3px_rgba(26,59,139,0.06)]' : 'bg-gray-50/60 border-gray-100 hover:border-gray-200'}`}
      >
        {/* Floating label */}
        <motion.label
          htmlFor={name}
          className="absolute left-4 pointer-events-none text-gray-400 origin-top-left select-none"
          animate={
            lifted
              ? { top: '6px', fontSize: '10px', letterSpacing: '0.08em', color: '#1A3B8B', y: 0 }
              : { top: textarea ? '14px' : '50%', fontSize: '14px', letterSpacing: '0em', color: '#9ca3af', y: textarea ? 0 : '-50%' }
          }
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute' }}
        >
          {label}
        </motion.label>

        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            rows={3}
            className={`${sharedClass} resize-none`}
          />
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            className={sharedClass}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Magnetic Button ───────────────────────────────────────────── */
function MagneticButton({ sending }: { sending: boolean }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const translateX = useTransform(x, [-1, 1], [-6, 6]);
  const translateY = useTransform(y, [-1, 1], [-4, 4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      y.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={btnRef}
      type="submit"
      disabled={sending}
      variants={itemVariant}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: translateX, y: translateY }}
      className="w-full py-3.5 rounded-xl font-satoshi font-semibold text-sm text-white tracking-wide
        bg-gradient-to-r from-genolcare-blue to-[#2A4B9B]
        shadow-[0_0_20px_rgba(26,59,139,0.3)]
        hover:shadow-[0_0_32px_rgba(26,59,139,0.45)]
        transition-shadow duration-300 overflow-hidden relative"
    >
      <AnimatePresence mode="wait">
        {sending ? (
          <motion.span
            key="sending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Sending…
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            Send Message
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Modal ─────────────────────────────────────────────────────── */
export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 1600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-[60]"
          />

          {/* Glass Slab */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              variants={slabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden
                bg-white/72 backdrop-blur-3xl border border-white/60
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8),_0_24px_48px_-10px_rgba(0,0,0,0.12)]"
            >
              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center rounded-full
                  bg-white/50 backdrop-blur-md border border-gray-200/50
                  hover:bg-gray-100/60 text-gray-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2">

                {/* ── LEFT: WhatsApp Fast-Track ──────────────────── */}
                <motion.div
                  variants={itemVariant}
                  className="bg-genolcare-green/5 p-8 md:p-10 flex flex-col justify-center items-center text-center gap-5"
                >
                  {/* Pulse ring + icon */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute w-20 h-20 rounded-full bg-genolcare-green/20"
                    />
                    <a
                      href="https://wa.me/2349123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 w-14 h-14 rounded-full bg-genolcare-green/20 hover:bg-genolcare-green/30 flex items-center justify-center transition-colors duration-200"
                    >
                      <svg className="w-7 h-7 text-genolcare-green" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 .981.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </div>

                  <div>
                    <p className="font-satoshi text-[10px] tracking-[0.3em] text-genolcare-green uppercase font-semibold mb-2">
                      [ Fast Track ]
                    </p>
                    <h3 className="font-satoshi text-lg font-black text-gray-900 tracking-tight mb-1">
                      Need a refill quickly?
                    </h3>
                    <p className="font-satoshi text-sm text-gray-500 leading-relaxed">
                      Chat with us on WhatsApp for instant support and same-day service.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/2349123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-satoshi inline-flex items-center gap-2 px-6 py-3 rounded-full
                      bg-genolcare-green text-white text-sm font-semibold
                      hover:bg-genolcare-green/90 transition-colors duration-200
                      shadow-[0_4px_14px_rgba(109,190,69,0.35)]"
                  >
                    Message on WhatsApp
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>

                  {/* Subtle divider line on mobile only */}
                  <div className="w-16 h-px bg-gray-200 md:hidden mt-2" />
                </motion.div>

                {/* ── RIGHT: Inquiry Form ────────────────────────── */}
                <div className="p-8 md:p-10 flex flex-col gap-6">

                  {/* Header */}
                  <motion.div variants={itemVariant}>
                    <p className="font-satoshi text-[10px] tracking-[0.3em] text-gray-400 uppercase font-semibold mb-2">
                      [ Direct Inquiry ]
                    </p>
                    <h2 className="font-satoshi text-2xl font-black text-gray-900 tracking-tight leading-tight">
                      Send us a Message
                    </h2>
                    <p className="font-satoshi text-sm text-gray-400 mt-1">
                      We respond within 24 hours.
                    </p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FloatInput
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <FloatInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <FloatInput
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      textarea
                      required
                    />

                    <motion.div variants={itemVariant} className="pt-1">
                      <MagneticButton sending={sending} />
                    </motion.div>
                  </form>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
