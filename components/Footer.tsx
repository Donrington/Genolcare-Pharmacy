'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion';
import ContactModal from './ContactModal';

/* ─── JSON-LD Schema ────────────────────────────────────────────── */
const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Pharmacy', 'LocalBusiness'],
      '@id': 'https://genolcare.com/#pharmacy',
      name: 'Genolcare Pharmacy',
      description:
        'Specialist pharmacy and clinical consulting led by an FPCPharm-certified WAPCP Fellow in Wuse District, Abuja, Nigeria.',
      url: 'https://genolcare.com',
      telephone: '+2349123456789',
      priceRange: '₦₦',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Wuse District',
        addressLocality: 'Abuja',
        addressRegion: 'Federal Capital Territory',
        addressCountry: 'NG',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '21:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '20:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '12:00',
          closes: '18:00',
        },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'English',
        telephone: '+2349123456789',
      },
      sameAs: ['https://wa.me/2349123456789'],
    },
  ],
};

/* ─── Static data ───────────────────────────────────────────────── */
const HOURS = [
  { days: 'Mon — Fri', open: 8 * 60, close: 21 * 60, time: '8:00 AM – 9:00 PM' },
  { days: 'Saturday', open: 9 * 60, close: 20 * 60, time: '9:00 AM – 8:00 PM' },
  { days: 'Sunday', open: 12 * 60, close: 18 * 60, time: '12:00 PM – 6:00 PM' },
];

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Our Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
];

/* ─── Stagger variants ──────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Uptime Ticker ─────────────────────────────────────────────── */
function UptimeTicker() {
  const [tick, setTick] = useState('--:--:--.---');

  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      const h = n.getHours().toString().padStart(2, '0');
      const m = n.getMinutes().toString().padStart(2, '0');
      const s = n.getSeconds().toString().padStart(2, '0');
      const ms = n.getMilliseconds().toString().padStart(3, '0');
      setTick(`${h}:${m}:${s}.${ms}`);
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-1.5 h-1.5 rounded-full bg-genolcare-green flex-shrink-0"
      />
      <span className="font-mono text-[9px] tracking-wider text-genolcare-green/60 select-none">
        PHARMACY ACTIVE · {tick}
      </span>
    </div>
  );
}

