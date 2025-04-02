'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Map as MapIcon, Navigation, LogIn, MapPin, Sparkles, BarChart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useActivity } from '@/lib/activity-context';
import { Button } from '@/components/ui/button';
import { formatElevation } from '@/lib/utils';
import ComingSoonOverlay from './ComingSoonOverlay';

// Function to decode Strava's polyline format
function decodePolyline(encoded: string): [number, number][] {
  if (!encoded) return [];
  
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  const coordinates: [number, number][] = [];

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coordinates.push([lng * 1e-5, lat * 1e-5]);
  }

  return coordinates;
}

// Generate a demo route if no real routes are available
function generateDemoRoute(): [number, number][] {
  // London-centered route demo
  const centerLat = 51.509865;
  const centerLng = -0.118092;
  
  // Generate a circular-ish route around the center
  const coordinates: [number, number][] = [];
  const points = 30;
  const radius = 0.01; // About 1km
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // Add some randomness to make it look more natural
    const jitter = (Math.random() - 0.5) * 0.005;
    const lat = centerLat + Math.sin(angle) * radius + jitter;
    const lng = centerLng + Math.cos(angle) * radius + jitter;
    coordinates.push([lng, lat]);
  }
  
  // Close the loop
  coordinates.push(coordinates[0]);
  
  return coordinates;
}

