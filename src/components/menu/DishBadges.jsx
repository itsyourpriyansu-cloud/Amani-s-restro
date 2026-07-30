import React from 'react';
import { Clock, Flame, AlertTriangle } from 'lucide-react';
import { formatMenuPrice } from '../../utils/formatters';

/**
 * Small, reusable dish-metadata badges shared by FoodCard and FoodDetailsScreen.
 * Dietary/spice/availability status is always paired with a text label — never color alone.
 */

const FOOD_TYPE_META = {
  VEGETARIAN: { label: 'Vegetarian', dotClass: 'bg-success', textClass: 'text-success', bgClass: 'bg-success/10 border-success/30' },
  NON_VEGETARIAN: { label: 'Non-Vegetarian', dotClass: 'bg-danger', textClass: 'text-danger', bgClass: 'bg-danger/10 border-danger/30' },
  CONTAINS_EGG: { label: 'Contains Egg', dotClass: 'bg-warning', textClass: 'text-warning', bgClass: 'bg-warning/10 border-warning/30' },
};

export const FoodTypeBadge = ({ foodType, className = '' }) => {
  const meta = FOOD_TYPE_META[foodType] || FOOD_TYPE_META.VEGETARIAN;
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full border text-[11px] leading-none font-semibold whitespace-nowrap flex-shrink-0 ${meta.bgClass} ${meta.textClass} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full border border-current ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
};

const SPICE_META = {
  MILD: { label: 'Mild', flames: 1 },
  MEDIUM: { label: 'Medium Spice', flames: 2 },
  SPICY: { label: 'Spicy', flames: 3 },
  EXTRA_SPICY: { label: 'Extra Spicy', flames: 3 },
};

export const SpiceLevelBadge = ({ spiceLevel, className = '' }) => {
  if (!spiceLevel) return null;
  const meta = SPICE_META[spiceLevel] || SPICE_META.MEDIUM;
  return (
    <span
      className={`inline-flex items-center gap-1 h-[22px] px-2 rounded-full border border-saffron-600/30 bg-saffron-100/60 text-maroon-900 text-[11px] leading-none font-semibold whitespace-nowrap flex-shrink-0 ${className}`}
      title={meta.label}
    >
      <Flame className="w-3 h-3" aria-hidden="true" />
      {meta.label}
    </span>
  );
};

export const PrepTimeBadge = ({ minutes, className = '' }) => (
  <span className={`inline-flex items-center gap-1 text-[11px] font-medium text-muted ${className}`}>
    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
    {minutes ? `${minutes} min` : 'Prep time varies'}
  </span>
);

const AVAILABILITY_META = {
  SOLD_OUT: { label: 'Sold out for today', className: 'text-danger' },
  TEMPORARILY_UNAVAILABLE: { label: 'Temporarily unavailable', className: 'text-danger' },
  LIMITED_AVAILABILITY: { label: 'Only a few portions left', className: 'text-warning' },
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
  <span className={`font-bold text-maroon-800 ${className}`}>
    {priceDisplay || formatMenuPrice(price)}
  </span>
);
