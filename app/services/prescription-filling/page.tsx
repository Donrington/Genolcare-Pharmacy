import type { Metadata } from 'next';
import PrecisionHero from '@/components/PrecisionHero';
import VerificationMesh from '@/components/VerificationMesh';
import ColdChainSentinel from '@/components/ColdChainSentinel';
import SpecialistOversight from '@/components/SpecialistOversight';
import FinalPreparationCraft from '@/components/FinalPreparationCraft';
import DigitalBridgeCTA from '@/components/DigitalBridgeCTA';

export const metadata: Metadata = {
  title: 'Precision Prescription Fulfillment',
  description:
    'Specialist-led prescription filling with multi-tier verification by Eugene Apasi Eromosele. Cold-chain capable. 15+ years of infectious disease pharmacology expertise.',
};

export default function PrescriptionFillingPage() {
  return (
    <main>
      <PrecisionHero />
      <VerificationMesh />
      <ColdChainSentinel />
      <SpecialistOversight />
      <FinalPreparationCraft />
      <DigitalBridgeCTA />
    </main>
  );
}
