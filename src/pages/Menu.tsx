
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuFilters from '@/components/menu/MenuFilters';
import MenuGrid from '@/components/menu/MenuGrid';
import LoadingState from '@/components/menu/LoadingState';
import EmptyState from '@/components/menu/EmptyState';
import { useFoodItems } from '@/hooks/menu/useFoodItems';
import { useMenuFilters } from '@/hooks/menu/useMenuFilters';

const Menu = () => {
  const { foodItems, categories, isLoading } = useFoodItems();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gym-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Our Menu</h1>
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
