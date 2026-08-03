import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ResponsiveImage from '../common/ResponsiveImage';
import { FoodTypeBadge, SpiceLevelBadge, PriceTag } from './DishBadges';
import { ChevronRight, Plus, Sparkles } from 'lucide-react';
import RecommendedDishCard from './RecommendedDishCard';

/**
 * Standard dish card for the main food list.
 * Redesigned with modern mobile UI/UX principles:
 * - 16x16 standard Indian FSSAI Veg/Non-Veg icon (saves ~75px space)
 * - Image-overlay Bestseller tag
 * - Line-clamp-2 titles so full dish names are legible
 * - Brand primary maroon CTA button with clear customization / cart indicators
 */
const FoodCard = ({ dish, onCustomize, variant = 'compact' }) => {
  const navigate = useNavigate();
  const { addToCart, getDishQuantityInCart } = useCart();
  const { showToast } = useToast();

  const quantityInCart = getDishQuantityInCart(dish.id);
  const isAvailable = dish.availabilityStatus === 'AVAILABLE' || dish.availabilityStatus === 'LIMITED_AVAILABILITY';
  const isSoldOut = dish.availabilityStatus === 'SOLD_OUT' || dish.availabilityStatus === 'TEMPORARILY_UNAVAILABLE';
  const isOrderable = dish.orderableInApp !== false;

  const handleCardClick = () => navigate(`/menu/${dish.id}`);

  const handlePrimaryAction = (e) => {
    e.stopPropagation();
    if (!isAvailable || !isOrderable) return;

    if (dish.customizationAvailable && onCustomize) {
      onCustomize(dish);
    } else {
      addToCart(dish);
      showToast(`Added "${dish.name}" to cart`, 'success');
    }
  };

  const actionLabel = !isOrderable
    ? 'Ask server'
    : !isAvailable
    ? (isSoldOut ? 'Sold Out' : 'Unavailable')
    : dish.customizationAvailable
    ? 'Customize'
    : 'ADD';

  const actionAriaLabel = dish.customizationAvailable && isAvailable && isOrderable
    ? `Customize and add ${dish.name}`
    : `Add ${dish.name}`;

  const actionDisabled = !isAvailable || !isOrderable;

  if (variant === 'featured') {
    return <RecommendedDishCard dish={dish} onCustomize={onCustomize} />;
  }

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className={`bg-surface rounded-[18px] border border-outline-variant/60 shadow-2xs hover:shadow-md transition-all p-2.5 sm:p-3.5 flex gap-3 sm:gap-3.5 relative cursor-pointer select-none group items-center h-[160px] overflow-hidden ${
        !isAvailable ? 'opacity-70' : ''
      }`}
    >
      {/* Dish Thumbnail Container — 160px height card thumbnail */}
      <div className="relative w-[115px] sm:w-[130px] h-full shrink-0 rounded-[14px] overflow-hidden bg-surface-container flex items-center justify-center">
        <ResponsiveImage
          src={dish.image}
          alt={dish.name}
          rounded="rounded-none"
          objectPosition="center 35%"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {dish.bestseller && (
          <span className="absolute top-0 left-0 bg-primary text-on-primary text-[9px] font-extrabold px-1.5 py-0.5 rounded-br-lg shadow-xs tracking-wide uppercase z-10 flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-highlight" />
            Bestseller
          </span>
        )}
      </div>

      {/* Info Column — 200px full card height content */}
      <div className="flex-1 h-full flex flex-col justify-between min-w-0 py-0.5">
        <div className="min-w-0">
          {/* Top row: Compact standard FSSAI veg icon + spice badge */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <FoodTypeBadge foodType={dish.foodType} />
            {dish.spiceLevel && <SpiceLevelBadge spiceLevel={dish.spiceLevel} />}
          </div>

          {/* Dish Title: Bold, legible 2-line clamp */}
          <h3 className="font-sans font-bold text-on-surface text-[14.5px] sm:text-[15.5px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {dish.name}
          </h3>
        </div>

        {/* Price & Action Button Row — Never overflows */}
        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-outline-variant/60 mt-auto shrink-0 min-w-0">
          <div className="shrink-0 min-w-0">
            <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-[15px] sm:text-[16px] text-primary font-extrabold" />
          </div>

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={actionDisabled}
            aria-label={actionAriaLabel}
            className={`h-[33px] px-3 sm:px-3.5 rounded-xl text-[12px] sm:text-[12.5px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap ${
              actionDisabled
                ? 'bg-surface-container text-on-surface-variant border border-outline-variant cursor-not-allowed'
                : 'bg-primary hover:brightness-90 text-on-primary active:scale-95 shadow-xs'
            }`}
          >
            <span>{actionLabel}</span>
            {isAvailable && isOrderable && !dish.customizationAvailable && <Plus className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />}
            {isAvailable && isOrderable && dish.customizationAvailable && <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />}
            {isAvailable && isOrderable && quantityInCart > 0 && (
              <span className="bg-on-primary/20 text-on-primary px-1.5 py-0.2 rounded-full text-[10px] ml-0.5 font-extrabold">
                {quantityInCart}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

