// components/Footer.tsx

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">ClinicCare</h2>
          <p className="text-gray-300 text-sm">
            Your trusted healthcare booking partner for surgery and consultation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Doctors</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Online Consultation</a></li>
            <li><a href="#" className="hover:text-white">Surgery Booking</a></li>
            <li><a href="#" className="hover:text-white">Emergency Care</a></li>
            <li><a href="#" className="hover:text-white">24/7 Chat</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p className="text-gray-300 text-sm">123 Health Street, Wellness City</p>
          <p className="text-gray-300 text-sm mt-2">Email: support@healthconnect.com</p>
          <p className="text-gray-300 text-sm">Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="border-t border-blue-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} HealthConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
