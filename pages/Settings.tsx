import React from 'react';
import { User, Bell, Lock, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
// import SettingsSidebar from '@/components/settings/SettingsSidebar';
// import ProfileInformation from '@/components/settings/ProfileInformation';
// import AppearanceSettings from '@/components/settings/AppearanceSettings';
// import NotificationSettings from '@/components/settings/NotificationSettings';
// import LanguageSettings from '@/components/settings/LanguageSettings';
// import DangerZone from '@/components/settings/DangerZone';

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
            {/* <SettingsSidebar settingsSections={settingsSections} /> */}
            
            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="bike-card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                
                {/* <ProfileInformation /> */}
                
                <Separator className="my-6" />
                
                {/* <AppearanceSettings 
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                /> */}
                
                {/* <NotificationSettings 
                  pushNotifications={pushNotifications}
                  setPushNotifications={setPushNotifications}
                  emailNotifications={emailNotifications}
                  setEmailNotifications={setEmailNotifications}
                /> */}
                
                {/* <LanguageSettings 
                  language={language}
                  setLanguage={setLanguage}
                /> */}
                
                <Separator className="my-6" />
                
                {/* <DangerZone /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
