import React from 'react';
import { getCategoryIcon } from './CategoryIcons';

/**
 * Horizontal category tab — icon + label in a single compact pill.
 */
const CategoryShortcut = ({ category, isActive, onClick }) => {
  const IconComponent = getCategoryIcon(category.id);

  // Shorten names visually if needed (e.g. "Main Course – Veg" -> "Veg Curries")
  const getShortLabel = (cat) => {
    switch (cat.id) {
      case 'all':
        return 'Full Menu';
      case 'starters':
        return 'Starters';
      case 'meals':
        return 'Meals';
      case 'biryanis':
        return 'Biryanis';
      case 'rotis_breads':
        return 'Breads';
      case 'desserts':
        return 'Desserts';
      case 'drinks':
        return 'Cooldrinks';
      default:
        return cat.name;
    }
  };

  const label = getShortLabel(category);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Show ${category.name} category`}
      className={`flex items-center gap-1.5 shrink-0 h-9 pl-2.5 pr-3.5 rounded-full border text-[13px] font-bold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] focus-visible:ring-offset-2 ${
        isActive
          ? 'bg-[#FBECEF] border-[#A30F3B] text-[#A30F3B] shadow-2xs'
          : 'bg-white border-[#EADFD6] text-[#6F5F58] hover:bg-[#FFF7EE] hover:text-[#211917]'
      }`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <IconComponent className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
};

export default CategoryShortcut;
