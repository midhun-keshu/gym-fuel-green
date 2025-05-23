
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Format the order status to be more human-readable
export const formatOrderStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Order Pending';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

// Get the appropriate color scheme for each status
export const getStatusColorScheme = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Update an order's status (admin functionality)
export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus.toLowerCase() })
      .eq('id', orderId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error };
  }
};
