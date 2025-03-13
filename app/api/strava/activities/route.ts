import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the access token from cookies
  const accessToken = request.cookies.get('strava_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Fetch activities from Strava API
    const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.statusText}`);
    }

    const activities = await response.json();
    
    // Calculate total stats
    const stats = calculateStats(activities);
    
    return NextResponse.json({ activities, stats });
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
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