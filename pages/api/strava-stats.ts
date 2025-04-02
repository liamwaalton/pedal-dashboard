// src/pages/api/strava-stats.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Headers for the API request
    const headers = {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    // Request body for Strava token refresh
    const body = JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    });

    // Request a new access token
    const reauthResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers,
      body,
    });

    if (!reauthResponse.ok) {
      return res.status(reauthResponse.status).json({ error: "Failed to refresh token" });
    }

    const reAuthJson = await reauthResponse.json();
    
    // Fallback to the original athlete ID if it's not in the token response
    const athleteId = reAuthJson.athlete?.id || "46396287"; // Fallback to original ID

    // Fetch athlete stats using the new access token
    const response = await fetch(
      `https://www.strava.com/api/v3/athletes/${athleteId}/stats?access_token=${reAuthJson.access_token}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch athlete stats" });
    }

    const json: {
      all_ride_totals: { count: number; distance: number; moving_time: number };
      // Add other possible fields here if needed
    } = await response.json();

    // Extract the relevant data
    const { count, distance, moving_time: movingTime } = json.all_ride_totals;
    
    // Calculate average speed in km/h
    const averageSpeed = movingTime > 0 ? (distance / 1000) / (movingTime / 3600) : 0;
    
    // Convert meters to miles
    const totalDistanceMiles = distance * 0.000621371;
    const averageSpeedMph = averageSpeed * 0.621371;
    
    console.log('Strava Data:', { distance, movingTime, totalDistanceMiles, averageSpeedMph });
    return res.status(200).json({
      totalDistance: distance, // Strava returns distance in meters
      elapsedTime: movingTime, // This is in seconds
      averageSpeed: averageSpeed, // Average speed in km/h
    });
  } catch (error) {
    console.error("Strava API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  
  }
}