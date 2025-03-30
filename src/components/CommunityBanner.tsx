import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample news articles
const newsArticles = [
  {
    id: 1,
    title: "New Mountain Biking Trail Opens in Echo Park",
    excerpt: "A new 12km trail has been unveiled, featuring challenging terrain and stunning views for all skill levels.",
    category: "Trails",
    date: "2 days ago",
    comments: 24,
    image: "bg-gradient-to-r from-orange-400 to-pink-500"
  },
  {
    id: 2,
    title: "Local Cyclist Wins National Championship",
    excerpt: "Sarah Johnson takes gold in the national cycling time trials, setting a new course record.",
    category: "Events",
    date: "1 week ago",
    comments: 36,
    image: "bg-gradient-to-r from-green-400 to-teal-500"
  },
  {
    id: 3,
    title: "Best Gear for Autumn Cycling",
    excerpt: "Our experts review the top weather-resistant gear to keep you riding through the changing seasons.",
    category: "Gear",
    date: "3 days ago",
    comments: 18,
    image: "bg-gradient-to-r from-blue-400 to-indigo-500"
  }
];

const CommunityBanner = () => {
  const [currentArticle, setCurrentArticle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextArticle = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentArticle((prev) => (prev + 1) % newsArticles.length);
    }
  };

  const prevArticle = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentArticle((prev) => (prev - 1 + newsArticles.length) % newsArticles.length);
    }
  };

  useEffect(() => {
    // Reset animation state after transition
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    // Auto rotate every 5 seconds
    const autoRotate = setTimeout(() => {
      nextArticle();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoRotate);
    };
  }, [currentArticle]);

  const article = newsArticles[currentArticle];

  return (
    <div className="mb-6 animate-fade-in">
      <div className="bike-card p-0 overflow-hidden">
        <div className="flex justify-between items-center px-6 pt-6">
          <h2 className="text-sm text-gray-500">Cycling News</h2>
          <div className="flex space-x-1">
            <button 
              onClick={prevArticle} 
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={isAnimating}
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={nextArticle} 
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={isAnimating}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="relative px-6 pt-4 pb-6 overflow-hidden">
          <div className={`transition-all duration-500 ease-out ${isAnimating ? 'opacity-0 transform translate-x-10' : 'opacity-100 transform translate-x-0'}`}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Article image/color block */}
              <div className={`md:w-1/3 h-40 md:h-auto ${article.image} rounded-xl flex items-center justify-center`}>
                <span className="text-white font-bold text-sm px-3 py-1 bg-black/20 rounded-full">
                  {article.category}
                </span>
              </div>
              
              {/* Article content */}
              <div className="md:w-2/3">
                <h3 className="font-bold text-xl mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{article.date}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <MessageSquare size={12} className="mr-1" />
                    <span>{article.comments} comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Article pagination indicators */}
          <div className="flex justify-center mt-5 space-x-1">
            {newsArticles.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all ${index === currentArticle ? 'bg-bike-blue w-6' : 'bg-gray-300'}`}
                onClick={() => setCurrentArticle(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityBanner;
