
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  address: string;
  phoneNumber: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  open,
  onClose,
  orderId,
  date,
  status,
  total,
  items,
  address,
  phoneNumber,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order #{orderId.substring(0, 8)}</span>
            <Badge variant="outline" className={
              status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
              status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
              'bg-yellow-100 text-yellow-800 border-yellow-200'
            }>
              {status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Placed on {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Delivery Details</h3>
            <div className="text-sm text-gray-500">
              <p>Address: {address}</p>
              <p>Phone: {phoneNumber}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                  <TableCell className="text-right font-bold">${total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>A confirmation was sent to your WhatsApp number.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetail;
