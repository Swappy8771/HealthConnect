import React from "react";
import { Stethoscope, Calendar, MessagesSquare, Shield } from "lucide-react";

const features = [
  {
    icon: Stethoscope,
    title: "Expert Doctors",
    description: "Connect with highly experienced specialists for your specific needs.",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book appointments quickly with a seamless, user-friendly experience.",
  },
  {
    icon: MessagesSquare,
    title: "Online Consultation",
    description: "Chat or video consult with doctors from anywhere at your convenience.",
  },
  {
    icon: Shield,
    title: "Data Privacy",
    description: "Your health data is encrypted and securely protected at all times.",
  },
];

const Feature: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
        <p className="text-gray-600 mb-12">We offer trusted healthcare services for your well-being.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 text-blue-600 rounded-full mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feature;
