import React from 'react';

/**
 * Clean, lightweight SVG category illustrations for Amani's Kitchen.
 * Palette: Maroon (#7A1F24), Chilli (#A93F1D), Leaf Green (#4B651F),
 * Warm Cream (#F7F1E5), Copper (#985D2E), Charcoal (#2A241F).
 * All graphics are resolution-independent 1:1 SVG vectors.
 */

export const FullMenuIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="32" rx="6" fill="#F7F1E5" stroke="#7A1F24" strokeWidth="2.5" />
    <path d="M14 18H34M14 24H34M14 30H26" stroke="#7A1F24" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="31" cy="30" r="3" fill="#A93F1D" />
  </svg>
);

export const MealsIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Banana leaf shape */}
    <path
      d="M6 34C10 20 22 10 42 8C40 28 30 40 14 42C10 42 7 39 6 34Z"
      fill="#DDE6CB"
      stroke="#4B651F"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M10 38C18 28 28 20 40 10" stroke="#4B651F" strokeWidth="1.8" strokeLinecap="round" />
    {/* Serving bowls */}
    <circle cx="20" cy="22" r="4" fill="#FFF" stroke="#7A1F24" strokeWidth="2" />
    <circle cx="29" cy="25" r="4.5" fill="#FFF" stroke="#A93F1D" strokeWidth="2" />
    <circle cx="23" cy="31" r="3.5" fill="#FFF" stroke="#985D2E" strokeWidth="2" />
  </svg>
);

export const BiryaniIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Handi pot base */}
    <path
      d="M10 24C10 33 16 38 24 38C32 38 38 33 38 24V20H10V24Z"
      fill="#F2D9C7"
      stroke="#A93F1D"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Pot rim */}
    <rect x="8" y="16" width="32" height="4" rx="2" fill="#A93F1D" />
    {/* Lid handle */}
    <path d="M20 16C20 13 22 11 24 11C26 11 28 13 28 16" stroke="#7A1F24" strokeWidth="2.2" strokeLinecap="round" />
    {/* Rice & aromatic garnish details */}
    <path d="M16 26C19 28 22 28 24 26C26 24 29 24 32 26" stroke="#7A1F24" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="20" r="1.5" fill="#4B651F" />
    <circle cx="18" cy="21" r="1.2" fill="#A93F1D" />
  </svg>
);

export const StartersIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Skewer line */}
    <path d="M10 38L38 10" stroke="#4A1118" strokeWidth="2.5" strokeLinecap="round" />
    {/* Spiced grilled pieces */}
    <rect
      x="14"
      y="24"
      width="10"
      height="10"
      rx="3"
      transform="rotate(-45 14 24)"
      fill="#F2D8D8"
      stroke="#7A1F24"
      strokeWidth="2.2"
    />
    <rect
      x="24"
      y="14"
      width="10"
      height="10"
      rx="3"
      transform="rotate(-45 24 14)"
      fill="#F2D9C7"
      stroke="#A93F1D"
      strokeWidth="2.2"
    />
    {/* Flame accent */}
    <path
      d="M36 34C36 37 33.5 39 31 39C29 39 28 37.5 28 36C28 33.5 31 31 31 31C31 31 36 32 36 34Z"
      fill="#A93F1D"
    />
  </svg>
);

export const CurriesIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Kadhai / wok bowl */}
    <path
      d="M8 22C8 32 15 36 24 36C33 36 40 32 40 22H8Z"
      fill="#F2D8D8"
      stroke="#7A1F24"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Handles */}
    <path d="M5 20C5 17 7 16 9 18" stroke="#7A1F24" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M43 20C43 17 41 16 39 18" stroke="#7A1F24" strokeWidth="2.2" strokeLinecap="round" />
    {/* Rich gravy wave */}
    <path d="M12 22C16 20 20 25 24 22C28 19 32 24 36 22" stroke="#A93F1D" strokeWidth="2.5" strokeLinecap="round" />
    {/* Coriander herb garnish */}
    <circle cx="24" cy="27" r="2" fill="#4B651F" />
  </svg>
);

