
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '@/types/food';

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
      console.log('🍽️ Starting to fetch food items from database...');
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching food items:', error);
        throw error;
      }

      console.log('✅ Successfully fetched food items:', data?.length || 0, 'items');
      console.log('📋 Food items data:', data);

      if (isMounted) {
        setFoodItems(data as FoodItem[]);
        updateCategories(data);
        console.log('✅ Food items state updated successfully with', data.length, 'items');
        
        toast({
          title: "Menu Loaded",
          description: `Successfully loaded ${data.length} menu items.`,
        });
      }
      
    } catch (error) {
      console.error('❌ Critical error in fetchFoodItems:', error);
      
      if (isMounted) {
        toast({
          title: "Error Loading Menu",
          description: "Failed to load menu items. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        console.log('✅ Loading state set to false');
      }
    }
  };

  const updateCategories = (items: FoodItem[]) => {
    const uniqueCategories = Array.from(
      new Set(items.map(item => item.category).filter(Boolean))
    );
    setCategories(['All', ...uniqueCategories]);
    console.log('✅ Categories updated:', ['All', ...uniqueCategories]);
  };

  return { foodItems, categories, isLoading, refetch: fetchFoodItems };
};
