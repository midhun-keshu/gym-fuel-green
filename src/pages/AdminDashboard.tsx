
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PackageIcon, UsersIcon, MenuIcon, ShoppingCartIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);

  // Sample food data
  const [foods, setFoods] = useState([
    {
      id: 1,
      name: 'Protein Power Bowl',
      description: 'Grilled chicken breast, quinoa, black beans, avocado, and roasted vegetables',
      price: 15.99,
      category: 'High Protein',
      protein: '42g',
      calories: '480',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    },
    {
      id: 2,
      name: 'Muscle Builder Salmon',
      description: 'Baked salmon with sweet potato, broccoli, and lemon-dill sauce',
      price: 18.99,
      category: 'Omega Rich',
      protein: '35g',
      calories: '520',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
    },
    {
      id: 3,
      name: 'Vegan Protein Plate',
      description: 'Lentil patty, roasted vegetables, hummus, and quinoa with tahini dressing',
      price: 14.99,
      category: 'Plant Based',
      protein: '28g',
      calories: '440',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFoodName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setProtein('');
    setCalories('');
    setSelectedFile(null);
    setIsEditMode(false);
    setEditItemId(null);
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && editItemId !== null) {
      // Update existing food item
      const updatedFoods = foods.map(food => 
        food.id === editItemId 
          ? { 
              ...food, 
              name: foodName, 
              description, 
              price: parseFloat(price), 
              category, 
              protein, 
              calories,
              // In a real app, we would handle image update
            }
          : food
      );
      
      setFoods(updatedFoods);
      toast({
        title: "Food Updated",
        description: `${foodName} has been updated successfully.`,
      });
    } else {
      // Add new food item
      const newFood = {
        id: foods.length + 1,
        name: foodName,
        description,
        price: parseFloat(price),
        category,
        protein,
        calories,
        image: selectedFile ? URL.createObjectURL(selectedFile) : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
      };
      
      setFoods([...foods, newFood]);
      toast({
        title: "Food Added",
        description: `${foodName} has been added to the menu.`,
      });
    }
    
    resetForm();
  };

  const handleEditFood = (food: any) => {
    setFoodName(food.name);
    setDescription(food.description);
    setPrice(food.price.toString());
    setCategory(food.category);
    setProtein(food.protein);
    setCalories(food.calories);
    setIsEditMode(true);
    setEditItemId(food.id);
  };

  const handleDeleteFood = (id: number) => {
    const updatedFoods = foods.filter(food => food.id !== id);
    setFoods(updatedFoods);
    toast({
      title: "Food Deleted",
      description: "The food item has been removed from the menu.",
      variant: "destructive",
    });
  };

  // Dashboard stats
  const stats = [
    { title: 'Total Orders', value: '156', icon: <ShoppingCartIcon className="h-6 w-6" /> },
    { title: 'Total Customers', value: '85', icon: <UsersIcon className="h-6 w-6" /> },
    { title: 'Menu Items', value: foods.length.toString(), icon: <MenuIcon className="h-6 w-6" /> },
    { title: 'Active Deliveries', value: '12', icon: <PackageIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="bg-gym-100 p-3 rounded-full text-gym-600">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="menu">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Manage Menu</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add/Edit Food Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{isEditMode ? 'Edit Food Item' : 'Add New Food'}</CardTitle>
                    <CardDescription>
                      {isEditMode
                        ? 'Update the details of the food item'
                        : 'Add a new food item to your menu'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddFood} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Food Name</Label>
                        <Input 
                          id="name" 
                          value={foodName} 
                          onChange={(e) => setFoodName(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input 
                          id="price"
                          type="number"
                          step="0.01"
                          value={price} 
                          onChange={(e) => setPrice(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={category} 
                          onValueChange={setCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High Protein">High Protein</SelectItem>
                            <SelectItem value="Low Carb">Low Carb</SelectItem>
                            <SelectItem value="Keto Friendly">Keto Friendly</SelectItem>
                            <SelectItem value="Vegan">Vegan</SelectItem>
                            <SelectItem value="Plant Based">Plant Based</SelectItem>
                            <SelectItem value="Omega Rich">Omega Rich</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="protein">Protein (g)</Label>
                          <Input 
                            id="protein"
                            value={protein} 
                            onChange={(e) => setProtein(e.target.value)} 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="calories">Calories</Label>
                          <Input 
                            id="calories"
                            value={calories} 
                            onChange={(e) => setCalories(e.target.value)} 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image">Food Image</Label>
                        <Input 
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange} 
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          className="bg-gym-600 hover:bg-gym-700"
                        >
                          {isEditMode ? 'Update Food' : 'Add Food'}
                        </Button>
                        {isEditMode && (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={resetForm}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Food Items List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Menu Items</CardTitle>
                    <CardDescription>Manage your food items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {foods.map((food) => (
                            <TableRow key={food.id}>
                              <TableCell className="font-medium">{food.name}</TableCell>
                              <TableCell>{food.category}</TableCell>
                              <TableCell>${food.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditFood(food)}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteFood(food.id)}
                                  >
                                    <TrashIcon className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">ORD-001</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>May 22, 2023</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>$42.97</TableCell>
                      <TableCell>
                        <Select defaultValue="processing">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ORD-002</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>May 21, 2023</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>$34.98</TableCell>
                      <TableCell>
                        <Select defaultValue="delivered">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ORD-003</TableCell>
                      <TableCell>Robert Johnson</TableCell>
                      <TableCell>May 20, 2023</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>$67.50</TableCell>
                      <TableCell>
                        <Select defaultValue="shipped">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
