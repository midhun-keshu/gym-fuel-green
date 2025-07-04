
-- First, let's check if RLS is enabled and disable it for food_items since this should be publicly readable
ALTER TABLE public.food_items DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled, create a policy that allows public read access
-- ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to food items" ON public.food_items FOR SELECT USING (true);

-- Let's also ensure there are some food items in the database for testing
INSERT INTO public.food_items (name, description, price, category, protein_grams, calories, available) 
VALUES 
  ('Grilled Chicken Bowl', 'High-protein grilled chicken with quinoa and vegetables', 1299, 'Main Course', 35, 450, true),
  ('Protein Smoothie', 'Post-workout protein smoothie with banana and berries', 899, 'Beverages', 25, 280, true),
  ('Turkey Wrap', 'Lean turkey breast wrap with fresh vegetables', 1099, 'Wraps', 28, 380, true)
ON CONFLICT (id) DO NOTHING;
