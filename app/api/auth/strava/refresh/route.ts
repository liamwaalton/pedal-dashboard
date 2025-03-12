import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the refresh token from cookies
  const refreshToken = request.cookies.get('strava_refresh_token')?.value;
  
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
  }

  try {
    // Exchange the refresh token for a new access token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token refresh failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    // Set cookies with the new tokens
    const response = NextResponse.json({ success: true });
    
    // Set secure HTTP-only cookies
    response.cookies.set({
      name: 'strava_access_token',
      value: tokenData.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in,
      path: '/',
    });
    
    response.cookies.set({
      name: 'strava_refresh_token',
      value: tokenData.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // Long expiration for refresh token
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
} 