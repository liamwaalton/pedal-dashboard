'use client';

import React from 'react';
import { useActivity } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';
import { Clock, Map, TrendingUp, Activity, LogIn, Award, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const ActivityStats = () => {
  const { stats, isLoading, error, isStravaDown } = useActivity();
  const { isLoggedIn, login } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-[#FC4C02] to-[#FF703D] rounded-xl p-4 shadow-md">
              <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.5,19.3l-3-6.6l-3,6.6h6.1M25.7,24.4l-3-6.6h-7.5l-3,6.6h4.2l1.7-3.8h6.1l1.7,3.8h4.2" fill="white" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Welcome to Your Cycling Dashboard</h3>
          <p className="text-gray-600 max-w-md">Connect with Strava to see your cycling statistics and track your progress over time</p>
          <Button 
            onClick={login}
            className="bike-button-orange rounded-lg gap-2 mt-2 shadow-md"
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`rounded-full ${isStravaDown ? 'bg-yellow-100' : 'bg-red-100'} p-3 mb-2`}>
            <Activity className={`h-6 w-6 ${isStravaDown ? 'text-yellow-600' : 'text-red-600'}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isStravaDown ? 'Strava Service Temporarily Unavailable' : 'Unable to Load Statistics'}
          </h3>
          <p className="text-gray-600">
            {error}
            {isStravaDown && stats && (
              <span className="block mt-2 text-sm font-medium text-yellow-600">
                Showing your cached data from the last successful sync.
              </span>
            )}
          </p>
          <div className="flex gap-3">
            {isStravaDown && (
              <a
                href="https://status.strava.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Check Strava Status
              </a>
            )}
            <Button 
              onClick={() => window.location.reload()}
              variant={isStravaDown ? "outline" : "default"}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Distance Widget */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center mb-3">
          <div className="bg-blue-50 p-1.5 rounded-lg mr-3">
            <Map className="h-4 w-4 text-bike-blue" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">Distance</h3>
        </div>
        
        {isLoading || !stats ? (
          <Skeleton className="h-10 w-3/4" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{stats.totalDistanceKm}</span>
            <span className="ml-1 text-gray-500 text-sm">km</span>
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
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
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center mb-3">
          <div className="bg-orange-50 p-1.5 rounded-lg mr-3">
            <Clock className="h-4 w-4 text-bike-orange" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">Time</h3>
        </div>
        
        {isLoading || !stats ? (
          <Skeleton className="h-10 w-3/4" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{stats.totalMovingTimeHours}</span>
            <span className="ml-1 text-gray-500 text-sm">hours</span>
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
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
      
      {/* Elevation Widget */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center mb-3">
          <div className="bg-purple-50 p-1.5 rounded-lg mr-3">
            <Award className="h-4 w-4 text-bike-purple" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">Elevation</h3>
        </div>
        
        {isLoading || !stats ? (
          <Skeleton className="h-10 w-3/4" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{stats.totalElevationGain || '0'}</span>
            <span className="ml-1 text-gray-500 text-sm">m</span>
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
          {isLoading || !stats ? (
            <Skeleton className="h-4 w-3/4" />
          ) : (
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>Avg: {Math.round((stats.totalElevationGain || 0) / (stats.totalActivities || 1))} m/ride</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Calories Widget */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center mb-3">
          <div className="bg-green-50 p-1.5 rounded-lg mr-3">
            <Flame className="h-4 w-4 text-bike-green" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">Calories</h3>
        </div>
        
        {isLoading || !stats ? (
          <Skeleton className="h-10 w-3/4" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{stats.totalCalories || '0'}</span>
            <span className="ml-1 text-gray-500 text-sm">kcal</span>
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
          {isLoading || !stats ? (
            <Skeleton className="h-4 w-3/4" />
          ) : (
            <div className="flex items-center">
              <Activity className="h-3 w-3 mr-1 text-green-500" />
              <span>Avg: {Math.round((stats.totalCalories || 0) / (stats.totalActivities || 1))} kcal/ride</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStats; 