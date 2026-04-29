'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';
import Carousel from './Carousel';

const PRIMARY = '#1A3B8B';
const ACCENT = '#6DBE45';

const TRUST_CARDS = [
  {
    img: '/trust-1.png',
    subtitle: 'Certified excellence in healthcare',
    title: 'Licensed pharmaceutical care provider',
    meta: 'NAFDAC & PCN registered',
  },
  {
    img: '/trust-2.png',
    subtitle: 'Trusted medical professionals',
    title: 'Expert clinical team with specialist credentials',
    meta: 'Board-certified across 8 specialties',
  },
  {
    img: '/trust-3.png',
    subtitle: 'Always here when you need us',
    title: '24/7 professional support available',
    meta: 'Telehealth + home delivery',
  },
];

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden px-4 sm:px-6 md:px-8 lg:px-14 pt-20 sm:pt-24 pb-10 sm:pb-14 text-white font-sans">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero_vid2.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(1100px 680px at 78% 18%, rgba(109,190,69,0.12), transparent 60%),
              radial-gradient(900px 700px at 12% 90%, rgba(26,59,139,0.5), transparent 65%),
              linear-gradient(180deg, rgba(10,24,56,0.88) 0%, rgba(8,20,52,0.84) 50%, rgba(5,14,38,0.90) 100%)
            `,
          }}
        />

        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at 50% 40%, black 50%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 50%, transparent 90%)',
          }}
        />

        {/* EKG line — hidden on mobile */}
        <svg
          className="hidden sm:block absolute left-0 right-0 top-[55%] h-[120px] opacity-35 pointer-events-none w-full"
          viewBox="0 0 1600 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,60 L380,60 L420,60 L440,30 L470,90 L500,40 L530,75 L560,60 L1080,60 L1110,30 L1140,95 L1170,40 L1200,60 L1600,60"
            fill="none"
            stroke={ACCENT}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Social links — hidden on mobile to avoid overlap */}
        <div className="hidden md:flex absolute right-7 lg:right-14 top-[148px] flex-col gap-3.5 z-[4]">
          {(['instagram', 'facebook', 'linkedin', 'twitter'] as const).map((s) => (
            <a
              key={s}
              href="#"
              aria-label={s}
              className="w-[30px] h-[30px] grid place-items-center rounded-lg text-white/70 hover:text-white transition"
            >
              {s === 'instagram' && (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.7}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              )}
              {s === 'facebook' && (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M13 22v-8h3l1-4h-4V7.5c0-1.1.4-2 2-2h2V2h-3c-3 0-4.5 1.8-4.5 4.5V10H7v4h2.5v8H13z" />
                </svg>
              )}
              {s === 'linkedin' && (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M4 4h4v4H4V4zm0 6h4v10H4V10zm6 0h4v1.6c.6-1 1.8-2 3.6-2 3 0 4.4 1.8 4.4 5V20h-4v-4.6c0-1.4-.6-2.4-2-2.4s-2 1-2 2.4V20h-4V10z" />
                </svg>
              )}
              {s === 'twitter' && (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18 4h2.7l-6 6.8L22 20h-5.5l-4.3-5.6L7 20H4.3l6.4-7.3L4 4h5.6l3.9 5.1L18 4z" />
                </svg>
              )}
            </a>
          ))}
        </div>

        {/* Info strip */}
        <div className="relative z-[4] flex items-start justify-between gap-4 mt-6 sm:mt-8 md:mt-10 flex-col md:flex-row">
          {/* Patient count badges */}
          <div className="flex items-center gap-3">
            <div className="flex" aria-hidden="true">
              {[
                { label: 'DR', grad: `linear-gradient(135deg, ${PRIMARY}, #34d399)` },
                { label: 'RN', grad: `linear-gradient(135deg, ${ACCENT}, #34d399)` },
                { label: 'MD', grad: `linear-gradient(135deg, #67e8f9, ${PRIMARY})` },
                { label: 'PH', grad: `linear-gradient(135deg, ${PRIMARY}, #34d399)` },
              ].map((d, idx) => (
                <div
                  key={idx}
                  className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full border-2 border-[#0a1838] -ml-2 sm:-ml-2.5 first:ml-0 grid place-items-center text-white text-[10px] sm:text-[11px] font-bold"
                  style={{ background: d.grad }}
                >
                  {d.label}
                </div>
              ))}
            </div>
            <div className="text-[12px] sm:text-[13px] leading-snug text-white/75">
              <b className="text-white font-bold block">12,400+ patients</b>
              served across Abuja
            </div>
          </div>

          {/* Consultation card */}
          <div className="w-full md:w-[380px] bg-white/[0.04] border border-white/10 rounded-[18px] py-3.5 sm:py-4 px-4 sm:px-5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2 gap-2">
              <h4 className="m-0 text-sm sm:text-base font-bold">Need a consultation?</h4>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] shrink-0"
                style={{ color: '#34d399' }}
              >
                <span className="w-[7px] h-[7px] rounded-full animate-pulse" style={{ background: '#34d399' }} />
                Open now
              </span>
            </div>
            <p className="m-0 text-[13px] leading-relaxed text-white/70">
              Speak with a licensed specialist today. Walk-ins, telehealth, and home delivery — all from one trusted clinic.{' '}
              <button
                onClick={() => setIsModalOpen(true)}
                className="font-semibold bg-transparent border-0 p-0 cursor-pointer"
                style={{ color: ACCENT }}
              >
                Contact us
              </button>
            </p>
          </div>
        </div>

        {/* Centerpiece */}
        <div className="relative z-[3] text-center mt-8 sm:mt-12 md:mt-[72px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] sm:text-[12px] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-white/75 mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
            15+ years • Abuja • since 2010
          </div>

          {/* Headline */}
          <h1
            className="m-0 mx-auto max-w-[1100px] font-black leading-[1.02] tracking-[-0.02em] px-2 sm:px-0"
            style={{ fontSize: 'clamp(36px, 8.5vw, 108px)' }}
          >
            <span
              className="inline-block rounded-full"
              style={{
                background: PRIMARY,
                color: '#fff',
                padding: '0.05em 0.36em 0.13em',
                boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.06), 0 12px 30px ${PRIMARY}73`,
              }}
            >
              Clinical
            </span>{' '}
            Excellence
            <br />
            Precision{' '}
            <span
              className="inline-block rounded-full"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, #4fa030)`,
                color: '#0a1632',
                padding: '0.05em 0.36em 0.13em',
                boxShadow: `0 12px 30px ${ACCENT}66`,
              }}
            >
              Care
            </span>
            <span
              className="block font-semibold italic mt-2 sm:mt-3.5"
              style={{
                fontFamily: 'var(--font-dancing-script), cursive',
                color: ACCENT,
                fontSize: 'clamp(18px, 3.8vw, 54px)',
                transform: 'rotate(-2deg)',
              }}
            >
              A legacy of trusted expertise
            </span>
          </h1>

          {/* Body + CTA */}
          <div className="mt-6 sm:mt-8 mx-auto max-w-[700px] flex flex-col items-center gap-5 sm:gap-6 px-1 sm:px-0">
            <p className="m-0 text-[15px] sm:text-[17px] leading-relaxed text-white/75">
              Elevating community health in Abuja with{' '}
              <span className="text-white font-semibold">15+ years</span> of specialist expertise.
              Genuine medications, expert consultations, and seamless service.
            </p>
            <div className="flex gap-3 sm:gap-3.5 items-center flex-wrap justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 h-[46px] sm:h-[42px] px-6 sm:px-[18px] rounded-full font-bold text-sm cursor-pointer border transition active:scale-95 hover:-translate-y-px"
                style={{ background: ACCENT, color: '#0a1632', borderColor: ACCENT }}
              >
                Contact Us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <span className="text-[13px] text-white/55">
                <b className="text-white font-semibold">Avg reply</b> · under 2 hours
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="relative z-[4] flex items-end justify-between gap-6 mt-10 sm:mt-14 md:mt-[72px] flex-col md:flex-row">
          {/* Scroll indicator — hidden on mobile */}
          <div className="hidden md:flex flex-col items-start gap-2.5 text-white/60 text-[12px] tracking-[0.22em] uppercase">
            Scroll
            <div
              className="w-px h-16 relative overflow-hidden"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)' }}
              aria-hidden="true"
            >
              <span
                className="absolute top-0 left-0 w-full h-6"
                style={{ background: ACCENT, animation: 'scrollMove 1.8s ease-in-out infinite' }}
              />
            </div>
          </div>

          <Carousel cards={TRUST_CARDS} autoRotate={true} accent={ACCENT} />
        </div>

        {/* Star decoration — hidden on mobile */}
        <div
          className="hidden md:grid absolute right-7 lg:right-14 bottom-14 w-14 h-14 place-items-center text-white/35"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2z" />
          </svg>
        </div>
      </section>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
