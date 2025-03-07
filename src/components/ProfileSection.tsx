
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileSectionProps {
  name: string;
  email: string;
}

const ProfileSection = ({ name, email }: ProfileSectionProps) => {
  return (
    <div className="bike-card mb-6 animate-fade-in">
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
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <img 
          src="/lovable-uploads/e82c7da6-61e8-4d1d-bf72-cc5d1335ed67.png" 
          alt="Bike"
          className="w-full h-auto object-contain max-h-32 opacity-0"
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
      
      <Button className="bike-button-orange w-full">Go To Shop</Button>
    </div>
  );
};

export default ProfileSection;
