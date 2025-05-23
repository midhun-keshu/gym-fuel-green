import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCartIcon, SearchIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  id: string; // Changed from number to string to match Supabase UUID format
  name: string;
  description: string;
  price: number;
  image_url: string;
  protein_grams: number | null;
  calories: number | null;
  category: string | null;
  created_at?: string;
}

const Menu = () => {
  const { addItem, formatPrice } = useCart();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .eq('available', true);

        if (error) {
          console.error('Error fetching food items:', error);
          toast({
            title: "Error",
            description: "Failed to load menu items. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          console.log('Fetched food items:', data); // Debug log
          setFoodItems(data as unknown as FoodItem[]);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map(item => item.category).filter(Boolean))
          );
          setCategories(['All', ...uniqueCategories]);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
        toast({
          title: "Error",
          description: "Something went wrong while loading the menu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, [toast]);

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'protein') {
      const proteinA = a.protein_grams || 0;
      const proteinB = b.protein_grams || 0;
      return proteinB - proteinA;
    }
    
    // Default: recommended (by creation date, newest first)
    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
  });

  const handleAddToCart = (item: FoodItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image_url
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gym-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Our Menu</h1>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our selection of protein-rich meals designed to complement your workout routine
            and help you achieve your fitness goals.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search menu items..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="protein">Highest Protein</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading menu items...</p>
          </div>
        ) : sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                  <p className="text-gray-600 mb-4">{item.description || 'No description available'}</p>
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
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No menu items match your search.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Menu;
