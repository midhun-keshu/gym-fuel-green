
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '@/types/food';
import { createDefaultFoodItems } from '@/utils/menu/defaultFoodItems';

export const useFoodItems = () => {
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchFoodItems(isMounted);
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchFoodItems = async (isMounted: boolean = true) => {
    try {
      if (isMounted) setIsLoading(true);
      console.log('🍽️ Fetching food items...');
      
      // First try to fetch from database
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching food items:', error);
        
        // If no items exist or there's an error, try to create defaults
        console.log('📝 Creating default food items due to error...');
        await handleCreateDefaults(isMounted);
        return;
      }

      console.log('✅ Fetched food items:', data?.length || 0, 'items');

      if (!data || data.length === 0) {
        console.log('📝 No food items found, creating default ones...');
        await handleCreateDefaults(isMounted);
        return;
      }

      if (isMounted) {
        setFoodItems(data as FoodItem[]);
        updateCategories(data);
      }
      
    } catch (error) {
      console.error('❌ Error in fetchFoodItems:', error);
      if (isMounted) {
        // Try to create defaults as fallback
        await handleCreateDefaults(isMounted);
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleCreateDefaults = async (isMounted: boolean = true) => {
    try {
      const defaultItems = await createDefaultFoodItems();
      
      if (defaultItems && isMounted) {
        console.log('✅ Default food items created:', defaultItems.length, 'items');
        setFoodItems(defaultItems);
        updateCategories(defaultItems);
        
        toast({
          title: "Menu Loaded",
          description: "Sample menu items have been loaded successfully.",
        });
      }
    } catch (error) {
      console.error('❌ Error creating default food items:', error);
      if (isMounted) {
        toast({
          title: "Setup Error",
          description: "Could not initialize menu items. Please check your connection.",
          variant: "destructive",
        });
      }
    }
  };

  const updateCategories = (items: FoodItem[]) => {
    const uniqueCategories = Array.from(
      new Set(items.map(item => item.category).filter(Boolean))
    );
    setCategories(['All', ...uniqueCategories]);
  };

  return { foodItems, categories, isLoading, refetch: fetchFoodItems };
};
