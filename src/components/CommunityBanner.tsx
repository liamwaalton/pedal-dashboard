
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cloud {
  top: string;
  left: string;
  size: string;
  delay: string;
}

// Generate some random clouds
const clouds: Cloud[] = [
  { top: '20%', left: '15%', size: 'w-16 h-8', delay: '0s' },
  { top: '10%', left: '60%', size: 'w-20 h-10', delay: '1s' },
  { top: '35%', left: '75%', size: 'w-14 h-7', delay: '2s' },
  { top: '15%', left: '35%', size: 'w-12 h-6', delay: '3s' },
];

const CommunityBanner = () => {
  return (
    <div className="relative overflow-hidden bg-bike-blue rounded-3xl h-80 flex flex-col justify-end p-6 mb-6 animate-scale-in">
      {/* Clouds */}
      {clouds.map((cloud, index) => (
        <div
          key={index}
          className={`cloud ${cloud.size}`}
          style={{
            top: cloud.top,
            left: cloud.left,
            animationDelay: cloud.delay,
          }}
        />
      ))}
      
      {/* Green hill */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-bike-green rounded-t-[80px] rounded-b-3xl opacity-80" />
      
      {/* Tree */}
      <div className="absolute bottom-20 right-20 w-16 h-32">
        <div className="w-16 h-16 bg-bike-green rounded-full absolute -top-6" />
        <div className="w-12 h-12 bg-bike-green rounded-full absolute top-2 -left-4" />
        <div className="w-14 h-14 bg-yellow-400 rounded-full absolute top-0 left-4" />
        <div className="w-4 h-16 bg-yellow-700 absolute bottom-0 left-6" />
      </div>
      
      {/* Cyclist SVG */}
      <div className="absolute bottom-8 left-36 transform -translate-x-1/2">
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bike Wheels */}
          <circle cx="20" cy="40" r="15" stroke="white" strokeWidth="2" fill="transparent" />
          <circle cx="80" cy="40" r="15" stroke="white" strokeWidth="2" fill="transparent" />
          
          {/* Bike Frame */}
          <line x1="20" y1="40" x2="50" y2="20" stroke="white" strokeWidth="2" />
          <line x1="50" y1="20" x2="80" y2="40" stroke="white" strokeWidth="2" />
          <line x1="20" y1="40" x2="60" y2="40" stroke="white" strokeWidth="2" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="white" strokeWidth="2" />
          <line x1="50" y1="20" x2="60" y2="40" stroke="white" strokeWidth="2" />
          
          {/* Cyclist */}
          <circle cx="50" cy="10" r="8" fill="#FFD700" /> {/* Head */}
          <line x1="50" y1="18" x2="50" y2="30" stroke="#FFD700" strokeWidth="3" /> {/* Body */}
          <line x1="50" y1="22" x2="60" y2="30" stroke="#FFD700" strokeWidth="2" /> {/* Arm */}
          <line x1="50" y1="30" x2="40" y2="40" stroke="#FFD700" strokeWidth="2" /> {/* Leg */}
          <line x1="50" y1="30" x2="60" y2="40" stroke="#FFD700" strokeWidth="2" /> {/* Leg */}
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-white text-3xl font-bold mb-2">Join our Cycling Community</h2>
        <p className="text-white opacity-80 mb-4 max-w-xs">
          By joining this collection, you will get acquainted with a variety of cycling sports and bike routes.
        </p>
        <Button className="bg-white text-bike-blue rounded-full px-4 py-2 font-medium hover:bg-opacity-90 transition-all inline-flex items-center">
          Welcome to Group 
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default CommunityBanner;
