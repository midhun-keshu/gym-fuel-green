
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
      console.log('Fetching food items...');
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching food items:', error);
        throw error;
      }

      console.log('Fetched food items:', data);

      if (!data || data.length === 0) {
        console.log('No food items found, creating default ones...');
        await createDefaultFoodItems(isMounted);
        return;
      }

      if (isMounted) {
        setFoodItems(data as FoodItem[]);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map(item => item.category).filter(Boolean))
        );
        setCategories(['All', ...uniqueCategories]);
      }
      
    } catch (error) {
      console.error('Error in fetchFoodItems:', error);
      if (isMounted) {
        toast({
          title: "Error",
          description: "Failed to load menu items. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const createDefaultFoodItems = async (isMounted: boolean = true) => {
    try {
      const defaultFoods = [
        {
          name: "High Protein Chicken Bowl",
          description: "Grilled chicken with quinoa, mixed vegetables, and a light vinaigrette.",
          price: 350,
          image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
          protein_grams: 35,
          calories: 420,
          category: "High Protein",
          available: true
        },
        {
          name: "Keto-Friendly Steak Plate",
          description: "Grass-fed steak with avocado and roasted vegetables.",
          price: 450,
          image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
          protein_grams: 40,
          calories: 550,
          category: "Keto",
          available: true
        },
        {
          name: "Vegan Power Salad",
          description: "Plant-based protein with mixed greens, nuts, and balsamic dressing.",
          price: 320,
          image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          protein_grams: 22,
          calories: 380,
          category: "Vegan",
          available: true
        },
        {
          name: "Protein Pancake Stack",
          description: "Fluffy protein pancakes topped with fresh berries and honey.",
          price: 280,
          image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          protein_grams: 25,
          calories: 450,
          category: "Breakfast",
          available: true
        },
        {
          name: "Salmon Superfood Bowl",
          description: "Grilled salmon with kale, quinoa, avocado, and lemon dressing.",
          price: 420,
          image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
          protein_grams: 32,
          calories: 490,
          category: "Seafood",
          available: true
        },
        {
          name: "Turkey Wrap",
          description: "Sliced turkey breast with fresh vegetables in a whole grain wrap.",
          price: 290,
          image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
          protein_grams: 28,
          calories: 380,
          category: "Lunch",
          available: true
        },
        {
          name: "Protein Smoothie",
          description: "Blended whey protein with banana, peanut butter, and almond milk.",
          price: 220,
          image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
          protein_grams: 30,
          calories: 320,
          category: "Beverages",
          available: true
        },
        {
          name: "Muscle Builder Meal",
          description: "Grilled chicken, sweet potato, and steamed broccoli with olive oil.",
          price: 380,
          image_url: "https://images.unsplash.com/photo-1497888329096-51c27beff665?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
          protein_grams: 45,
          calories: 520,
          category: "High Protein",
          available: true
        }
      ];

      const { data: insertedData, error: insertError } = await supabase
        .from('food_items')
        .insert(defaultFoods)
        .select();

      if (insertError) {
        console.error('Error inserting default food items:', insertError);
        throw insertError;
      }

      if (insertedData && isMounted) {
        console.log('Default food items created:', insertedData);
        setFoodItems(insertedData as FoodItem[]);
        
        const uniqueCategories = Array.from(
          new Set(insertedData.map(item => item.category).filter(Boolean))
        );
        setCategories(['All', ...uniqueCategories]);
        
        toast({
          title: "Sample menu items loaded",
          description: "We've loaded some sample menu items for you.",
        });
      }
    } catch (error) {
      console.error('Error creating default food items:', error);
      if (isMounted) {
        toast({
          title: "Error",
          description: "Could not load menu items.",
          variant: "destructive",
        });
      }
    }
  };

  return { foodItems, categories, isLoading };
};
