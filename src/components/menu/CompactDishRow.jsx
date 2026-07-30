import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { FoodTypeBadge, PriceTag } from './DishBadges';
import { ChevronRight, Plus } from 'lucide-react';

/**
 * Compact list row for simple/low-information dishes (e.g. Rotis & Breads, Drinks).
 * Keeps the menu fast to scan without forcing every ₹31 Roti into a 150px tall card.
 */
const CompactDishRow = ({ dish, onCustomize }) => {
  const navigate = useNavigate();
  const { addToCart, getDishQuantityInCart } = useCart();
  const { showToast } = useToast();

  const quantityInCart = getDishQuantityInCart(dish.id);
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
      className={`bg-white rounded-[16px] border border-[#EADFD6] shadow-2xs hover:shadow-sm transition-all p-3 flex items-center justify-between gap-3 cursor-pointer select-none ${
        !isAvailable ? 'opacity-75' : ''
      }`}
    >
      {/* Left info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2">
          <FoodTypeBadge foodType={dish.foodType} />
          <h3 className="font-bold text-[#211917] text-[14.5px] truncate">{dish.name}</h3>
        </div>
      </div>

      {/* Right price & action */}
      <div className="flex items-center gap-3 shrink-0">
        <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-[15px] text-[#A30F3B]" />

        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={!isAvailable || !isOrderable}
          className={`h-9 px-3 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            !isAvailable || !isOrderable
              ? 'bg-[#FFF7EE] text-[#95867E] border border-[#EADFD6]'
              : 'bg-[#F47712] hover:bg-[#DB5F05] text-white active:scale-95 shadow-2xs'
          }`}
          aria-label={`${actionLabel} ${dish.name}`}
        >
          {!dish.customizationAvailable && <Plus className="w-3.5 h-3.5" />}
          <span>{actionLabel}</span>
          {dish.customizationAvailable && <ChevronRight className="w-3.5 h-3.5" />}
          {quantityInCart > 0 && !dish.customizationAvailable && (
            <span className="bg-[#7E0D2F] text-white px-1.5 py-0.2 rounded-full text-[10px] ml-0.5">
              {quantityInCart}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CompactDishRow;
