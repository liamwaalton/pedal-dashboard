
import React from 'react';
import { Line } from 'recharts';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';

const data = [
  { name: 'Su', blue: 180, orange: 100 },
  { name: 'Mo', blue: 120, orange: 150 },
  { name: 'Tu', blue: 160, orange: 180 },
  { name: 'We', blue: 110, orange: 120 },
  { name: 'Th', blue: 140, orange: 90 },
  { name: 'Fr', blue: 170, orange: 160 },
  { name: 'Sa', blue: 220, orange: 200 },
];

const StatisticsChart = () => {
  return (
    <div className="h-40 mt-4 mb-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3E82FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3E82FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6934" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF6934" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#94A3B8' }}
          />
          <Area 
            type="monotone" 
            dataKey="blue" 
            stroke="#3E82FF" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorBlue)"
          />
          <Area 
            type="monotone" 
            dataKey="orange" 
            stroke="#FF6934" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorOrange)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsChart;
