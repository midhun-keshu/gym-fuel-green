
import { Badge } from '@/components/ui/badge';
import React from 'react';

export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatPrice = (price: number) => {
  if (!price) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
    processing: { className: "bg-blue-100 text-blue-800", label: "Processing" },
    delivered: { className: "bg-green-100 text-green-800", label: "Delivered" },
    cancelled: { className: "bg-red-100 text-red-800", label: "Cancelled" }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || { className: "", label: status };
  
  return React.createElement(Badge, { className: config.className }, config.label);
};