const MapCard = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { isLoggedIn, login } = useAuth();
  const { activities } = useActivity();
  const [latestRoute, setLatestRoute] = useState<{
    name: string;
    distance: string;
    polyline: string;
    startLatlng?: [number, number];
    endLatlng?: [number, number];
  } | null>(null);
  const [secondRoute, setSecondRoute] = useState<{
    name: string;
    distance: string;
    polyline: string;
  } | null>(null);
  const [showAIInsightsOverlay, setShowAIInsightsOverlay] = useState(false);

  // Load the latest route data when activities are available
  useEffect(() => {
    console.log("Activities update:", activities ? `${activities.length} activities` : "no activities");
    
    if (activities && activities.length > 0) {
      // Log a sample activity to see its structure
      console.log("Sample activity:", JSON.stringify(activities[0], null, 2).substring(0, 500) + "...");
      
      // Find the latest ride with a map polyline
      const ridesWithRoute = activities
        .filter(activity => 
          activity.type === 'Ride' && 
          activity.map && 
          activity.map.summary_polyline
        );
      
      console.log("Rides with route:", ridesWithRoute.length);
      
      if (ridesWithRoute.length > 0) {
        const latest = ridesWithRoute[0];
        console.log("Latest ride with route:", latest.name, "has polyline:", !!latest.map.summary_polyline);
        
        // Start and end positions
        const coordinates = decodePolyline(latest.map.summary_polyline);
        const startLatlng = coordinates.length > 0 ? 
          [coordinates[0][1], coordinates[0][0]] as [number, number] : 
          undefined;
        
        const endLatlng = coordinates.length > 0 ? 
          [coordinates[coordinates.length - 1][1], coordinates[coordinates.length - 1][0]] as [number, number] : 
          undefined;
        
        setLatestRoute({
          name: latest.name || 'Recent Ride',
          distance: `${(latest.distance / 1000).toFixed(1)} km`,
          polyline: latest.map.summary_polyline,
          startLatlng,
          endLatlng
        });
        
        // Set second route if available
        if (ridesWithRoute.length > 1) {
          const second = ridesWithRoute[1];
          setSecondRoute({
            name: second.name || 'Previous Ride',
            distance: `${(second.distance / 1000).toFixed(1)} km`,
            polyline: second.map.summary_polyline
          });
        }
      } else {
        console.log("No rides with polyline data found");
        // For testing: check if any rides have map data at all
        const ridesWithMap = activities.filter(activity => activity.type === 'Ride' && activity.map);
        console.log("Rides with map data:", ridesWithMap.length);
        if (ridesWithMap.length > 0) {
          console.log("First ride with map:", ridesWithMap[0].name);
          console.log("Map data:", JSON.stringify(ridesWithMap[0].map, null, 2));
        }
        
        // No polylines found - create demo routes
        createDemoRoutes();
      }
    } else {
      // No activities available at all - create demo routes
      createDemoRoutes();
    }
  }, [activities]);
  
  // Create demo routes when no real routes are available
  const createDemoRoutes = () => {
    console.log("Creating demo routes");
    
    // Generate a route
    const coordinates = generateDemoRoute();
    
    setLatestRoute({
      name: 'Demo Route',
      distance: '7.5 km',
      polyline: "placeholder", // Not needed as we'll use the coordinates directly
      startLatlng: [coordinates[0][1], coordinates[0][0]] as [number, number],
      endLatlng: [coordinates[coordinates.length - 1][1], coordinates[coordinates.length - 1][0]] as [number, number]
    });
    
    setSecondRoute({
      name: 'Weekend Loop',
      distance: '12.3 km',
      polyline: "placeholder" // Not needed for display
    });
  };

  // Initialize map when component mounts and mapbox is loaded
  useEffect(() => {
    async function initializeMap() {
      if (!mapContainer.current || !window.mapboxgl || map.current) return;
      
      try {
        console.log("Initializing map...");
        
        let coordinates: [number, number][] = [];
        
        // Use either real or demo route coordinates
        if (latestRoute?.polyline && latestRoute.polyline !== "placeholder") {
          console.log("Using real route polyline");
          coordinates = decodePolyline(latestRoute.polyline);
        } else {
          console.log("Using demo route");
          coordinates = generateDemoRoute();
        }
        
        console.log("Coordinates to use:", coordinates.length);
        
        if (coordinates.length === 0) return;
        
        // Calculate the bounding box for the route
        let minLng = coordinates[0][0];
        let maxLng = coordinates[0][0];
        let minLat = coordinates[0][1];
        let maxLat = coordinates[0][1];
        
        coordinates.forEach(([lng, lat]) => {
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        });
        
        console.log("Map bounds:", { minLng, maxLng, minLat, maxLat });
        console.log("Map center:", [(minLng + maxLng) / 2, (minLat + maxLat) / 2]);
        
        // Initialize map
        map.current = new window.mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12', // Changed back to streets which is more reliable
          center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
          zoom: 11,
          attributionControl: false,
          interactive: true
        });
        
        // Handle style load errors
        map.current.on('style.load', () => {
          console.log("Map style loaded successfully");
        });
        
        // Properly handle error events with safety checks
        map.current.on('error', (e: unknown) => {
          console.log("Mapbox error occurred");
          
          // Safely handle errors without accessing potentially undefined properties
          try {
            // Try using a minimal style as fallback
            if (map.current) {
              map.current.setStyle({
                version: 8,
                sources: {},
                layers: [
                  {
                    id: 'background',
                    type: 'background',
                    paint: { 'background-color': '#f8f9fa' }
                  }
                ]
              });
            }
          } catch (styleError) {
            console.log("Failed to set fallback style");
          }
        });
        
        map.current.on('load', () => {
          console.log("Map loaded");
          
          // First add a solid background color as ultimate fallback
          try {
            map.current.addLayer({
              id: 'background-color',
              type: 'background',
              paint: {
                'background-color': '#e5e7eb'  // Light gray background
              }
            });
          } catch (err) {
            console.log("Error adding background layer");
          }
          
          // Add the route line
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              }
            }
          });
          
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#FF5A1F',
              'line-width': 4
            }
          });
          
          // Add start and end markers
          if (coordinates.length > 1) {
            // Start marker (first coordinate)
            const startCoord = coordinates[0];
            const startEl = document.createElement('div');
            startEl.className = 'marker-start';
            startEl.style.backgroundColor = '#3B82F6';
            startEl.style.width = '14px';
            startEl.style.height = '14px';
            startEl.style.borderRadius = '50%';
            startEl.style.border = '2px solid white';
            startEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            
            new window.mapboxgl.Marker(startEl)
              .setLngLat(startCoord)
              .addTo(map.current);
            
            // End marker (last coordinate)
            const endCoord = coordinates[coordinates.length - 1];
            const endEl = document.createElement('div');
            endEl.className = 'marker-end';
            endEl.style.backgroundColor = '#FF5A1F';
            endEl.style.width = '18px';
            endEl.style.height = '18px';
            endEl.style.borderRadius = '50%';
            endEl.style.border = '2px solid white';
            endEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            
            new window.mapboxgl.Marker(endEl)
              .setLngLat(endCoord)
              .addTo(map.current);
          }
          
          // Fit map to the route bounds
          map.current.fitBounds(
            [[minLng, minLat], [maxLng, maxLat]],
            { padding: 50 }
          );
        });
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    }
    
    // Load Mapbox script if not already loaded
    if (isLoggedIn && latestRoute && !window.mapboxgl && !mapLoaded) {
      console.log("Loading Mapbox script...");
      setMapLoaded(true);
      
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'; // Stable version
      script.async = true;
      script.onerror = () => {
        console.log("Failed to load Mapbox script");
      };
      script.onload = () => {
        console.log("Mapbox script loaded");
        // Use a public demo token
        window.mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
        setTimeout(() => {
          initializeMap(); // Small delay to ensure proper initialization
        }, 100);
      };
      
      const style = document.createElement('link');
      style.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
      style.rel = 'stylesheet';
      
      document.head.appendChild(style);
      document.body.appendChild(script);
    } else if (isLoggedIn && latestRoute && window.mapboxgl) {
      console.log("Mapbox already loaded, initializing map");
      setTimeout(() => {
        initializeMap(); // Small delay to ensure proper initialization
      }, 100);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isLoggedIn, latestRoute, mapLoaded]);

  if (!isLoggedIn) {
    return (
      <div className="bike-card-gradient-blue p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <MapIcon className="h-8 w-8 text-bike-blue" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Your Rides</h3>
        <p className="text-gray-600 mb-4 max-w-xs">Connect with Strava to visualize your favorite routes and riding patterns</p>
      </div>
    );
  }

  return (
    <div className="bike-card-gradient-blue p-6 flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <Navigation className="h-4 w-4 text-bike-blue" />
          </div>
          <h2 className="font-medium text-gray-800">Your Routes</h2>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 gap-2">
          <div className="w-2 h-2 rounded-full bg-bike-orange"></div>
          <span>Latest</span>
        </div>
      </div>
      
      <div className="rounded-xl overflow-hidden relative mb-4 flex-grow group">
        {/* Map gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-bike-blue/10 z-10 pointer-events-none"></div>
        
        {/* The map container needs a fixed height to render properly */}
        <div 
          ref={mapContainer} 
          className="absolute inset-0 bg-gray-200" 
          style={{ 
            minHeight: "180px", 
            width: "100%", 
            height: "100%",
            borderRadius: "0.75rem",
            border: "1px solid rgba(0,0,0,0.1)"
          }}
        >
          {/* Fallback grid pattern if map fails */}
          <div className="w-full h-full opacity-50" 
            style={{ 
              backgroundImage: `
                linear-gradient(#3E82FF10 1px, transparent 1px),
                linear-gradient(90deg, #3E82FF10 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}>
          </div>
          
          {/* Fallback route line */}
          <div className="absolute top-1/2 left-0 w-full h-1/3 transform -translate-y-1/2">
            <svg width="100%" height="100%" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,50 C50,20 100,80 150,50 C200,20 250,80 300,50" stroke="#6B4BFF" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M30,50 L270,50" stroke="#FF5A1F" strokeWidth="2" />
            </svg>
          </div>
        </div>
        
        {/* Hover overlay for interaction indication */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-20 flex items-center justify-center">
          <span className="text-bike-blue bg-white rounded-lg px-4 py-1.5 text-sm font-medium shadow-md">View Full Map</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 mb-4">
        <div className="bg-white rounded-lg p-2 shadow-sm flex items-start justify-between">
          <div className="flex gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 bg-bike-orange rounded-full flex-shrink-0 mt-1.5"></div>
            <div className="text-sm font-medium text-gray-700 break-words">
              {latestRoute?.name || 'Morning Route'}
            </div>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2 mt-1">
            {latestRoute?.distance || '5.2 km'}
          </span>
        </div>
        
        <div className="bg-white rounded-lg p-2 shadow-sm flex items-start justify-between">
          <div className="flex gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
            <div className="text-sm font-medium text-gray-700 break-words">
              {secondRoute?.name || 'Mountain Loop'}
            </div>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2 mt-1">
            {secondRoute?.distance || '12.6 km'}
          </span>
        </div>
      </div>
      
      {/* AI Insights Section */}
      <div className="mt-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <Sparkles className="h-4 w-4 text-bike-purple" />
          </div>
          <h2 className="font-medium text-gray-800">AI Insights</h2>
        </div>
        
        <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Button 
            onClick={() => setShowAIInsightsOverlay(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-bike-purple/90 to-bike-blue/90 text-white text-xs font-medium py-2 px-3 rounded-lg hover:shadow-md transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            <Sparkles className="h-4 w-4" />
            View AI Insights
          </Button>
        </div>
      </div>

      {/* AI Insights Coming Soon Overlay */}
      {showAIInsightsOverlay && (
        <ComingSoonOverlay 
          title="AI Insights Coming Soon" 
          description="We're working on advanced AI features to analyze your rides and provide personalized training recommendations."
          onClose={() => setShowAIInsightsOverlay(false)}
        />
      )}
    </div>
  );
};

// Add interface for global window object to include mapboxgl
declare global {
  interface Window {
    mapboxgl: any;
  }
}

export default MapCard; 