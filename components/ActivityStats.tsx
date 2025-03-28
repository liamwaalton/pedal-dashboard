'use client';

import React from 'react';
import { useActivity } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';
import { Clock, Map, TrendingUp, Activity, LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const ActivityStats = () => {
  const { stats, isLoading, error } = useActivity();
  const { isLoggedIn, login } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="bike-card p-6 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex justify-center">
            <svg viewBox="0 0 40 40" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#FC4C02" />
              <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="white" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Welcome to Your Cycling Dashboard</h3>
          <p className="text-gray-600">Connect with Strava to see your cycling statistics and track your progress</p>
          <Button 
            onClick={login}
            className="bg-[#FC4C02] hover:bg-[#e64500] text-white rounded-full gap-2"
          >
            <LogIn size={18} />
            Connect with Strava
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bike-card p-6 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-red-100 p-3 mb-2">
            <Activity className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Unable to Load Statistics</h3>
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Distance Widget */}
      <div className="bike-card p-4">
        <div className="flex items-center mb-2">
          <Map className="h-5 w-5 mr-2 text-bike-blue" />
          <h3 className="text-sm font-medium text-gray-700">Total Distance</h3>
        </div>
        
        {isLoading || !stats ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{stats.totalDistanceKm}</span>
            <span className="ml-1 text-gray-500">km</span>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          {isLoading || !stats ? (
            <Skeleton className="h-4 w-3/4" />
          ) : (
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>From {stats.totalActivities} activities</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Time Widget */}
      <div className="bike-card p-4">
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 mr-2 text-bike-orange" />
          <h3 className="text-sm font-medium text-gray-700">Total Time</h3>
        </div>
        
        {isLoading || !stats ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{stats.totalMovingTimeHours}</span>
            <span className="ml-1 text-gray-500">hours</span>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          {isLoading || !stats ? (
            <Skeleton className="h-4 w-3/4" />
          ) : (
            <div className="flex items-center">
              <Activity className="h-3 w-3 mr-1 text-green-500" />
              <span>Avg. speed: {stats.averageSpeed} km/h</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStats; 