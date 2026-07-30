import React, { useState } from 'react';
import { SlidersHorizontal, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDraggableScroll } from '../../hooks/useDraggableScroll';

// Only the highest-value filters stay visible inline; everything else lives
// behind the "More filters" bottom sheet to keep the chip row scannable.
export const PRIMARY_FILTER_IDS = ['veg', 'nonveg', 'bestseller', 'under20'];
export const SECONDARY_FILTER_IDS = ['egg', 'jain', 'available', 'mild', 'spicy'];

export const QUICK_FILTERS = [
  { id: 'veg', label: 'Veg', test: (d) => d.foodType === 'VEGETARIAN' },
  { id: 'nonveg', label: 'Non-Veg', test: (d) => d.foodType === 'NON_VEGETARIAN' },
  { id: 'bestseller', label: 'Bestsellers', test: (d) => !!d.bestseller },
  { id: 'under20', label: 'Under 20 Mins', test: (d) => (d.preparationTimeMinutes || 99) <= 20 },
  { id: 'egg', label: 'Egg', test: (d) => d.containsEgg },
  { id: 'jain', label: 'Jain Option', test: (d) => d.jainAvailable },
  { id: 'available', label: 'Available Now', test: (d) => d.availabilityStatus === 'AVAILABLE' },
  { id: 'mild', label: 'Mild Spice', test: (d) => d.spiceLevel === 'MILD' },
  { id: 'spicy', label: 'Spicy', test: (d) => d.spiceLevel === 'SPICY' },
];

/**
 * Compact horizontal dietary quick filter rail with retained 16px left padding.
 */
const DietaryFilterRail = ({ activeFilters = [], onToggleFilter, onResetFilters }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight, dragProps } = useDraggableScroll();

  const primaryFilters = QUICK_FILTERS.filter((f) => PRIMARY_FILTER_IDS.includes(f.id));
  const secondaryActiveCount = activeFilters.filter((id) => SECONDARY_FILTER_IDS.includes(id)).length;

  return (
    <section className="mb-6 relative group/filter">
      {/* Left Scroll Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll filters left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#EADFD6] text-[#A30F3B] hidden sm:flex items-center justify-center hover:bg-[#FFF7EE] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Right Scroll Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll filters right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#EADFD6] text-[#A30F3B] hidden sm:flex items-center justify-center hover:bg-[#FFF7EE] transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <div
        ref={ref}
        {...dragProps}
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar px-4 py-1 select-none cursor-grab active:cursor-grabbing"
        style={{
          scrollPaddingLeft: '16px',
          scrollPaddingRight: '16px',
          overscrollBehaviorX: 'contain',
          touchAction: 'pan-x pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Primary chips */}
        {primaryFilters.map((f) => {
          const isActive = activeFilters.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onToggleFilter(f.id)}
              aria-pressed={isActive}
              className={`shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full text-[12.5px] font-bold border transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#FBECEF] text-[#A30F3B] border-[#A30F3B]/30 shadow-2xs'
                  : 'bg-white text-[#6F5F58] border-[#EADFD6] hover:bg-[#FFF7EE] hover:text-[#211917]'
              }`}
            >
              {f.label}
            </button>
          );
        })}

        {/* More filters trigger — opens the bottom sheet with the rest */}
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          aria-label="Open more dietary and spice filters"
          className={`shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full text-[12.5px] font-bold border flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
            secondaryActiveCount > 0
              ? 'bg-[#A30F3B] text-white border-[#A30F3B]'
              : 'bg-white text-[#211917] border-[#EADFD6] hover:bg-[#FFF7EE]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>More filters</span>
          {secondaryActiveCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-[#A30F3B] text-[10px] font-extrabold flex items-center justify-center">
              {secondaryActiveCount}
            </span>
          )}
        </button>

        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="shrink-0 text-xs font-semibold text-[#95867E] hover:text-[#A30F3B] underline px-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Secondary Filters Drawer / Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[24px] sm:rounded-[24px] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADFD6]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#A30F3B]" />
                <h3 className="text-lg font-bold text-[#211917]">More Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FFF7EE] text-[#6F5F58] hover:text-[#211917] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#95867E] mb-2.5">
                  Dietary Preferences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {QUICK_FILTERS.filter((f) => ['egg', 'jain', 'available'].includes(f.id)).map((f) => {
                    const isActive = activeFilters.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => onToggleFilter(f.id)}
                        className={`min-h-[40px] px-4 rounded-xl text-xs font-bold border flex items-center gap-2 transition-colors ${
                          isActive
                            ? 'bg-[#FBECEF] text-[#A30F3B] border-[#A30F3B]'
                            : 'bg-white text-[#6F5F58] border-[#EADFD6]'
                        }`}
                      >
                        {isActive && <Check className="w-3.5 h-3.5" />}
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#95867E] mb-2.5">
                  Spice Level
                </h4>
                <div className="flex flex-wrap gap-2">
                  {QUICK_FILTERS.filter((f) => ['mild', 'spicy'].includes(f.id)).map((f) => {
                    const isActive = activeFilters.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => onToggleFilter(f.id)}
                        className={`min-h-[40px] px-4 rounded-xl text-xs font-bold border flex items-center gap-2 transition-colors ${
                          isActive
                            ? 'bg-[#FBECEF] text-[#A30F3B] border-[#A30F3B]'
                            : 'bg-white text-[#6F5F58] border-[#EADFD6]'
                        }`}
                      >
                        {isActive && <Check className="w-3.5 h-3.5" />}
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EADFD6] flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 h-11 rounded-xl border border-[#EADFD6] text-xs font-bold text-[#6F5F58] hover:bg-[#FFF7EE] transition-colors"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 h-11 rounded-xl bg-[#A30F3B] text-white text-xs font-bold shadow-md hover:bg-[#7E0D2F] transition-colors"
              >
                Apply Filters ({activeFilters.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DietaryFilterRail;
