import React from "react";
import doctorImage from "../assets/Untitled design.png";


const Hero: React.FC = () => {
  return (
    <section className="bg-blue-50 py-16 px-4 md:px-8 lg:px-20">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Search & Find Clinic <br /> For <span className="text-blue-600">Your Surgery</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg">
            Our skilled doctors have tremendous experience with a wide range of diseases to serve the needs of our patients.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition">
              Ask A Doctor Online
            </button>
            <button className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition">
              Unlimited Chat
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
         <img src={doctorImage} alt="Doctor"
            className="w-[90%] max-w-md object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
