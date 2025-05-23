
import { supabase } from '@/integrations/supabase/client';
import { FoodItem } from '@/types/food';

export async function fetchFoodItems(): Promise<FoodItem[]> {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data as unknown as FoodItem[];
}

export async function deleteFoodItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('food_items')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}

export async function toggleFoodItemAvailability(id: string, currentStatus: boolean): Promise<void> {
  const { error } = await supabase
    .from('food_items')
    .update({ available: !currentStatus })
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}

export async function saveFoodItem(foodItemData: any, imageFile: File | null, editingId: string | null): Promise<any> {
  // Upload image if there's a new file
  let imageUrl = foodItemData.image_url;
  
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
  
  // Prepare data with updated image URL
  const itemData = {
    ...foodItemData,
    image_url: imageUrl,
    available: foodItemData.available !== undefined ? foodItemData.available : true
  };
  
  let result;
  
  if (editingId) {
    // Update existing item
    result = await supabase
      .from('food_items')
      .update(itemData)
      .eq('id', editingId)
      .select();
  } else {
    // Create new item
    result = await supabase
      .from('food_items')
      .insert(itemData)
      .select();
  }
  
  if (result.error) {
    throw result.error;
  }
  
  return result.data;
}
