import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ResponsiveImage from '../common/ResponsiveImage';
import { FoodTypeBadge, SpiceLevelBadge, PriceTag } from './DishBadges';
import { ChevronRight, Sparkles } from 'lucide-react';

/**
 * Featured horizontal card for recommended dishes.
 * Width: 215–225px, Image height: 118px.
 */
const RecommendedDishCard = ({ dish, onCustomize, isDragging = false }) => {
  const navigate = useNavigate();
  const { addToCart, getDishQuantityInCart } = useCart();
  const { showToast } = useToast();

  const quantityInCart = getDishQuantityInCart(dish.id);
  const isAvailable = dish.availabilityStatus === 'AVAILABLE' || dish.availabilityStatus === 'LIMITED_AVAILABILITY';
  const isOrderable = dish.orderableInApp !== false;

  const handleCardClick = () => {
    if (isDragging) return;
    navigate(`/menu/${dish.id}`);
  };

  const handlePrimaryAction = (e) => {
    e.stopPropagation();
    if (isDragging || !isAvailable || !isOrderable) return;

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
    ? 'Sold Out'
    : dish.customizationAvailable
    ? 'Customize'
    : 'Add';

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className={`w-[215px] sm:w-[225px] shrink-0 bg-surface rounded-[18px] border border-outline-variant shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col select-none group ${
        !isAvailable ? 'opacity-75' : ''
      }`}
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Food Image */}
      <div className="relative w-full h-[118px] overflow-hidden bg-surface-container">
        <ResponsiveImage
          src={dish.image}
          alt={dish.name}
          rounded="rounded-none"
          objectPosition="center 35%"
          className="w-full h-full group-hover:scale-105 transition-transform duration-300 pointer-events-none"
        />
        {dish.bestseller && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10.5px] font-bold shadow-xs">
            <Sparkles className="w-3 h-3 text-highlight" aria-hidden="true" />
            Recommended
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1 justify-between">
        <div>
          {/* Dietary & Spice Indicators */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-1">
            <FoodTypeBadge foodType={dish.foodType} />
            {dish.spiceLevel && <SpiceLevelBadge spiceLevel={dish.spiceLevel} />}
          </div>

          {/* Dish Name */}
          <h3 className="font-serif font-bold text-on-surface text-[15px] sm:text-[16px] leading-snug line-clamp-2 min-h-[42px]">
            {dish.name}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-outline-variant mt-1 flex items-center justify-between">
          <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-[15px] text-primary font-extrabold" />

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={!isAvailable || !isOrderable}
            className="h-8 px-3 rounded-xl bg-primary hover:brightness-90 text-on-primary text-[12px] font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs whitespace-nowrap cursor-pointer"
            aria-label={`${actionLabel} ${dish.name}`}
          >
            <span>{actionLabel}</span>
            {dish.customizationAvailable && <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />}
            {quantityInCart > 0 && !dish.customizationAvailable && (
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

export default RecommendedDishCard;
