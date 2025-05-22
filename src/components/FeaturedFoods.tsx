
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from 'lucide-react';

const featuredMeals = [
  {
    id: 1,
    name: 'Protein Power Bowl',
    description: 'Grilled chicken breast, quinoa, black beans, avocado, and roasted vegetables',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
    protein: '42g',
    calories: '480',
    category: 'High Protein'
  },
  {
    id: 2,
    name: 'Muscle Builder Salmon',
    description: 'Baked salmon with sweet potato, broccoli, and lemon-dill sauce',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
    protein: '35g',
    calories: '520',
    category: 'Omega Rich'
  },
  {
    id: 3,
    name: 'Vegan Protein Plate',
    description: 'Lentil patty, roasted vegetables, hummus, and quinoa with tahini dressing',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    protein: '28g',
    calories: '440',
    category: 'Plant Based'
  },
];

const FeaturedFoods: React.FC = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Meals</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our chef-prepared meals are designed to provide optimal nutrition for your workout routine.
          Each meal is packed with protein and essential nutrients.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredMeals.map((meal) => (
          <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img 
                src={meal.image} 
                alt={meal.name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl">{meal.name}</h3>
                  <Badge variant="outline" className="bg-gym-100 text-gym-800 mt-2">
                    {meal.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gym-600">${meal.price}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{meal.description}</p>
              <div className="flex items-center space-x-4">
                <div className="bg-gym-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gym-800">Protein: {meal.protein}</span>
                </div>
                <div className="bg-gym-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gym-800">Calories: {meal.calories}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gym-600 hover:bg-gym-700 text-white">
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedFoods;
