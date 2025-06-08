import React from "react";
import Navbar from "../components/ui/Navbar"; // adjust path as needed
import Hero from "../components/HomePage/Hero";
import Feature from "../components/HomePage/Features";
import TrustedBy from "../components/HomePage/TrustedBy";
import HowItWorks from "../components/HomePage/HowitWorks";
import Footer from "../components/shared/Footer";
import FAQ from "../components/HomePage/Faq";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
     <Feature/>
     <HowItWorks />
     <TrustedBy />
     <FAQ />
     <Footer />
    </>
  );
};

export default Home;
