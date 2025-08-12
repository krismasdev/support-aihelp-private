import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "Is this therapy?",
    answer: "Not exactly. It's better for some things—and different. Safe Haven can connect you with a licensed therapist, but it starts as a conversation tailored to what you need right now."
  },
  {
    question: "Is it really private?",
    answer: "100%. Your data is encrypted. No judgment. No shame. You control everything."
  },
  {
    question: "How does the AI know what I need?",
    answer: "The onboarding process learns about your goals, stressors, and style. From there, the system assigns your ideal helper—and keeps learning."
  },
  {
    question: "What does it cost?",
    answer: "Chat is free. You can upgrade to voice support for just $1/minute."
  },
  {
    question: "What if I don't know what kind of help I need?",
    answer: "That's okay. Most people don't. Safe Haven is designed for that. We'll guide you."
  }
];

const FAQSection: React.FC = () => {
  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-indigo-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;