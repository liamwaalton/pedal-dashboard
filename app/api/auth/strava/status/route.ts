import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check if the access token exists
  const accessToken = request.cookies.get('strava_access_token')?.value;
  const athleteData = request.cookies.get('strava_athlete')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ isLoggedIn: false, debug: 'No access token found' });
  }

  try {
    // Parse athlete data if it exists
    let athlete = athleteData ? JSON.parse(athleteData) : null;
    
    // If no athlete data in cookie but we have an access token, try to fetch it from Strava API
    if (!athlete && accessToken) {
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Attempting to fetch athlete data from Strava API');
        }
        const stravaResponse = await fetch('https://www.strava.com/api/v3/athlete', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (stravaResponse.ok) {
          const stravaData = await stravaResponse.json();
          athlete = {
            id: stravaData.id,
            firstname: stravaData.firstname,
            lastname: stravaData.lastname,
            profile: stravaData.profile
          };
          if (process.env.NODE_ENV !== 'production') {
            console.log('Successfully fetched athlete data from Strava API', athlete);
          }
        } else {
          console.warn(
            'Failed to fetch athlete data from Strava API', 
            process.env.NODE_ENV === 'production' ? stravaResponse.status : stravaResponse.statusText
          );
        }
      } catch (apiError) {
        console.error(
          'Error fetching from Strava API:', 
          process.env.NODE_ENV === 'production' ? 'API error' : apiError
        );
      }
    }
    
    // Log athlete data to help debug (this will only show in the server logs)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Final athlete data being returned:', athlete);
    }
    
    if (!athlete) {
      console.warn('User is logged in but no athlete data found');
    }
    
    return NextResponse.json({ 
      isLoggedIn: true,
      athlete,
      debug: athlete ? 'Athlete data found' : 'No athlete data found, but user is logged in'
    });
  } catch (error) {
    console.error('Error parsing athlete data:', error);
    // Return authenticated but without athlete data
    return NextResponse.json({ 
      isLoggedIn: true, 
      athlete: null,
      debug: `Error parsing athlete data: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
} 