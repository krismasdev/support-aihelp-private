import React from 'react';

const benefits = [
  "Guided onboarding gets to the root of what you need.",
  "Smart AI matches you with the right kind of support instantly.",
  "Your \"helper\" adapts—mentor, therapist, friend, coach, or guide.",
  "Conversations evolve with you over time.",
  "Want to talk? Upgrade to live voice chat anytime.",
  "Private. Judgment-free. Always on your terms."
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 shadow-lg">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-center">
                  <div className="w-64 h-96 mx-auto bg-gray-800 rounded-3xl relative overflow-hidden shadow-xl">
                    <img 
                      src="https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751394831850_b4bcb584.png" 
                      alt="Chat interface showing AI support conversation"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              One App. Every Kind of Help.
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-lg text-gray-700 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;