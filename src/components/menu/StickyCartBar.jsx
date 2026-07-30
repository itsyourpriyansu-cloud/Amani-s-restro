import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import { ShoppingBag, ArrowRight, Minus, X } from 'lucide-react';

/**
 * Floating sticky cart summary capsule.
 * Positioned cleanly above the bottom navigation island.
 */
const StickyCartBar = () => {
  const navigate = useNavigate();
  const { cartItems, totals, updateQuantity, removeFromCart } = useCart();

  if (!totals || totals.itemCount <= 0) return null;

  const totalAmount = totals.totalPayable || totals.grandTotal || 0;
  const singleCartLine = cartItems.length === 1 ? cartItems[0] : null;
  const singleCartLineId = singleCartLine?.cartItemId || singleCartLine?.id;
  const shouldRemove = singleCartLine?.quantity === 1;

  const handleReduceOrRemove = () => {
    if (!singleCartLine || !singleCartLineId) return;

    if (shouldRemove) {
      removeFromCart(singleCartLineId);
      return;
    }

    updateQuantity(singleCartLineId, singleCartLine.quantity - 1);
  };

  return (
    <div
      className="fixed left-0 w-full z-40 px-4 pointer-events-none"
      style={{ bottom: 'calc(92px + env(safe-area-inset-bottom))' }}
    >
      <div className="pointer-events-auto mx-auto flex min-h-[68px] max-w-[520px] items-center gap-2 rounded-[18px] border border-primary bg-primary p-2.5 text-on-primary shadow-xl">
        {singleCartLine ? (
          <button
            type="button"
            onClick={handleReduceOrRemove}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-on-primary/15 text-on-primary transition-colors hover:bg-on-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            aria-label={
              shouldRemove
                ? `Remove ${singleCartLine.name} from cart`
                : `Reduce ${singleCartLine.name} quantity to ${singleCartLine.quantity - 1}`
            }
            title={shouldRemove ? 'Remove item' : 'Reduce quantity'}
          >
            {shouldRemove ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Minus className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-primary bg-error px-1 text-[10px] font-extrabold text-on-error">
              {singleCartLine.quantity}
            </span>
          </button>
        ) : (
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-on-primary/15">
            <ShoppingBag className="h-5 w-5 text-on-primary" aria-hidden="true" />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-primary bg-error px-1 text-[10px] font-extrabold text-on-error">
              {totals.itemCount}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/cart')}
          aria-label={`Cart summary: ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}, total ${formatInvoiceAmount(totalAmount)}. View cart.`}
          className="min-w-0 flex-1 rounded-lg px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary"
        >
          <span className="block truncate text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] opacity-90 sm:text-[11px]">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} in cart
          </span>
          <span className="mt-0.5 block truncate text-[17px] font-bold leading-5 sm:text-[19px]">
            {formatInvoiceAmount(totalAmount)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-surface px-3.5 text-[13px] font-bold text-primary shadow-xs transition-colors hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:px-4"
          aria-label="View cart"
        >
          <span>
            <span className="hidden min-[360px]:inline">View </span>
            Cart
          </span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default StickyCartBar;
