import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Disable this endpoint in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debugging is disabled in production' }, { status: 403 });
  }
  
  // Get all cookies
  const cookieNames = ['strava_access_token', 'strava_refresh_token', 'strava_athlete'];
  const cookieData: Record<string, any> = {};
  
  // Extract information about each cookie without exposing sensitive values
  for (const name of cookieNames) {
    const cookie = request.cookies.get(name);
    if (cookie) {
      cookieData[name] = {
        exists: true,
        value: name === 'strava_athlete' ? 
          // For the athlete cookie, we want to see the actual content to debug
          cookie.value :
          // For tokens, just show a short preview
          `${cookie.value.substring(0, 8)}...`,
        // Note: We can't access these properties in RequestCookie
        // So we're just checking if the cookie exists
      };
    } else {
      cookieData[name] = { exists: false };
    }
  }
  
  // Parse athlete data if it exists
  let parsedAthlete = null;
  try {
    const athleteCookie = request.cookies.get('strava_athlete')?.value;
    if (athleteCookie) {
      parsedAthlete = JSON.parse(athleteCookie);
    }
  } catch (error) {
    console.error('Error parsing athlete cookie:', error);
  }
  
  return NextResponse.json({
    cookieData,
    parsedAthlete,
    allCookies: request.cookies.getAll().map(c => c.name)
  });
} 