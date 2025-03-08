
import React from 'react';
import { Map, Calendar, User } from 'lucide-react';
import SidebarNavItem from '@/components/SidebarNavItem';
import SearchInput from '@/components/SearchInput';
import SupportCard from '@/components/SupportCard';

interface PopularEvent {
  id: number;
  name: string;
  date: string;
  participants: number;
}

interface TrendPlacesSidebarProps {
  popularEvents: PopularEvent[];
}

const TrendPlacesSidebar = ({ popularEvents }: TrendPlacesSidebarProps) => {
  return (
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
  );
};

export default TrendPlacesSidebar;
