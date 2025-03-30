'use client';

import React from 'react';
import { Map, Navigation, LogIn, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

const MapCard = () => {
  const { isLoggedIn, login } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="bike-card-gradient-blue p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <Map className="h-8 w-8 text-bike-blue" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Your Rides</h3>
        <p className="text-gray-600 mb-4 max-w-xs">Connect with Strava to visualize your favorite routes and riding patterns</p>
        <Button 
          onClick={login}
          className="bike-button-orange rounded-lg gap-2 shadow-md"
        >
          <LogIn size={18} />
          Connect with Strava
        </Button>
      </div>
    );
  }

  return (
    <div className="bike-card-gradient-blue p-6 flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <Navigation className="h-4 w-4 text-bike-blue" />
          </div>
          <h2 className="font-medium text-gray-800">Your Routes</h2>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 gap-2">
          <div className="w-2 h-2 rounded-full bg-bike-orange"></div>
          <span>Popular</span>
        </div>
      </div>
      
      <div className="rounded-xl overflow-hidden relative mb-4 flex-grow group">
        {/* Stylish map implementation */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-bike-blue/10 z-10"></div>
        
        <div className="absolute inset-0 bg-white">
          {/* Map background with grid */}
          <div className="w-full h-full bg-white opacity-90" 
               style={{ 
                 backgroundImage: `
                   linear-gradient(#3E82FF10 1px, transparent 1px),
                   linear-gradient(90deg, #3E82FF10 1px, transparent 1px)
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
              <path d="M0,50 C50,20 100,80 150,50 C200,20 250,80 300,50" stroke="#6B4BFF" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M30,50 L270,50" stroke="#FF5A1F" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Origin marker */}
          <div className="absolute bottom-[40%] left-[10%]">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-md -translate-y-3">
              <MapPin size={12} />
            </div>
            <div className="absolute bottom-0 left-3 w-px h-3 bg-blue-500"></div>
          </div>
          
          {/* Destination marker */}
          <div className="absolute top-[40%] right-[10%]">
            <div className="w-8 h-8 bg-bike-orange rounded-lg flex items-center justify-center text-white shadow-md -translate-y-4">
              <MapPin size={16} />
            </div>
            <div className="absolute bottom-0 left-4 w-px h-4 bg-bike-orange"></div>
          </div>
        </div>
        
        {/* Hover overlay for interaction indication */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-20 flex items-center justify-center">
          <span className="text-bike-blue bg-white rounded-lg px-4 py-1.5 text-sm font-medium shadow-md">View Full Map</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="bg-white rounded-lg p-2 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-bike-orange rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Morning Route</span>
          </div>
          <span className="text-xs text-gray-500">5.2 km</span>
        </div>
        
        <div className="bg-white rounded-lg p-2 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Mountain Loop</span>
          </div>
          <span className="text-xs text-gray-500">12.6 km</span>
        </div>
      </div>
    </div>
  );
};

export default MapCard; 