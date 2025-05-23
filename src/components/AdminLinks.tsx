
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon, ShoppingBagIcon, UtensilsIcon, DollarSignIcon, SettingsIcon } from 'lucide-react';

const AdminLinks: React.FC = () => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Admin Quick Access</CardTitle>
        <CardDescription>Manage your FuelBox store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/admin-dashboard" 
            className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
            <SettingsIcon className="h-6 w-6 text-gym-600 mb-2" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          
          <Link to="/admin/food-management" 
            className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
            <UtensilsIcon className="h-6 w-6 text-gym-600 mb-2" />
            <span className="text-sm font-medium">Food Items</span>
          </Link>
          
          <Link to="/admin/orders" 
            className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
            <ShoppingBagIcon className="h-6 w-6 text-gym-600 mb-2" />
            <span className="text-sm font-medium">Orders</span>
          </Link>
          
          <Link to="/admin/users" 
            className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
            <UsersIcon className="h-6 w-6 text-gym-600 mb-2" />
            <span className="text-sm font-medium">Users</span>
          </Link>
          
          <Link to="/admin/analytics" 
            className="flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300">
            <DollarSignIcon className="h-6 w-6 text-gym-600 mb-2" />
            <span className="text-sm font-medium">Analytics</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLinks;
