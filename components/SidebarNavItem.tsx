'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarNavItem = ({ icon, label, active = false, onClick }: SidebarNavItemProps) => {
  return (
    <button
      className={cn(
        "nav-item w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-bike-blue hover:text-white transition-all",
        active && "bg-bike-blue text-white shadow-md"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default SidebarNavItem; 