
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AccessDenied = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg mb-8">You don't have permission to access this page.</p>
        <Button onClick={() => navigate('/')}>Return to Homepage</Button>
      </div>
      <Footer />
    </div>
  );
};

export default AccessDenied;
