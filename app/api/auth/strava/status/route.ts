import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check if the access token exists
  const accessToken = request.cookies.get('strava_access_token')?.value;
  const athleteData = request.cookies.get('strava_athlete')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ isLoggedIn: false });
  }

  try {
    // Parse athlete data if it exists
    const athlete = athleteData ? JSON.parse(athleteData) : null;
    
    return NextResponse.json({ 
      isLoggedIn: true,
      athlete
    });
  } catch (error) {
    console.error('Error parsing athlete data:', error);
    return NextResponse.json({ isLoggedIn: true, athlete: null });
  }
} 