'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Our Process', href: '/#process' },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
];

const SERVICES = [
  { label: 'Prescription Filling', desc: 'Specialist-led precision dispensing with multi-tier verification.', href: '/services/prescription-filling' },
  { label: 'Clinical Consulting', desc: 'One-on-one sessions with Eugene Apasi Eromosele — FPCPharm, WAPCP Fellow.', href: '/services/consultations' },
  { label: 'OTC Medications', desc: 'Genuine over-the-counter medications for everyday care.', href: '/services/otc-medications' },
  { label: 'Wellness Products', desc: 'Curated vitamins and premium wellness essentials.', href: '/services' },
];

/* ── Logo ─────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/genolcare_logo_white.png"
        alt="Genolcare"
        width={120}
        height={40}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}

/* ── Desktop Services Dropdown ───────────────────────────────────── */
function ServicesDropdown({ open }: { open: boolean }) {
  return (
    <div
      className={[
        'absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[520px] origin-top',
        'transition-all duration-200 ease-out',
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
      ].join(' ')}
    >
      <div
        className="rounded-3xl p-2.5 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        style={{ background: 'rgba(8,16,38,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {SERVICES.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group block rounded-2xl p-3.5 hover:bg-white/[0.05] transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] font-bold text-white">{s.label}</span>
                <span
                  className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition"
                  style={{ color: '#6DBE45' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
              <p className="m-0 text-[12px] leading-snug text-white/55">{s.desc}</p>
            </Link>
          ))}
        </div>
        <Link
          href="/services"
          className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] font-semibold text-white hover:bg-white/[0.04] transition"
          style={{ background: 'rgba(109,190,69,0.08)', border: '1px solid rgba(109,190,69,0.2)' }}
        >
          <span>
            View all services <span className="text-white/50 font-normal">— including private consults</span>
          </span>
          <span style={{ color: '#6DBE45' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ── Contact Modal ────────────────────────────────────────────────── */
function NavContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center px-5" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'rgba(5,14,38,0.7)' }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[480px] rounded-3xl p-7 border border-white/10"
        style={{
          background: 'linear-gradient(180deg, #0e1f48 0%, #081434 100%)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center text-white/60 hover:text-white hover:bg-white/10 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="text-[11px] uppercase tracking-[0.16em] font-bold mb-2" style={{ color: '#6DBE45' }}>
          Get in touch
        </div>
        <h3 className="m-0 text-[28px] font-black leading-tight text-white">Speak to a specialist</h3>
        <p className="mt-2 mb-5 text-[14px] text-white/60 leading-relaxed">
          Drop your details and our team in Abuja will respond within 2 hours. Or call us directly.
        </p>

        <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <input
            type="text"
            placeholder="Full name"
            className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-[14px] focus:outline-none transition"
            style={{ '--tw-ring-color': '#6DBE45' } as React.CSSProperties}
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-[14px] focus:outline-none transition"
          />
          <textarea
            rows={3}
            placeholder="How can we help?"
            className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-[14px] focus:outline-none transition resize-none"
          />
          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full font-bold text-sm border transition hover:-translate-y-px"
            style={{ background: '#6DBE45', color: '#0a1632', borderColor: '#6DBE45' }}
          >
            Send message
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 flex justify-between text-[12px] text-white/55">
          <span>📞 +234 800 GENOL</span>
          <span>✉ care@genolcare.ng</span>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile Overlay ───────────────────────────────────────────────── */
function MobileOverlay({
  onClose,
  openContact,
}: {
  onClose: () => void;
  openContact: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    // Trigger enter animations on next frame
    const id = requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] animate-[fadeIn_0.25s_ease]"
      style={{ background: 'linear-gradient(180deg, #0a1838 0%, #050e26 100%)' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(700px 500px at 80% 0%, rgba(109,190,69,0.18), transparent 60%), radial-gradient(700px 500px at 20% 100%, rgba(26,59,139,0.4), transparent 60%)',
        }}
      />

      <div className="relative h-full flex flex-col px-7 pt-7 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-11 h-11 rounded-full grid place-items-center text-white border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center -mt-10">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((l, i) => {
              const isServices = l.label === 'Services';
              return (
                <li
                  key={l.label}
                  className={[
                    'border-b border-white/[0.08] transition-all',
                    mounted ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
                  ].join(' ')}
                  style={{ transitionDelay: mounted ? `${100 + i * 60}ms` : '0ms', transitionDuration: '400ms' }}
                >
                  {isServices ? (
                    <>
                      <button
                        onClick={() => setServicesOpen((v) => !v)}
                        className="w-full flex items-center justify-between py-4 text-left text-white"
                      >
                        <span
                          className="font-black tracking-tight"
                          style={{ fontSize: 'clamp(34px, 9vw, 52px)', lineHeight: 1 }}
                        >
                          {l.label}
                        </span>
                        <span
                          className="w-9 h-9 rounded-full grid place-items-center transition-transform"
                          style={{
                            border: '1px solid rgba(255,255,255,0.15)',
                            transform: servicesOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                            color: servicesOpen ? '#6DBE45' : 'white',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </button>
                      <div
                        className="grid transition-all duration-300 ease-out overflow-hidden"
                        style={{ gridTemplateRows: servicesOpen ? '1fr' : '0fr', opacity: servicesOpen ? 1 : 0 }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="pb-4 flex flex-col gap-2">
                            {SERVICES.map((s) => (
                              <Link
                                key={s.label}
                                href={s.href}
                                onClick={onClose}
                                className="rounded-2xl p-3.5 bg-white/[0.04] border border-white/[0.06] block"
                              >
                                <div className="text-[15px] font-bold text-white mb-0.5">{s.label}</div>
                                <div className="text-[12px] leading-snug text-white/55">{s.desc}</div>
                              </Link>
                            ))}
                            <Link
                              href="/services"
                              onClick={onClose}
                              className="px-3.5 py-2 text-[13px] font-semibold"
                              style={{ color: '#6DBE45' }}
                            >
                              View all services →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-4 text-white group"
                    >
                      <span
                        className="font-black tracking-tight transition-transform group-hover:translate-x-1"
                        style={{ fontSize: 'clamp(34px, 9vw, 52px)', lineHeight: 1 }}
                      >
                        {l.label}
                      </span>
                      <span
                        className="w-9 h-9 rounded-full grid place-items-center text-white/40 group-hover:text-[#6DBE45] transition"
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Contact CTA */}
          <button
            onClick={() => { onClose(); setTimeout(openContact, 200); }}
            className={[
              'mt-7 w-full inline-flex items-center justify-center gap-2 h-14 rounded-full font-bold text-base border transition',
              mounted ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
            ].join(' ')}
            style={{
              background: '#6DBE45',
              color: '#0a1632',
              borderColor: '#6DBE45',
              transitionDelay: mounted ? `${100 + NAV_LINKS.length * 60}ms` : '0ms',
              transitionDuration: '400ms',
            }}
          >
            Contact us
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </nav>

        {/* Footer */}
        <div className="flex justify-between text-[11px] uppercase tracking-[0.16em] text-white/40 font-semibold">
          <span>Abuja, NG</span>
          <span>Open 24/7</span>
        </div>
      </div>
    </div>
  );
}

/* ── PillNav ──────────────────────────────────────────────────────── */
export default function PillNav() {
  const pathname = usePathname();
  const [servicesHover, setServicesHover] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showServices = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setServicesHover(true);
  };
  const hideServices = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setServicesHover(false), 160);
  };

  const isActive = (href: string) => pathname === href || (href === '/' && pathname === '/');

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2.5 max-w-full">

          {/* Logo pill — desktop only */}
          <div
            className="hidden md:flex items-center h-12 px-4 rounded-full border border-white/10"
            style={{ background: 'rgba(8,16,38,0.85)', backdropFilter: 'blur(14px)' }}
          >
            <Logo />
          </div>

          {/* Main nav pill — desktop only */}
          <nav
            className="hidden md:flex items-center h-12 px-1.5 rounded-full border border-white/10 relative"
            style={{ background: 'rgba(8,16,38,0.85)', backdropFilter: 'blur(14px)' }}
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((l, i) => {
              const isServices = l.label === 'Services';
              const active = isActive(l.href);
              return (
                <div key={l.label} className="flex items-center">
                  {i > 0 && <span className="w-px h-4 bg-white/10" aria-hidden="true" />}
                  <div
                    className="relative"
                    onMouseEnter={isServices ? showServices : undefined}
                    onMouseLeave={isServices ? hideServices : undefined}
                  >
                    <Link
                      href={l.href}
                      className={[
                        'inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-medium transition',
                        active ? 'text-[#0a1632]' : 'text-white/75 hover:text-white',
                      ].join(' ')}
                      style={active ? { background: '#6DBE45' } : undefined}
                    >
                      {l.label}
                      {isServices && (
                        <svg
                          width="10" height="10" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth={2.6} strokeLinecap="round"
                          className="transition-transform"
                          style={{ transform: servicesHover ? 'rotate(180deg)' : 'rotate(0)' }}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      )}
                    </Link>
                    {isServices && <ServicesDropdown open={servicesHover} />}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* CTA pill — desktop only */}
          <div className="hidden md:block">
            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-[13px] font-bold border transition hover:-translate-y-px relative overflow-hidden"
              style={{ background: '#6DBE45', color: '#0a1632', borderColor: '#6DBE45' }}
            >
              <span className="relative">Contact</span>
              <svg className="relative" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* Mobile pill bar — hidden while overlay is open */}
          <div
            className={`md:hidden flex items-center justify-between gap-3 h-12 pl-4 pr-1.5 rounded-full border border-white/10 w-[calc(100vw-2rem)] max-w-sm ${mobileOpen ? 'hidden' : ''}`}
            style={{ background: 'rgba(8,16,38,0.85)', backdropFilter: 'blur(14px)' }}
          >
            <Logo />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="w-9 h-9 rounded-full grid place-items-center shrink-0"
              style={{ background: '#6DBE45', color: '#0a1632' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {mobileOpen && (
        <MobileOverlay
          onClose={() => setMobileOpen(false)}
          openContact={() => setContactOpen(true)}
        />
      )}
      <NavContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
