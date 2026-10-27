import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ProgramsSection from '../sections/ProgramsSection';
import SessionsPreview from '../sections/SessionsPreview';
import AmbassadorPreview from '../sections/AmbassadorPreview';
import WhyChooseUs from '../sections/WhyChooseUs';
import StatisticsSection from '../sections/StatisticsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import PartnersSection from '../sections/PartnersSection';
import StayUpdated from '../sections/StayUpdated';
import CTASection from '../sections/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProgramsSection />
      <SessionsPreview />
      <AmbassadorPreview />
      <AboutSection />
      <WhyChooseUs />
      <StatisticsSection />
      <TestimonialsSection />
      <StayUpdated />
      <PartnersSection />
      <CTASection />
    </>
  );
}
