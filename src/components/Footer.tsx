
import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 pt-16 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-gym-600 mb-4">GymFuel</h3>
            <p className="text-gray-600 mb-4">
              Providing nutrition designed for fitness enthusiasts. Our meal plans are created to complement your workout routine.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gym-600">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gym-600">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gym-600">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gym-600">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-gray-600 hover:text-gym-600">Our Menu</Link>
              </li>
              <li>
                <Link to="/meal-plans" className="text-gray-600 hover:text-gym-600">Meal Plans</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gym-600">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gym-600">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gym-600">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Meal Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Meal Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/high-protein" className="text-gray-600 hover:text-gym-600">High Protein</Link>
              </li>
              <li>
                <Link to="/category/low-carb" className="text-gray-600 hover:text-gym-600">Low Carb</Link>
              </li>
              <li>
                <Link to="/category/vegan" className="text-gray-600 hover:text-gym-600">Vegan</Link>
              </li>
              <li>
                <Link to="/category/keto" className="text-gray-600 hover:text-gym-600">Keto Friendly</Link>
              </li>
              <li>
                <Link to="/category/bulking" className="text-gray-600 hover:text-gym-600">Bulking Plans</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600">
              <p className="mb-2">123 Fitness Street</p>
              <p className="mb-2">Protein City, PC 12345</p>
              <p className="mb-4">United States</p>
              <p className="mb-2">Email: info@gymfuel.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 py-6">
          <p className="text-center text-gray-600">
            &copy; {new Date().getFullYear()} GymFuel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
