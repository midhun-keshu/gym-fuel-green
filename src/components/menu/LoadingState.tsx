
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gym-600 border-r-transparent"></div>
      <p className="mt-4 text-lg">Loading delicious meals...</p>
      <p className="mt-2 text-sm text-gray-500">Connecting to database and fetching menu items</p>
      <div className="mt-4 max-w-md mx-auto">
        <div className="bg-gym-50 border border-gym-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            If this takes more than a few seconds, check the browser console for detailed logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
