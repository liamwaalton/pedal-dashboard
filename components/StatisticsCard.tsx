'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ActivityStats from './ActivityStats';
import ActivityTrendsChart from './ActivityTrendsChart';
import { useActivity, TimePeriod } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';
import { Separator } from '@/src/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/src/components/ui/select';
import { Calendar, BarChart2 } from 'lucide-react';

interface StatisticsCardProps {
  timeframe?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = () => {
  const { stats, isLoading, error, loadActivities, timePeriod, setTimePeriod } = useActivity();
  const { isLoggedIn } = useAuth();
  const [showActivityStats, setShowActivityStats] = useState(false);

  // Format distance to 1 decimal place when available
  const displayDistance = !isLoggedIn ? "Log in to view" : 
                        isLoading || !stats ? "Loading..." : 
                        `${stats.totalDistanceKm} KM`;
  
  // Format duration from hours
  const displayDuration = !isLoggedIn ? "Log in to view" : 
                        isLoading || !stats ? "Loading..." : 
                        `${stats.totalMovingTimeHours} Hours`;

  // Load data on component mount - only if authenticated
  useEffect(() => {
    // Only attempt to load if user is logged in, not already loading and not already loaded
    if (isLoggedIn && !isLoading && !showActivityStats) {
      loadActivities()
        .then(() => setShowActivityStats(true))
        .catch((err) => {
          console.error('Error loading activities:', err);
        });
    }
  }, [isLoggedIn, isLoading, loadActivities, showActivityStats]);

  // Handle time period change
  const handleTimePeriodChange = (value: string) => {
    const newPeriod = value as TimePeriod;
    setTimePeriod(newPeriod);
    if (isLoggedIn) {
      loadActivities(newPeriod);
    }
  };

  // Get display text for time period
  const getTimePeriodDisplay = (period: TimePeriod): string => {
    switch (period) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      case '30days':
      default:
        return 'Last 30 Days';
    }
  };

  return (
    <div className="bike-card-gradient-blue p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <BarChart2 className="h-5 w-5 text-bike-blue" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Activity Statistics</h2>
            <p className="text-xs text-gray-500">Your cycling progress</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => loadActivities(timePeriod)}
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            Refresh Data
          </Button>
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="text-xs h-9 rounded-lg px-3 w-auto min-w-[140px] border border-gray-200 shadow-sm">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              <SelectValue placeholder="Select period">
                {getTimePeriodDisplay(timePeriod)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Show ActivityStats component */}
      <ActivityStats />
      
      {/* Activity Trends Section */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-800">Riding Trends</h3>
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <div className="w-3 h-3 rounded-full bg-bike-orange mr-1.5"></div>
              <span className="text-xs text-gray-500">Distance</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-bike-blue mr-1.5"></div>
              <span className="text-xs text-gray-500">Speed</span>
            </div>
          </div>
        </div>
        <ActivityTrendsChart />
      </div>
    </div>
  );
};

export default StatisticsCard; 