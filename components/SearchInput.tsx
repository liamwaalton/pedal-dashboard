'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder: string;
  onSearch?: (value: string) => void;
}

const SearchInput = ({ placeholder, onSearch }: SearchInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.currentTarget.value);
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={16} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-100 
                  text-sm focus:outline-none focus:ring-1 focus:ring-bike-blue/30 focus:border-bike-blue/30
                  shadow-sm transition-all duration-200 placeholder:text-gray-400"
        onKeyDown={handleKeyDown}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-gray-100 rounded-md w-5 h-5 flex items-center justify-center cursor-pointer">
          <span className="text-xs text-gray-500 font-semibold">/</span>
        </div>
      </div>
    </div>
  );
};

export default SearchInput; 