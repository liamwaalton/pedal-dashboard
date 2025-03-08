
import React from 'react';
import { Button } from '@/components/ui/button';

const ProfileInformation = () => {
  return (
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
  );
};

export default ProfileInformation;
