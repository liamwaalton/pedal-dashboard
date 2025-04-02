'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LoginOverlay = () => {
  const { login } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-[#FC4C02] to-[#FF703D] rounded-xl p-5 shadow-md">
            <svg viewBox="0 0 40 40" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="white" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">Welcome to Pedal Pulse</h2>
        
        <p className="text-center text-gray-600 mb-6">
          Connect with Strava to see your cycling statistics, track your progress, and set personal goals
        </p>
        
        <Button
          onClick={login}
          className="bike-button-orange rounded-lg gap-2 w-full py-6 text-lg shadow-md hover:shadow-lg transition-all"
        >
          <LogIn size={22} />
          Connect with Strava
        </Button>
        
        <p className="text-xs text-center text-gray-500 mt-6">
          By connecting, you'll allow Pedal Pulse to access your Strava activity data.
          We only use this data to display your statistics and don't store your personal information.
        </p>
      </div>
    </div>
  );
};

export default LoginOverlay; 