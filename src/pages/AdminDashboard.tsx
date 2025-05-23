
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
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setDashboardLoading(true);
    try {
      // Fetch recent orders with joined data
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
        throw ordersError;
      }

      setOrders(ordersData || []);

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (profilesError) {
        throw profilesError;
      }

      setUsers(profilesData || []);
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/admin/food-management">
              <Button className="bg-gym-600 hover:bg-gym-700 transition-transform hover:scale-105">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Food Item
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="transition-all duration-300 hover:shadow-lg bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Admin Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/admin-dashboard" 
                className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              
              <Link to="/admin/food-management" 
                className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
                <span className="text-sm font-medium">Food Items</span>
              </Link>
              
              <Link to="/admin/orders" 
                className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
                <span className="text-sm font-medium">Orders</span>
              </Link>
              
              <Link to="/admin/users" 
                className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
                <span className="text-sm font-medium">Users</span>
              </Link>
              
              <Link to="/admin/analytics" 
                className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
                <span className="text-sm font-medium">Analytics</span>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent orders section */}
            <Card className="animate-fade-in">
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
            <Card className="animate-fade-in">
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
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
