
export interface FoodItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  protein_grams: number | null;
  calories: number | null;
  available: boolean;
  created_at: string;
}
