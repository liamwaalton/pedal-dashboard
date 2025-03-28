'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/src/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useActivity, Goal } from '@/lib/activity-context';
import { Target, Clock, Activity } from 'lucide-react';

interface GoalSettingDialogProps {
  children: React.ReactNode;
}

const GoalSettingDialog: React.FC<GoalSettingDialogProps> = ({ children }) => {
  const { goal, setGoal, getGoalProgress } = useActivity();
  
  const [goalType, setGoalType] = useState<'distance' | 'time' | 'activities'>(
    goal?.type || 'distance'
  );
  const [goalTarget, setGoalTarget] = useState<number>(goal?.target || 100);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>(
    goal?.timeframe || 'month'
  );
  const [open, setOpen] = useState(false);

  const handleSaveGoal = () => {
    const newGoal: Goal = {
      type: goalType,
      target: goalTarget,
      timeframe: timeframe
    };
    
    setGoal(newGoal);
    setOpen(false);
  };

  const getGoalTypeLabel = (type: 'distance' | 'time' | 'activities') => {
    switch (type) {
      case 'distance':
        return 'kilometers';
      case 'time':
        return 'hours';
      case 'activities':
        return 'rides';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-bike-orange" />
            Set Your Cycling Goal
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Set a goal for your cycling activities and track your progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Goal Type</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={goalType === 'distance' ? 'default' : 'outline'}
                className={`rounded-full ${goalType === 'distance' ? 'bg-bike-orange hover:bg-bike-orange/90' : ''}`}
                onClick={() => setGoalType('distance')}
              >
                <Target className="h-4 w-4 mr-1" />
                Distance
              </Button>
              <Button
                type="button"
                variant={goalType === 'time' ? 'default' : 'outline'}
                className={`rounded-full ${goalType === 'time' ? 'bg-bike-blue hover:bg-bike-blue/90' : ''}`}
                onClick={() => setGoalType('time')}
              >
                <Clock className="h-4 w-4 mr-1" />
                Time
              </Button>
              <Button
                type="button"
                variant={goalType === 'activities' ? 'default' : 'outline'}
                className={`rounded-full ${goalType === 'activities' ? 'bg-green-600 hover:bg-green-600/90' : ''}`}
                onClick={() => setGoalType('activities')}
              >
                <Activity className="h-4 w-4 mr-1" />
                Rides
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Target</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={goalTarget}
                onChange={(e) => setGoalTarget(Number(e.target.value))}
                className="w-full rounded-lg"
              />
              <span className="text-sm text-gray-500 min-w-20">
                {getGoalTypeLabel(goalType)}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Timeframe</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={timeframe === 'week' ? 'default' : 'outline'}
                className={`rounded-full ${timeframe === 'week' ? 'bg-bike-orange hover:bg-bike-orange/90' : ''}`}
                onClick={() => setTimeframe('week')}
              >
                Weekly
              </Button>
              <Button
                type="button"
                variant={timeframe === 'month' ? 'default' : 'outline'}
                className={`rounded-full ${timeframe === 'month' ? 'bg-bike-blue hover:bg-bike-blue/90' : ''}`}
                onClick={() => setTimeframe('month')}
              >
                Monthly
              </Button>
              <Button
                type="button"
                variant={timeframe === 'year' ? 'default' : 'outline'}
                className={`rounded-full ${timeframe === 'year' ? 'bg-green-600 hover:bg-green-600/90' : ''}`}
                onClick={() => setTimeframe('year')}
              >
                Yearly
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSaveGoal} 
            className="bg-bike-orange hover:bg-bike-orange/90 rounded-full"
          >
            Save Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalSettingDialog; 