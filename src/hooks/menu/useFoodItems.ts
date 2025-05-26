
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
      console.log('🍽️ Fetching food items from database...');
      
      // Fetch from database with the new RLS policy that allows public read
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

      if (!data || data.length === 0) {
        console.log('📝 No food items found in database');
        
        // Set fallback items if no data is found
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
          
          toast({
            title: "Menu Loaded",
            description: "Sample menu items are being displayed.",
          });
        }
        return;
      }

      if (isMounted) {
        setFoodItems(data as FoodItem[]);
        updateCategories(data);
        console.log('✅ Food items state updated successfully');
      }
      
    } catch (error) {
      console.error('❌ Error in fetchFoodItems:', error);
      
      if (isMounted) {
        // Always show fallback items on error
        const fallbackItems: FoodItem[] = [
          {
            id: 'error-fallback-1',
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
            id: 'error-fallback-2',
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
          description: "Basic menu items are available. Database connection may be limited.",
          variant: "default",
        });
      }
    } finally {
      if (isMounted) setIsLoading(false);
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
