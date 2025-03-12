import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Create a response that redirects to the home page
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear all Strava-related cookies
  response.cookies.delete('strava_access_token');
  response.cookies.delete('strava_refresh_token');
  response.cookies.delete('strava_athlete');
  
  return response;
} 