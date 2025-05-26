
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
      
      // Try to fetch from database without authentication requirements
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching food items:', error);
        console.log('📝 Trying to create default food items...');
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
        await handleCreateDefaults(isMounted);
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleCreateDefaults = async (isMounted: boolean = true) => {
    try {
      console.log('🔧 Creating default food items...');
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
        // Set some fallback items to prevent empty state
        const fallbackItems: FoodItem[] = [
          {
            id: '1',
            name: 'Protein Bowl',
            description: 'High protein meal with chicken and vegetables',
            price: 299,
            image_url: '/placeholder.svg',
            category: 'Main Course',
            protein_grams: 35,
            calories: 450,
            available: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Energy Smoothie',
            description: 'Post-workout protein smoothie',
            price: 199,
            image_url: '/placeholder.svg',
            category: 'Beverages',
            protein_grams: 25,
            calories: 280,
            available: true,
            created_at: new Date().toISOString()
          }
        ];
        
        setFoodItems(fallbackItems);
        updateCategories(fallbackItems);
        
        toast({
          title: "Menu Loaded",
          description: "Basic menu items have been loaded.",
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
