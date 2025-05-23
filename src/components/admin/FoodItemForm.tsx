
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '@/types/food';

interface FoodItemFormProps {
  editingItem: FoodItem | null;
  onSubmit: (formData: any, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const FoodItemForm = ({ editingItem, onSubmit, onCancel, isSubmitting }: FoodItemFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [proteinGrams, setProteinGrams] = useState('');
  const [calories, setCalories] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set form values when editing an existing item
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description || '');
      setPrice(editingItem.price.toString());
      setCategory(editingItem.category || '');
      setProteinGrams(editingItem.protein_grams !== null ? editingItem.protein_grams.toString() : '');
      setCalories(editingItem.calories !== null ? editingItem.calories.toString() : '');
      
      if (editingItem.image_url) {
        setImagePreview(editingItem.image_url);
      }
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [editingItem]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setProteinGrams('');
    setCalories('');
    setImageFile(null);
    setImagePreview(null);
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

    const foodItemData = {
      name,
      description: description || null,
      price: priceValue,
      category: category || null,
      protein_grams: proteinGrams ? parseFloat(proteinGrams) : null,
      calories: calories ? parseInt(calories, 10) : null,
      image_url: imagePreview,
    };
    
    await onSubmit(foodItemData, imageFile);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</CardTitle>
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
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gym-600 hover:bg-gym-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FoodItemForm;
