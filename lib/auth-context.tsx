'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AthleteType = {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
} | null;

type AuthContextType = {
  isLoggedIn: boolean;
  athlete: AthleteType;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  athlete: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [athlete, setAthlete] = useState<AthleteType>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/strava/status');
        const data = await response.json();
        
        setIsLoggedIn(data.isLoggedIn);
        
        // Only set athlete data if it exists
        if (data.athlete) {
          // Only log in development
          if (process.env.NODE_ENV !== 'production') {
            console.log('Setting athlete data:', data.athlete);
          }
          setAthlete(data.athlete);
        } else {
          // Only log in development
          if (process.env.NODE_ENV !== 'production') {
            console.log('No athlete data received from API');
          }
          // Keep athlete as null
        }
      } catch (error) {
        console.error('Error checking auth status:', 
          process.env.NODE_ENV === 'production' 
            ? 'Authentication failed' 
            : error
        );
        setIsLoggedIn(false);
        setAthlete(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Function to initiate Strava OAuth flow
  const login = () => {
    // Get client ID from .env.local
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    
    // If client ID is undefined or empty, use a fallback approach
    if (!clientId) {
      console.error('Strava client configuration missing');
      // Try to get the client ID from the server
      window.location.href = '/api/auth/strava/login';
      return;
    }
    
    const redirectUri = `${window.location.origin}/api/auth/strava/callback`;
    const scope = 'read,activity:read';
    
    // Redirect to Strava authorization page
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
  };

  // Function to logout
  const logout = async () => {
    try {
      await fetch('/api/auth/strava/logout');
      setIsLoggedIn(false);
      setAthlete(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, athlete, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
} 