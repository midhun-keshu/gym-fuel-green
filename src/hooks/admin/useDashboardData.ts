
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  phone_number: string;
  delivery_address: string;
}

interface User {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  created_at: string;
}

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalFoodItems: number;
}

export const useDashboardData = (isAdmin: boolean) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalFoodItems: 0
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const loadDashboardData = async () => {
    if (!isAdmin) {
      console.log('❌ User is not admin, skipping dashboard data load');
      return;
    }
    
    try {
      console.log('📊 Loading admin dashboard data...');
      setDashboardLoading(true);
      
      let totalFoodItems = 0;

      // Get food items count (this should work with the new RLS policy)
      try {
        const { count: foodItemsCount, error: foodItemsCountError } = await supabase
          .from('food_items')
          .select('*', { count: 'exact', head: true });

        if (!foodItemsCountError && foodItemsCount !== null) {
          totalFoodItems = foodItemsCount;
          console.log('✅ Food items count:', totalFoodItems);
        } else {
          console.log('⚠️ Could not get food items count:', foodItemsCountError);
        }
      } catch (error) {
        console.log('⚠️ Food items count error:', error);
      }

      // Try to get orders count
      let totalOrders = 0;
      try {
        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        if (!ordersError && ordersCount !== null) {
          totalOrders = ordersCount;
          console.log('✅ Orders count:', totalOrders);
        }
      } catch (error) {
        console.log('⚠️ Orders count not available:', error);
      }

      // Try to get users count
      let totalUsers = 0;
      try {
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (!usersError && usersCount !== null) {
          totalUsers = usersCount;
          console.log('✅ Users count:', totalUsers);
        }
      } catch (error) {
        console.log('⚠️ Users count not available:', error);
      }

      const stats = {
        totalOrders,
        totalUsers,
        totalRevenue: 0, // Will calculate this when we have order data
        totalFoodItems
      };

      console.log('📊 Dashboard statistics loaded:', stats);
      setDashboardStats(stats);
      setOrders([]);
      setUsers([]);

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      
      // Set default stats on error
      setDashboardStats({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalFoodItems: 0
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    } else {
      // Reset data when not admin
      setDashboardStats({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalFoodItems: 0
      });
      setOrders([]);
      setUsers([]);
      setDashboardLoading(false);
    }
  }, [isAdmin]);

  return {
    orders,
    users,
    dashboardStats,
    dashboardLoading,
    loadDashboardData
  };
};
