import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAdminCheck } from '@/hooks/admin/useAdminCheck';
import AccessDenied from '@/components/admin/AccessDenied';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdminCheck();
  
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
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <p className="text-gray-500">Recent order information will appear here.</p>
            </div>
            
            {/* Analytics section */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">FuelBox Analytics</h2>
              <p className="text-gray-500">Store performance analytics will appear here.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
