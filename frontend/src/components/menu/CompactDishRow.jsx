import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { FoodTypeBadge, PriceTag } from './DishBadges';
import { ChevronRight, Plus, Minus } from 'lucide-react';

/**
 * Compact list row for simple/low-information dishes (e.g. Rotis & Breads, Drinks).
 * Features interactive stepper [- qty +] when added to cart:
 * - Tapping '-' reduces/removes item directly
 * - Tapping '+' opens customization tab again if customizable, or increments quantity
 */
const CompactDishRow = ({ dish, onCustomize }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const matchingCartItems = cartItems.filter((item) => item.id === dish.id);
  const quantityInCart = matchingCartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isAvailable = dish.availabilityStatus === 'AVAILABLE' || dish.availabilityStatus === 'LIMITED_AVAILABILITY';
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
    ? 'Sold Out'
    : dish.customizationAvailable
    ? 'Customize'
    : 'ADD';

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className={`bg-surface rounded-[16px] border border-outline-variant shadow-2xs hover:shadow-sm transition-all p-3 flex items-center justify-between gap-3 cursor-pointer select-none ${
        !isAvailable ? 'opacity-70' : ''
      }`}
    >
      {/* Left info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2">
          <FoodTypeBadge foodType={dish.foodType} />
          <h3 className="font-sans font-bold text-on-surface text-[14.5px] truncate">{dish.name}</h3>
        </div>
      </div>

      {/* Right price & action */}
      <div className="flex items-center gap-3 shrink-0">
        <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-[15px] text-primary font-extrabold" />

        {quantityInCart > 0 && isAvailable && isOrderable ? (
          <div className="h-8 px-1.5 rounded-xl bg-primary text-on-primary font-bold transition-all flex items-center justify-between gap-1.5 shrink-0 shadow-xs border border-primary/20">
            <button
              type="button"
              onClick={handleDecrease}
              className="w-6 h-6 rounded-lg bg-on-primary/20 hover:bg-on-primary/30 active:scale-90 flex items-center justify-center text-on-primary transition-all cursor-pointer"
              title="Reduce quantity"
              aria-label={`Reduce ${dish.name} quantity`}
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
            </button>
            
            <span className="text-[12.5px] font-extrabold text-on-primary px-0.5 min-w-[14px] text-center select-none">
              {quantityInCart}
            </span>
            
            <button
              type="button"
              onClick={handleIncrease}
              className="w-6 h-6 rounded-lg bg-on-primary/20 hover:bg-on-primary/30 active:scale-90 flex items-center justify-center text-on-primary transition-all cursor-pointer"
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
            disabled={!isAvailable || !isOrderable}
            className={`h-8 px-3 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              !isAvailable || !isOrderable
                ? 'bg-surface-container text-on-surface-variant border border-outline-variant'
                : 'bg-primary hover:brightness-90 text-on-primary active:scale-95 shadow-xs'
            }`}
            aria-label={`${actionLabel} ${dish.name}`}
          >
            <span>{actionLabel}</span>
            {!dish.customizationAvailable && <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
            {dish.customizationAvailable && <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CompactDishRow;