/* ─── Time Scrubber ─────────────────────────────────────────────── */
function TimeScrubber() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const TOTAL = 24 * 60;
  const nowMins = now ? now.getHours() * 60 + now.getMinutes() : null;
  const nowPct = nowMins != null ? (nowMins / TOTAL) * 100 : null;

  const hourLabels = [0, 6, 12, 18, 24];

  return (
    <div className="flex flex-col gap-4">
      <p className="font-satoshi text-[10px] tracking-[0.35em] text-white/30 uppercase font-semibold">
        [ Hours ]
      </p>

      {/* Scrubber track */}
      <div className="relative h-5 flex items-center">
        {/* Base track */}
        <div className="absolute inset-x-0 h-[3px] bg-white/8 rounded-full" />

        {/* Operating windows */}
        {HOURS.map(({ days, open, close }) => (
          <div
            key={days}
            className="absolute h-[3px] rounded-full bg-genolcare-green/35"
            style={{
              left: `${(open / TOTAL) * 100}%`,
              width: `${((close - open) / TOTAL) * 100}%`,
            }}
          />
        ))}

        {/* Current time cursor */}
        {nowPct != null && (
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5"
            style={{ left: `${nowPct}%` }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3 h-3 rounded-full bg-genolcare-green shadow-[0_0_12px_rgba(109,190,69,0.9)] border border-white/30"
            />
          </div>
        )}
      </div>

      {/* Hour tick labels */}
      <div className="flex justify-between">
        {hourLabels.map((h) => (
          <span key={h} className="font-mono text-[8px] text-white/18">
            {h.toString().padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Hours list */}
      <ul className="flex flex-col gap-2.5 mt-1" aria-label="Opening hours">
        {HOURS.map(({ days, time, open, close }) => {
          const isActive =
            nowMins != null && nowMins >= open && nowMins < close;
          return (
            <li key={days} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {isActive && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-1 h-1 rounded-full bg-genolcare-green flex-shrink-0"
                  />
                )}
                <span className={`font-satoshi text-xs ${isActive ? 'text-white/60' : 'text-white/30'}`}>
                  {days}
                </span>
              </div>
              <span className={`font-satoshi text-xs ${isActive ? 'text-white/80 font-semibold' : 'text-white/40'}`}>
                {time}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─── Magnetic Map Card ─────────────────────────────────────────── */
function MagneticMapCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rawRotateX = useTransform(mouseY, [-1, 1], [10, -10]);
  const rawRotateY = useTransform(mouseX, [-1, 1], [-10, 10]);
  const rotateX = useSpring(rawRotateX, { stiffness: 200, damping: 28 });
  const rotateY = useSpring(rawRotateY, { stiffness: 200, damping: 28 });

  const glowX = useTransform(mouseX, [-1, 1], ['10%', '90%']);
  const glowY = useTransform(mouseY, [-1, 1], ['10%', '90%']);
  const spotlight = useMotionTemplate`radial-gradient(180px circle at ${glowX} ${glowY}, rgba(109,190,69,0.18), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] cursor-pointer group"
      >
        {/* Grid backdrop */}
        <div
          className="absolute inset-0 bg-white/[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Faux road SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 150"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="0" y1="75" x2="200" y2="75" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
          <line x1="100" y1="0" x2="100" y2="150" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
          <line x1="0" y1="38" x2="140" y2="38" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
          <line x1="58" y1="0" x2="58" y2="75" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
          <line x1="58" y1="112" x2="200" y2="112" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
          <line x1="152" y1="75" x2="152" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
          <rect x="82" y="60" width="36" height="30" rx="5" fill="rgba(109,190,69,0.1)" />
        </svg>

        {/* Cursor spotlight */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ background: spotlight }} />

        {/* Bouncing pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transform: 'translateZ(30px)' }}
            className="flex flex-col items-center"
          >
            <div className="w-4 h-4 rounded-full bg-genolcare-green shadow-[0_0_18px_rgba(109,190,69,0.8)] border-[2px] border-white" />
            <div className="w-px h-5 bg-genolcare-green/50" />
            <div className="w-2 h-1 rounded-full bg-genolcare-green/30 blur-sm" />
          </motion.div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Bottom label + floating CTA */}
        <div
          className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div>
            <p className="font-satoshi text-[9px] tracking-[0.3em] text-white/40 uppercase font-semibold mb-0.5">
              Wuse District
            </p>
            <p className="font-satoshi text-sm font-semibold text-white leading-none">
              Abuja, Nigeria
            </p>
          </div>

          {/* Circular floating CTA */}
          <a
            href="https://maps.google.com/?q=Wuse+District+Abuja+Nigeria"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get directions to Genolcare Pharmacy in Wuse District, Abuja on Google Maps"
            className="shrink-0 w-12 h-12 rounded-full
              bg-white/10 backdrop-blur-xl border border-white/20
              flex items-center justify-center
              hover:bg-genolcare-green hover:border-genolcare-green
              transition-colors duration-300 group/btn"
          >
            <svg
              className="w-4 h-4 text-white group-hover/btn:rotate-45 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M4.5 4.5h15v15" />
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Footer ────────────────────────────────────────────────────── */
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  /* ABUJA liquid scale */
  const abujaScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const abujaY = useTransform(scrollYProgress, [0, 1], ['4%', '-3%']);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <footer
        ref={footerRef}
        className="relative w-full overflow-hidden"
        style={{
          background:
            'linear-gradient(175deg, #050505 0%, #050505 30%, #0a1840 60%, #0F2660 100%)',
        }}
        aria-label="Genolcare Pharmacy site footer"
      >
        {/* Ambient orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-genolcare-blue/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-genolcare-green/8 blur-[100px] pointer-events-none" />

        {/* ── TOP: Liquid ABUJA ──────────────────────────────── */}
        <div className="relative overflow-hidden pt-20 md:pt-28 pb-4">
          <motion.div
            style={{ scale: abujaScale, y: abujaY }}
            className="will-change-transform select-none pointer-events-none"
          >
            <motion.h2
              className="font-satoshi font-black leading-none tracking-tighter text-center px-4"
              style={{
                fontSize: 'clamp(5rem, 19vw, 20rem)',
                backgroundImage:
                  'linear-gradient(135deg, #6DBE45 0%, #1A3B8B 20%, #0a1840 40%, #2A4B9B 60%, #6DBE45 80%, #1A3B8B 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            >
              ABUJA
            </motion.h2>
          </motion.div>

          {/* Eyebrow centred above */}
          <div className="absolute inset-x-0 top-24 md:top-32 flex justify-center pointer-events-none">
            <motion.p
              className="font-satoshi text-[10px] tracking-[0.5em] text-white/25 uppercase font-semibold"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              [ Wuse District · FCT · Nigeria ]
            </motion.p>
          </div>
        </div>

        {/* ── MIDDLE: Four-column info grid ─────────────────── */}
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-10 pb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand + Nav */}
            <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col gap-8 items-center lg:items-start text-center lg:text-left">
              <Image
                src="/genolcare_logo_white.png"
                alt="Genolcare Pharmacy"
                width={160}
                height={80}
                className="h-24 w-auto object-contain"
              />

              <nav aria-label="Footer navigation">
                <ul className="flex flex-col gap-3 items-center lg:items-start">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        aria-label={`Navigate to ${link.label} section`}
                        className="font-satoshi text-sm text-white/35 hover:text-white transition-colors duration-200 tracking-wide"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Uptime ticker */}
              <div className="mt-auto pt-4">
                <UptimeTicker />
              </div>
            </motion.div>

            {/* Address */}
            <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col gap-5 items-center lg:items-start text-center lg:text-left">
              <p className="font-satoshi text-[10px] tracking-[0.35em] text-white/30 uppercase font-semibold">
                [ Location ]
              </p>

              <address className="not-italic font-satoshi flex flex-col gap-2 items-center lg:items-start">
                <p className="text-white font-semibold text-base leading-snug">
                  Genolcare Pharmacy
                </p>
                <p className="text-white/45 text-sm leading-relaxed text-center lg:text-left">
                  Wuse District<br />
                  Abuja, FCT<br />
                  Nigeria
                </p>
              </address>

              <a
                href="https://wa.me/2349123456789"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Genolcare Pharmacy via WhatsApp"
                className="font-satoshi text-sm text-genolcare-green hover:text-genolcare-green/70 transition-colors duration-200 tracking-wide"
              >
                +234 912 345 6789
              </a>

              {/* Contact Us CTA */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center justify-center gap-3 px-7 py-3 rounded-full
                  bg-genolcare-blue text-white font-satoshi font-medium text-sm
                  transition-all duration-300 hover:scale-105 active:scale-95
                  shadow-[0_0_20px_rgba(26,59,139,0.4)] hover:shadow-[0_0_32px_rgba(26,59,139,0.6)]
                  mt-1"
              >
                <span>Contact Us</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </motion.div>

            {/* Time Scrubber */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <TimeScrubber />
            </motion.div>

            {/* Magnetic Map */}
            <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col gap-5">
              <p className="font-satoshi text-[10px] tracking-[0.35em] text-white/30 uppercase font-semibold">
                [ Get Directions ]
              </p>
              <MagneticMapCard />
            </motion.div>

          </div>
        </motion.div>

        {/* ── DIVIDER ───────────────────────────────────────── */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="h-px bg-white/[0.06]" />
        </div>

        {/* ── BOTTOM: Legal + copyright ─────────────────────── */}
        <motion.div
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8
            flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <nav aria-label="Legal navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center sm:justify-start">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-label={link.label}
                    className="font-satoshi text-[11px] text-white/20 hover:text-white/50 transition-colors duration-200 tracking-wide"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="font-satoshi text-[11px] text-white/50 tracking-wide text-center sm:text-right">
            © {new Date().getFullYear()} Genolcare Pharmacy. All rights reserved.
            <span className="mx-2 text-white/[0.08]">·</span>
            <a
              href="https://cybersage.africa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website designed and built by Cybersage"
              className="text-white/25 hover:text-white/50 transition-colors duration-200"
            >
              Built by Cybersage
            </a>
          </p>
        </motion.div>
      </footer>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
