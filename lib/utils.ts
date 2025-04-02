import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats elevation values to avoid long decimal issues.
 * @param meters Elevation in meters
 * @returns Formatted elevation string with no decimal places
 */
export function formatElevation(meters: number): string {
  // Convert to number in case it's a string, then round to no decimal places
  return `${Math.round(Number(meters))} m`;
} 