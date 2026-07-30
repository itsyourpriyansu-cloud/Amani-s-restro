import React from 'react';

const CategoryChip = ({ category, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      style={{ scrollSnapAlign: 'start' }}
      className={`shrink-0 whitespace-nowrap min-h-[40px] px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
        isActive
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
      }`}
    >
      {category.name}
    </button>
  );
};

export default CategoryChip;
