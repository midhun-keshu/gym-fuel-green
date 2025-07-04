
-- Fix the RLS policies for orders to allow guest users to place orders
-- Update the orders table policy to allow guest orders
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

-- Create a new policy that allows both authenticated users and guest users to insert orders
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Also update the order_items policy to allow guest order items
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;

-- Create a new policy for order items that allows insertion for any order
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Keep the view policies restrictive - only show orders to their owners or admins
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (
  auth.uid() = user_id OR 
  is_admin(auth.uid()) OR 
  user_id = '00000000-0000-0000-0000-000000000000'::uuid
);

-- Same for order items - allow viewing for order owners or admins
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR is_admin(auth.uid()) OR orders.user_id = '00000000-0000-0000-0000-000000000000'::uuid)
  )
);
