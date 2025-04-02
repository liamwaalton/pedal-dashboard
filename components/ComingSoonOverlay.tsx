'use client';

import React from 'react';
import { TrendingUp, ArrowLeft, MessageSquare, Newspaper, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ComingSoonOverlayProps {
  title?: string;
  description?: string;
  onClose: () => void;
}

const ComingSoonOverlay = ({ 
  title = 'Challenges Coming Soon', 
  description = 'We\'re working hard to bring you exciting cycling challenges to push your limits and connect with other riders.', 
  onClose 
}: ComingSoonOverlayProps) => {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push('/');
    onClose();
  };

  // Determine which icon to show based on the title
  const getIcon = () => {
    if (title.includes('Community')) {
      return <MessageSquare size={50} className="text-white" />;
    } else if (title.includes('News')) {
      return <Newspaper size={50} className="text-white" />;
    } else if (title.includes('Routes')) {
      return <Map size={50} className="text-white" />;
    } else {
      return <TrendingUp size={50} className="text-white" />;
    }
  };

  // Determine gradient colors based on the title
  const getGradientClass = () => {
    if (title.includes('Community')) {
      return "from-[#2563EB] to-[#7DD3FC]"; // Blue gradient for Community
    } else if (title.includes('News')) {
      return "from-[#16A34A] to-[#86EFAC]"; // Green gradient for News
    } else if (title.includes('Routes')) {
      return "from-[#F59E0B] to-[#FCD34D]"; // Amber gradient for Routes
    } else {
      return "from-[#6B4BFF] to-[#9980FF]"; // Purple gradient for Challenges
    }
  };

  // Determine background and text colors for the info box
  const getInfoBoxClasses = () => {
    if (title.includes('Community')) {
      return {
        bg: "bg-blue-50",
        text: "text-blue-700"
      };
    } else if (title.includes('News')) {
      return {
        bg: "bg-green-50",
        text: "text-green-700"
      };
    } else if (title.includes('Routes')) {
      return {
        bg: "bg-amber-50",
        text: "text-amber-700"
      };
    } else {
      return {
        bg: "bg-purple-50",
        text: "text-purple-700"
      };
    }
  };

  const infoBoxClasses = getInfoBoxClasses();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className={`bg-gradient-to-br ${getGradientClass()} rounded-xl p-5 shadow-md`}>
            {getIcon()}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">{title}</h2>
        
        <p className="text-center text-gray-600 mb-6">
          {description}
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleReturnHome}
            className={`w-full py-6 text-lg shadow-md hover:shadow-lg transition-all bg-gradient-to-r ${getGradientClass()} text-white rounded-lg`}
          >
            <ArrowLeft size={22} className="mr-2" />
            Return to Dashboard
          </Button>
          
          <button 
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline text-center mt-2"
          >
            Close this message
          </button>
        </div>
        
        <div className={`mt-6 p-4 ${infoBoxClasses.bg} rounded-xl`}>
          <p className={`text-xs text-center ${infoBoxClasses.text}`}>
            Be the first to know when we launch this feature! We're working to make Pedal Pulse the best cycling companion for all your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonOverlay; 