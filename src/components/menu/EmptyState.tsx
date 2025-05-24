
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onReset: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">No menu items match your search.</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onReset}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default EmptyState;
