// TrustedBy.tsx
import React from "react";
import logo1 from "../assets/1.png";
import logo2 from "../assets/2.png";
import logo3 from "../assets/3.png";
import logo4 from "../assets/4.png";
import logo5 from "../assets/5.jpeg";

const TrustedBy: React.FC = () => {
  const logos = [logo1, logo2, logo3, logo4, logo5];

  return (
    <section className="bg-white py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-xl text-blue-600 font-semibold mb-2">Trusted By</h2>
        <p className="text-gray-700 text-lg mb-8">
          Trusted by top clinics, doctors, and thousands of patients
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Trusted logo ${index + 1}`}
              className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