export const BreadsIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Basket */}
    <path d="M8 26L12 38H36L40 26H8Z" fill="#F2D9C7" stroke="#985D2E" strokeWidth="2.2" strokeLinejoin="round" />
    {/* Stacked naan / rotis */}
    <path
      d="M14 26C14 18 20 14 28 16C34 18 36 22 34 26H14Z"
      fill="#F2D9C7"
      stroke="#A93F1D"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M18 20C21 19 25 20 27 23" stroke="#985D2E" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const RiceIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Rice bowl */}
    <path
      d="M10 24C10 33 16 38 24 38C32 38 38 33 38 24H10Z"
      fill="#FFF"
      stroke="#7A1F24"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Fluffy rice mound */}
    <path
      d="M10 24C10 18 16 14 24 14C32 14 38 18 38 24H10Z"
      fill="#F7F1E5"
      stroke="#985D2E"
      strokeWidth="2.2"
    />
    <path d="M18 19C20 18 22 18 24 19" stroke="#A93F1D" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SoupsIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Steam lines */}
    <path d="M18 10C18 8 20 7 20 5" stroke="#A93F1D" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 12C24 10 26 9 26 7" stroke="#A93F1D" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 10C30 8 32 7 32 5" stroke="#A93F1D" strokeWidth="2" strokeLinecap="round" />
    {/* Bowl */}
    <path d="M8 22C8 32 15 38 24 38C33 38 40 32 40 22H8Z" fill="#FFF" stroke="#7A1F24" strokeWidth="2.5" />
    <rect x="6" y="20" width="36" height="3" rx="1.5" fill="#7A1F24" />
  </svg>
);

export const FishPrawnsIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Fish outline */}
    <path
      d="M10 24C16 16 32 16 38 24C32 32 16 32 10 24Z"
      fill="#DDE6CB"
      stroke="#4B651F"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M10 24L4 18V30L10 24Z" fill="#4B651F" stroke="#4B651F" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="30" cy="22" r="1.8" fill="#7A1F24" />
  </svg>
);

export const DessertsIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Bowl */}
    <path d="M12 26C12 34 17 38 24 38C31 38 36 34 36 26H12Z" fill="#F2D9C7" stroke="#985D2E" strokeWidth="2.5" />
    {/* Gulab jamun spheres */}
    <circle cx="19" cy="22" r="5" fill="#4A1118" stroke="#7A1F24" strokeWidth="1.8" />
    <circle cx="29" cy="22" r="5" fill="#4A1118" stroke="#7A1F24" strokeWidth="1.8" />
    <circle cx="24" cy="18" r="4.5" fill="#7A1F24" stroke="#A93F1D" strokeWidth="1.8" />
  </svg>
);

export const DrinksIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Glass */}
    <path d="M14 16L17 38H31L34 16H14Z" fill="#DDE6CB" stroke="#4B651F" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Beverage level */}
    <path d="M15 20L17.2 36H30.8L33 20H15Z" fill="#F2D9C7" opacity="0.8" />
    {/* Straw */}
    <path d="M28 10L23 20L21 36" stroke="#A93F1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Mint leaf */}
    <circle cx="18" cy="19" r="2.5" fill="#4B651F" />
  </svg>
);

/**
 * Returns the appropriate SVG icon component for a category ID or icon string name.
 */
export const getCategoryIcon = (catId) => {
  switch (catId) {
    case 'all':
      return FullMenuIcon;
    case 'meals':
      return MealsIcon;
    case 'biryanis':
      return BiryaniIcon;
    case 'nonveg_starters':
    case 'chinese_veg_starters':
    case 'starters':
      return StartersIcon;
    case 'main_course_veg':
    case 'main_course_nonveg':
    case 'curries':
      return CurriesIcon;
    case 'rotis_breads':
    case 'breads':
      return BreadsIcon;
    case 'veg_pulaos':
    case 'rice_varieties':
    case 'rice':
      return RiceIcon;
    case 'veg_soups':
    case 'nonveg_soups':
    case 'soups':
      return SoupsIcon;
    case 'fish_prawns':
      return FishPrawnsIcon;
    case 'desserts':
      return DessertsIcon;
    case 'drinks':
      return DrinksIcon;
    default:
      return FullMenuIcon;
  }
};
