import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751394344802_13b97957.png)'
      }}
    >
      {/* Soft, gentle overlay for warmth */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/60 via-purple-50/40 to-blue-50/60"></div>
      
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-6xl font-light text-slate-700 mb-8 leading-relaxed tracking-wide">
          Need someone to talk to?
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
          Get gentle support for what you're going through—from a caring system that understands you. 
          Whether you need guidance, comfort, or healing, YouMatter.ai is here with open arms.
        </p>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white border-0 px-10 py-5 text-lg font-medium rounded-full shadow-soft hover:shadow-lg transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
        >
          Begin Your Journey — Free & Gentle
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;