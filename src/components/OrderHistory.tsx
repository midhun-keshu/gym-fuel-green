
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OrderDetail from './OrderDetail';
import { formatOrderStatus, getStatusColorScheme } from '@/utils/orderUtils';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  address: string;
  phoneNumber: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in
        setLoading(false);
        return;
      }
      
      try {
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        
        // For each order, fetch its items
        const ordersWithItems = await Promise.all(ordersData.map(async (order) => {
          // Fetch order items
          const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              price,
              food_items (
                name
              )
            `)
            .eq('order_id', order.id);
          
          if (itemsError) throw itemsError;

          return {
            id: order.id,
            date: order.created_at,
            status: order.status,
            total: order.total_amount,
            items: orderItems.map((item) => ({
              id: item.id,
              name: item.food_items.name,
              quantity: item.quantity,
              price: item.price
            })),
            address: order.delivery_address,
            phoneNumber: order.phone_number
          };
        }));
        
        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error loading orders",
          description: "There was a problem retrieving your order history.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [toast]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gym-600 border-r-transparent"></div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Button 
            className="mt-4 bg-gym-600 hover:bg-gym-700 transition-transform hover:scale-105"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColorScheme(order.status)}>
                      {formatOrderStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                      className="transition-colors hover:bg-gym-100"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedOrder && (
        <OrderDetail
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          orderId={selectedOrder.id}
          date={selectedOrder.date}
          status={selectedOrder.status}
          total={selectedOrder.total}
          items={selectedOrder.items}
          address={selectedOrder.address}
          phoneNumber={selectedOrder.phoneNumber}
        />
      )}
    </div>
  );
};

export default OrderHistory;
