
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAdminCheck } from '@/hooks/admin/useAdminCheck';
import AccessDenied from '@/components/admin/AccessDenied';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdminCheck();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalFoodItems: 0
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    if (isAdmin) {
      loadDashboardData(isMounted);
    }
    
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const loadDashboardData = async (isMounted: boolean = true) => {
    try {
      if (isMounted) setDashboardLoading(true);
      console.log('Loading dashboard data...');
      
      // Fetch recent orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, 
          created_at, 
          status, 
          total_amount, 
          phone_number, 
          delivery_address
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersError) {
        console.error('Orders error:', ordersError);
      } else {
        console.log('Orders data:', ordersData);
        if (isMounted) setOrders(ordersData || []);
      }

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (profilesError) {
        console.error('Profiles error:', profilesError);
      } else {
        console.log('Profiles data:', profilesData);
        if (isMounted) setUsers(profilesData || []);
      }

      // Fetch dashboard statistics
      const [ordersCount, usersCount, foodItemsCount] = await Promise.all([
        supabase.from('orders').select('total_amount', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('food_items').select('*', { count: 'exact', head: true })
      ]);

      // Calculate total revenue
      let totalRevenue = 0;
      if (ordersCount.data) {
        totalRevenue = ordersCount.data.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      }

      if (isMounted) {
        setDashboardStats({
          totalOrders: ordersCount.count || 0,
          totalUsers: usersCount.count || 0,
          totalRevenue: totalRevenue,
          totalFoodItems: foodItemsCount.count || 0
        });
      }

      console.log('Dashboard stats:', {
        totalOrders: ordersCount.count || 0,
        totalUsers: usersCount.count || 0,
        totalRevenue: totalRevenue,
        totalFoodItems: foodItemsCount.count || 0
      });

    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
      if (isMounted) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted) setDashboardLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Processing</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-600">
              Admin credentials: <strong>admin@gymfood.com</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>
        
        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(dashboardStats.totalRevenue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Food Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalFoodItems}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Access */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/food-management">
              <Button className="w-full bg-gym-600 hover:bg-gym-700">
                <PlusIcon className="mr-2 h-4 w-4" />
                Manage Food Items
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent orders section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gym-600 border-r-transparent"></div>
                </div>
              ) : orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>{formatPrice(order.total_amount)}</TableCell>
                        <TableCell>{getStatusBadgeVariant(order.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">No orders found</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recent users section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gym-600 border-r-transparent"></div>
                </div>
              ) : users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.phone_number || 'N/A'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">No users found</p>
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
