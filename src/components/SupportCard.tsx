
import React from 'react';

const SupportCard = () => {
  return (
    <div className="relative overflow-hidden bg-bike-purple rounded-3xl p-6 animate-scale-in">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-opacity-10 bg-white rounded-full -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-opacity-10 bg-white rounded-full -ml-10 -mb-10" />
      
      <h2 className="text-white text-xl font-medium mb-2">Help & Support</h2>
      <p className="text-white/80 text-sm">
        If you have trouble using your panel, contact support
      </p>
    </div>
  );
};

export default SupportCard;
