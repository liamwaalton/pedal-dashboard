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
        setAthlete(data.athlete);
      } catch (error) {
        console.error('Error checking auth status:', error);
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
    // Hardcoded client ID from .env.local
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    
    // Log the client ID to help with debugging
    console.log('Using Strava Client ID:', clientId);
    
    // If client ID is undefined or empty, use a fallback approach
    if (!clientId) {
      console.error('NEXT_PUBLIC_STRAVA_CLIENT_ID is not defined in environment variables');
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