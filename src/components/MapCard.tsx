
import React from 'react';
import SearchInput from './SearchInput';

const MapCard = () => {
  return (
    <div className="bike-card relative animate-fade-in">
      <div className="mb-4">
        <SearchInput placeholder="Search Location ..." />
      </div>
      
      <div className="h-40 bg-gray-100 rounded-xl overflow-hidden relative mb-6">
        {/* Map placeholder - would be replaced with actual map */}
        <div className="absolute inset-0 bg-gray-200">
          {/* Map route */}
          <div className="absolute top-1/4 left-0 w-full h-1/2">
            <svg width="100%" height="100%" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,50 C50,20 100,80 150,50 C200,20 250,80 300,50" stroke="#6B4BFF" strokeWidth="3" />
              <path d="M30,50 L270,50" stroke="#FF6934" strokeWidth="3" />
            </svg>
          </div>
          
          {/* Destination marker */}
          <div className="absolute bottom-4 right-8">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Your destination</p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#FF6934" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="3" stroke="#FF6934" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-bike-purple w-12 h-12 rounded-full flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="mt-1">
            <p className="text-xl font-bold">00:48:24</p>
            <p className="text-xs text-gray-500">Leased time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
