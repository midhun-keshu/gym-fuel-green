
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
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      console.log('📊 Loading admin dashboard data...');
      setDashboardLoading(true);
      
      // Fetch recent orders with better error handling
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount, phone_number, delivery_address')
          .order('created_at', { ascending: false })
          .limit(5);

        if (ordersError && !ordersError.message.includes('relation "orders" does not exist')) {
          console.error('❌ Orders fetch error:', ordersError);
        } else {
          console.log('✅ Fetched orders:', ordersData?.length || 0, 'items');
          setOrders(ordersData || []);
        }
      } catch (error) {
        console.log('⚠️ Orders table not available, skipping...');
        setOrders([]);
      }

      // Fetch user profiles with better error handling
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, phone_number, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (profilesError && !profilesError.message.includes('relation "profiles" does not exist')) {
          console.error('❌ Profiles fetch error:', profilesError);
        } else {
          console.log('✅ Fetched profiles:', profilesData?.length || 0, 'items');
          setUsers(profilesData || []);
        }
      } catch (error) {
        console.log('⚠️ Profiles table not available, skipping...');
        setUsers([]);
      }

      // Fetch dashboard statistics with better error handling
      let totalRevenue = 0;
      let totalOrders = 0;
      let totalUsers = 0;
      let totalFoodItems = 0;

      try {
        // Get orders data
        const { data: ordersStatsData, error: ordersStatsError } = await supabase
          .from('orders')
          .select('total_amount');

        if (!ordersStatsError && ordersStatsData) {
          totalOrders = ordersStatsData.length;
          totalRevenue = ordersStatsData.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
          console.log('✅ Orders stats:', { totalOrders, totalRevenue });
        }
      } catch (error) {
        console.log('⚠️ Orders stats not available');
      }

      try {
        // Get users count
        const { count: usersCount, error: usersCountError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (!usersCountError) {
          totalUsers = usersCount || 0;
          console.log('✅ Users count:', totalUsers);
        }
      } catch (error) {
        console.log('⚠️ Users count not available');
      }

      try {
        // Get food items count
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

      const stats = {
        totalOrders,
        totalUsers,
        totalRevenue,
        totalFoodItems
      };

      console.log('📊 Dashboard statistics loaded:', stats);
      setDashboardStats(stats);

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      toast({
        title: "Loading Error",
        description: "Some dashboard data could not be loaded. This is normal for new setups.",
        variant: "destructive",
      });
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
