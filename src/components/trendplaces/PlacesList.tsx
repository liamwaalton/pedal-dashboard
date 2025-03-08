
import React from 'react';
import PlaceCard from './PlaceCard';

interface TrendingPlace {
  id: number;
  name: string;
  location: string;
  distance: string;
  rating: number;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PlacesListProps {
  trendingPlaces: TrendingPlace[];
}

const PlacesList = ({ trendingPlaces }: PlacesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {trendingPlaces.map(place => (
        <PlaceCard key={place.id} {...place} />
      ))}
    </div>
  );
};

export default PlacesList;
