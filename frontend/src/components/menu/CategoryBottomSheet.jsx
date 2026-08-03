import React from 'react';

export const REAL_MENU_CATEGORIES = [
  { id: 'starters', name: 'Starters' },
  { id: 'meals', name: 'Meals' },
  { id: 'biryanis', name: 'Biryanis' },
  { id: 'rotis_breads', name: 'Breads' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Cooldrinks' },
];

/**
 * Zomato exact Menu Popover Modal matching Image 1.
 */
const CategoryBottomSheet = ({
  isOpen,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  dishes = [],
}) => {
  if (!isOpen) return null;

  const totalDishes = dishes.length;

  const menuCategories = [
    { id: 'all', name: 'Full Menu', count: totalDishes },
    ...REAL_MENU_CATEGORIES.map((cat) => ({
      ...cat,
      count: dishes.filter((d) => d.category === cat.id).length,
    })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      {/* Translucent backdrop click trigger */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close menu modal"
      />

      {/* Floating Card Popover matching Image 1 */}
      <div className="relative w-full max-w-[340px] sm:max-w-[370px] bg-white rounded-[24px] p-3.5 sm:p-4 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 z-10 max-h-[70vh] flex flex-col my-auto border border-gray-100">
        <div className="overflow-y-auto no-scrollbar divide-y divide-gray-100/70">
          {menuCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`w-full py-3 px-3.5 flex items-center justify-between text-left transition-colors duration-150 rounded-xl cursor-pointer ${
                  isSelected ? 'bg-red-50/50' : 'hover:bg-gray-50/80 active:bg-gray-100/80'
                }`}
              >
                <span
                  className={`text-[15px] sm:text-[16px] tracking-tight ${
                    isSelected ? 'font-bold text-[#E23744]' : 'font-semibold text-[#3D3E4E]'
                  }`}
                >
                  {cat.name}
                </span>

                <span
                  className={`text-[14px] sm:text-[15px] ${
                    isSelected ? 'font-bold text-[#E23744]' : 'font-medium text-[#686B78]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBottomSheet;
