
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  protein_grams: number;
  calories: number;
  category: string;
}

const FeaturedFoods: React.FC = () => {
  const { addItem, formatPrice } = useCart();
  const [featuredMeals, setFeaturedMeals] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMeals = async () => {
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .eq('available', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching featured meals:', error);
          return;
        }

        if (data && data.length > 0) {
          setFeaturedMeals(data as unknown as FoodItem[]);
        }
      } catch (error) {
        console.error('Error fetching featured meals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMeals();
  }, []);

  const handleAddToCart = (meal: FoodItem) => {
    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      image: meal.image_url
    });
  };

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Meals</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our chef-prepared meals are designed to provide optimal nutrition for your workout routine.
          Each meal is packed with protein and essential nutrients.
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading featured meals...</p>
        </div>
      ) : featuredMeals.length === 0 ? (
        <div className="text-center py-10">
          <p>No featured meals available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMeals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={meal.image_url} 
                  alt={meal.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-xl">{meal.name}</h3>
                    <Badge variant="outline" className="bg-gym-100 text-gym-800 mt-2">
                      {meal.category || 'General'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gym-600">{formatPrice(meal.price)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{meal.description}</p>
                <div className="flex items-center space-x-4">
                  {meal.protein_grams && (
                    <div className="bg-gym-50 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-gym-800">Protein: {meal.protein_grams}g</span>
                    </div>
                  )}
                  {meal.calories && (
                    <div className="bg-gym-50 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-gym-800">Calories: {meal.calories}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleAddToCart(meal)}
                  className="w-full bg-gym-600 hover:bg-gym-700 text-white"
                >
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedFoods;
