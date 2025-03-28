'use client';

import React from 'react';
import { useActivity } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';
import { Target, Clock, Activity, LogIn } from 'lucide-react';
import GoalSettingDialog from './GoalSettingDialog';
import { Button } from '@/components/ui/button';

const GoalSidebarCard = () => {
  const { goal, stats, getGoalProgress } = useActivity();
  const { isLoggedIn, login } = useAuth();
  
  // If not logged in, show a prompt to connect with Strava
  if (!isLoggedIn) {
    return (
      <div className="rounded-xl p-4 bg-gray-50">
        <div className="flex justify-center mb-3">
          <div className="bg-bike-blue rounded-full p-2 inline-flex">
            <Target className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <h3 className="font-medium text-gray-800 mb-1 text-center">Set Cycling Goals</h3>
        
        <p className="text-xs text-gray-500 text-center mb-3">
          Connect with Strava to set and track your cycling goals
        </p>
        
        <div className="text-center">
          <Button 
            onClick={login}
            className="bg-[#FC4C02] hover:bg-[#e64500] text-white rounded-full gap-2 px-3 py-1 text-xs"
            size="sm"
          >
            <LogIn size={12} />
            Connect
          </Button>
        </div>
      </div>
    );
  }
  
  const progress = getGoalProgress();
  
  const getGoalIcon = () => {
    if (!goal) return <Target className="h-5 w-5 text-white" />;
    
    switch (goal.type) {
      case 'distance':
        return <Target className="h-5 w-5 text-white" />;
      case 'time':
        return <Clock className="h-5 w-5 text-white" />;
      case 'activities':
        return <Activity className="h-5 w-5 text-white" />;
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

  const getBackgroundColor = () => {
    if (!goal) return 'bg-bike-blue/10';
    
    switch (goal.type) {
      case 'distance':
        return 'bg-bike-orange/10';
      case 'time':
        return 'bg-bike-blue/10';
      case 'activities':
        return 'bg-green-600/10';
    }
  };

  const getIconBackgroundColor = () => {
    if (!goal) return 'bg-bike-blue';
    
    switch (goal.type) {
      case 'distance':
        return 'bg-bike-orange';
      case 'time':
        return 'bg-bike-blue';
      case 'activities':
        return 'bg-green-600';
    }
  };

  const getTextColor = () => {
    if (!goal) return 'text-bike-blue';
    
    switch (goal.type) {
      case 'distance':
        return 'text-bike-orange';
      case 'time':
        return 'text-bike-blue';
      case 'activities':
        return 'text-green-600';
    }
  };

  return (
    <div className={`rounded-xl p-4 ${getBackgroundColor()}`}>
      <div className="flex justify-center mb-3">
        <div className={`${getIconBackgroundColor()} rounded-full p-2 inline-flex`}>
          {getGoalIcon()}
        </div>
      </div>
      
      <h3 className="font-medium text-gray-800 mb-1 text-center">Your Goal</h3>
      
      {goal ? (
        <>
          <div className="text-center mb-3">
            <p className="text-sm font-semibold text-gray-700">
              {goal.target} {getGoalTypeLabel()} {getTimeframeLabel()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getCurrentValue()} / {goal.target} {getGoalTypeLabel()}
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor()}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </>
      ) : (
        <p className="text-xs text-gray-500 text-center mb-3">
          Set a cycling goal to track your progress
        </p>
      )}
      
      <div className="text-center">
        <GoalSettingDialog>
          <button className={`${getTextColor()} text-sm font-medium hover:underline`}>
            {goal ? 'Edit Goal' : 'Set Goal'}
          </button>
        </GoalSettingDialog>
      </div>
    </div>
  );
};

export default GoalSidebarCard; 