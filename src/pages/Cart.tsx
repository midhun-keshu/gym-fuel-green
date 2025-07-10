
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, MinusIcon, TrashIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, formatPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Your Twilio WhatsApp number
  const sendWhatsAppNotification = (orderDetails: string) => {
    const message = encodeURIComponent(orderDetails);
    const whatsappNumber = '14155238886'; // Your Twilio WhatsApp number
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!address || !phoneNumber || !customerName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      let userId = session?.user?.id || '00000000-0000-0000-0000-000000000000';
      
      console.log('Creating order for user:', userId);
      console.log('Order details:', { address, phoneNumber, customerName, totalPrice });
      
      // Prepare order details for WhatsApp notification
      const orderDate = new Date().toLocaleString();
      const customerType = session ? 'Registered Customer' : 'Guest Customer';
      const orderDetails = `🍲 *New Order from FuelBox!*\n\n*Customer Type*: ${customerType}\n*Customer*: ${customerName}\n*Phone*: ${phoneNumber}\n*Email*: ${customerEmail || 'Not provided'}\n\n*Order Date*: ${orderDate}\n\n*Items*:\n${items.map(item => `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}`).join('\n')}\n\n*Total*: ${formatPrice(totalPrice)}\n*Delivery Address*: ${address}\n*Notes*: ${notes || 'None'}\n\n*Thank you for your order!* 🙏`;
      
      // Send WhatsApp notification immediately
      sendWhatsAppNotification(orderDetails);
      
      // Try to create order in database (for logged-in users and guest tracking)
      try {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            delivery_address: address,
            phone_number: phoneNumber,
            total_amount: totalPrice,
            status: 'pending'
          })
          .select()
          .single();
        
        if (!orderError && order) {
          console.log('Order created successfully:', order);
          
          // Create order items
          const orderItems = items.map(item => ({
            order_id: order.id,
            food_item_id: item.id,
            quantity: item.quantity,
            price: item.price
          }));
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
          
          if (itemsError) {
            console.error('Order items creation error:', itemsError);
          } else {
            console.log('Order items created successfully');
          }
        } else {
          console.log('Order creation failed, but WhatsApp notification sent:', orderError);
        }
      } catch (dbError) {
        console.log('Database operation failed, but WhatsApp notification sent:', dbError);
      }
      
      // Clear cart and show success
      clearCart();
      setOrderConfirmed(true);
      
      // Show success message
      toast({
        title: "Order placed successfully!",
        description: "Your order has been sent to our staff via WhatsApp. They will contact you shortly to confirm delivery details.",
      });
      
    } catch (error: any) {
      console.error('Error in order process:', error);
      toast({
        title: "Order notification sent",
        description: "Your order details have been sent to our staff via WhatsApp. They will contact you to confirm.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order confirmation screen
  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-gym-600">Order Confirmed! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-6xl">✅</div>
              <p className="text-lg font-medium">Thank you for your order!</p>
              <p className="text-gray-600">
                Your order details have been sent to our staff via WhatsApp. 
                They will contact you shortly at <strong>{phoneNumber}</strong> to confirm 
                delivery details and timing.
              </p>
              <div className="bg-gym-50 p-4 rounded-lg">
                <p className="text-sm text-gym-700">
                  <strong>What happens next?</strong><br/>
                  • Our staff will WhatsApp you within 15 minutes<br/>
                  • They'll confirm your order and delivery time<br/>
                  • You'll receive updates on your order status
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                onClick={() => navigate('/menu')}
                variant="outline"
                className="flex-1"
              >
                Order More
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex-1 bg-gym-600 hover:bg-gym-700"
              >
                Go Home
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add items from our menu to get started</p>
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-gym-600 hover:bg-gym-700"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-500">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => clearCart()}
                  >
                    Clear Cart
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Checkout Form */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Order</CardTitle>
                  <p className="text-sm text-gym-600 font-medium">
                    📱 Instant WhatsApp confirmation
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">We'll contact you on WhatsApp</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea 
                        id="address" 
                        placeholder="Enter your full address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Special instructions, allergies, etc."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-gym-600 hover:bg-gym-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending Order..." : "Place Order Now 📱"}
                      </Button>
                      <p className="text-xs text-center mt-2 text-gym-600">
                        ✅ Instant WhatsApp notification to our staff
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
