'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useActivity } from '@/lib/activity-context';
import { useState } from 'react';

interface ServiceStatusBannerProps {
  className?: string;
}

const ServiceStatusBanner: React.FC<ServiceStatusBannerProps> = ({ className = '' }) => {
  const { isStravaDown, error } = useActivity();
  const [dismissed, setDismissed] = useState(false);

  if (!isStravaDown || dismissed || !error) {
    return null;
  }

  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Strava Service Alert:</span> {error}
          </p>
          <p className="mt-1 text-xs text-yellow-600">
            Some features may be limited. We're showing cached data where available.
          </p>
          <div className="mt-2">
            <a
              href="https://status.strava.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-yellow-700 hover:text-yellow-600 underline"
            >
              Check Strava Status
            </a>
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 ml-3 h-5 w-5 text-yellow-500 hover:text-yellow-700 focus:outline-none"
          onClick={() => setDismissed(true)}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ServiceStatusBanner; 