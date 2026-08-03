import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ResponsiveImage from '../common/ResponsiveImage';
import { FoodTypeBadge, SpiceLevelBadge, PriceTag } from './DishBadges';
import { ChevronRight, Plus, Minus, Sparkles } from 'lucide-react';
import RecommendedDishCard from './RecommendedDishCard';

/**
 * Standard dish card for the main food list.
 * Features:
 * - 16x16 standard Indian FSSAI Veg/Non-Veg icon
 * - Image-overlay Bestseller tag
 * - Line-clamp-2 titles in Plus Jakarta Sans typography
 * - Interactive stepper [- qty +] when added to cart:
 *   - Tapping '-' reduces/removes item directly
 *   - Tapping '+' opens customization tab again if customizable, or increments quantity
 */
const FoodCard = ({ dish, onCustomize, variant = 'compact' }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const matchingCartItems = cartItems.filter((item) => item.id === dish.id);
  const quantityInCart = matchingCartItems.reduce((acc, item) => acc + item.quantity, 0);

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

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (matchingCartItems.length === 0) return;

    const lastMatching = matchingCartItems[matchingCartItems.length - 1];
    const targetId = lastMatching.cartItemId || lastMatching.id;

    if (lastMatching.quantity > 1) {
      updateQuantity(targetId, lastMatching.quantity - 1);
    } else {
      removeFromCart(targetId);
      showToast(`Removed "${dish.name}" from cart`, 'info');
    }
  };

  const handleIncrease = (e) => {
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

          {quantityInCart > 0 && isAvailable && isOrderable ? (
            <div className="h-[34px] px-1.5 rounded-xl bg-primary text-on-primary font-bold transition-all flex items-center justify-between gap-1.5 shrink-0 shadow-xs border border-primary/20">
              <button
                type="button"
                onClick={handleDecrease}
                className="w-6.5 h-6.5 rounded-lg bg-on-primary/20 hover:bg-on-primary/30 active:scale-90 flex items-center justify-center text-on-primary transition-all cursor-pointer"
                title="Reduce quantity"
                aria-label={`Reduce ${dish.name} quantity`}
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
              
              <span className="text-[13px] font-extrabold text-on-primary px-1 min-w-[16px] text-center select-none">
                {quantityInCart}
              </span>
              
              <button
                type="button"
                onClick={handleIncrease}
                className="w-6.5 h-6.5 rounded-lg bg-on-primary/20 hover:bg-on-primary/30 active:scale-90 flex items-center justify-center text-on-primary transition-all cursor-pointer"
                title={dish.customizationAvailable ? "Customize another portion" : "Add another"}
                aria-label={dish.customizationAvailable ? `Customize another ${dish.name}` : `Add another ${dish.name}`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={actionDisabled}
              aria-label={actionAriaLabel}
              className={`h-[34px] px-3 sm:px-3.5 rounded-xl text-[12px] sm:text-[12.5px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap ${
                actionDisabled
                  ? 'bg-surface-container text-on-surface-variant border border-outline-variant cursor-not-allowed'
                  : 'bg-primary hover:brightness-90 text-on-primary active:scale-95 shadow-xs'
              }`}
            >
              <span>{actionLabel}</span>
              {isAvailable && isOrderable && !dish.customizationAvailable && <Plus className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />}
              {isAvailable && isOrderable && dish.customizationAvailable && <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

