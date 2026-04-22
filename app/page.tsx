import HeroSection from '@/components/HeroSection';
import EthosSection from '@/components/EthosSection';
import ServicesShowcase from '@/components/ServicesShowcase';
import ProcessTimeline from '@/components/ProcessTimeline';
import FounderAuthority from '@/components/FounderAuthority';
import FAQSection from '@/components/FAQSection';

export default function Home() {
  return (
    <div className="relative z-10">
      <HeroSection />
      <EthosSection />
      <ServicesShowcase />
      <ProcessTimeline />
      <FounderAuthority />
      <FAQSection />
    </div>
  );
}
