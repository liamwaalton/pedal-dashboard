'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import StatisticsChart from './StatisticsChart';
import ActivityStats from './ActivityStats';
import { useActivity } from '@/lib/activity-context';
import { toast } from '@/components/ui/use-toast';

interface StatisticsCardProps {
  timeframe?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  timeframe = 'Last 30 Days'
}) => {
  const { stats, isLoading, error, loadActivities } = useActivity();
  const [showActivityStats, setShowActivityStats] = useState(false);

  // Format distance to 1 decimal place when available
  const displayDistance = isLoading || !stats ? "Loading..." : `${stats.totalDistanceKm} KM`;
  
  // Format duration from hours
  const displayDuration = isLoading || !stats ? "Loading..." : `${stats.totalMovingTimeHours} Hours`;

  const handleLoadData = async () => {
    try {
      await loadActivities();
      setShowActivityStats(true);
      toast({
        title: "Data loaded successfully",
        description: "Your Strava activity data has been loaded.",
      });
    } catch (err) {
      toast({
        title: "Error loading data",
        description: "There was a problem loading your Strava data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bike-card h-auto flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm text-gray-500">Statistics</h2>
        <div className="relative">
          <Button variant="outline" className="text-xs h-8 rounded-full px-3">
            {timeframe}
          </Button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800">Excellent!</h3>
      <p className="text-sm text-gray-500 mb-2">Your cycling statistics from Strava</p>
      
      {/* Show ActivityStats component when data is loaded */}
      {showActivityStats && <ActivityStats />}
      
      <div className="flex-grow">
        <StatisticsChart />
      </div>
      
      <div className="flex justify-between mt-auto pt-2">
        <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-full">
          <div className="bg-bike-orange rounded-full p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17v-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 14.5L12 17l2.5-2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Distance</p>
            <p className="font-semibold text-bike-orange">{displayDistance}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
          <div className="bg-bike-blue rounded-full p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="font-semibold text-bike-blue">{displayDuration}</p>
          </div>
        </div>
      </div>
      
      {/* Load Data Button */}
      <div className="mt-4">
        <Button 
          onClick={handleLoadData} 
          className="w-full bg-bike-blue hover:bg-bike-blue/90"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load Data"}
        </Button>
      </div>
    </div>
  );
};

export default StatisticsCard; 