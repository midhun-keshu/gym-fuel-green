
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, DumbbellIcon, UtensilsIcon } from 'lucide-react';
import Navbar from "@/components/Navbar";
import FeaturedFoods from "@/components/FeaturedFoods";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <HowItWorks />
        <FeaturedFoods />
        <div className="mt-12 text-center">
          <Link to="/menu">
            <Button className="bg-gym-600 hover:bg-gym-700 text-white">
              View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
