
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
      
      {/* Person on bike */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        {/* This would ideally be an SVG or image */}
        <div className="h-20 w-20 bg-yellow-400 opacity-0"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-white text-3xl font-bold mb-2">join our Comminety</h2>
        <p className="text-white opacity-80 mb-4 max-w-xs">
          By joining this collection, you will get acquainted with a variety of cycling sports.
        </p>
        <Button className="bg-white text-bike-blue rounded-full px-4 py-2 font-medium hover:bg-opacity-90 transition-all inline-flex items-center">
          Wellcome to Group 
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default CommunityBanner;
