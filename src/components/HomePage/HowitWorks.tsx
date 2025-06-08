// components/HowItWorks.tsx

import React from "react";
import { FaSearch, FaCalendarCheck, FaComments } from "react-icons/fa";

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12">Book your medical appointment in 3 simple steps</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FaSearch className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Search a Doctor</h3>
            <p className="text-gray-600">Find a trusted doctor based on your location, specialty, or reviews.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FaCalendarCheck className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
            <p className="text-gray-600">Choose your preferred time and book your visit instantly online.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FaComments className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Consultation</h3>
            <p className="text-gray-600">Join a video or in-person consultation and get medical advice easily.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
