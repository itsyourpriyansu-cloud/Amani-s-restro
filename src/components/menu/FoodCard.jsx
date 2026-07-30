import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ResponsiveImage from '../common/ResponsiveImage';
import { FoodTypeBadge, SpiceLevelBadge, PriceTag } from './DishBadges';
import { ChevronRight } from 'lucide-react';
import RecommendedDishCard from './RecommendedDishCard';

/**
 * Standard dish card for the main food list.
 * Modernized with a clean horizontal layout, 108px image, max 2 badges, line-clamped description,
 * bold maroon price, and accessible orange action button.
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
    ? 'Customize & Add'
    : 'Add';

  const actionShortLabel = dish.customizationAvailable && isAvailable && isOrderable ? 'Customize' : actionLabel;
  const actionAriaLabel = dish.customizationAvailable && isAvailable && isOrderable
    ? `Customize and add ${dish.name}`
    : `${actionLabel} ${dish.name}`;

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
      className={`bg-white rounded-[16px] border border-[#EADFD6] shadow-2xs hover:shadow-sm transition-all p-3 flex gap-3.5 relative cursor-pointer select-none group ${
        !isAvailable ? 'opacity-75' : ''
      }`}
    >
      {/* Dish Image */}
      <div className="w-[104px] sm:w-[112px] h-[104px] sm:h-[112px] flex-shrink-0 rounded-[13px] overflow-hidden bg-[#FFF7EE] self-center">
        <ResponsiveImage
          src={dish.image}
          alt={dish.name}
          rounded="rounded-none"
          objectPosition="center 35%"
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info Column */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
        <div>
          {/* Short tags — dietary type, plus spice level when it matters most */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-1">
            <FoodTypeBadge foodType={dish.foodType} />
            {dish.spiceLevel && <SpiceLevelBadge spiceLevel={dish.spiceLevel} />}
          </div>

          {/* Dish Name */}
          <h3 className="font-bold text-[#211917] text-[15px] leading-snug truncate">
            {dish.name}
            {dish.bestseller && (
              <span className="ml-1.5 text-[10.5px] font-bold text-[#F47712] align-middle">Bestseller</span>
            )}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0E7E0] mt-1.5">
          <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-[16px] text-[#A30F3B] font-bold" />

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={actionDisabled}
            aria-label={actionAriaLabel}
            className={`h-[40px] px-3.5 rounded-[12px] text-[13px] font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              actionDisabled
                ? 'bg-[#FFF7EE] text-[#95867E] border border-[#EADFD6] cursor-not-allowed'
                : 'bg-[#F47712] hover:bg-[#DB5F05] text-white active:scale-95 shadow-2xs'
            }`}
          >
            <span className="hidden min-[360px]:inline">{actionLabel}</span>
            <span className="min-[360px]:hidden">{actionShortLabel}</span>
            {isAvailable && isOrderable && dish.customizationAvailable && <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
            {isAvailable && isOrderable && !dish.customizationAvailable && quantityInCart > 0 && (
              <span className="bg-[#7E0D2F] text-white px-1.5 py-0.2 rounded-full text-[10px] ml-0.5">{quantityInCart}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
