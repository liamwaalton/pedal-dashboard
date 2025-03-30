'use client';

import React from 'react';
import { Settings, User, Bell, Lock, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gray-800 p-2 rounded-lg text-white">
          <Settings className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Account Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg" 
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg" 
                    placeholder="Your Email"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  className="w-full p-2.5 border border-gray-300 rounded-lg" 
                  rows={3}
                  placeholder="Tell us about your cycling journey"
                ></textarea>
              </div>
              
              <Button className="bg-bike-blue hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive emails about your activity</p>
                </div>
                <Switch id="email-notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive push notifications</p>
                </div>
                <Switch id="push-notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weekly Summary</h3>
                  <p className="text-sm text-gray-500">Receive weekly activity summary</p>
                </div>
                <Switch id="weekly-summary" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Privacy */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Privacy</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Public Profile</h3>
                  <p className="text-sm text-gray-500">Make your profile visible to others</p>
                </div>
                <Switch id="public-profile" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Activity Map</h3>
                  <p className="text-sm text-gray-500">Display maps of your activities</p>
                </div>
                <Switch id="activity-map" defaultChecked />
              </div>
            </div>
          </div>
          
          {/* Appearance */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Compact Mode</h3>
                  <p className="text-sm text-gray-500">Use smaller UI elements</p>
                </div>
                <Switch id="compact-mode" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 