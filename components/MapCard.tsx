'use client';

import React from 'react';
import { Map, Navigation, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

const MapCard = () => {
  const { isLoggedIn, login } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="bike-card p-6 h-[400px] flex flex-col items-center justify-center text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <Map className="h-8 w-8 text-bike-blue" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">View Your Ride Map</h3>
        <p className="text-gray-600 mb-4">Connect with Strava to visualize your rides on the map</p>
        <Button 
          onClick={login}
          className="bg-[#FC4C02] hover:bg-[#e64500] text-white rounded-full gap-2"
        >
          <LogIn size={18} />
          Connect with Strava
        </Button>
      </div>
    );
  }

  return (
    <div className="bike-card relative h-[400px] flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-bike-blue">
          <Navigation size={16} />
        </div>
      </div>
      
      <div className="rounded-xl overflow-hidden relative mb-4 flex-grow group">
        {/* Stylish map implementation */}
        <div className="absolute inset-0 bg-gradient-to-br from-bike-blue/10 to-bike-blue/40 z-10"></div>
        
        <div className="absolute inset-0 bg-white">
          {/* Map background with grid */}
          <div className="w-full h-full bg-white opacity-90" 
               style={{ 
                 backgroundImage: `
                   linear-gradient(#3E82FF20 1px, transparent 1px),
                   linear-gradient(90deg, #3E82FF20 1px, transparent 1px)
                 `,
                 backgroundSize: '20px 20px'
               }}>
          </div>
          
          {/* Decorative map elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-bike-blue/5 rounded-full"></div>
            <div className="absolute w-20 h-20 bg-bike-blue/10 rounded-full animate-pulse"></div>
          </div>
          
          {/* Map route */}
          <div className="absolute top-1/2 left-0 w-full h-1/3 transform -translate-y-1/2">
            <svg width="100%" height="100%" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,50 C50,20 100,80 150,50 C200,20 250,80 300,50" stroke="#6B4BFF" strokeWidth="3" strokeDasharray="5 5" />
              <path d="M30,50 L270,50" stroke="#FF6934" strokeWidth="3" />
            </svg>
          </div>
          
          {/* Origin marker */}
          <div className="absolute bottom-10 left-10">
            <div className="w-6 h-6 bg-bike-blue rounded-full flex items-center justify-center text-white">
              <Map size={12} />
            </div>
          </div>
          
          {/* Destination marker */}
          <div className="absolute top-12 right-14">
            <div className="w-8 h-8 bg-bike-orange rounded-full flex items-center justify-center text-white shadow-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Hover overlay for interaction indication */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-20 flex items-center justify-center">
          <span className="text-bike-blue bg-white rounded-full px-3 py-1 text-xs font-medium shadow-md">View Details</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-auto">
        <div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-bike-orange rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapCard; 