import React from 'react';
import { Play } from 'lucide-react';

const VideoSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
          How It Works (and Why It Changes Everything)
        </h2>
        <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <div className="aspect-video relative">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751395050017_0dde53a3.png" 
              alt="Selene - Safe Haven Founder" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group hover:bg-black/30 transition-colors duration-300">
              <div className="bg-white/20 rounded-full p-6 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300 cursor-pointer">
                <Play className="w-12 h-12 text-white" fill="white" />
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 mt-6 text-lg italic">
          "Selene shares the story behind Safe Haven and how it helps."
        </p>
      </div>
    </section>
  );
};

export default VideoSection;