import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats elevation values to avoid long decimal issues.
 * @param elevation Elevation in meters
 * @returns Formatted elevation string with no decimal places
 */
export function formatElevation(elevation: number): string {
  if (elevation >= 1000) {
    return `${(elevation / 1000).toFixed(1)}km`;
  }
  return `${Math.round(elevation)}m`;
} 