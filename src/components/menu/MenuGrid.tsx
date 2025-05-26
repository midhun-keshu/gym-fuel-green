
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '@/types/food';

interface MenuGridProps {
  items: FoodItem[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  const { addItem, formatPrice } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: FoodItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image_url || undefined
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      variant: "default",
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No menu items available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="h-48 overflow-hidden">
            <img 
              src={item.image_url || '/placeholder.svg'} 
              alt={item.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-xl">{item.name}</h3>
                <Badge variant="outline" className="bg-gym-100 text-gym-800 mt-2">
                  {item.category || 'General'}
                </Badge>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gym-600">{formatPrice(item.price)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{item.description || 'Delicious and nutritious meal'}</p>
            <div className="flex items-center space-x-4">
              {item.protein_grams && (
                <div className="bg-gym-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gym-800">Protein: {item.protein_grams}g</span>
                </div>
              )}
              {item.calories && (
                <div className="bg-gym-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gym-800">Calories: {item.calories}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gym-600 hover:bg-gym-700 text-white"
              onClick={() => handleAddToCart(item)}
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MenuGrid;
