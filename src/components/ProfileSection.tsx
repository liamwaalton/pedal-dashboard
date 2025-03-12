
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../App';

interface ProfileSectionProps {
  name?: string;
  email?: string;
}

const ProfileSection = ({ name, email }: ProfileSectionProps) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { toast } = useToast();

  const handleLoginWithStrava = () => {
    // In a real implementation, this would redirect to Strava OAuth
    // For now, we'll just toggle the state for demonstration
    setIsLoggedIn(true);
    toast({
      title: "Successfully logged in",
      description: "You've been logged in with Strava",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Successfully logged out",
      description: "You've been logged out",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="bike-card mb-6 animate-fade-in h-[400px] flex flex-col">
        <h2 className="text-sm text-gray-500 mb-4">Login</h2>
        <div className="flex flex-col items-center justify-center py-6 gap-4 flex-grow">
          <div className="flex justify-center">
            <svg viewBox="0 0 40 40" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#FC4C02" />
              <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="white" />
            </svg>
          </div>
          <p className="text-center text-gray-700 mb-2">
            Connect with Strava to track your cycling routes and join the community
          </p>
          <Button 
            onClick={handleLoginWithStrava} 
            className="bg-[#FC4C02] hover:bg-[#e64500] text-white rounded-full gap-2 w-full"
          >
            <LogIn size={18} />
            Login with Strava
          </Button>
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
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileSection;
