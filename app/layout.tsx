import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Caveat } from 'next/font/google';
import PillNav from '@/components/PillNav';
import Footer from '@/components/Footer';
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

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '600', '700'],
});

const BASE_URL = 'https://genolcare-pharmacy.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'Genolcare Pharmacy — Clinical Excellence. Precision Care. | Abuja, Nigeria',
    template: '%s | Genolcare Pharmacy',
  },

  description:
    "Genolcare Pharmacy is Abuja's premier specialist pharmaceutical practice — founded by Eugene Apasi Eromosele with 15+ years in infectious disease pharmacology. Genuine medications, expert clinical consultations, cold-chain handling, and precision prescription fulfillment in Dakwo, Lokogoma, Abuja FCT.",

  keywords: [
    'pharmacy Abuja',
    'pharmacist Abuja Nigeria',
    'prescription filling Abuja',
    'clinical consultation Abuja',
    'specialist pharmacy Nigeria',
    'genuine medications Abuja',
    'Dakwo pharmacy Abuja',
    'Lokogoma pharmacy Abuja',
    'infectious disease pharmacology Nigeria',
    'WAPCP Fellow pharmacist',
    'FPCPharm Abuja',
    'cold chain medications Abuja',
    'OTC medications Nigeria',
    'wellness products Abuja',
    'Genolcare Pharmacy',
    'community pharmacy FCT',
    'antimicrobial stewardship Nigeria',
  ],

  authors: [{ name: 'Genolcare Pharmacy', url: BASE_URL }],
  creator: 'Genolcare Pharmacy',
  publisher: 'Genolcare Pharmacy',

  category: 'Healthcare & Pharmacy',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/genolcare_logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/genolcare_logo.png', type: 'image/png' },
    ],
    shortcut: '/genolcare_logo.png',
  },

  openGraph: {
    type: 'website',
    locale: 'en_NG',
    alternateLocale: 'en_US',
    url: BASE_URL,
    siteName: 'Genolcare Pharmacy',
    title: 'Genolcare Pharmacy — Clinical Excellence. Precision Care.',
    description:
      'Abuja\'s premier specialist pharmacy. WAPCP-certified clinical consultations, genuine medications, precision prescription fulfillment, and cold-chain handling — 15+ years of trusted expertise in Dakwo, Lokogoma, Abuja FCT.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Genolcare Pharmacy — Clinical Excellence. Precision Care. Abuja, Nigeria.',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@genolcare',
    creator: '@genolcare',
    title: 'Genolcare Pharmacy — Clinical Excellence. Precision Care.',
    description:
      'Abuja\'s premier specialist pharmacy. 15+ years of expertise, WAPCP-certified consultations, and 100% genuine medications. Dakwo, Lokogoma, Abuja FCT.',
    images: [
      {
        url: '/api/og',
        alt: 'Genolcare Pharmacy — Clinical Excellence. Precision Care.',
      },
    ],
  },

  alternates: {
    canonical: BASE_URL,
  },

  verification: {
    google: '',
  },

  other: {
    'geo.region': 'NG-FC',
    'geo.placename': 'Abuja',
    'geo.position': '9.0028;7.4478',
    'ICBM': '9.0028, 7.4478',
    'og:locality': 'Abuja',
    'og:region': 'FCT',
    'og:country-name': 'Nigeria',
    'business:contact_data:locality': 'Abuja',
    'business:contact_data:region': 'FCT',
    'business:contact_data:country_name': 'Nigeria',
    'business:contact_data:phone_number': '+234 912 345 6789',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${caveat.variable}`}>
      <head>
        <link rel="stylesheet" href="/lineicons/lineicons-free.css" />
        <link rel="canonical" href={BASE_URL} />
        <meta name="theme-color" content="#0F2660" />
        <meta name="msapplication-TileColor" content="#0F2660" />
        <meta name="msapplication-TileImage" content="/genolcare_logo.png" />
        <meta name="application-name" content="Genolcare Pharmacy" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Genolcare" />
        <meta name="format-detection" content="telephone=yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': ['Pharmacy', 'LocalBusiness', 'MedicalBusiness'],
                  '@id': `${BASE_URL}/#pharmacy`,
                  name: 'Genolcare Pharmacy',
                  alternateName: 'Genolcare Pharmacy & Clinical Consulting',
                  description:
                    'Specialist pharmaceutical practice in Dakwo, off Sunnyvale Junction, Lokogoma, Abuja FCT, Nigeria. Founded by Eugene Apasi Eromosele with over 15 years of expertise in infectious disease pharmacology.',
                  url: BASE_URL,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${BASE_URL}/genolcare_logo.png`,
                    width: 200,
                    height: 200,
                  },
                  image: `${BASE_URL}/api/og`,
                  telephone: '+234912345678',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Dakwo, off Sunnyvale Junction, Lokogoma',
                    addressLocality: 'Abuja',
                    addressRegion: 'FCT',
                    addressCountry: 'NG',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 9.0028,
                    longitude: 7.4478,
                  },
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                      opens: '08:30',
                      closes: '21:30',
                    },
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: 'Sunday',
                      opens: '15:00',
                      closes: '20:30',
                    },
                  ],
                  priceRange: 'NGN',
                  currenciesAccepted: 'NGN',
                  paymentAccepted: 'Cash, Bank Transfer',
                  hasMap: 'https://maps.google.com/?q=Dakwo+Sunnyvale+Junction+Lokogoma+Abuja+Nigeria',
                  sameAs: [],
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '87',
                    bestRating: '5',
                  },
                  founder: {
                    '@type': 'Person',
                    name: 'Eugene Apasi Eromosele',
                    jobTitle: 'Clinical Pharmacist',
                    hasCredential: ['FPCPharm', 'WAPCP Fellow'],
                    knowsAbout: ['Infectious Disease Pharmacology', 'Antimicrobial Stewardship', 'Clinical Pharmacy'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': `${BASE_URL}/#website`,
                  url: BASE_URL,
                  name: 'Genolcare Pharmacy',
                  description: 'Clinical Excellence. Precision Care.',
                  publisher: { '@id': `${BASE_URL}/#pharmacy` },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'WebPage',
                  '@id': `${BASE_URL}/#webpage`,
                  url: BASE_URL,
                  name: 'Genolcare Pharmacy — Clinical Excellence. Precision Care.',
                  isPartOf: { '@id': `${BASE_URL}/#website` },
                  about: { '@id': `${BASE_URL}/#pharmacy` },
                  description:
                    'Abuja\'s premier specialist pharmacy offering precision prescription filling, WAPCP-certified clinical consultations, genuine OTC medications, and curated wellness products.',
                  breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                      {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: BASE_URL,
                      },
                    ],
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <PillNav />
        {children}
        <Footer />
        <BackToTop />
        <ClinicalAIOverlay />
      </body>
    </html>
  );
}
