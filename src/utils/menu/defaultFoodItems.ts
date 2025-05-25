
import { supabase } from '@/integrations/supabase/client';
import { FoodItem } from '@/types/food';

export const createDefaultFoodItems = async (): Promise<FoodItem[]> => {
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
    console.error('❌ Error inserting default food items:', insertError);
    throw insertError;
  }

  return insertedData as FoodItem[];
};
