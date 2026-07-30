import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search dishes, curries or biryanis',
  autoFocus = false,
}) => {
  return (
    <div className="relative flex items-center w-full">
      {/* Left Magnifying Glass Icon */}
      <Search
        className="absolute left-4 w-5 h-5 text-primary pointer-events-none shrink-0"
        aria-hidden="true"
      />

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search dishes, curries or biryanis"
        className="w-full h-[54px] pl-12 pr-11 rounded-[18px] bg-surface border-[1.5px] border-outline-variant/80 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-on-surface-variant/80 text-[15px] font-medium text-on-surface transition-all outline-none shadow-2xs"
      />

      {/* Clear button when search text is present */}
      {value && (
        <div className="absolute right-3 flex items-center">
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search text"
            className="flex items-center justify-center w-8 h-8 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
