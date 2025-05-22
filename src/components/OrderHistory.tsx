
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';

// Sample order data
const orders = [
  {
    id: 'ORD-001',
    date: '2023-05-15',
    status: 'Delivered',
    total: 42.97,
    items: 3
  },
  {
    id: 'ORD-002',
    date: '2023-05-08',
    status: 'Delivered',
    total: 67.50,
    items: 5
  },
  {
    id: 'ORD-003',
    date: '2023-04-27',
    status: 'Delivered',
    total: 29.99,
    items: 2
  }
];

const OrderHistory: React.FC = () => {
  return (
    <div>
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Button className="mt-4 bg-gym-600 hover:bg-gym-700">Browse Menu</Button>
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
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <EyeIcon className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
