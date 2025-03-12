import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the authorization code from the URL query parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    // Set cookies with the tokens
    const response = NextResponse.redirect(new URL('/', request.url));
    
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

    // Also store athlete data in a non-httpOnly cookie so the client can access it
    response.cookies.set({
      name: 'strava_athlete',
      value: JSON.stringify({
        id: tokenData.athlete.id,
        firstname: tokenData.athlete.firstname,
        lastname: tokenData.athlete.lastname,
        profile: tokenData.athlete.profile,
      }),
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.redirect(new URL(`/?error=token_exchange_failed`, request.url));
  }
} 