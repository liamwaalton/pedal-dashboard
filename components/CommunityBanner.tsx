'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Sparkles, Brain, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CommunityBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="overflow-hidden rounded-xl shadow-lg relative">
        {/* Main content area with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-bike-blue p-4 sm:p-5 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center">
              
              {/* Text content - left side */}
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white/20 p-1.5 rounded-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">Coming Soon</span>
                </div>
                <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                  AI-Powered Cycling Platform
                </h2>
                <p className="text-white/90 text-base mb-4 max-w-xl">
                  Experience the future of cycling with AI-driven personalized training plans, route recommendations, and performance insights.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-white border-0 text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-semibold px-4 py-2 rounded-lg text-sm shadow-md">
                    Join Waitlist
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
              
              {/* Illustration - right side */}
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-full max-w-[120px]">
                  {/* Circle background with AI + Bicycle icon */}
                  <div className="aspect-square rounded-full bg-white/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-24 h-24 bg-purple-400/30 rounded-full animate-pulse"></div>
                      <div className="absolute w-32 h-32 border-4 border-white/30 rounded-full"></div>
                      <div className="relative z-10">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    
                    {/* Animated circuits */}
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <path d="M10,50 Q30,20 50,50 Q70,80 90,50" stroke="white" strokeWidth="0.5" fill="none" />
                        <path d="M10,60 Q30,90 50,60 Q70,30 90,60" stroke="white" strokeWidth="0.5" fill="none" />
                        <path d="M50,10 Q20,30 50,50 Q80,70 50,90" stroke="white" strokeWidth="0.5" fill="none" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full opacity-30 -mr-10 -mt-10 hidden md:block" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400 rounded-full opacity-20 -ml-20 -mb-20 hidden md:block" />
        
        {/* Bottom accent strip */}
        <div className="h-2 bg-gradient-to-r from-purple-400 to-blue-500" />
      </div>
    </motion.div>
  );
};

export default CommunityBanner; 