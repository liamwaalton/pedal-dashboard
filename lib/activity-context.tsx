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
  totalCalories?: number; // Optional as it may not be present in older cached data
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
  isStravaDown: boolean;
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
  isStravaDown: false,
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
  const [isStravaDown, setIsStravaDown] = useState(false);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  // Add cache keys for local storage
  const CACHE_KEYS = {
    ACTIVITIES: 'strava-activities-cache',
    STATS: 'strava-stats-cache',
    CACHE_TIME: 'strava-cache-timestamp',
    LAST_FETCH: 'strava-last-fetch-time'
  };

  // Rate limiting constants
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
  const CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes in milliseconds

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
    
    // Load last fetch time
    const savedLastFetch = localStorage.getItem(CACHE_KEYS.LAST_FETCH);
    if (savedLastFetch) {
      setLastFetchTime(parseInt(savedLastFetch, 10));
    }
    
    // Try loading cached data
    tryLoadingCachedData();
  }, []);
  
  // Save goal to localStorage whenever it changes
  useEffect(() => {
    if (goal) {
      localStorage.setItem('cycling-goal', JSON.stringify(goal));
    }
  }, [goal]);
  
  // Save time period to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cycling-time-period', JSON.stringify(timePeriod));
  }, [timePeriod]);
  
  // Function to check if we should fetch new data
  const shouldFetchNewData = (): boolean => {
    const now = Date.now();
    
    // Check rate limiting
    if (now - lastFetchTime < RATE_LIMIT_WINDOW) {
      return false;
    }
    
    // Check if cache is still fresh
    const cacheTimestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIME);
    if (cacheTimestamp) {
      const cacheAge = now - parseInt(cacheTimestamp, 10);
      if (cacheAge < CACHE_MAX_AGE) {
        return false;
      }
    }
    
    return true;
  };
  
  // Function to load data from cache
  const tryLoadingCachedData = () => {
    try {
      // Check if we have cached data
      const cachedActivities = localStorage.getItem(CACHE_KEYS.ACTIVITIES);
      const cachedStats = localStorage.getItem(CACHE_KEYS.STATS);
      const cacheTimestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIME);
      
      if (cachedActivities && cachedStats && cacheTimestamp) {
        const parsedActivities = JSON.parse(cachedActivities);
        const parsedStats = JSON.parse(cachedStats);
        
        setActivities(parsedActivities);
        setStats(parsedStats);
        return true;
      }
    } catch (err) {
      console.error('Error loading cached data:', err);
    }
    return false;
  };
  
  // Function to cache data
  const cacheData = (activitiesData: any[], statsData: ActivityStats) => {
    try {
      localStorage.setItem(CACHE_KEYS.ACTIVITIES, JSON.stringify(activitiesData));
      localStorage.setItem(CACHE_KEYS.STATS, JSON.stringify(statsData));
      localStorage.setItem(CACHE_KEYS.CACHE_TIME, Date.now().toString());
    } catch (err) {
      console.error('Error caching activity data:', err);
    }
  };

  // Updated loadActivities function with rate limiting
  const loadActivities = async (period?: TimePeriod) => {
    // Return cached data if we shouldn't fetch new data
    if (!shouldFetchNewData()) {
      console.log('Using cached data due to rate limiting');
      return;
    }
    
    // Only prevent loading if already in progress
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setIsStravaDown(false);
    
    try {
      // Update last fetch time
      const now = Date.now();
      setLastFetchTime(now);
      localStorage.setItem(CACHE_KEYS.LAST_FETCH, now.toString());
      
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
      
      // Handle rate limiting
      if (response.status === 429) {
        console.log('Rate limit hit, using cached data');
        tryLoadingCachedData();
        setError('Rate limit exceeded. Showing cached data.');
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 503 && data.isStravaDown) {
          setIsStravaDown(true);
          const hasCachedData = tryLoadingCachedData();
          
          if (hasCachedData) {
            setError(`${data.error} Showing cached data from your last session.`);
          } else {
            throw new Error(data.error || 'Strava service is unavailable');
          }
        } else if (response.status === 401) {
          throw new Error('Please log in to view your activities');
        } else {
          throw new Error(data.error || 'Failed to load activities');
        }
      } else {
        // Success - update state and cache
        setActivities(data.activities);
        setStats(data.stats);
        
        // Cache successful responses
        if (data.activities && data.activities.length > 0 && data.stats) {
          cacheData(data.activities, data.stats);
        }
      }
    } catch (err) {
      console.error('Error loading activities:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // If we don't have data loaded yet, try from cache as a last resort
      if (!stats) {
        tryLoadingCachedData();
      }
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
      isStravaDown,
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