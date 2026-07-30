import React, { useEffect, useRef } from 'react';
import CategoryShortcut from './CategoryShortcut';
import { useDraggableScroll } from '../../hooks/useDraggableScroll';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontally scrollable visual category rail.
 * Retains 16px left padding aligned with the rest of the page.
 */
const VisualCategoryRail = ({ categories = [], selectedCategory, onSelectCategory }) => {
  const { ref, isDragging, canScrollLeft, canScrollRight, scrollLeft, scrollRight, dragProps } = useDraggableScroll();
  const selectedItemRef = useRef(null);

  // Auto-scroll selected category shortcut smoothly into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedCategory]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="mb-5 relative group/rail">
      {/* Left Scroll Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll categories left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#EADFD6] text-[#A30F3B] hidden sm:flex items-center justify-center hover:bg-[#FFF7EE] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Right Scroll Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll categories right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#EADFD6] text-[#A30F3B] hidden sm:flex items-center justify-center hover:bg-[#FFF7EE] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scroll Container with retained 16px left padding */}
      <div
        ref={ref}
        {...dragProps}
        className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-1 select-none cursor-grab active:cursor-grabbing scroll-smooth"
        style={{
          scrollSnapType: isDragging ? 'none' : 'x proximity',
          scrollPaddingLeft: '16px',
          scrollPaddingRight: '16px',
          overscrollBehaviorX: 'contain',
          touchAction: 'pan-x pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <div key={cat.id} ref={isActive ? selectedItemRef : null} className="shrink-0">
              <CategoryShortcut
                category={cat}
                isActive={isActive}
                onClick={(e) => {
                  if (isDragging) return;
                  onSelectCategory(cat.id);
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VisualCategoryRail;
