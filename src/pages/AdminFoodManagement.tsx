import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircleIcon, EditIcon, TrashIcon, ImageIcon, CheckIcon, XIcon } from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  protein_grams: number | null;
  calories: number | null;
  available: boolean;
  created_at: string;
}

const AdminFoodManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [proteinGrams, setProteinGrams] = useState('');
  const [calories, setCalories] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // Check user roles
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
          
        if (error) {
          throw error;
        }
        
        const isUserAdmin = userRoles?.some(ur => ur.role === 'admin') || false;
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  // Fetch food items
  useEffect(() => {
    if (isAdmin) {
      fetchFoodItems();
    }
  }, [isAdmin]);
  
  const fetchFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setFoodItems(data as unknown as FoodItem[]);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast({
        title: "Error",
        description: "Failed to load food items.",
        variant: "destructive",
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setProteinGrams('');
    setCalories('');
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };
  
  const handleEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || '');
    setPrice(String(item.price)); // Convert number to string explicitly
    setCategory(item.category || '');
    setProteinGrams(item.protein_grams !== null ? String(item.protein_grams) : ''); // Fix: Convert to string explicitly
    setCalories(item.calories !== null ? String(item.calories) : ''); // Fix: Convert to string explicitly
    
    if (item.image_url) {
      setImagePreview(item.image_url);
    }
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this food item?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove from local state
      setFoodItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item deleted",
        description: "Food item has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast({
        title: "Error",
        description: "Failed to delete food item.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .update({ available: !currentStatus })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setFoodItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, available: !currentStatus } : item
        )
      );
      
      toast({
        title: "Status updated",
        description: `Item is now ${!currentStatus ? 'available' : 'unavailable'}.`,
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability status.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = imagePreview;
      
      // Upload image if there's a new file
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `food-items/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('food_images')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('food_images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }
      
      const foodItemData = {
        name,
        description: description || null,
        price: priceValue,
        category: category || null,
        protein_grams: proteinGrams ? parseFloat(proteinGrams) : null, // Fix: Convert to number for database
        calories: calories ? parseInt(calories, 10) : null, // Fix: Convert to number for database
        image_url: imageUrl,
        available: true
      };
      
      let result;
      
      if (editingId) {
        // Update existing item
        result = await supabase
          .from('food_items')
          .update(foodItemData)
          .eq('id', editingId)
          .select();
          
        toast({
          title: "Item updated",
          description: "Food item has been updated successfully.",
        });
      } else {
        // Create new item
        result = await supabase
          .from('food_items')
          .insert(foodItemData)
          .select();
          
        toast({
          title: "Item created",
          description: "New food item has been added successfully.",
        });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Refresh food items list
      fetchFoodItems();
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving food item:', error);
      toast({
        title: "Error",
        description: "Failed to save food item.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex justify-center items-center">
          <p className="text-lg">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Access denied state
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg mb-8">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>Return to Homepage</Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Food Items Management</h1>
        
        {/* Add/Edit Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Food Item' : 'Add New Food Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input 
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. High Protein, Vegan, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input 
                        id="protein"
                        type="number"
                        value={proteinGrams}
                        onChange={(e) => setProteinGrams(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input 
                        id="calories"
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Item Image</Label>
                    <div className="mt-1 flex items-center">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="mb-2 text-sm text-gray-500">Preview:</p>
                        <div className="h-40 w-40 border rounded overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Preview"
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gym-600 hover:bg-gym-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Food Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Food Items List</CardTitle>
          </CardHeader>
          <CardContent>
            {foodItems.length === 0 ? (
              <div className="text-center py-6">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No food items found. Add your first item above.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foodItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.image_url ? (
                            <div className="h-12 w-12 rounded overflow-hidden">
                              <img 
                                src={item.image_url} 
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.category ? (
                            <Badge variant="outline">{item.category}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">Not set</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleAvailability(item.id, item.available)}
                              title={item.available ? "Mark as unavailable" : "Mark as available"}
                            >
                              {item.available ? <XIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(item.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AdminFoodManagement;
