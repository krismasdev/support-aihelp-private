import React from 'react';

const FounderSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
          From Selene, Our Founder
        </h2>
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg mb-4">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751395231540_e3184956.webp" 
                alt="Selene, Founder of Safe Haven"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              When I needed help the most, I didn't know where to go. I felt alone, overwhelmed, 
              and unsure if I even deserved support. That's why I built Safe Haven—not just as a 
              product, but as a promise. You deserve to feel seen. You deserve real help that meets 
              you where you are. And you deserve to feel safe enough to grow.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether it's a 2am spiral or a life decision you've been avoiding, Safe Haven is here 
              to walk with you.
            </p>
            <p className="text-indigo-600 font-semibold text-xl mb-4">
              You matter.
            </p>
            <div className="border-t pt-6">
              <p className="text-gray-600 font-medium">
                — Selene<br />
                <span className="text-sm">Founder, Safe Haven</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;