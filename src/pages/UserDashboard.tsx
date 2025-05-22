
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserIcon, PackageIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderHistory from '@/components/OrderHistory';

const UserDashboard = () => {
  const { toast } = useToast();
  const [name, setName] = React.useState('John Doe');
  const [email, setEmail] = React.useState('john.doe@example.com');
  const [phone, setPhone] = React.useState('(123) 456-7890');
  const [address, setAddress] = React.useState('123 Main St, City, State, 12345');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Hello, John</CardTitle>
                <div className="flex justify-center my-4">
                  <div className="bg-gym-100 h-20 w-20 rounded-full flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-gym-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <PackageIcon className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Delivery Address</Label>
                        <Input 
                          id="address" 
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)} 
                        />
                      </div>
                      <Button type="submit" className="bg-gym-600 hover:bg-gym-700">Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OrderHistory />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
