'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

const SupportCard = () => {
  return (
    <div className="bg-bike-blue/10 rounded-xl p-4 text-center">
      <div className="flex justify-center mb-2">
        <div className="bg-bike-blue rounded-full p-2 inline-flex">
          <HelpCircle size={20} className="text-white" />
        </div>
      </div>
      <h3 className="font-medium text-gray-800 mb-1">Need Help?</h3>
      <p className="text-xs text-gray-500 mb-2">
        Contact our support team for assistance with your cycling dashboard
      </p>
      <button className="text-bike-blue text-sm font-medium hover:underline">
        Contact Support
      </button>
    </div>
  );
};

export default SupportCard; 