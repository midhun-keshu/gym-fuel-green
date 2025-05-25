
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAdminCheck } from '@/hooks/admin/useAdminCheck';
import AccessDenied from '@/components/admin/AccessDenied';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

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

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdminCheck();
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
  
  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

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
      const statsPromises = [
        supabase.from('orders').select('total_amount').then(result => ({
          type: 'orders',
          data: result.data,
          error: result.error
        })),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).then(result => ({
          type: 'profiles',
          count: result.count,
          error: result.error
        })),
        supabase.from('food_items').select('*', { count: 'exact', head: true }).then(result => ({
          type: 'food_items',
          count: result.count,
          error: result.error
        }))
      ];

      const results = await Promise.allSettled(statsPromises);
      
      let totalRevenue = 0;
      let totalOrders = 0;
      let totalUsers = 0;
      let totalFoodItems = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const data = result.value;
          
          if (data.type === 'orders' && data.data && !data.error) {
            totalOrders = data.data.length;
            totalRevenue = data.data.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
          } else if (data.type === 'profiles' && !data.error) {
            totalUsers = data.count || 0;
          } else if (data.type === 'food_items' && !data.error) {
            totalFoodItems = data.count || 0;
          }
        }
      });

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

  const handleRefreshDashboard = () => {
    console.log('🔄 Refreshing dashboard...');
    loadDashboardData();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      processing: { className: "bg-blue-100 text-blue-800", label: "Processing" },
      delivered: { className: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { className: "bg-red-100 text-red-800", label: "Cancelled" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { className: "", label: status };
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex justify-center items-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gym-600 border-r-transparent"></div>
            <p className="mt-4 text-lg">Checking admin privileges...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshDashboard}
              disabled={dashboardLoading}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className={`h-4 w-4 ${dashboardLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Admin Access: <span className="font-semibold text-green-600">Active</span>
              </p>
              <p className="text-xs text-gray-500">
                Credentials: admin@gymfood.com / admin123
              </p>
            </div>
          </div>
        </div>
        
        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {dashboardLoading ? '...' : dashboardStats.totalOrders}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {dashboardLoading ? '...' : dashboardStats.totalUsers}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                {dashboardLoading ? '...' : formatPrice(dashboardStats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Food Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {dashboardLoading ? '...' : dashboardStats.totalFoodItems}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/food-management">
              <Button className="w-full bg-gym-600 hover:bg-gym-700 text-white">
                <PlusIcon className="mr-2 h-4 w-4" />
                Manage Food Items
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gym-600 border-r-transparent"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-700">Order ID</TableHead>
                        <TableHead className="text-gray-700">Date</TableHead>
                        <TableHead className="text-gray-700">Amount</TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-gray-900">
                            #{order.id.substring(0, 8)}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {formatDate(order.created_at)}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {formatPrice(order.total_amount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found</p>
                  <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers start placing them</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gym-600 border-r-transparent"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-700">User ID</TableHead>
                        <TableHead className="text-gray-700">Name</TableHead>
                        <TableHead className="text-gray-700">Phone</TableHead>
                        <TableHead className="text-gray-700">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium text-gray-900">
                            #{user.id.substring(0, 8)}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {user.full_name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {user.phone_number || 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {formatDate(user.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                  <p className="text-sm text-gray-400 mt-1">Registered users will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
