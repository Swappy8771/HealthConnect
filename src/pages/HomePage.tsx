import React from "react";
import Navbar from "../components/ui/Navbar"; // adjust path as needed
import Hero from "../components/Hero";
import Feature from "../components/Features";
import TrustedBy from "../components/TrustedBy";
import FAQ from "../components/Faq";
import HowItWorks from "../components/HowitWorks";
import Footer from "../components/shared/Footer";

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
