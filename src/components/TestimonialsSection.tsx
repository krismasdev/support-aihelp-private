import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  { quote: "I was spiraling. YouMatter.ai gave me a space to breathe. Then grow.", name: "Jasmine", age: 19 },
  { quote: "It's like therapy, but it actually fits into my life.", name: "Marcus", age: 34 },
  { quote: "One form, and it matched me with exactly who I needed.", name: "Kayla", age: 23 },
  { quote: "I talk to my mentor every morning. I'm not alone anymore.", name: "David", age: 48 },
  { quote: "The AI knew what I needed even before I did. Wild.", name: "Riya", age: 27 },
  { quote: "Finally found support that understands my journey.", name: "Alex", age: 31 }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <p className="text-gray-800 mb-4 italic text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="text-indigo-600 font-semibold">
                  — {testimonial.name}, {testimonial.age}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;