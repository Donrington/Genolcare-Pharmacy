import ConsultingHero from '@/components/ConsultingHero';
import ExpertiseMatrix from '@/components/ExpertiseMatrix';
import DialogueFlow from '@/components/DialogueFlow';
import FellowshipAuthority from '@/components/FellowshipAuthority';
import DiagnosticPulse from '@/components/DiagnosticPulse';
import SecureInsightCTA from '@/components/SecureInsightCTA';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clinical Consultations',
  description: 'Specialized pharmaceutical intelligence and diagnostic clarity.',
};

export default function ConsultationsPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex flex-col">
      <ConsultingHero />
      <ExpertiseMatrix />
      <DialogueFlow />
      <FellowshipAuthority />
      <DiagnosticPulse />
      <SecureInsightCTA />
    </main>
  );
}
