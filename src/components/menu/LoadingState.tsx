
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gym-600 border-r-transparent"></div>
      <p className="mt-4 text-lg">Loading delicious meals...</p>
      <p className="mt-2 text-sm text-gray-500">Please wait while we fetch our menu</p>
    </div>
  );
};

export default LoadingState;
