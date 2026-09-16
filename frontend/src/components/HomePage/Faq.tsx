// FAQ.tsx
import React, { useState } from "react";

// Keep these honest: describe what the product does today. Appointment
// booking, video and chat consultation are not built yet.
const faqs = [
  {
    question: "How do I find a doctor?",
    answer:
      "Create a patient account, then browse verified doctors by specialisation, experience and clinic from your dashboard.",
  },
  {
    question: "Are the doctors verified?",
    answer:
      "Yes. Every doctor submits their qualifications, registration and identity documents, and an administrator reviews them before the profile becomes visible.",
  },
  {
    question: "What can I do with a patient account?",
    answer:
      "You can keep your profile and a health record — blood group, medication, allergies, chronic conditions and emergency contacts — and browse approved doctors.",
  },
  {
    question: "Is appointment booking available?",
    answer:
      "Not yet. Doctor discovery and health records are live; online booking and consultations are in development.",
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="faq" className="bg-gray-50 py-12 px-4 md:px-8 lg:px-20">
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
