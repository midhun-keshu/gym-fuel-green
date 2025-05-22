
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon, UserIcon, MenuIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gym-600">GymFuel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gym-600 font-medium">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-gym-600 font-medium">Menu</Link>
            <Link to="/about" className="text-gray-700 hover:text-gym-600 font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gym-600 font-medium">Contact</Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-gym-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  0
                </span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gym-600 hover:bg-gym-700 text-white">Register</Button>
            </Link>
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
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-gym-600 font-medium py-2">Home</Link>
              <Link to="/menu" className="text-gray-700 hover:text-gym-600 font-medium py-2">Menu</Link>
              <Link to="/about" className="text-gray-700 hover:text-gym-600 font-medium py-2">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-gym-600 font-medium py-2">Contact</Link>
              <div className="pt-2 border-t border-gray-200 flex flex-col space-y-3">
                <Link to="/cart" className="flex items-center justify-between">
                  <span className="text-gray-700 hover:text-gym-600 font-medium">Cart</span>
                  <span className="bg-gym-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    0
                  </span>
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-gym-600 font-medium py-2">Login</Link>
                <Link to="/register">
                  <Button className="bg-gym-600 hover:bg-gym-700 text-white w-full">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
