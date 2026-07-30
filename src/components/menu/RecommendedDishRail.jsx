import React from 'react';
import RecommendedDishCard from './RecommendedDishCard';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDraggableScroll } from '../../hooks/useDraggableScroll';

/**
 * Curated horizontal carousel section for recommended dishes with retained 16px left padding.
 */
const RecommendedDishRail = ({ recommendedDishes = [], onCustomize, onViewAll, favouritesRef }) => {
  const { ref, isDragging, canScrollLeft, canScrollRight, scrollLeft, scrollRight, dragProps } = useDraggableScroll();

  if (!recommendedDishes || recommendedDishes.length === 0) return null;

  return (
    <section ref={favouritesRef} className="mb-6 scroll-mt-24 relative group/recommended">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-highlight" aria-hidden="true" />
          <h2 className="text-[16px] font-bold text-on-surface leading-tight">
            Popular picks
          </h2>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-primary hover:brightness-90 flex items-center gap-0.5 transition-colors cursor-pointer pb-0.5"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Left Scroll Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll recommendations left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface/95 shadow-md border border-outline-variant text-primary hidden sm:flex items-center justify-center hover:bg-surface-container hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right Scroll Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll recommendations right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface/95 shadow-md border border-outline-variant text-primary hidden sm:flex items-center justify-center hover:bg-surface-container hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scroll Container with retained 16px left padding */}
      <div
        ref={ref}
        {...dragProps}
        className="flex gap-3.5 overflow-x-auto no-scrollbar px-4 pb-2 pt-1 select-none cursor-grab active:cursor-grabbing scroll-smooth"
        style={{
          scrollSnapType: isDragging ? 'none' : 'x proximity',
          scrollPaddingLeft: '16px',
          scrollPaddingRight: '16px',
          overscrollBehaviorX: 'contain',
          touchAction: 'pan-x pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {recommendedDishes.map((dish) => (
          <RecommendedDishCard key={dish.id} dish={dish} onCustomize={onCustomize} isDragging={isDragging} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedDishRail;
