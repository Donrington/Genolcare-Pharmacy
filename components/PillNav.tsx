'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Image from 'next/image';

/* ─── Types ─────────────────────────────────────────────────────── */
interface SubItem {
  label: string;
  href: string;
  description: string;
  iconKey: 'rx' | 'consult' | 'otc' | 'wellness';
}

interface NavItem {
  label: string;
  href: string;
  subItems?: SubItem[];
}

interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
}

/* ─── Service Icons ─────────────────────────────────────────────── */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  rx: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  consult: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
    </svg>
  ),
  otc: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  wellness: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

/* ─── Desktop Dropdown ──────────────────────────────────────────── */
function ServicesDropdown({ subItems }: { subItems: SubItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] z-50"
    >
      {/* Stem */}
      <div className="flex justify-center mb-1">
        <div className="w-px h-3 bg-white/40" />
      </div>

      <div className="rounded-2xl overflow-hidden
        bg-white/80 backdrop-blur-2xl border border-white/60
        shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.7)]
        p-2"
      >
        {/* Header */}
        <div className="px-3 py-2 mb-1">
          <p className="font-satoshi text-[9px] tracking-[0.35em] text-gray-400 uppercase font-semibold">
            [ Our Services ]
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {subItems.map((sub, i) => (
            <motion.div
              key={sub.href}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={sub.href}
                className="group flex items-start gap-3 p-3 rounded-xl
                  hover:bg-genolcare-blue/5 transition-all duration-200"
              >
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-genolcare-blue/8 flex items-center justify-center
                  text-genolcare-blue group-hover:bg-genolcare-blue group-hover:text-white
                  transition-all duration-200 flex-shrink-0">
                  {SERVICE_ICONS[sub.iconKey]}
                </span>
                <div>
                  <p className="font-satoshi text-sm font-semibold text-gray-900 leading-tight mb-0.5 group-hover:text-genolcare-blue transition-colors duration-200">
                    {sub.label}
                  </p>
                  <p className="font-satoshi text-[11px] text-gray-400 leading-snug">
                    {sub.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-1 pt-2 border-t border-gray-100/80 px-3 pb-1">
          <Link
            href="/services"
            className="flex items-center justify-between w-full py-2 group"
          >
            <span className="font-satoshi text-[11px] text-gray-400 tracking-wide">
              View all services
            </span>
            <svg
              className="w-3.5 h-3.5 text-gray-400 group-hover:text-genolcare-blue group-hover:translate-x-0.5 transition-all duration-200"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Desktop Nav Item ──────────────────────────────────────────── */
function DesktopNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  if (!item.subItems) {
    return (
      <Link href={item.href}>
        <motion.button className="relative px-4 py-2 rounded-full text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-slate-900">
          {isActive && (
            <motion.div
              layoutId="active-bg"
              className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className={`font-satoshi ${isActive ? 'text-slate-900 font-semibold' : ''}`}>
            {item.label}
          </span>
        </motion.button>
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        className="relative flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-slate-900"
      >
        {isActive && (
          <motion.div
            layoutId="active-bg"
            className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span className={`font-satoshi ${isActive ? 'text-slate-900 font-semibold' : ''}`}>
          {item.label}
        </span>
        <motion.svg
          className="w-3 h-3 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && <ServicesDropdown subItems={item.subItems} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mobile Sub-menu ────────────────────────────────────────────── */
function MobileSubMenu({ subItems }: { subItems: SubItem[] }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ overflow: 'hidden' }}
    >
      <div className="flex flex-col gap-2 pt-3 pb-1 pl-4">
        {subItems.map((sub, i) => (
          <motion.div
            key={sub.href}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={sub.href}
              className="flex items-center gap-3 py-2 group"
            >
              <span className="w-7 h-7 rounded-lg bg-genolcare-blue/10 flex items-center justify-center text-genolcare-blue flex-shrink-0">
                {SERVICE_ICONS[sub.iconKey]}
              </span>
              <span className="font-satoshi text-xl font-semibold text-slate-500 group-hover:text-genolcare-blue transition-colors duration-200">
                {sub.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── PillNav ────────────────────────────────────────────────────── */
export default function PillNav({ logo, logoAlt = 'Logo', items }: PillNavProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const navItems = items.slice(0, -1);
  const ctaItem = items[items.length - 1];

  return (
    <>
      {/* ── Desktop Nav ─────────────────────────────────────── */}
      <LayoutGroup>
        <nav className="hidden md:fixed md:top-8 md:left-1/2 md:transform md:-translate-x-1/2 md:z-50 md:flex md:items-center md:gap-2 md:p-2 md:px-4 md:rounded-full md:backdrop-blur-2xl md:bg-white/40 md:border md:border-white/60 md:shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          {logo && (
            <Link href="/" className="flex items-center justify-center flex-shrink-0">
              <Image src={logo} alt={logoAlt} width={56} height={56} className="w-11 h-11 object-contain" />
            </Link>
          )}

          <div className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <DesktopNavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>

          {ctaItem && (
            <Link href={ctaItem.href}>
              <button className="ml-3 px-5 py-2 rounded-full bg-genolcare-blue text-white text-sm font-medium font-satoshi shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                {ctaItem.label}
              </button>
            </Link>
          )}
        </nav>
      </LayoutGroup>

      {/* ── Mobile Nav Bar ──────────────────────────────────── */}
      <nav className="md:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between w-11/12 max-w-xs p-2 px-3 rounded-full backdrop-blur-2xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        {logo && (
          <Link href="/" className="flex items-center justify-center flex-shrink-0">
            <Image src={logo} alt={logoAlt} width={56} height={56} className="w-10 h-10 object-contain" />
          </Link>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col justify-center items-center gap-1.5 w-9 h-9"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-slate-600 rounded"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={isMenuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
            className="w-4 h-0.5 bg-slate-600 rounded"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-slate-600 rounded"
            transition={{ duration: 0.3 }}
          />
        </button>
      </nav>

      {/* ── Mobile Full-Screen Overlay ───────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 bg-white/92 backdrop-blur-3xl z-40 overflow-y-auto"
          >
            <div className="w-full min-h-full flex flex-col items-center justify-center gap-2 px-8 py-24">
              {items.map((item, index) => {
                const isActive = pathname === item.href;
                const hasSubItems = !!item.subItems;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-xs"
                  >
                    {hasSubItems ? (
                      <div>
                        <button
                          onClick={() => setMobileServicesOpen((p) => !p)}
                          className="w-full flex items-center justify-between py-1"
                        >
                          <span className={`font-satoshi text-4xl font-bold transition-colors duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-genolcare-blue to-genolcare-green bg-clip-text text-transparent'
                              : 'text-slate-600'
                          }`}>
                            {item.label}
                          </span>
                          <motion.svg
                            className="w-5 h-5 text-gray-400 flex-shrink-0"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>

                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <MobileSubMenu
                              subItems={item.subItems!}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block font-satoshi text-4xl font-bold transition-colors duration-300 py-1 ${
                          isActive
                            ? 'bg-gradient-to-r from-genolcare-blue to-genolcare-green bg-clip-text text-transparent'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              {/* Bottom tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="font-satoshi text-[10px] tracking-[0.4em] text-gray-300 uppercase mt-8"
              >
                Clinical Excellence · Precision Care
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
