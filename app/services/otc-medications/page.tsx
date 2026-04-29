import type { Metadata } from 'next';
import HeroOTC from '@/components/HeroOTC';

export const metadata: Metadata = {
  title: 'OTC Medications',
  description:
    'Genuine over-the-counter medications sourced and verified by Eugene Apasi Eromosele. Fast turnaround. NAFDAC-approved. Dakwo, Lokogoma, Abuja.',
};

export default function OTCMedicationsPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <HeroOTC />
    </main>
  );
}
