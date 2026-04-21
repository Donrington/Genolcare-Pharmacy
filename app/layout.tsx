import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Dancing_Script } from 'next/font/google';
import PillNav from '@/components/PillNav';
import BackToTop from '@/components/BackToTop';
import ClinicalAIOverlay from '@/components/ClinicalAIOverlay';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Genolcare - Clinical Excellence. Precision Care.',
  description:
    'Elevating community health in Abuja with 15+ years of specialist expertise. Genuine medications, expert consultations, and seamless service.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${dancingScript.variable}`}>
      <head>
        <link rel="stylesheet" href="/lineicons/lineicons-free.css" />
      </head>
      <body>
        <PillNav
          logo="/genolcare_logo.png"
          logoAlt="Genolcare Logo"
          items={[
            { label: 'Home', href: '/' },
            {
              label: 'Services',
              href: '/services',
              subItems: [
                {
                  label: 'Prescription Filling',
                  href: '/services/prescription-filling',
                  description: 'Specialist-led precision dispensing with multi-tier verification.',
                  iconKey: 'rx',
                },
                {
                  label: 'Health Consultations',
                  href: '/services/consultations',
                  description: 'One-on-one sessions with WAPCP-certified clinical Fellows.',
                  iconKey: 'consult',
                },
                {
                  label: 'OTC Medications',
                  href: '/services/otc-medications',
                  description: 'Genuine over-the-counter medications for everyday care.',
                  iconKey: 'otc',
                },
                {
                  label: 'Wellness Products',
                  href: '/services/wellness',
                  description: 'Curated vitamins and premium wellness essentials.',
                  iconKey: 'wellness',
                },
              ],
            },
            { label: 'Our Process', href: '/#process' },
            { label: 'About', href: '/#about' },
            { label: 'FAQ', href: '/#faq' },
            { label: 'Contact', href: '/contact' },
          ]}
        />
        {children}
        <BackToTop />
        <ClinicalAIOverlay />
      </body>
    </html>
  );
}
