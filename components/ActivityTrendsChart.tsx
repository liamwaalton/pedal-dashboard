'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  time: number;
}

interface ChartData {
  labels: string[];
  distanceData: number[];
  timeData: number[];
}

const ActivityTrendsChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [mounted, setMounted] = useState(false);
  const { activities, isLoading, timePeriod } = useActivity();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chartRef.current) return;

    // Prepare data for the chart
    const prepareChartData = (): ChartData => {
      // Return empty data if not logged in
      if (!isLoggedIn) {
        return {
          labels: ['Log in to see your activity data'],
          distanceData: [0],
          timeData: [0]
        };
      }
      
      if (!activities || activities.length === 0) {
        // Empty data for authenticated users with no activities
        return {
          labels: ['No activities found'],
          distanceData: [0],
          timeData: [0]
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
        let dateStr: string;
        let formattedDate: string;
        
        if (timePeriod === 'today') {
          // Group by hour for today
          dateStr = `${date.getHours()}`;
          formattedDate = date.toLocaleTimeString('en-US', { hour: 'numeric' });
        } else if (timePeriod === 'year') {
          // Group by month for year
          dateStr = `${date.getFullYear()}-${date.getMonth() + 1}`;
          formattedDate = date.toLocaleDateString('en-US', { month: 'short' });
        } else {
          // Group by date for other periods
          dateStr = date.toISOString().split('T')[0];
          formattedDate = date.toLocaleDateString('en-US', dateFormat);
        }
        
        if (!dailyData[dateStr]) {
          dailyData[dateStr] = {
            date: dateStr,
            formattedDate: formattedDate,
            distance: 0,
            time: 0
          };
        }
        
        dailyData[dateStr].distance += (activity.distance || 0) / 1000; // meters to km
        dailyData[dateStr].time += (activity.moving_time || 0) / 3600; // seconds to hours
      });

      // Fill in missing dates/hours for a complete timeline
      if (timePeriod === 'today') {
        // Fill in missing hours for today
        const filledData: Record<string, DailyData> = {};
        for (let hour = 0; hour < 24; hour++) {
          const hourStr = `${hour}`;
          if (dailyData[hourStr]) {
            filledData[hourStr] = dailyData[hourStr];
          } else {
            const date = new Date();
            date.setHours(hour, 0, 0, 0);
            filledData[hourStr] = {
              date: hourStr,
              formattedDate: date.toLocaleTimeString('en-US', { hour: 'numeric' }),
              distance: 0,
              time: 0
            };
          }
        }
        Object.assign(dailyData, filledData);
      } else if (timePeriod === 'month') {
        // Fill in missing days for month
        const filledData: Record<string, DailyData> = {};
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          const dateStr = date.toISOString().split('T')[0];
          
          if (dailyData[dateStr]) {
            filledData[dateStr] = dailyData[dateStr];
          } else if (date <= now) { // Only fill past dates
            filledData[dateStr] = {
              date: dateStr,
              formattedDate: date.toLocaleDateString('en-US', { day: 'numeric' }),
              distance: 0,
              time: 0
            };
          }
        }
        Object.assign(dailyData, filledData);
      } else if (timePeriod === 'year') {
        // Fill in missing months for year
        const filledData: Record<string, DailyData> = {};
        const year = now.getFullYear();
        
        for (let month = 0; month < 12; month++) {
          const date = new Date(year, month, 1);
          const dateStr = `${year}-${month + 1}`;
          
          if (dailyData[dateStr]) {
            filledData[dateStr] = dailyData[dateStr];
          } else if (date <= now) { // Only fill past months
            filledData[dateStr] = {
              date: dateStr,
              formattedDate: date.toLocaleDateString('en-US', { month: 'short' }),
              distance: 0,
              time: 0
            };
          }
        }
        Object.assign(dailyData, filledData);
      }

      // Create arrays for chart
      const sortedData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
      const dates = sortedData.map((d: DailyData) => d.formattedDate);
      const distances = sortedData.map((d: DailyData) => parseFloat(d.distance.toFixed(1)));
      const times = sortedData.map((d: DailyData) => parseFloat(d.time.toFixed(1)));

      return {
        labels: dates.length > 0 ? dates : ['No data'],
        distanceData: distances.length > 0 ? distances : [0],
        timeData: times.length > 0 ? times : [0]
      };
    };

    // Get data
    const { labels, distanceData, timeData } = prepareChartData();

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    if (ctx) {
      // Create new chart with improved styling
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Distance',
              data: distanceData,
              borderColor: '#FF5A1F', // Updated orange
              backgroundColor: 'rgba(255, 90, 31, 0.15)',
              fill: true,
              tension: 0.4,
              yAxisID: 'y',
              pointBackgroundColor: '#FF5A1F',
              pointBorderColor: 'rgba(255, 255, 255, 0.8)',
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBorderWidth: 2,
              borderWidth: 2.5,
            },
            {
              label: 'Time',
              data: timeData,
              borderColor: '#3B82F6', // Updated blue
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              fill: true,
              tension: 0.4,
              yAxisID: 'y1',
              pointBackgroundColor: '#3B82F6',
              pointBorderColor: 'rgba(255, 255, 255, 0.8)',
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBorderWidth: 2,
              borderWidth: 2.5,
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
              display: false, // Hide the legend as we have custom indicators
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              bodyColor: '#666',
              borderColor: 'rgba(200, 200, 200, 0.25)',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 10,
              boxPadding: 5,
              usePointStyle: true,
              callbacks: {
                // Format tooltip values
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.dataset.yAxisID === 'y' 
                      ? context.parsed.y.toFixed(1) + ' km'
                      : context.parsed.y.toFixed(1) + ' hrs';
                  }
                  return label;
                }
              }
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: 'rgba(100, 116, 139, 0.8)',
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
                color: 'rgba(203, 213, 225, 0.3)',
              },
              ticks: {
                color: 'rgba(100, 116, 139, 0.8)',
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
                color: 'rgba(100, 116, 139, 0.8)',
                font: {
                  size: 10,
                },
                callback: function(value) {
                  return value + ' h';
                }
              }
            }
          }
        }
      });
    }
  }, [activities, mounted, timePeriod, isLoggedIn]);

  if (isLoading) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center bg-gray-50/50 rounded-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-2 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full relative">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ActivityTrendsChart; 