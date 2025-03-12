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
  };
  
  // Calculate totals
  activities.forEach(activity => {
    stats.totalDistance += activity.distance || 0;
    stats.totalMovingTime += activity.moving_time || 0;
    stats.totalElevationGain += activity.total_elevation_gain || 0;
    
    // Count activity types
    const type = activity.type || 'Unknown';
    stats.activityTypes[type] = (stats.activityTypes[type] || 0) + 1;
  });
  
  // Convert to more readable formats
  return {
    ...stats,
    totalDistanceKm: (stats.totalDistance / 1000).toFixed(1),
    totalMovingTimeHours: (stats.totalMovingTime / 3600).toFixed(1),
    averageSpeed: stats.totalDistance > 0 ? 
      ((stats.totalDistance / stats.totalMovingTime) * 3.6).toFixed(1) : 0, // km/h
  };
} 