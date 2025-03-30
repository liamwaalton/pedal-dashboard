'use client';

import React from 'react';
import { Newspaper } from 'lucide-react';

const NewsPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-bike-blue p-2 rounded-lg text-white">
          <Newspaper className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold">Cycling News</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* News Article 1 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-xs font-medium rounded text-blue-600">
              Events
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-2">Tour de France 2023 Route Announced</h2>
            <p className="text-gray-600 text-sm mb-3">
              The 110th edition of the Tour de France will feature 8 mountain stages, 1 time trial, and a challenging route through the Pyrenees.
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>3 days ago</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
        
        {/* News Article 2 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
          <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600 relative">
            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-xs font-medium rounded text-green-600">
              Gear
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-2">New Carbon Fiber Frame Technology</h2>
            <p className="text-gray-600 text-sm mb-3">
              Engineers have developed a breakthrough carbon fiber layup technique that increases strength while reducing weight by 15%.
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>1 week ago</span>
              <span>7 min read</span>
            </div>
          </div>
        </div>
        
        {/* News Article 3 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
          <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-600 relative">
            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-xs font-medium rounded text-orange-600">
              Training
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-2">Interval Training for Endurance Cyclists</h2>
            <p className="text-gray-600 text-sm mb-3">
              A new study shows how strategic interval training can significantly improve endurance performance for long-distance cyclists.
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>2 weeks ago</span>
              <span>10 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage; 