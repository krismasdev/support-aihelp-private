import React from 'react';

const features = [
  "Text-first. Like a journal with a human inside.",
  "ChatGPT-powered support, tuned to your emotional state.",
  "Human voice option when you're ready for real-time connection.",
  "Modular AI adapts to trauma, stress, career decisions, relationships, more.",
  "24/7 access, always just a tap away.",
  "Actually helps—users report feeling better in under 10 minutes."
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Built for the Way You Feel, Not Just What You Say
            </h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-lg text-gray-700 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751395153359_8b292d07.png" 
                alt="Woman using Safe Haven app on her phone in a cozy bedroom setting"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;