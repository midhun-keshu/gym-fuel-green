
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FoodItemForm from '@/components/admin/FoodItemForm';
import FoodItemsList from '@/components/admin/FoodItemsList';
import AccessDenied from '@/components/admin/AccessDenied';
import { useToast } from '@/hooks/use-toast';
import { useAdminCheck } from '@/hooks/admin/useAdminCheck';
import { FoodItem } from '@/types/food';
import { 
  fetchFoodItems, 
  deleteFoodItem, 
  toggleFoodItemAvailability, 
  saveFoodItem 
} from '@/utils/admin/foodManagement';

const AdminFoodManagement = () => {
  const { toast } = useToast();
  const { isAdmin, isLoading } = useAdminCheck();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch food items when admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      loadFoodItems();
    }
  }, [isAdmin]);
  
  const loadFoodItems = async () => {
    try {
      const items = await fetchFoodItems();
      setFoodItems(items);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast({
        title: "Error",
        description: "Failed to load food items.",
        variant: "destructive",
      });
    }
  };
  
  const handleFormCancel = () => {
    setEditingItem(null);
  };
  
  const handleFormSubmit = async (formData: any, imageFile: File | null) => {
    setIsSubmitting(true);
    
    try {
      await saveFoodItem(formData, imageFile, editingItem?.id || null);
      
      toast({
        title: editingItem ? "Item updated" : "Item created",
        description: editingItem 
          ? "Food item has been updated successfully." 
          : "New food item has been added successfully.",
      });
      
      // Refresh food items list and reset form
      loadFoodItems();
      setEditingItem(null);
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
  
  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) {
      return;
    }
    
    try {
      await deleteFoodItem(id);
      
      // Update local state
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
  
  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await toggleFoodItemAvailability(id, currentStatus);
      
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
    return <AccessDenied />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Food Items Management</h1>
        
        {/* Add/Edit Form */}
        <FoodItemForm 
          editingItem={editingItem} 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormCancel}
          isSubmitting={isSubmitting}
        />
        
        {/* Food Items List */}
        <FoodItemsList 
          foodItems={foodItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleAvailability={handleToggleAvailability}
        />
      </div>
      <Footer />
    </div>
  );
};

export default AdminFoodManagement;
