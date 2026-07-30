import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search dishes, curries or biryanis', autoFocus = false }) => {
  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-4 w-5 h-5 text-[#A30F3B] pointer-events-none" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search dishes, curries or biryanis"
        className="w-full h-[52px] pl-12 pr-10 rounded-[16px] bg-white border-[1.5px] border-[#EADFD6] focus:ring-2 focus:ring-[#A30F3B] focus:border-[#A30F3B] placeholder:text-[#95867E] text-[15px] text-[#211917] transition-all outline-none shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search text"
          className="absolute right-3 flex items-center justify-center w-7 h-7 rounded-full text-[#95867E] hover:text-[#211917] hover:bg-[#FFF7EE] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
