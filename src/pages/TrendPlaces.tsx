
import React from 'react';
import { Map, TrendingUp, Navigation, MapPin, Calendar, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarNavItem from '@/components/SidebarNavItem';
import SearchInput from '@/components/SearchInput';
import SupportCard from '@/components/SupportCard';

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
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center h-8 w-8 bg-gray-900 rounded-md text-white">
                  <span className="text-xs">🚲</span>
                </div>
                <h1 className="text-lg font-bold">Pedal Dashboard</h1>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Your Management dashboard</p>
              
              <div className="mb-6">
                <SearchInput placeholder="Search Your Items ..." />
              </div>
              
              <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Main Items</h2>
                <nav className="space-y-1">
                  <SidebarNavItem 
                    icon={<Map size={20} />} 
                    label="Trend Places" 
                    active={true}
                  />
                </nav>
              </div>
              
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-3">Popular Events</h2>
                <div className="space-y-4">
                  {popularEvents.map(event => (
                    <div key={event.id} className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-medium text-gray-800">{event.name}</h3>
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{event.participants}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <SupportCard />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-9">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingPlaces.map(place => (
                  <div key={place.id} className="bike-card p-0 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={place.image} 
                        alt={place.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin size={14} />
                          <span className="text-sm">{place.location}</span>
                        </div>
                        <h3 className="text-xl font-bold">{place.name}</h3>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          place.difficulty === 'easy' ? 'bg-green-500 text-white' :
                          place.difficulty === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {place.difficulty.charAt(0).toUpperCase() + place.difficulty.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1">
                          <div className="text-bike-blue">
                            <Navigation size={16} />
                          </div>
                          <span className="text-sm font-medium">{place.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star size={16} fill="currentColor" />
                          <span className="font-medium">{place.rating}</span>
                        </div>
                      </div>
                      <Button className="w-full rounded-full bg-bike-blue">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendPlaces;
