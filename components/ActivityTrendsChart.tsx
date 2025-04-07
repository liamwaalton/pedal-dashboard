'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { useActivity, TimePeriod } from '@/lib/activity-context';
import { useAuth } from '@/lib/auth-context';

// Register all Chart.js components
Chart.register(...registerables);

// Define types for our data
interface DailyData {
  date: string;
  formattedDate: string;
  distance: number;
  averageSpeed: number;
  activityCount: number;
  totalDistance: number;
  totalMovingTime: number;
}

interface ChartData {
  labels: string[];
  distanceData: number[];
  speedData: number[];
}

const ActivityTrendsChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [mounted, setMounted] = useState(false);
  const { activities, isLoading, timePeriod } = useActivity();
  const { isLoggedIn } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check dark mode on mount and when theme changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Create observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Initial check
    checkDarkMode();

    // Cleanup
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize chart data preparation
  const prepareChartData = useMemo((): ChartData => {
    // Return empty data if not logged in
    if (!isLoggedIn) {
      return {
        labels: ['Log in to see your activity data'],
        distanceData: [0],
        speedData: [0]
      };
    }
    
    if (!activities || activities.length === 0) {
      // Empty data for authenticated users with no activities
      return {
        labels: ['No activities found'],
        distanceData: [0],
        speedData: [0]
      };
    }

    // Process real activity data
    const now = new Date();
    let startDate: Date;
    let dateFormat: Intl.DateTimeFormatOptions;
    
    // Set start date and date format based on time period
    switch (timePeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateFormat = { hour: 'numeric' };
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        dateFormat = { weekday: 'short' };
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFormat = { day: 'numeric' };
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        dateFormat = { month: 'short' };
        break;
      case '30days':
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        dateFormat = { month: 'short', day: 'numeric' };
        break;
    }

    // Filter and sort activities
    const relevantActivities = activities
      .filter(activity => activity.type === 'Ride')
      .filter(activity => new Date(activity.start_date) >= startDate)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    // Group by date or hour depending on time period
    const dailyData: Record<string, DailyData> = {};
    
    relevantActivities.forEach(activity => {
      const date = new Date(activity.start_date);
      // Ensure we're working with local time
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      let dateStr: string;
      let formattedDate: string;
      
      if (timePeriod === 'today') {
        // Group by hour for today
        dateStr = `${localDate.getHours()}`;
        formattedDate = localDate.toLocaleTimeString('en-US', { hour: 'numeric' });
      } else if (timePeriod === 'year') {
        // Group by month for year
        dateStr = `${localDate.getFullYear()}-${localDate.getMonth() + 1}`;
        formattedDate = localDate.toLocaleDateString('en-US', { month: 'short' });
      } else {
        // Group by date for other periods
        dateStr = localDate.toISOString().split('T')[0];
        formattedDate = localDate.toLocaleDateString('en-US', dateFormat);
      }
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          date: dateStr,
          formattedDate: formattedDate,
          distance: 0,
          averageSpeed: 0,
          activityCount: 0,
          totalDistance: 0,
          totalMovingTime: 0
        };
      }
      
      // Update aggregated data
      const distanceInKm = (activity.distance || 0) / 1000; // meters to km
      const movingTimeInHours = (activity.moving_time || 0) / 3600; // seconds to hours
      
      dailyData[dateStr].totalDistance += distanceInKm;
      dailyData[dateStr].totalMovingTime += movingTimeInHours;
      dailyData[dateStr].activityCount += 1;
      
      // Calculate true average speed using total distance and total time
      dailyData[dateStr].distance = dailyData[dateStr].totalDistance;
      dailyData[dateStr].averageSpeed = dailyData[dateStr].totalMovingTime > 0 
        ? dailyData[dateStr].totalDistance / dailyData[dateStr].totalMovingTime 
        : 0;
    });

    // Fill in missing dates/hours
    const filledData = fillMissingDates(dailyData, startDate, now, timePeriod, dateFormat);

    // Create arrays for chart
    const sortedData = Object.values(filledData).sort((a, b) => a.date.localeCompare(b.date));
    const dates = sortedData.map((d: DailyData) => d.formattedDate);
    const distances = sortedData.map((d: DailyData) => parseFloat(d.distance.toFixed(1)));
    const speeds = sortedData.map((d: DailyData) => parseFloat(d.averageSpeed.toFixed(1)));

    return {
      labels: dates.length > 0 ? dates : ['No data'],
      distanceData: distances.length > 0 ? distances : [0],
      speedData: speeds.length > 0 ? speeds : [0]
    };
  }, [activities, timePeriod, isLoggedIn]); // Only recompute when these dependencies change

  // Update chart when data or theme changes
  useEffect(() => {
    if (!mounted || !chartRef.current) return;

    // Get data
    const { labels, distanceData, speedData } = prepareChartData;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Distance',
            data: distanceData,
            borderColor: isDarkMode ? 'rgba(249, 115, 22, 0.8)' : 'rgba(249, 115, 22, 0.8)',
            backgroundColor: isDarkMode ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.1)',
            yAxisID: 'y',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          },
          {
            label: 'Speed',
            data: speedData,
            borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.8)',
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            yAxisID: 'y1',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            titleColor: isDarkMode ? '#fff' : '#000',
            bodyColor: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(226, 232, 240, 0.2)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: isDarkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(100, 116, 139, 0.8)',
              font: {
                size: 10,
              },
              maxRotation: 0,
            },
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(203, 213, 225, 0.3)',
            },
            ticks: {
              color: isDarkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(100, 116, 139, 0.8)',
              font: {
                size: 10,
              },
              callback: function(value) {
                return value + ' km';
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              display: false,
            },
            ticks: {
              color: isDarkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(100, 116, 139, 0.8)',
              font: {
                size: 10,
              },
              callback: function(value) {
                return value + ' km/h';
              }
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [mounted, prepareChartData, isDarkMode]); // Only update when these dependencies change

  if (isLoading) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center bg-muted/50 rounded-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-muted rounded mb-2.5"></div>
          <div className="h-2 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full relative riding-trends-graph rounded-lg">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

// Helper function to fill in missing dates
function fillMissingDates(
  data: Record<string, DailyData>,
  startDate: Date,
  endDate: Date,
  period: TimePeriod,
  dateFormat: Intl.DateTimeFormatOptions
): Record<string, DailyData> {
  const filledData = { ...data };

  const createEmptyData = (dateStr: string, formattedDate: string): DailyData => ({
    date: dateStr,
    formattedDate: formattedDate,
    distance: 0,
    averageSpeed: 0,
    activityCount: 0,
    totalDistance: 0,
    totalMovingTime: 0
  });

  if (period === 'today') {
    // Fill in missing hours
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = `${hour}`;
      if (!filledData[hourStr]) {
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        filledData[hourStr] = createEmptyData(
          hourStr,
          date.toLocaleTimeString('en-US', { hour: 'numeric' })
        );
      }
    }
  } else if (period === 'month') {
    // Fill in missing days for month
    const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(endDate.getFullYear(), endDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!filledData[dateStr] && date <= endDate) {
        filledData[dateStr] = createEmptyData(
          dateStr,
          date.toLocaleDateString('en-US', dateFormat)
        );
      }
    }
  } else if (period === 'year') {
    // Fill in missing months for year
    for (let month = 0; month < 12; month++) {
      const date = new Date(endDate.getFullYear(), month, 1);
      const dateStr = `${endDate.getFullYear()}-${month + 1}`;
      
      if (!filledData[dateStr] && date <= endDate) {
        filledData[dateStr] = createEmptyData(
          dateStr,
          date.toLocaleDateString('en-US', dateFormat)
        );
      }
    }
  } else {
    // Fill in missing days for other periods
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      if (!filledData[dateStr]) {
        filledData[dateStr] = createEmptyData(
          dateStr,
          current.toLocaleDateString('en-US', dateFormat)
        );
      }
      current.setDate(current.getDate() + 1);
    }
  }

  return filledData;
}

export default ActivityTrendsChart; 