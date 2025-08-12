import React from 'react';
import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';
import TestimonialsSection from './TestimonialsSection';
import VideoSection from './VideoSection';
import BenefitsSection from './BenefitsSection';
import FeaturesSection from './FeaturesSection';
import FAQSection from './FAQSection';
import FounderSection from './FounderSection';
import CTASection from './CTASection';

const YouMatterLanding: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16"> {/* Add padding-top to account for fixed header */}
        <HeroSection />
        <TestimonialsSection />
        <VideoSection />
        <BenefitsSection />
        <FeaturesSection />
        <FAQSection />
        <FounderSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default YouMatterLanding;