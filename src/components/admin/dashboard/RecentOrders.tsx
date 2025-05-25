
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  phone_number: string;
  delivery_address: string;
}

interface RecentOrdersProps {
  orders: Order[];
  isLoading: boolean;
  formatDate: (dateString: string) => string;
  formatPrice: (price: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ 
  orders, 
  isLoading, 
  formatDate, 
  formatPrice, 
  getStatusBadge 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gym-600 border-r-transparent"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700">Order ID</TableHead>
                  <TableHead className="text-gray-700">Date</TableHead>
                  <TableHead className="text-gray-700">Amount</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-gray-900">
                      #{order.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatPrice(order.total_amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers start placing them</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
