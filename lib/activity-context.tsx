'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our activity data
export type ActivityStats = {
  totalDistance: number;
  totalMovingTime: number;
  totalElevationGain: number;
  totalActivities: number;
  totalDistanceKm: string;
  totalMovingTimeHours: string;
  averageSpeed: string | number;
  recentActivities: any[];
  activityTypes: Record<string, number>;
  locations: { name: string, count: number }[];
};

type ActivityContextType = {
  activities: any[];
  stats: ActivityStats | null;
  isLoading: boolean;
  error: string | null;
  loadActivities: () => Promise<void>;
};

const defaultStats: ActivityStats = {
  totalDistance: 0,
  totalMovingTime: 0,
  totalElevationGain: 0,
  totalActivities: 0,
  totalDistanceKm: '0',
  totalMovingTimeHours: '0',
  averageSpeed: '0',
  recentActivities: [],
  activityTypes: {},
  locations: [],
};

const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  stats: defaultStats,
  isLoading: false,
  error: null,
  loadActivities: async () => {},
});

export const useActivity = () => useContext(ActivityContext);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = async () => {
    // Only prevent loading if already in progress
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/strava/activities');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load activities');
      }
      
      const data = await response.json();
      setActivities(data.activities);
      setStats(data.stats);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActivityContext.Provider value={{ activities, stats, isLoading, error, loadActivities }}>
      {children}
    </ActivityContext.Provider>
  );
} 