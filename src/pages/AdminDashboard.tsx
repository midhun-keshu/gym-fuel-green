
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAdminCheck } from '@/hooks/admin/useAdminCheck';
import AccessDenied from '@/components/admin/AccessDenied';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';
import { useDashboardData } from '@/hooks/admin/useDashboardData';
import { formatDate, formatPrice, getStatusBadge } from '@/utils/admin/dashboardHelpers';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import DashboardActions from '@/components/admin/dashboard/DashboardActions';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import RecentUsers from '@/components/admin/dashboard/RecentUsers';

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdminCheck();
  const { orders, users, dashboardStats, dashboardLoading, loadDashboardData } = useDashboardData(isAdmin);

  const handleRefreshDashboard = () => {
    console.log('🔄 Refreshing dashboard...');
    loadDashboardData();
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
        
        <DashboardStats 
          stats={dashboardStats} 
          isLoading={dashboardLoading} 
          formatPrice={formatPrice} 
        />
        
        <DashboardActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders 
            orders={orders}
            isLoading={dashboardLoading}
            formatDate={formatDate}
            formatPrice={formatPrice}
            getStatusBadge={getStatusBadge}
          />
          
          <RecentUsers 
            users={users}
            isLoading={dashboardLoading}
            formatDate={formatDate}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
