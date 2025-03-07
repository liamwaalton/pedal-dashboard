
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
        "nav-item w-full text-left",
        active && "active"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default SidebarNavItem;
