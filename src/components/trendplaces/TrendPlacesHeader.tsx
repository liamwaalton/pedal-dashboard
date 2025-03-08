
import React from 'react';
import { TrendingUp, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrendPlacesHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Trending Cycling Routes</h2>
        <p className="text-gray-500">Discover the most popular cycling destinations</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="rounded-full">
          <TrendingUp size={16} className="mr-2" />
          Most Popular
        </Button>
        <Button variant="outline" className="rounded-full">
          <Navigation size={16} className="mr-2" />
          Nearest
        </Button>
      </div>
    </div>
  );
};

export default TrendPlacesHeader;
