
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gym-600">404</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Page not found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            We're sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-gym-600 hover:bg-gym-700 text-white">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
