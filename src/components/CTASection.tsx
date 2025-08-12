import React from 'react';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  return (
    <section id="cta-section" className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Start Feeling Better Today.
        </h2>
        <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
          Join thousands already using Safe Haven to feel heard, supported, and empowered.
        </p>
        <Button 
          size="lg" 
          className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Create Your Free Account Now
        </Button>
      </div>
    </section>
  );
};

export default CTASection;