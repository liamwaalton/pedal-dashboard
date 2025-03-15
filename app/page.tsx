'use client';

import React, { useState } from 'react';
import { Home, MessageSquare, Map, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SearchInput from '@/components/SearchInput';
import SidebarNavItem from '@/components/SidebarNavItem';
import LocationItem from '@/components/LocationItem';
import CommunityBanner from '@/components/CommunityBanner';
import StatisticsCard from '@/components/StatisticsCard';
import MapCard from '@/components/MapCard';
import ProfileSection from '@/components/ProfileSection';
import SupportCard from '@/components/SupportCard';
import { useRouter } from 'next/navigation';
import { useActivity } from '@/lib/activity-context';

export default function HomePage() {
  const [activeNavItem, setActiveNavItem] = useState('home');
  const router = useRouter();
  const { stats, loadActivities, isLoading } = useActivity();
  
  const handleNavigation = (path: string, navItem: string) => {
    setActiveNavItem(navItem);
    router.push(path);
  };
  
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
                <h1 className="text-lg font-bold">Pedal Pulse</h1>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Your Management dashboard</p>
              
              <div className="mb-6">
                <SearchInput placeholder="Search Your Items ..." />
              </div>
              
              <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Main Items</h2>
                <nav className="space-y-1">
                  <SidebarNavItem 
                    icon={<Home size={20} />} 
                    label="Home" 
                    active={activeNavItem === 'home'} 
                    onClick={() => handleNavigation('/', 'home')}
                  />
                  <SidebarNavItem 
                    icon={<MessageSquare size={20} />} 
                    label="Message" 
                    active={activeNavItem === 'message'} 
                    onClick={() => handleNavigation('/messages', 'message')}
                  />
                  <SidebarNavItem 
                    icon={<Map size={20} />} 
                    label="Trend Places" 
                    active={activeNavItem === 'places'} 
                    onClick={() => handleNavigation('/trend-places', 'places')}
                  />
                  <SidebarNavItem 
                    icon={<Settings size={20} />} 
                    label="Setting" 
                    active={activeNavItem === 'settings'} 
                    onClick={() => handleNavigation('/settings', 'settings')}
                  />
                </nav>
              </div>
              
              <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Your Favorite Locations</h2>
                <div>
                  {stats && stats.locations && stats.locations.length > 0 ? (
                    stats.locations.map((location, index) => (
                      <LocationItem 
                        key={location.name}
                        name={location.name} 
                        value={`+${location.count}`} 
                        active={index === 0}
                        color={index === 0 ? "bg-bike-orange" : undefined}
                      />
                    ))
                  ) : isLoading ? (
                    <div className="text-sm text-gray-400">Loading locations...</div>
                  ) : (
                    <div className="text-sm text-gray-400">No locations found. Click "Load Data" to fetch your ride locations.</div>
                  )}
                </div>
              </div>
              
              <SupportCard />
            </div>
            
            {/* Middle Section */}
            <div className="lg:col-span-6">
              <CommunityBanner />
              
              {/* Two-column layout with StatisticsCard spanning full width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <StatisticsCard />
                </div>
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <ProfileSection />
              <MapCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 