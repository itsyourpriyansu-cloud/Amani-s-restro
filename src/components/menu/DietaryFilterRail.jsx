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
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-surface/95 shadow-md border border-outline-variant text-primary hidden sm:flex items-center justify-center hover:bg-surface-container transition-all cursor-pointer"
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
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-surface/95 shadow-md border border-outline-variant text-primary hidden sm:flex items-center justify-center hover:bg-surface-container transition-all cursor-pointer"
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
        {/* More filters trigger — placed at the beginning */}
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          aria-label="Open more dietary and spice filters"
          className={`shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full text-[12.5px] font-bold border flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
            secondaryActiveCount > 0
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface text-on-surface border-outline-variant hover:bg-surface-container'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>More filters</span>
          {secondaryActiveCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-on-primary text-primary text-[10px] font-extrabold flex items-center justify-center">
              {secondaryActiveCount}
            </span>
          )}
        </button>

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
                  ? 'bg-primary-container text-primary border-primary/30 shadow-2xs'
                  : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {f.label}
            </button>
          );
        })}

        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="shrink-0 text-xs font-semibold text-on-surface-variant hover:text-primary underline px-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Secondary Filters Drawer / Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-surface rounded-t-[24px] sm:rounded-[24px] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">More Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5">
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
                            ? 'bg-primary-container text-primary border-primary'
                            : 'bg-surface text-on-surface-variant border-outline-variant'
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5">
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
                            ? 'bg-primary-container text-primary border-primary'
                            : 'bg-surface text-on-surface-variant border-outline-variant'
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

            <div className="pt-3 border-t border-outline-variant flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 h-11 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:brightness-90 transition-colors"
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
