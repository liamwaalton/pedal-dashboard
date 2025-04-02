'use client';

import React from 'react';
import { useActivity } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';
import { Clock, Map, TrendingUp, Activity, LogIn, Award, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatElevation } from '@/lib/utils';

const ActivityStats = () => {
  const { stats, isLoading, error, isStravaDown } = useActivity();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-medium text-gray-900">Activity Statistics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-medium text-gray-900">Activity Statistics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isStravaDown) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="bg-red-100 rounded-xl p-4">
              <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="#FC4C02" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Strava API Service Unavailable</h3>
          <p className="text-gray-600 max-w-md">The Strava API appears to be temporarily unavailable. Please check back later.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Error Loading Data</h3>
          <p className="text-gray-600 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">No Data Available</h3>
          <p className="text-gray-600 max-w-md">
            {useActivity().timePeriod === 'today' 
              ? "Get out for a ride!" 
              : "There seems to be no activity data available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  // Format values for display
  const formatDistance = (meters: number) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hrs`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between mb-4">
        <h3 className="font-medium text-gray-900">Activity Statistics</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Last 30 Days</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 p-1.5 rounded-md">
              <Map className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Distance</span>
          </div>
          <div className="font-semibold text-lg text-gray-800">{stats.totalDistanceKm} km</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-100 p-1.5 rounded-md">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">Time</span>
          </div>
          <div className="font-semibold text-lg text-gray-800">{stats.totalMovingTimeHours} hrs</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-100 p-1.5 rounded-md">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Activities</span>
          </div>
          <div className="font-semibold text-lg text-gray-800 text-center">{stats.totalActivities}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-100 p-1.5 rounded-md">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Elevation</span>
          </div>
          <div className="font-semibold text-lg text-gray-800 break-words">{formatElevation(stats.totalElevationGain || 0)}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats; 