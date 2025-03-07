
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationItemProps {
  name: string;
  value: string;
  active?: boolean;
  color?: string;
}

const LocationItem = ({ name, value, active = false, color }: LocationItemProps) => {
  return (
    <div className="location-item">
      <div className="flex items-center gap-3">
        <div 
          className={cn(
            "w-5 h-5 rounded-full", 
            color ? color : "bg-gray-200"
          )}
        />
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-xs font-medium", active ? "text-bike-blue" : "text-gray-400")}>
          {value}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

export default LocationItem;
