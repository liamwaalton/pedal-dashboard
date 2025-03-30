'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 sm:p-8 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center">
              
              {/* Text content - left side */}
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4">
                  Join our Cycling Community
                </h2>
                <p className="text-white/90 text-lg mb-6 max-w-xl">
                  By joining this collection, you will get acquainted with a variety of cycling sports and bike routes.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-white border-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-6 py-3 rounded-lg text-base shadow-md">
                    Welcome to Group
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
              
              {/* Illustration - right side */}
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-full max-w-xs">
                  {/* Circle background with bicycle SVG */}
                  <div className="aspect-square rounded-full bg-white/20 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src="/images/bicycle-illustration.svg" 
                      alt="Cycling illustration" 
                      className="w-full h-auto object-contain" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallbackSvg = document.getElementById('fallback-svg');
                        if (fallbackSvg) {
                          fallbackSvg.style.display = 'block';
                        }
                      }}
                    />
                    
                    {/* Fallback SVG if image fails to load */}
                    <svg 
                      id="fallback-svg"
                      style={{ display: 'none' }}
                      width="150" 
                      height="150" 
                      viewBox="0 0 150 150" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3/4 h-auto"
                    >
                      <circle cx="75" cy="75" r="73" stroke="white" strokeWidth="3" fillOpacity="0.1" fill="white" />
                      <circle cx="40" cy="106" r="15" stroke="white" strokeWidth="4" fill="white" fillOpacity="0.2" />
                      <circle cx="110" cy="106" r="15" stroke="white" strokeWidth="4" fill="white" fillOpacity="0.2" />
                      <path d="M40,106 L75,56 L110,106" stroke="white" strokeWidth="4" fill="none" />
                      <path d="M75,56 L75,96" stroke="white" strokeWidth="4" fill="none" />
                      <path d="M40,106 L75,96" stroke="white" strokeWidth="4" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-30 -mr-10 -mt-10 hidden md:block" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400 rounded-full opacity-20 -ml-20 -mb-20 hidden md:block" />
        
        {/* Bottom accent strip */}
        <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
      </div>
    </motion.div>
  );
};

export default CommunityBanner; 