'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useActivity } from '@/lib/activity-context';
import { useSearchParams } from 'next/navigation';

interface ProfileSectionProps {
  name?: string;
  email?: string;
}

const ProfileSection = ({ name, email }: ProfileSectionProps) => {
  const { isLoggedIn, athlete, login, logout, isLoading: authLoading } = useAuth();
  const { loadActivities, isLoading: dataLoading, stats } = useActivity();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
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
      <div className="bike-card mb-6 h-[400px] flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-14 w-14 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bike-card mb-6 h-[400px] flex flex-col">
        <h2 className="text-sm text-gray-500 mb-4">Login</h2>
        <div className="flex flex-col items-center justify-center py-6 gap-4 flex-grow">
          <div className="flex justify-center">
            <svg viewBox="0 0 40 40" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#FC4C02" />
              <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="white" />
            </svg>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-2 text-sm text-red-600 flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
                <p className="mt-1 text-xs">
                  Please check your .env.local file and ensure STRAVA_CLIENT_ID and NEXT_PUBLIC_STRAVA_CLIENT_ID are set correctly.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-700 mb-2">
              Connect with Strava to track your cycling routes and join the community
            </p>
          )}
          
          <Button 
            onClick={() => {
              // Clear any previous errors
              setError(null);
              login();
            }} 
            className="bg-[#FC4C02] hover:bg-[#e64500] text-white rounded-full gap-2 w-full"
          >
            <LogIn size={18} />
            Login with Strava
          </Button>
          
          <Button
            variant="outline"
            size="sm"
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
            className="text-xs"
          >
            Check Configuration
          </Button>
        </div>
      </div>
    );
  }

  // Display user profile when logged in
  const fullName = athlete ? `${athlete.firstname} ${athlete.lastname}` : name || "Jerome Bell";
  const profileImage = athlete?.profile || null;

  // Determine if data is already loaded
  const dataAlreadyLoaded = stats !== null;

  return (
    <div className="bike-card mb-6 h-[400px] flex flex-col">
      <h2 className="text-sm text-gray-500 mb-4">Profile Info</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 bg-gray-100 rounded-full overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-bike-blue/20"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{fullName}</h3>
          <p className="text-sm text-gray-500">{email || "Strava Athlete"}</p>
        </div>
      </div>
      
      <div className="mb-6 flex-grow flex items-center justify-center">
        <div className="w-32 h-32 bg-bike-blue/10 rounded-full flex items-center justify-center">
          <span className="text-4xl">🚲</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        <div>
          <p className="text-xs text-gray-500">Model</p>
          <p className="font-semibold text-gray-800">GT 869</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Speed</p>
          <p className="font-semibold text-gray-800">50KM/h</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Type</p>
          <p className="font-semibold text-gray-800">Classic</p>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-auto">
        <Button 
          className="bg-bike-orange text-white hover:bg-bike-orange/90 flex-1"
          onClick={loadActivities}
          disabled={dataLoading}
        >
          {dataLoading ? "Loading..." : dataAlreadyLoaded ? "Refresh Data" : "Load Data"}
        </Button>
        <Button 
          variant="outline" 
          className="flex-none" 
          onClick={logout}
        >
          <LogOut size={18} className="mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileSection; 