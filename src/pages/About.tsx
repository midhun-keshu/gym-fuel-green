
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UtensilsIcon, DumbbellIcon, HeartIcon, UsersIcon } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gym-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Fuel Box</h1>
            <p className="text-lg text-gray-700 mb-8">
              We're on a mission to deliver nutritious, delicious meals that fuel your active lifestyle.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2023, Fuel Box started with a simple idea: make nutritious food accessible to everyone.
                We believe that eating healthy shouldn't be a hassle, and that's why we created a service that delivers
                balanced, protein-rich meals right to your doorstep.
              </p>
              <p className="text-gray-700 mb-4">
                Our team of nutritionists and chefs work together to create meals that not only taste amazing but also
                provide the optimal balance of nutrients to support your fitness goals, whether you're an athlete,
                fitness enthusiast, or just someone who wants to eat better.
              </p>
              <p className="text-gray-700">
                What started as a small kitchen serving the local fitness community has grown into a beloved service
                that helps thousands of people eat better every day.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
                alt="Healthy meal preparation" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-gym-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="h-16 w-16 bg-gym-100 text-gym-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Ingredients</h3>
              <p className="text-gray-600">
                We source the freshest, highest-quality ingredients for our meals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="h-16 w-16 bg-gym-100 text-gym-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DumbbellIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fitness Focused</h3>
              <p className="text-gray-600">
                Every meal is designed to support your active lifestyle and fitness goals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="h-16 w-16 bg-gym-100 text-gym-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Health First</h3>
              <p className="text-gray-600">
                We prioritize nutrition without sacrificing flavor in every meal we create.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="h-16 w-16 bg-gym-100 text-gym-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">
                We're building a community of health-conscious individuals who support each other.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1548449112-96a38a643324?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                  alt="Chef" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Chef Rahul Kumar</h3>
              <p className="text-gym-600 mb-2">Head Chef</p>
              <p className="text-gray-600">
                With over 15 years of experience, Chef Rahul creates balanced meals that are both nutritious and delicious.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Arjun Patel</h3>
              <p className="text-gym-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600">
                A former athlete, Arjun founded Fuel Box to solve his own problem of finding healthy, convenient meals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1629904853716-f0bc54eea481?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                  alt="Nutritionist" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Dr. Priya Sharma</h3>
              <p className="text-gym-600 mb-2">Lead Nutritionist</p>
              <p className="text-gray-600">
                With a Ph.D. in Nutritional Sciences, Dr. Sharma ensures every meal meets optimal nutritional standards.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gym-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Fuel Your Body Right?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of customers who trust us to deliver delicious, nutritious meals straight to their door.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/menu">
              <Button className="bg-white text-gym-600 hover:bg-gray-100">
                View Our Menu
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-gym-700">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
