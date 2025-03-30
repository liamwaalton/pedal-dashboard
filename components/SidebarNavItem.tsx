'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

const SidebarNavItem = ({ 
  icon, 
  label, 
  active = false, 
  onClick,
  badge
}: SidebarNavItemProps) => {
  return (
    <button
      className={cn(
        "dashboard-nav-item w-full text-left",
        active && "active"
      )}
      onClick={onClick}
    >
      <span className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
        active ? "text-white" : "text-gray-500 bg-gray-100/80"
      )}>
        {icon}
      </span>
      <span className={cn(
        "font-medium flex-1", 
        active ? "text-white" : "text-gray-700"
      )}>
        {label}
      </span>
      {badge && (
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
        )}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default SidebarNavItem; 