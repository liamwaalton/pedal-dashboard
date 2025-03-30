'use client';

import React, { useState } from 'react';
import { Home, MessageSquare, Map, TrendingUp, LayoutDashboard, Newspaper } from 'lucide-react';
import SearchInput from '@/components/SearchInput';
import SidebarNavItem from '@/components/SidebarNavItem';
import LocationItem from '@/components/LocationItem';
import CommunityBanner from '@/components/CommunityBanner';
import StatisticsCard from '@/components/StatisticsCard';
import MapCard from '@/components/MapCard';
import ProfileSection from '@/components/ProfileSection';
import SupportCard from '@/components/SupportCard';
import GoalSidebarCard from '@/components/GoalSidebarCard';
import ServiceStatusBanner from '@/components/ServiceStatusBanner';
import { useRouter } from 'next/navigation';
import { useActivity } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const [activeNavItem, setActiveNavItem] = useState('home');
  const router = useRouter();
  const { stats, loadActivities, isLoading } = useActivity();
  const { isLoggedIn } = useAuth();
  
  const handleNavigation = (path: string, navItem: string) => {
    setActiveNavItem(navItem);
    router.push(path);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-md border border-gray-100 p-4 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center h-10 w-10 bg-gradient-to-br from-bike-blue to-bike-purple rounded-xl text-white shadow-sm">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Pedal Pulse</h1>
                  <p className="text-xs text-gray-500">Cycling dashboard</p>
                </div>
              </div>
              
              <div className="mb-6">
                <SearchInput placeholder="Search your rides..." />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs uppercase font-semibold text-gray-500 tracking-wider mb-3 px-2">Navigation</h2>
                  <nav className="space-y-1.5">
                    <SidebarNavItem 
                      icon={<Home size={18} />} 
                      label="Dashboard" 
                      active={activeNavItem === 'home'} 
                      onClick={() => handleNavigation('/', 'home')}
                    />
                    <SidebarNavItem 
                      icon={<TrendingUp size={18} />} 
                      label="Activity" 
                      active={activeNavItem === 'activity'} 
                      onClick={() => handleNavigation('/activity', 'activity')}
                    />
                    <SidebarNavItem 
                      icon={<Map size={18} />} 
                      label="Routes" 
                      active={activeNavItem === 'routes'} 
                      onClick={() => handleNavigation('/routes', 'routes')}
                    />
                    <SidebarNavItem 
                      icon={<MessageSquare size={18} />} 
                      label="Community" 
                      active={activeNavItem === 'community'} 
                      onClick={() => handleNavigation('/community', 'community')}
                    />
                    <SidebarNavItem 
                      icon={<Newspaper size={18} />} 
                      label="News" 
                      active={activeNavItem === 'news'} 
                      onClick={() => handleNavigation('/news', 'news')}
                    />
                  </nav>
                </div>
                
                <div className="bike-card-gradient-blue p-4">
                  <h2 className="text-xs uppercase font-semibold text-gray-600 tracking-wider mb-3">Popular Routes</h2>
                  <div className="space-y-1.5">
                    {!isLoggedIn ? (
                      <div className="text-sm text-gray-400 py-2">Connect with Strava to see your popular routes</div>
                    ) : stats && stats.locations && stats.locations.length > 0 ? (
                      stats.locations.map((location, index) => (
                        <LocationItem 
                          key={location.name}
                          name={location.name} 
                          value={`+${location.count}`} 
                          active={index === 0}
                          color={index === 0 ? "bg-gradient-to-r from-bike-orange to-amber-500" : undefined}
                        />
                      ))
                    ) : isLoading ? (
                      <div className="text-sm text-gray-400 py-2">Loading routes...</div>
                    ) : (
                      <div className="text-sm text-gray-400 py-2">No routes found. Click "Load Data" to fetch your ride routes.</div>
                    )}
                  </div>
                </div>
                
                <GoalSidebarCard />
              </div>
            </div>
            
            {/* Middle Section */}
            <div className="lg:col-span-6 space-y-6">
              <ServiceStatusBanner />
              <CommunityBanner />
              <StatisticsCard />
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <ProfileSection />
              <MapCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 