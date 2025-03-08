
import React from 'react';
import { Navigation, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceCardProps {
  id: number;
  name: string;
  location: string;
  distance: string;
  rating: number;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const PlaceCard = ({ id, name, location, distance, rating, image, difficulty }: PlaceCardProps) => {
  return (
    <div className="bike-card p-0 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={14} />
            <span className="text-sm">{location}</span>
          </div>
          <h3 className="text-xl font-bold">{name}</h3>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            difficulty === 'easy' ? 'bg-green-500 text-white' :
            difficulty === 'medium' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <div className="text-bike-blue">
              <Navigation size={16} />
            </div>
            <span className="text-sm font-medium">{distance}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>
        <Button className="w-full rounded-full bg-bike-blue">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PlaceCard;
