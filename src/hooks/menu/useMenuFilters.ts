
import { useState, useMemo } from 'react';
import { FoodItem } from '@/types/food';

export const useMenuFilters = (foodItems: FoodItem[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [foodItems, searchTerm, selectedCategory]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'protein') {
        const proteinA = a.protein_grams || 0;
        const proteinB = b.protein_grams || 0;
        return proteinB - proteinA;
      }
      
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });
  }, [filteredItems, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
    sortedItems,
    resetFilters
  };
};
