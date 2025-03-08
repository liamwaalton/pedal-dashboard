
import React from 'react';
import TrendPlacesSidebar from '@/components/trendplaces/TrendPlacesSidebar';
import TrendPlacesHeader from '@/components/trendplaces/TrendPlacesHeader';
import PlacesList from '@/components/trendplaces/PlacesList';
import ExploreAllBanner from '@/components/trendplaces/ExploreAllBanner';

interface TrendingPlace {
  id: number;
  name: string;
  location: string;
  distance: string;
  rating: number;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const trendingPlaces: TrendingPlace[] = [
  {
    id: 1,
    name: 'Alpine Mountain Trail',
    location: 'Switzerland',
    distance: '24 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    difficulty: 'hard'
  },
  {
    id: 2,
    name: 'Coastal Highway',
    location: 'Brazil',
    distance: '18 km',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1531218614045-e596f12f0393',
    difficulty: 'medium'
  },
  {
    id: 3,
    name: 'Desert Expedition',
    location: 'Iran',
    distance: '12 km',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922',
    difficulty: 'medium'
  },
  {
    id: 4,
    name: 'Forest Adventure',
    location: 'Canada',
    distance: '8 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1565006447292-055dc1232ae1',
    difficulty: 'easy'
  }
];

const popularEvents = [
  { id: 1, name: 'Annual Bike Marathon', date: 'Jun 15, 2023', participants: 245 },
  { id: 2, name: 'Mountain Challenge', date: 'Jul 22, 2023', participants: 189 },
  { id: 3, name: 'City Tour Ride', date: 'Aug 05, 2023', participants: 312 }
];

const TrendPlaces = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <TrendPlacesSidebar popularEvents={popularEvents} />
            
            <div className="lg:col-span-9">
              <TrendPlacesHeader />
              <PlacesList trendingPlaces={trendingPlaces} />
              <ExploreAllBanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendPlaces;
