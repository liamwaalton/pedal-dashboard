import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the access token from cookies
  const accessToken = request.cookies.get('strava_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get the time period from the query parameters
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || '30days';

  try {
    // Fetch activities from Strava API - get more activities for longer time periods
    const perPage = period === 'year' ? 200 : period === 'month' ? 100 : 50;
    
    // Add retries for Strava API calls
    const maxRetries = 3;
    let retries = 0;
    let response;
    
    while (retries < maxRetries) {
      try {
        response = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        // If successful, break the retry loop
        if (response.ok) break;
        
        // If unauthorized, don't retry
        if (response.status === 401) break;
        
        // If it's a server error (5xx), retry
        if (response.status >= 500) {
          retries++;
          // Wait with exponential backoff before retrying (1s, 2s, 4s)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries - 1) * 1000));
          continue;
        }
        
        // For other error codes, don't retry
        break;
      } catch (fetchError) {
        // Network errors or timeouts - retry
        retries++;
        if (retries >= maxRetries) throw fetchError;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries - 1) * 1000));
      }
    }
    
    // Check if we have a response object
    if (!response) {
      throw new Error('Failed to connect to Strava API after retries');
    }

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json({ error: 'Authentication expired, please log in again' }, { status: 401 });
      } else if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      } else if (response.status >= 500) {
        return NextResponse.json({ 
          error: 'Strava service is currently unavailable. We\'ll try to show cached data if available.',
          isStravaDown: true
        }, { status: 503 });
      }
      throw new Error(`Strava API error: ${response.statusText}`);
    }

    const allActivities = await response.json();
    
    // Filter activities based on the time period
    const filteredActivities = filterActivitiesByPeriod(allActivities, period);
    
    // Calculate total stats
    const stats = calculateStats(filteredActivities);
    
    return NextResponse.json({ activities: filteredActivities, stats });
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    
    // Determine if it's a network error or timeout
    const isNetworkError = error instanceof Error && 
      (error.name === 'AbortError' || error.message.includes('network') || error.message.includes('fetch'));
    
    return NextResponse.json({ 
      error: isNetworkError 
        ? 'Unable to connect to Strava. Please check your internet connection and try again.' 
        : 'Failed to fetch activities. Please try again later.',
      isStravaDown: isNetworkError
    }, { status: 503 });
  }
}

// Helper function to filter activities by time period
function filterActivitiesByPeriod(activities: any[], period: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      // Activities from today (midnight to now)
      return activities.filter(activity => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= today;
      });
      
    case 'week':
      // Activities from the last 7 days (including today)
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6); // Include today, so go back 6 days
      return activities.filter(activity => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= weekAgo;
      });
      
    case 'month':
      // Activities from the current month (1st to now)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return activities.filter(activity => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= startOfMonth;
      });
      
    case 'year':
      // Activities from the current year (Jan 1st to now)
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return activities.filter(activity => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= startOfYear;
      });
      
    case '30days':
    default:
      // Activities from the last 30 days (including today)
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 29); // Include today, so go back 29 days
      return activities.filter(activity => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= thirtyDaysAgo;
      });
  }
}

// Helper function to calculate stats from activities
function calculateStats(activities: any[]) {
  // Initialize stats
  const stats = {
    totalDistance: 0,        // in meters
    totalMovingTime: 0,      // in seconds
    totalElevationGain: 0,   // in meters
    totalActivities: activities.length,
    recentActivities: activities.slice(0, 5),
    activityTypes: {} as Record<string, number>,
    locations: [] as { name: string, count: number }[],
  };
  
  // Track locations
  const locationMap = new Map<string, number>();
  
  // Calculate totals
  activities.forEach(activity => {
    stats.totalDistance += activity.distance || 0;
    stats.totalMovingTime += activity.moving_time || 0;
    stats.totalElevationGain += activity.total_elevation_gain || 0;
    
    // Count activity types
    const type = activity.type || 'Unknown';
    stats.activityTypes[type] = (stats.activityTypes[type] || 0) + 1;
    
    // Extract location information
    let location = null;
    
    // Try to use start coordinates to determine location if available
    if (activity.start_latlng && activity.start_latlng.length === 2) {
      const [lat, lng] = activity.start_latlng;
      
      // Simple check for UK coordinates (rough bounding box)
      if (lat >= 49.9 && lat <= 58.7 && lng >= -8.2 && lng <= 1.8) {
        location = "United Kingdom";
      }
    }
    
    // If no location from coordinates, try location_country (though it's deprecated)
    if (!location) {
      location = activity.location_country;
    }
    
    // If still no location, try to use the timezone to infer a location
    if (!location && activity.timezone) {
      // Extract location from timezone string like "(GMT-08:00) America/Los_Angeles"
      const timezoneMatch = activity.timezone.match(/\(GMT[+-]\d{2}:\d{2}\)\s+(.+)/);
      if (timezoneMatch && timezoneMatch[1]) {
        const timezoneParts = timezoneMatch[1].split('/');
        
        // Skip Africa/Abidjan timezone completely as it's often used as default for GMT+0
        if (timezoneParts[0] === "Africa" && timezoneParts[1] === "Abidjan") {
          // For UK users, default to United Kingdom for GMT+0 timezone
          location = "United Kingdom";
        }
        // Handle common timezone mappings that might be misleading
        else if (timezoneParts[0] === "Europe") {
          if (timezoneParts[1] === "London") {
            location = "United Kingdom";
          } else {
            location = timezoneParts[1].replace(/_/g, ' ');
          }
        } 
        else if (timezoneParts.length > 1) {
          // Use the city part and replace underscores with spaces
          location = timezoneParts[1].replace(/_/g, ' ');
        } else {
          location = timezoneParts[0];
        }
      }
    }
    
    // If we found a location, add it to our map
    if (location) {
      locationMap.set(location, (locationMap.get(location) || 0) + 1);
    }
  });
  
  // Convert location map to array and sort by count
  stats.locations = Array.from(locationMap.entries())
    .map(([name, count]) => ({ name, count }))
    // Filter out Abidjan completely
    .filter(loc => loc.name !== 'Abidjan')
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Get top 5 locations
  
  // Convert to more readable formats
  return {
    ...stats,
    totalDistanceKm: (stats.totalDistance / 1000).toFixed(1),
    totalMovingTimeHours: (stats.totalMovingTime / 3600).toFixed(1),
    averageSpeed: stats.totalDistance > 0 ? 
      ((stats.totalDistance / stats.totalMovingTime) * 3.6).toFixed(1) : 0, // km/h
  };
} 