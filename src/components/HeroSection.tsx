
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, DumbbellIcon, UtensilsIcon } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gym-50 via-gym-100 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fuel Your <span className="text-gym-600">Workouts</span> with Premium Nutrition
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Personalized protein-rich meals designed to match your fitness goals and workout routines.
              Delivered fresh to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu">
                <Button className="bg-gym-600 hover:bg-gym-700 text-white px-8 py-6 text-lg">
                  View Menu <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-gym-600 text-gym-600 hover:bg-gym-50 px-8 py-6 text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="flex items-center mt-8 space-x-8">
              <div className="flex items-center">
                <DumbbellIcon className="h-6 w-6 text-gym-600 mr-2" />
                <span className="text-gray-700">Workout Optimized</span>
              </div>
              <div className="flex items-center">
                <UtensilsIcon className="h-6 w-6 text-gym-600 mr-2" />
                <span className="text-gray-700">Chef Prepared</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Protein-rich meal prepared for fitness enthusiasts" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
