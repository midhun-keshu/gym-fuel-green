
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon, UserIcon, MenuIcon, LogOutIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Check for user session on component mount
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Check if user is admin
      if (session?.user) {
        // Check by email first (hardcoded admin)
        if (session.user.email === 'admin@gymfood.com') {
          setIsAdmin(true);
          return;
        }
        
        // Then check database role
        try {
          const { data: isAdminResult } = await supabase
            .rpc('is_admin', { uid: session.user.id });
          setIsAdmin(isAdminResult === true);
        } catch (error) {
          console.log('Admin check failed:', error);
          setIsAdmin(false);
        }
      }
    };
    
    getSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      // Check if user is admin
      if (session?.user) {
        // Check by email first (hardcoded admin)
        if (session.user.email === 'admin@gymfood.com') {
          setIsAdmin(true);
          return;
        }
        
        // Then check database role
        try {
          const { data: isAdminResult } = await supabase
            .rpc('is_admin', { uid: session.user.id });
          setIsAdmin(isAdminResult === true);
        } catch (error) {
          console.log('Admin check failed:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gym-600 transition-transform hover:scale-105">FuelBox</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gym-600 font-medium transition-colors duration-300">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-gym-600 font-medium transition-colors duration-300">Menu</Link>
            <Link to="/about" className="text-gray-700 hover:text-gym-600 font-medium transition-colors duration-300">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gym-600 font-medium transition-colors duration-300">Contact</Link>
            {isAdmin && (
              <Link to="/admin-dashboard" className="text-gray-700 hover:text-gym-600 font-medium transition-colors duration-300">Admin</Link>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative transition-transform hover:scale-105">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gym-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs animate-fade-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/user-dashboard">
                  <Button variant="ghost" className="text-gray-700 flex items-center transition-colors hover:text-gym-600 duration-300">
                    <UserIcon className="h-5 w-5 mr-2" />
                    My Account
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 flex items-center transition-colors hover:text-red-600 duration-300"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 flex items-center transition-colors hover:text-gym-600 duration-300">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gym-600 hover:bg-gym-700 text-white transition-transform hover:scale-105">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <MenuIcon className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-gym-600 font-medium py-2 transition-colors duration-300">Home</Link>
              <Link to="/menu" className="text-gray-700 hover:text-gym-600 font-medium py-2 transition-colors duration-300">Menu</Link>
              <Link to="/about" className="text-gray-700 hover:text-gym-600 font-medium py-2 transition-colors duration-300">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-gym-600 font-medium py-2 transition-colors duration-300">Contact</Link>
              {isAdmin && (
                <Link to="/admin-dashboard" className="text-gray-700 hover:text-gym-600 font-medium py-2 transition-colors duration-300">Admin</Link>
              )}
              <div className="pt-2 border-t border-gray-200 flex flex-col space-y-3">
                <Link to="/cart" className="flex items-center justify-between">
                  <span className="text-gray-700 hover:text-gym-600 font-medium transition-colors duration-300">Cart</span>
                  {totalItems > 0 && (
                    <span className="bg-gym-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </span>
                  )}
                </Link>
                
                {user ? (
                  <>
                    <Link to="/user-dashboard" className="text-gray-700 hover:text-gym-600 font-medium py-2 transition-colors duration-300">My Account</Link>
                    <Button 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 font-medium justify-start px-0 transition-colors duration-300"
                      onClick={handleLogout}
                    >
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-gym-600 font-medium py-2 transition-colors duration-300">Login</Link>
                    <Link to="/register">
                      <Button className="bg-gym-600 hover:bg-gym-700 text-white w-full transition-transform hover:scale-105">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
