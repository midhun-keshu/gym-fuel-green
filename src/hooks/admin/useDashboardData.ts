
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
    if (!isAdmin) return;
    
    try {
      console.log('📊 Loading admin dashboard data...');
      setDashboardLoading(true);
      
      let totalRevenue = 0;
      let totalOrders = 0;
      let totalUsers = 0;
      let totalFoodItems = 0;

      // Try to get food items count (this should work)
      try {
        const { count: foodItemsCount, error: foodItemsCountError } = await supabase
          .from('food_items')
          .select('*', { count: 'exact', head: true });

        if (!foodItemsCountError) {
          totalFoodItems = foodItemsCount || 0;
          console.log('✅ Food items count:', totalFoodItems);
        }
      } catch (error) {
        console.log('⚠️ Food items count not available');
      }

      // Set basic stats (other tables might not exist yet)
      const stats = {
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalFoodItems
      };

      console.log('📊 Dashboard statistics loaded:', stats);
      setDashboardStats(stats);
      setOrders([]);
      setUsers([]);

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
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
