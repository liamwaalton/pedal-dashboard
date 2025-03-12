'use client';

import React from 'react';
import { useActivity } from '@/lib/activity-context';
import { Clock, Map, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityStats = () => {
  const { stats, isLoading, error } = useActivity();

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
        <h3 className="font-semibold mb-2">Error Loading Data</h3>
        <p>{error}</p>
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