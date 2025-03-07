
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder: string;
}

const SearchInput = ({ placeholder }: SearchInputProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full py-2 pl-4 pr-10 rounded-xl bg-gray-100/70 text-sm focus:outline-none focus:ring-1 focus:ring-bike-blue"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Search size={18} className="text-gray-400" />
      </div>
    </div>
  );
};

export default SearchInput;
