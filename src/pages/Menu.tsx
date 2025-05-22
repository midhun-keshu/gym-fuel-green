import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCartIcon, SearchIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

const foodItems = [
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
    image: 'https://images.unsplash.com/photo-1512621776951-a5b131c97ff8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    protein: '28g',
    calories: '440',
    category: 'Plant Based'
  },
  {
    id: 4,
    name: 'Keto Steak Bowl',
    description: 'Grass-fed steak, avocado, cauliflower rice, and mixed greens with chimichurri',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    protein: '38g',
    calories: '510',
    category: 'Keto Friendly'
  },
  {
    id: 5,
    name: 'Pre-Workout Energizer',
    description: 'Banana protein pancakes with almond butter, berries, and honey',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1486328228599-85db4443971f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    protein: '25g',
    calories: '450',
    category: 'Pre-Workout'
  },
  {
    id: 6,
    name: 'Recovery Smoothie Bowl',
    description: 'Protein-packed smoothie with fruits, granola, and nut butter toppings',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1622484212790-a5b131c97ff8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    protein: '30g',
    calories: '420',
    category: 'Post-Workout'
  },
];

const categories = ['All', 'High Protein', 'Keto Friendly', 'Plant Based', 'Pre-Workout', 'Post-Workout', 'Omega Rich'];

const Menu = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'protein') return parseInt(b.protein) - parseInt(a.protein);
    
    // Default: recommended (no specific sort)
    return 0;
  });

  const handleAddToCart = (item: {id: number, name: string, price: number, image?: string}) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
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
        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl">{item.name}</h3>
                      <Badge variant="outline" className="bg-gym-100 text-gym-800 mt-2">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gym-600">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gym-50 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-gym-800">Protein: {item.protein}</span>
                    </div>
                    <div className="bg-gym-50 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-gym-800">Calories: {item.calories}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gym-600 hover:bg-gym-700 text-white"
                    onClick={() => handleAddToCart({
                      id: item.id, 
                      name: item.name, 
                      price: item.price,
                      image: item.image
                    })}
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
