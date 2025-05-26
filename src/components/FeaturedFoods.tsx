
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon, RefreshCwIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFoodItems } from '@/hooks/menu/useFoodItems';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '@/types/food';

const FeaturedFoods: React.FC = () => {
  const { addItem, formatPrice } = useCart();
  const { toast } = useToast();
  const { foodItems, isLoading, refetch } = useFoodItems();
  const [featuredMeals, setFeaturedMeals] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (foodItems.length > 0) {
      // Take first 3 available items as featured
      const availableItems = foodItems.filter(item => item.available !== false);
      setFeaturedMeals(availableItems.slice(0, 3));
      console.log('✅ Featured meals set:', availableItems.slice(0, 3).length, 'items');
    }
  }, [foodItems]);

  const handleAddToCart = (meal: FoodItem) => {
    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      image: meal.image_url || undefined
    });
    
    toast({
      title: "Added to cart",
      description: `${meal.name} has been added to your cart.`,
    });
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing featured meals...');
    refetch();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
  };

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Featured Meals</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our chef-prepared meals are designed to provide optimal nutrition for your workout routine.
          Each meal is packed with protein and essential nutrients.
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gym-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Loading featured meals...</p>
        </div>
      ) : featuredMeals.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No featured meals available at the moment.</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Try Loading Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMeals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={meal.image_url || '/placeholder.svg'} 
                  alt={meal.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={handleImageError}
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
                <p className="text-gray-600 mb-4">{meal.description || 'Delicious and nutritious meal'}</p>
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
