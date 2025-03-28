'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

export type Goal = {
  type: 'distance' | 'time' | 'activities';
  target: number;
  timeframe: 'week' | 'month' | 'year';
};

export type TimePeriod = 'today' | 'week' | 'month' | 'year' | '30days';

type ActivityContextType = {
  activities: any[];
  stats: ActivityStats | null;
  isLoading: boolean;
  error: string | null;
  loadActivities: (period?: TimePeriod) => Promise<void>;
  goal: Goal | null;
  setGoal: (goal: Goal) => void;
  getGoalProgress: () => number;
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
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
  goal: null,
  setGoal: () => {},
  getGoalProgress: () => 0,
  timePeriod: '30days',
  setTimePeriod: () => {},
});

export const useActivity = () => useContext(ActivityContext);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');

  // Load goal from localStorage on initial render
  useEffect(() => {
    const savedGoal = localStorage.getItem('cycling-goal');
    if (savedGoal) {
      try {
        setGoal(JSON.parse(savedGoal));
      } catch (err) {
        console.error('Error parsing saved goal:', err);
      }
    }
    
    // Load saved time period if available
    const savedTimePeriod = localStorage.getItem('cycling-time-period');
    if (savedTimePeriod) {
      try {
        setTimePeriod(JSON.parse(savedTimePeriod) as TimePeriod);
      } catch (err) {
        console.error('Error parsing saved time period:', err);
      }
    }
  }, []);

  // Save goal to localStorage whenever it changes
  useEffect(() => {
    if (goal) {
      localStorage.setItem('cycling-goal', JSON.stringify(goal));
    }
  }, [goal]);
  
  // Save time period to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cycling-time-period', timePeriod);
  }, [timePeriod]);

  const loadActivities = async (period?: TimePeriod) => {
    // Only prevent loading if already in progress
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the provided period or the current timePeriod
      const periodValue = period || timePeriod;
      let response = await fetch(`/api/strava/activities?period=${periodValue}`);
      
      // If we get a 401, try to refresh the token
      if (response.status === 401) {
        // Attempt to refresh the token
        const refreshResponse = await fetch('/api/auth/strava/refresh');
        if (refreshResponse.ok) {
          // Retry the original request with the new token
          response = await fetch(`/api/strava/activities?period=${periodValue}`);
        } else {
          throw new Error('Your session has expired. Please log in again.');
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error('Please log in to view your activities');
        } else {
          throw new Error(errorData.error || 'Failed to load activities');
        }
      }
      
      const data = await response.json();
      setActivities(data.activities);
      setStats(data.stats);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Clear activities and stats on error to prevent stale data display
      setActivities([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getGoalProgress = (): number => {
    if (!goal || !stats) return 0;
    
    let current = 0;
    let target = goal.target;
    
    switch (goal.type) {
      case 'distance':
        current = stats.totalDistance / 1000; // Convert to km
        break;
      case 'time':
        current = stats.totalMovingTime / 3600; // Convert to hours
        break;
      case 'activities':
        current = stats.totalActivities;
        break;
    }
    
    // Calculate percentage (capped at 100%)
    return Math.min(100, (current / target) * 100);
  };

  return (
    <ActivityContext.Provider value={{ 
      activities, 
      stats, 
      isLoading, 
      error, 
      loadActivities,
      goal,
      setGoal,
      getGoalProgress,
      timePeriod,
      setTimePeriod
    }}>
      {children}
    </ActivityContext.Provider>
  );
} 