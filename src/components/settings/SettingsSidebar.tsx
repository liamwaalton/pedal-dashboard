
import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe } from 'lucide-react';
import SearchInput from '@/components/SearchInput';
import SidebarNavItem from '@/components/SidebarNavItem';
import SupportCard from '@/components/SupportCard';

interface SettingsSidebarProps {
  settingsSections: {
    id: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
  }[];
}

const SettingsSidebar = ({ settingsSections }: SettingsSidebarProps) => {
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
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            active={true}
          />
        </nav>
      </div>
      
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Settings</h2>
        <nav className="space-y-1">
          {settingsSections.map((section) => (
            <SidebarNavItem 
              key={section.id}
              icon={section.icon} 
              label={section.label} 
              active={section.active} 
            />
          ))}
        </nav>
      </div>
      
      <SupportCard />
    </div>
  );
};

export default SettingsSidebar;
