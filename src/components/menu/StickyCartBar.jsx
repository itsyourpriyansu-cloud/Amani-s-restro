import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import { ShoppingBag, ArrowRight } from 'lucide-react';

/**
 * Floating sticky cart summary capsule.
 * Positioned cleanly above the bottom navigation island.
 */
const StickyCartBar = () => {
  const navigate = useNavigate();
  const { totals } = useCart();

  if (!totals || totals.itemCount <= 0) return null;

  const totalAmount = totals.totalPayable || totals.grandTotal || 0;

  return (
    <div
      className="fixed left-0 w-full z-40 px-4 pointer-events-none"
      style={{ bottom: 'calc(92px + env(safe-area-inset-bottom))' }}
    >
      <div
        onClick={() => navigate('/cart')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/cart')}
        aria-label={`Cart summary: ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}, total ${formatInvoiceAmount(totalAmount)}. Click to view cart.`}
        className="max-w-[520px] mx-auto h-[64px] sm:h-[68px] bg-[#A30F3B] text-white rounded-[18px] shadow-xl flex items-center justify-between px-4 cursor-pointer active:scale-[0.98] transition-transform pointer-events-auto border border-[#7E0D2F]"
      >
        <div className="flex items-center gap-3">
          <div className="relative bg-white/20 p-2.5 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" aria-hidden="true" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#F47712] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#A30F3B]">
              {totals.itemCount}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold opacity-90 leading-none uppercase tracking-wider">
              {totals.itemCount} {totals.itemCount === 1 ? 'Item' : 'Items'} in Cart
            </span>
            <span className="font-bold text-[18px] sm:text-[20px] leading-tight mt-0.5">
              {formatInvoiceAmount(totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white text-[#A30F3B] px-4 py-2.5 rounded-xl font-bold text-[13px] shadow-xs hover:bg-[#FFF7EE] transition-colors">
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4 text-[#A30F3B]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
