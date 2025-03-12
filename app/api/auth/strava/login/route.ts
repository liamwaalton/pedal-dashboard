import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  
  if (!clientId) {
    console.error('STRAVA_CLIENT_ID is not defined in server environment variables');
    return NextResponse.redirect(new URL('/?error=missing_client_id', request.url));
  }
  
  const baseUrl = request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/auth/strava/callback`;
  const scope = 'read,activity:read';
  
  // Redirect to Strava authorization page
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
  
  return NextResponse.redirect(stravaAuthUrl);
} 