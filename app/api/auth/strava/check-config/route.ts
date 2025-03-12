import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const publicClientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  
  return NextResponse.json({
    serverConfig: {
      clientIdConfigured: !!clientId,
      clientSecretConfigured: !!clientSecret,
      // Don't expose the actual values for security reasons
      clientIdValue: clientId ? `${clientId.substring(0, 2)}...` : 'not set',
    },
    clientConfig: {
      publicClientIdConfigured: !!publicClientId,
      publicClientIdValue: publicClientId ? `${publicClientId.substring(0, 2)}...` : 'not set',
    }
  });
} 