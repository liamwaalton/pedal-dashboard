import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Settings, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';

interface ProfileSectionProps {
  name?: string;
  email?: string;
}

const ProfileSection = ({ name, email }: ProfileSectionProps) => {
  const { isLoggedIn, athlete, login, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
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
          
          <Button 
            onClick={login}
            className="bg-[#FC4C02] hover:bg-[#e64500] text-white rounded-full gap-2 w-full"
          >
            <LogIn size={18} />
            Login with Strava
          </Button>
          
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

  return (
    <div className="bike-card mb-6 animate-fade-in h-[400px] flex flex-col">
      <h2 className="text-sm text-gray-500 mb-4">Profile Info</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 bg-gray-100 rounded-full overflow-hidden">
          <img 
            src="/lovable-uploads/e82c7da6-61e8-4d1d-bf72-cc5d1335ed67.png" 
            alt="Profile"
            className="w-full h-full object-cover opacity-0"
            onLoad={(e) => {
              e.currentTarget.style.animation = 'fade-in 0.5s forwards';
              e.currentTarget.style.opacity = '1';
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{name || "Jerome Bell"}</h3>
          <p className="text-sm text-gray-500">{email || "jerome69@gmail.com"}</p>
        </div>
      </div>
      
      <div className="mb-6 flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/e82c7da6-61e8-4d1d-bf72-cc5d1335ed67.png" 
          alt="Bike"
          className="max-w-full h-auto object-contain max-h-32 opacity-0"
          onLoad={(e) => {
            e.currentTarget.style.animation = 'fade-in 0.5s forwards';
            e.currentTarget.style.opacity = '1';
          }}
        />
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
        <Button className="bike-button-orange flex-1">Load Data</Button>
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
