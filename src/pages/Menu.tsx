
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuFilters from '@/components/menu/MenuFilters';
import MenuGrid from '@/components/menu/MenuGrid';
import LoadingState from '@/components/menu/LoadingState';
import EmptyState from '@/components/menu/EmptyState';
import { useFoodItems } from '@/hooks/menu/useFoodItems';
import { useMenuFilters } from '@/hooks/menu/useMenuFilters';

const Menu = () => {
  const { foodItems, categories, isLoading, refetch } = useFoodItems();
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
    sortedItems,
    resetFilters
  } = useMenuFilters(foodItems);

  const handleForceRefresh = () => {
    console.log('🔄 Force refreshing menu...');
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gym-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Our Menu</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleForceRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Menu
            </Button>
          </div>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our selection of protein-rich meals designed to complement your workout routine
            and help you achieve your fitness goals.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <MenuFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />

        {isLoading ? (
          <LoadingState />
        ) : sortedItems.length > 0 ? (
          <MenuGrid items={sortedItems} />
        ) : (
          <EmptyState onReset={resetFilters} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Menu;
