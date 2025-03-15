'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { useActivity } from '@/lib/activity-context';

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
  const { activities, isLoading } = useActivity();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chartRef.current) return;

    // Prepare data for the chart
    const prepareChartData = (): ChartData => {
      if (!activities || activities.length === 0) {
        // Sample data if no activities
        return {
          labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
          distanceData: [10, 15, 5, 20, 12, 18, 25],
          timeData: [1, 1.5, 0.5, 2, 1.2, 1.8, 2.5]
        };
      }

      // Process real activity data
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      // Filter and sort activities
      const relevantActivities = activities
        .filter(activity => activity.type === 'Ride')
        .filter(activity => new Date(activity.start_date) >= thirtyDaysAgo)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

      // Group by date
      const dailyData: Record<string, DailyData> = {};
      relevantActivities.forEach(activity => {
        const date = new Date(activity.start_date);
        const dateStr = date.toISOString().split('T')[0];
        
        if (!dailyData[dateStr]) {
          dailyData[dateStr] = {
            date: dateStr,
            formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            distance: 0,
            time: 0
          };
        }
        
        dailyData[dateStr].distance += (activity.distance || 0) / 1000; // meters to km
        dailyData[dateStr].time += (activity.moving_time || 0) / 3600; // seconds to hours
      });

      // Create arrays for chart
      const dates = Object.values(dailyData).map((d: DailyData) => d.formattedDate);
      const distances = Object.values(dailyData).map((d: DailyData) => parseFloat(d.distance.toFixed(1)));
      const times = Object.values(dailyData).map((d: DailyData) => parseFloat(d.time.toFixed(1)));

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
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Distance',
              data: distanceData,
              borderColor: '#FF6934',
              backgroundColor: 'rgba(255, 105, 52, 0.2)',
              yAxisID: 'y',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Time',
              data: timeData,
              borderColor: '#3E82FF',
              backgroundColor: 'rgba(62, 130, 255, 0.2)',
              yAxisID: 'y1',
              tension: 0.4,
              fill: true,
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
              position: 'top',
              labels: {
                usePointStyle: true,
                boxWidth: 6,
                font: {
                  size: 10
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    if (context.dataset.label === 'Distance') {
                      label += context.parsed.y + ' km';
                    } else if (context.dataset.label === 'Time') {
                      label += context.parsed.y + ' hours';
                    }
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Distance (km)',
                font: {
                  size: 10
                }
              },
              ticks: {
                font: {
                  size: 9
                }
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Time (hours)',
                font: {
                  size: 10
                }
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                font: {
                  size: 9
                }
              }
            },
            x: {
              ticks: {
                font: {
                  size: 9
                }
              }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [mounted, activities]);

  if (!mounted || isLoading) {
    return (
      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="h-60 bg-gray-50 rounded-lg p-2">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ActivityTrendsChart; 