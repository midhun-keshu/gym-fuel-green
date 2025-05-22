
import React from 'react';
import { UtensilsIcon, ShoppingBagIcon, DumbbellIcon } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Select Your Meals',
    description: 'Browse our menu of protein-rich meals designed specifically for your fitness goals.',
    icon: <UtensilsIcon className="h-10 w-10 text-gym-600" />
  },
  {
    id: 2,
    title: 'We Prepare & Deliver',
    description: 'Our chefs prepare your meals with fresh ingredients and deliver them to your door.',
    icon: <ShoppingBagIcon className="h-10 w-10 text-gym-600" />
  },
  {
    id: 3,
    title: 'Eat & Train',
    description: 'Enjoy nutritious meals that fuel your workouts and help you reach your fitness goals.',
    icon: <DumbbellIcon className="h-10 w-10 text-gym-600" />
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get nutrition that matches your workout routine in three simple steps
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="bg-gym-50 p-4 rounded-full mb-6">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
            <div className="mt-6 flex items-center justify-center">
              <div className="bg-gym-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                {step.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
