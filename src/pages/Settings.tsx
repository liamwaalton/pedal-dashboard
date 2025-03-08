
import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, LogOut, Moon, Sun, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SidebarNavItem from '@/components/SidebarNavItem';
import SearchInput from '@/components/SearchInput';
import SupportCard from '@/components/SupportCard';

const settingsSections = [
  { id: 'account', icon: <User size={20} />, label: 'Account', active: true },
  { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications', active: false },
  { id: 'privacy', icon: <Lock size={20} />, label: 'Privacy & Security', active: false },
  { id: 'language', icon: <Globe size={20} />, label: 'Language', active: false },
];

const SettingsPage = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState('english');
  
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
            
            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="bike-card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                
                <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="/lovable-uploads/e82c7da6-61e8-4d1d-bf72-cc5d1335ed67.png" 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value="Jerome Bell"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-bike-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value="jerome69@gmail.com"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-bike-blue"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="bg-bike-blue">Save Changes</Button>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-500">Switch between light and dark mode</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bike-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bike-blue"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone size={24} />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive notifications on your device</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={pushNotifications}
                          onChange={() => setPushNotifications(!pushNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bike-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bike-blue"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail size={24} />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive emails about your account</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bike-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bike-blue"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Language</h3>
                  <div className="max-w-xs">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-bike-blue"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
                  <p className="text-gray-500 mb-4">These actions are irreversible. Please be certain.</p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="border-red-300 text-red-500 hover:bg-red-50">
                      Delete Account
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600">
                      <LogOut size={16} className="mr-2" />
                      Logout
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

export default SettingsPage;
