import type { Metadata } from 'next';
import PrecisionHero from '@/components/PrecisionHero';

export const metadata: Metadata = {
  title: 'Precision Prescription Fulfillment',
  description:
    'Specialist-led prescription filling with multi-tier verification by WAPCP-certified clinical Fellows. Cold-chain capable. 15+ years of infectious disease pharmacology expertise.',
};

export default function PrescriptionFillingPage() {
  return (
    <main>
      <PrecisionHero />
    </main>
  );
}
