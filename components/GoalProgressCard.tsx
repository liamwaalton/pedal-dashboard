'use client';

import React from 'react';
import { useActivity } from '@/lib/activity-context';
import { Target, Clock, Activity } from 'lucide-react';
import GoalSettingDialog from './GoalSettingDialog';
import { Button } from '@/components/ui/button';

const GoalProgressCard = () => {
  const { goal, stats, getGoalProgress } = useActivity();
  
  const progress = getGoalProgress();
  
  const getGoalIcon = () => {
    if (!goal) return <Target className="h-5 w-5 text-gray-400" />;
    
    switch (goal.type) {
      case 'distance':
        return <Target className="h-5 w-5 text-bike-orange" />;
      case 'time':
        return <Clock className="h-5 w-5 text-bike-blue" />;
      case 'activities':
        return <Activity className="h-5 w-5 text-green-600" />;
    }
  };
  
  const getGoalTypeLabel = () => {
    if (!goal) return '';
    
    switch (goal.type) {
      case 'distance':
        return 'kilometers';
      case 'time':
        return 'hours';
      case 'activities':
        return 'rides';
    }
  };
  
  const getTimeframeLabel = () => {
    if (!goal) return '';
    
    switch (goal.timeframe) {
      case 'week':
        return 'this week';
      case 'month':
        return 'this month';
      case 'year':
        return 'this year';
    }
  };
  
  const getCurrentValue = () => {
    if (!goal || !stats) return 0;
    
    switch (goal.type) {
      case 'distance':
        return parseFloat((stats.totalDistance / 1000).toFixed(1)); // Convert to km
      case 'time':
        return parseFloat((stats.totalMovingTime / 3600).toFixed(1)); // Convert to hours
      case 'activities':
        return stats.totalActivities;
    }
  };
  
  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-bike-orange';
    if (progress >= 50) return 'bg-bike-blue';
    return 'bg-gray-300';
  };

  return (
    <div className="mt-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getGoalIcon()}
          <h3 className="text-sm font-medium text-gray-700">Your Goal</h3>
        </div>
        
        <GoalSettingDialog>
          <Button variant="outline" size="sm" className="text-xs h-8 rounded-full px-3">
            {goal ? 'Edit Goal' : 'Set Goal'}
          </Button>
        </GoalSettingDialog>
      </div>
      
      {goal ? (
        <>
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {goal.target} {getGoalTypeLabel()} {getTimeframeLabel()}
            </h4>
            <p className="text-sm text-gray-500">
              Current progress: {getCurrentValue()} / {goal.target} {getGoalTypeLabel()}
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className={`h-2.5 rounded-full ${getProgressColor()}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No goal set yet</p>
          <p className="text-sm text-gray-400">
            Set a cycling goal to track your progress
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalProgressCard; 