
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OrderDetail from './OrderDetail';

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

  useEffect(() => {
    const fetchOrders = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Button 
            className="mt-4 bg-gym-600 hover:bg-gym-700"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewOrder(order)}
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
