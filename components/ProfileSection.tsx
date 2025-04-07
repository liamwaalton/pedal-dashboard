'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, AlertCircle, User, RefreshCw, AreaChart, Settings, Flame } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useActivity } from '@/lib/activity-context';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserIcon } from 'lucide-react';

interface ProfileSectionProps {
  name?: string;
  email?: string;
}

const ProfileSection = ({ name, email }: ProfileSectionProps) => {
  const { isLoggedIn, athlete, login, logout, isLoading: authLoading } = useAuth();
  const { loadActivities, isLoading: dataLoading, stats } = useActivity();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for error parameters in the URL
  useEffect(() => {
    if (searchParams) {
      const errorParam = searchParams.get('error');
      if (errorParam) {
        switch (errorParam) {
          case 'missing_code':
            setError('Authorization code missing from Strava response');
            break;
          case 'token_exchange_failed':
            setError('Failed to exchange authorization code for token');
            break;
          case 'missing_client_id':
            setError('Strava Client ID is not configured');
            break;
          default:
            setError(`Authentication error: ${errorParam}`);
        }
      } else {
        setError(null);
      }
    }
  }, [searchParams]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="bike-card-gradient-blue p-6 mb-6 flex flex-col items-center justify-center min-h-[350px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-white/50 rounded-xl mb-4"></div>
          <div className="h-4 w-32 bg-white/50 rounded mb-2"></div>
          <div className="h-3 w-24 bg-white/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bike-card-gradient-orange p-6 mb-6 flex flex-col min-h-[350px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <User className="h-4 w-4 text-bike-orange" />
          </div>
          <h2 className="font-medium text-gray-800">Your Profile</h2>
          <div className="ml-auto">
            <button 
              onClick={() => router.push('/settings')}
              className="bg-white p-1.5 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-6 gap-4 flex-grow">
          <div className="bg-gradient-to-br from-[#FC4C02] to-[#FF703D] rounded-xl p-4 shadow-md mb-2">
            <svg viewBox="0 0 40 40" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="white" />
            </svg>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-2 text-sm text-red-600 flex items-start shadow-sm">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Configuration Error</p>
                <p>{error}</p>
                <p className="mt-1 text-xs text-red-500">
                  Check your .env.local file and ensure API credentials are set correctly.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-700 mb-2 px-4">
              Connect with Strava to sync your cycling activities and track your progress
            </p>
          )}
          
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/auth/strava/check-config');
                const data = await response.json();
                console.log('Strava configuration:', data);
                
                if (!data.serverConfig.clientIdConfigured || !data.clientConfig.publicClientIdConfigured) {
                  setError('Strava API credentials are not properly configured. Check your .env.local file.');
                } else {
                  setError(null);
                  alert('Strava configuration looks good! Check the console for details.');
                }
              } catch (err) {
                console.error('Error checking configuration:', err);
                setError('Failed to check Strava configuration');
              }
            }}
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline mt-2"
          >
            Check API Configuration
          </button>
        </div>
      </div>
    );
  }

  // Display user profile when logged in
  const fullName = athlete ? `${athlete.firstname} ${athlete.lastname}` : name || "Jerome Bell";
  const profileImage = athlete?.profile || null;

  // Debug information - only log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Profile rendering with athlete data:', athlete);
    console.log('Using profile image:', profileImage);
    console.log('Using name:', fullName);
  }

  // Determine if data is already loaded
  const dataAlreadyLoaded = stats !== null;

  return (
    <div className="bike-card-gradient-blue p-6 mb-6 flex flex-col min-h-[350px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white p-1.5 rounded-lg shadow-sm">
          <User className="h-4 w-4 text-bike-blue" />
        </div>
        <h2 className="font-medium text-gray-800">Athlete Profile</h2>
        <div className="ml-auto">
          <button 
            onClick={() => router.push('/settings')}
            className="bg-white p-1.5 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-xl overflow-hidden shadow-sm bg-white">
          {profileImage ? (
            <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-bike-blue/10 flex items-center justify-center">
              <User className="h-6 w-6 text-bike-blue/50" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{fullName}</h3>
          <p className="text-sm text-gray-500">{email || "Strava Athlete"}</p>
        </div>
      </div>
      
      {stats && stats.totalActivities > 0 ? (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <AreaChart size={14} className="text-bike-blue" />
              <p className="text-xs text-gray-700 font-medium">Stats summary</p>
            </div>
            <p className="text-xs text-gray-500">{stats.totalActivities} rides</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Total Distance</p>
              <p className="text-xs font-medium">{stats.totalDistanceKm} km</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Total Time</p>
              <p className="text-xs font-medium">{stats.totalMovingTimeHours} hrs</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Avg Speed</p>
              <p className="text-xs font-medium">{stats.averageSpeed} km/h</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Total Calories</p>
              <p className="text-xs font-medium">{stats.totalCalories || '0'} kcal</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow"></div>
      )}
      
      <div className="flex space-x-2 mt-auto">
        <Button 
          className="bike-button-orange rounded-lg gap-2 flex-1 shadow-sm"
          onClick={() => loadActivities()}
          disabled={dataLoading}
        >
          <RefreshCw size={16} className={dataLoading ? "animate-spin" : ""} />
          {dataLoading ? "Loading..." : dataAlreadyLoaded ? "Refresh Data" : "Load Data"}
        </Button>
        
        <Button 
          variant="outline" 
          className="rounded-lg shadow-sm" 
          onClick={logout}
        >
          <LogOut size={16} className="text-gray-600" />
        </Button>
      </div>
      
      {/* Debug button - only shows in development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-2">
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/auth/strava/debug');
                const data = await response.json();
                console.log('Auth debug info:', data);
                alert('Debug info logged to console');
              } catch (err) {
                console.error('Error getting debug info:', err);
              }
            }}
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
          >
            Debug Auth State
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection; 