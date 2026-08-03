import React from 'react';
import { Clock, Flame, AlertTriangle } from 'lucide-react';
import { formatMenuPrice } from '../../utils/formatters';

/**
 * Modernized dish-metadata badges shared by FoodCard and FoodDetailsScreen.
 * FoodTypeBadge uses standard FSSAI Indian food icons (Green dot/square for Veg, Red dot/square for Non-Veg)
 * to save horizontal space and eliminate clipping on mobile cards.
 */

export const FoodTypeBadge = ({ foodType, showLabel = false, className = '' }) => {
  const isVeg = foodType === 'VEGETARIAN';
  const isEgg = foodType === 'CONTAINS_EGG';

  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full border text-[11px] leading-none font-semibold whitespace-nowrap flex-shrink-0 ${
          isVeg
            ? 'bg-success/10 text-success border-success/30'
            : isEgg
            ? 'bg-warning/10 text-warning border-warning/30'
            : 'bg-error/10 text-error border-error/30'
        } ${className}`}
      >
        <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center p-0.5 ${
          isVeg ? 'border-success' : isEgg ? 'border-warning' : 'border-error'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            isVeg ? 'bg-success' : isEgg ? 'bg-warning' : 'bg-error'
          }`} />
        </span>
        {isVeg ? 'Vegetarian' : isEgg ? 'Egg' : 'Non-Veg'}
      </span>
    );
  }

  // Standard compact FSSAI 16x16 icon format for list cards
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-[3px] border-[1.5px] p-[2px] flex-shrink-0 bg-surface ${
        isVeg
          ? 'border-success'
          : isEgg
          ? 'border-warning'
          : 'border-error'
      } ${className}`}
      title={isVeg ? 'Vegetarian' : isEgg ? 'Contains Egg' : 'Non-Vegetarian'}
      aria-label={isVeg ? 'Vegetarian' : isEgg ? 'Contains Egg' : 'Non-Vegetarian'}
    >
      <span
        className={`w-2 h-2 ${isEgg ? 'rounded-xs' : 'rounded-full'} ${
          isVeg ? 'bg-success' : isEgg ? 'bg-warning' : 'bg-error'
        }`}
      />
    </span>
  );
};

const SPICE_META = {
  MILD: { label: 'Mild', count: 1, color: 'text-warning' },
  MEDIUM: { label: 'Medium', count: 2, color: 'text-warning' },
  SPICY: { label: 'Spicy', count: 3, color: 'text-error' },
  EXTRA_SPICY: { label: 'Extra Spicy', count: 3, color: 'text-error' },
};

export const SpiceLevelBadge = ({ spiceLevel, className = '' }) => {
  if (!spiceLevel) return null;
  const meta = SPICE_META[spiceLevel] || SPICE_META.MEDIUM;
  return (
    <span
      className={`inline-flex items-center gap-1 h-5 px-1.5 rounded-md bg-error-container/50 border border-error/20 text-[11px] leading-none font-semibold text-on-error-container whitespace-nowrap flex-shrink-0 ${className}`}
      title={`Spice Level: ${meta.label}`}
    >
      <Flame className={`w-3 h-3 ${meta.color} fill-current`} aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
};

export const PrepTimeBadge = ({ minutes, className = '' }) => (
  <span className={`inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant ${className}`}>
    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
    {minutes ? `${minutes} min` : 'Prep time varies'}
  </span>
);

const AVAILABILITY_META = {
  SOLD_OUT: { label: 'Sold out for today', className: 'text-error' },
  TEMPORARILY_UNAVAILABLE: { label: 'Temporarily unavailable', className: 'text-error' },
  LIMITED_AVAILABILITY: { label: 'Few portions left', className: 'text-warning' },
};

export const AvailabilityBadge = ({ status, className = '' }) => {
  const meta = AVAILABILITY_META[status];
  if (!meta) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${meta.className} ${className}`}>
      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
      {meta.label}
    </span>
  );
};

export const PriceTag = ({ price, priceDisplay, className = '' }) => (
  <span className={`font-extrabold text-primary ${className}`}>
    {priceDisplay || formatMenuPrice(price)}
  </span>
);

