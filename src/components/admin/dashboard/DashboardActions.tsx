
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

const DashboardActions: React.FC = () => {
  return (
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
  );
};

export default DashboardActions;
