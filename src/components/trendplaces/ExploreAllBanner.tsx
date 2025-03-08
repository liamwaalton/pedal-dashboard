
import React from 'react';
import { Button } from '@/components/ui/button';

const ExploreAllBanner = () => {
  return (
    <div className="mt-10">
      <div className="bg-gradient-to-r from-bike-purple to-bike-blue rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Ready for your next adventure?</h3>
            <p className="text-white/80 max-w-md">Join our community of cyclists and discover new routes, challenges, and friends along the way.</p>
          </div>
          <Button className="bg-white text-bike-blue hover:bg-opacity-90 rounded-full px-6">
            Explore All Routes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExploreAllBanner;
