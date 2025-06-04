// FAQ.tsx
import React, { useState } from "react";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment by selecting a doctor and choosing an available time slot on our platform.",
  },
  {
    question: "Is online consultation available?",
    answer: "Yes, we offer both video and chat consultations with verified doctors.",
  },
  {
    question: "Are the doctors verified?",
    answer: "All doctors on our platform are verified with credentials and years of experience.",
  },
  {
    question: "Can I reschedule or cancel my appointment?",
    answer: "Absolutely! You can manage your appointments through your dashboard anytime.",
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="bg-gray-50 py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left text-lg font-medium text-gray-800 focus:outline-none flex justify-between items-center"
              >
                {faq.question}
                <span className="text-blue-600">{activeIndex === index ? "−" : "+"}</span>
              </button>
              {activeIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
