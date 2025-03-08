
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface AppearanceSettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const AppearanceSettings = ({ darkMode, setDarkMode }: AppearanceSettingsProps) => {
  return (
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
  );
};

export default AppearanceSettings;
