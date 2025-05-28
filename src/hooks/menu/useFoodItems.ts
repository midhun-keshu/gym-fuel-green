
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
      
      // First check if we have a valid connection
      const { data: healthCheck, error: healthError } = await supabase
        .from('food_items')
        .select('count(*)', { count: 'exact', head: true });

      if (healthError) {
        console.error('❌ Database connection failed:', healthError);
        throw new Error(`Database connection failed: ${healthError.message}`);
      }

      console.log('✅ Database connection successful, found', healthCheck || 0, 'total items');

      // Now fetch the actual data
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching food items:', error);
        throw new Error(`Failed to fetch food items: ${error.message}`);
      }

      console.log('✅ Successfully fetched food items:', data?.length || 0, 'items');
      console.log('📋 Food items data:', data);

      if (!data || data.length === 0) {
        console.log('📝 No food items found in database, using fallback items');
        
        const fallbackItems: FoodItem[] = [
          {
            id: 'fallback-1',
            name: 'Grilled Chicken Bowl',
            description: 'High-protein grilled chicken with quinoa and vegetables',
            price: 1299,
            image_url: '/placeholder.svg',
            category: 'Main Course',
            protein_grams: 35,
            calories: 450,
            available: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'fallback-2',
            name: 'Protein Smoothie',
            description: 'Post-workout protein smoothie with banana and berries',
            price: 899,
            image_url: '/placeholder.svg',
            category: 'Beverages',
            protein_grams: 25,
            calories: 280,
            available: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'fallback-3',
            name: 'Turkey Wrap',
            description: 'Lean turkey breast wrap with fresh vegetables',
            price: 1099,
            image_url: '/placeholder.svg',
            category: 'Wraps',
            protein_grams: 28,
            calories: 380,
            available: true,
            created_at: new Date().toISOString()
          }
        ];
        
        if (isMounted) {
          setFoodItems(fallbackItems);
          updateCategories(fallbackItems);
          console.log('✅ Fallback items set successfully');
        }
        return;
      }

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
        // Set fallback items on any error
        const errorFallbackItems: FoodItem[] = [
          {
            id: 'error-fallback-1',
            name: 'Protein Bowl',
            description: 'High protein meal with chicken and vegetables',
            price: 1299,
            image_url: '/placeholder.svg',
            category: 'Main Course',
            protein_grams: 35,
            calories: 450,
            available: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'error-fallback-2',
            name: 'Energy Smoothie',
            description: 'Post-workout protein smoothie',
            price: 899,
            image_url: '/placeholder.svg',
            category: 'Beverages',
            protein_grams: 25,
            calories: 280,
            available: true,
            created_at: new Date().toISOString()
          }
        ];
        
        setFoodItems(errorFallbackItems);
        updateCategories(errorFallbackItems);
        console.log('✅ Error fallback items set');
        
        toast({
          title: "Using Sample Menu",
          description: "Sample menu items are being displayed while we resolve database connectivity.",
          variant: "default",
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
