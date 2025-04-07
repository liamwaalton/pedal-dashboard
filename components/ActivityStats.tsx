'use client';

import React, { useMemo } from 'react';
import { useActivity } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';
import { Clock, Map, TrendingUp, Activity, LogIn, Award, Flame, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatElevation } from '@/lib/utils';

// Constants for conversion
const KM_TO_MILES = 0.621371;

export default function ActivityStats() {
  const { activities, isLoading, timePeriod, error } = useActivity();
  const { isLoggedIn } = useAuth();

  // Memoize the filtered stats calculation
  const stats = useMemo(() => {
    if (!activities || activities.length === 0) {
      return {
        totalDistance: 0,
        averageSpeed: 0,
        totalTime: 0
      };
    }

    // Calculate start date based on time period
    const now = new Date();
    let startDate: Date;
    
    switch (timePeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case '30days':
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
    }

    // Filter activities by time period and type
    const filteredActivities = activities
      .filter(activity => activity.type === 'Ride')
      .filter(activity => new Date(activity.start_date) >= startDate);

    // Calculate totals
    const totalDistance = filteredActivities.reduce((acc, curr) => acc + (curr.distance || 0), 0);
    const totalTime = filteredActivities.reduce((acc, curr) => acc + (curr.moving_time || 0), 0);
    
    // Calculate true average speed
    const averageSpeed = totalTime > 0 ? (totalDistance / totalTime) * 3.6 : 0; // Convert to km/h

    return {
      totalDistance: totalDistance / 1000, // Convert to km
      averageSpeed,
      totalTime
    };
  }, [activities, timePeriod]);

  if (!isLoggedIn) {
    return (
      <div className="activity-statistics-card p-4 rounded-lg">
        <div className="text-muted-foreground text-sm">
          Please log in to view your activity statistics
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="activity-statistics-card p-4 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/4 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="activity-statistics-card p-4 rounded-lg border border-yellow-300 bg-yellow-50">
        <div className="flex items-center gap-2 text-yellow-700">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium text-sm">Error loading data:</span>
        </div>
        <p className="text-sm text-yellow-600 mt-1 ml-7">{error}</p>
      </div>
    );
  }

  // Format time display
  const hours = Math.floor(stats.totalTime / 3600);
  const minutes = Math.floor((stats.totalTime % 3600) / 60);
  const timeDisplay = `${hours}h ${minutes}m`;

  // Convert to imperial units
  const distanceMiles = stats.totalDistance * KM_TO_MILES;
  const speedMph = stats.averageSpeed * KM_TO_MILES;

  return (
    <div className="activity-statistics-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Activity Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Map className="h-5 w-5 text-gray-500" />
            <div className="text-gray-500 text-sm">Total Distance</div>
          </div>
          <div className="text-2xl font-bold leading-tight">{distanceMiles.toFixed(1)} mi</div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <div className="text-gray-500 text-sm">Average Speed</div>
          </div>
          <div className="text-2xl font-bold leading-tight">{speedMph.toFixed(1)} mph</div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-5 w-5 text-gray-500" />
            <div className="text-gray-500 text-sm">Total Time</div>
          </div>
          <div className="text-2xl font-bold leading-tight">{timeDisplay}</div>
        </div>
      </div>
    </div>
  );
} 