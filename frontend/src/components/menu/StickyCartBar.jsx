import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import { ShoppingBag, ArrowRight, Minus, Plus, X, ChevronUp, Trash2 } from 'lucide-react';

/**
 * Floating sticky cart summary capsule.
 * UX Behavior:
 * 1. Single Dish in Cart: Direct inline [- qty +] stepper on the bar + Far-right clear (✕).
 * 2. Multiple Dishes in Cart: Stacked food avatars + Quick Edit Popover Sheet directly above the bar,
 *    allowing instant 1-tap quantity reduction [- qty +] and item deletion for ANY dish without leaving current view.
 */
const StickyCartBar = () => {
  const navigate = useNavigate();
  const { cartItems, totals, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const [isMultiItemSheetOpen, setIsMultiItemSheetOpen] = useState(false);

  if (!totals || totals.itemCount <= 0) return null;

  const totalAmount = totals.totalPayable || totals.grandTotal || 0;
  const singleCartLine = cartItems.length === 1 ? cartItems[0] : null;
  const singleCartLineId = singleCartLine?.cartItemId || singleCartLine?.id;
  const isMultiItem = cartItems.length > 1;

  // Single Item Direct Actions
  const handleReduceSingleQuantity = (e) => {
    e?.stopPropagation();
    if (!singleCartLine || !singleCartLineId) return;
    if (singleCartLine.quantity > 1) {
      updateQuantity(singleCartLineId, singleCartLine.quantity - 1);
    } else {
      removeFromCart(singleCartLineId);
      showToast(`Removed "${singleCartLine.name}" from cart`, 'info');
    }
  };

  const handleIncreaseSingleQuantity = (e) => {
    e?.stopPropagation();
    if (!singleCartLine || !singleCartLineId) return;
    updateQuantity(singleCartLineId, singleCartLine.quantity + 1);
  };

  // Item Action in Multi-Item Sheet
  const handleItemReduce = (item, e) => {
    e?.stopPropagation();
    const itemId = item.cartItemId || item.id;
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeFromCart(itemId);
      showToast(`Removed "${item.name}"`, 'info');
    }
  };

  const handleItemIncrease = (item, e) => {
    e?.stopPropagation();
    const itemId = item.cartItemId || item.id;
    updateQuantity(itemId, item.quantity + 1);
  };

  const handleItemRemove = (item, e) => {
    e?.stopPropagation();
    const itemId = item.cartItemId || item.id;
    removeFromCart(itemId);
    showToast(`Removed "${item.name}"`, 'info');
  };

  // Main Bar Clear Button (Far Right ✕)
  const handleBarClear = (e) => {
    e?.stopPropagation();
    if (singleCartLine && singleCartLineId) {
      removeFromCart(singleCartLineId);
      showToast(`Removed "${singleCartLine.name}"`, 'info');
    } else {
      clearCart();
      setIsMultiItemSheetOpen(false);
      showToast('Cart cleared', 'info');
    }
  };

  return (
    <div
      className="fixed left-0 w-full z-40 px-3 sm:px-4 pointer-events-none transition-all duration-300"
      style={{ bottom: 'calc(92px + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto max-w-[540px] relative">

        {/* ── Multi-Item Quick Adjuster Popover Sheet ── */}
        <AnimatePresence>
          {isMultiItem && isMultiItemSheetOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto absolute bottom-full mb-3 left-0 right-0 bg-surface border border-outline-variant/60 rounded-[24px] shadow-2xl p-3.5 flex flex-col gap-3 text-on-surface z-50 overflow-hidden max-h-[300px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Quick Adjust ({totals.itemCount} Items)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setIsMultiItemSheetOpen(false);
                    showToast('Cart cleared', 'info');
                  }}
                  className="text-[11px] font-bold text-error hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              </div>

              {/* Scrollable Item Rows */}
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[200px] pr-1">
                {cartItems.map((item) => {
                  const itemId = item.cartItemId || item.id;
                  const itemUnitPrice = item.unitPrice || item.price || 0;
                  return (
                    <div
                      key={itemId}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-container-low border border-outline-variant/40"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-outline-variant/40"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-4 h-4 text-on-surface-variant" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h5 className="text-[12.5px] font-bold text-on-surface truncate leading-tight">
                            {item.name}
                          </h5>
                          <p className="text-[11px] font-semibold text-primary">
                            {formatInvoiceAmount(itemUnitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Stepper Controls for this Dish */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1 bg-surface-container border border-outline-variant/60 rounded-full p-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleItemReduce(item, e)}
                            className="w-6 h-6 rounded-full bg-surface-container-lowest hover:bg-surface-container-high active:scale-95 flex items-center justify-center text-on-surface transition-colors cursor-pointer"
                            title="Reduce quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[11.5px] font-extrabold text-on-surface px-1 min-w-[14px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleItemIncrease(item, e)}
                            className="w-6 h-6 rounded-full bg-surface-container-lowest hover:bg-surface-container-high active:scale-95 flex items-center justify-center text-on-surface transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Direct Delete Dish Button */}
                        <button
                          type="button"
                          onClick={(e) => handleItemRemove(item, e)}
                          className="w-6.5 h-6.5 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 flex items-center justify-center transition-colors cursor-pointer"
                          title={`Remove ${item.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Sticky Floating Bar ── */}
        <div className="pointer-events-auto flex min-h-[64px] items-center justify-between gap-2 sm:gap-2.5 rounded-[26px] border border-primary/20 bg-primary p-2 pl-3 pr-2 text-on-primary shadow-[0_12px_32px_rgba(116,47,28,0.35)] backdrop-blur-md">
          
          {/* Left: Dish Thumbnail Avatar(s) & Summary */}
          <div
            onClick={() => {
              if (isMultiItem) {
                setIsMultiItemSheetOpen((prev) => !prev);
              } else {
                navigate('/cart');
              }
            }}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none group/summary"
            role="button"
            tabIndex={0}
          >
            {/* Avatar Stack for Multi-Item, or Single Avatar */}
            {isMultiItem ? (
              <div className="flex items-center -space-x-3 shrink-0">
                {cartItems.slice(-2).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary shrink-0 shadow-xs"
                  />
                ))}
              </div>
            ) : singleCartLine?.image ? (
              <img
                src={singleCartLine.image}
                alt={singleCartLine.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-on-primary/15 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-on-primary" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[13px] sm:text-[14px] font-bold leading-tight truncate text-white">
                  {!isMultiItem ? singleCartLine?.name : `${totals.itemCount} Items in Cart`}
                </h4>
                {isMultiItem && (
                  <ChevronUp
                    className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${
                      isMultiItemSheetOpen ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              <p className="text-[11px] sm:text-[12px] opacity-90 font-medium truncate text-white/90">
                {formatInvoiceAmount(totalAmount)}
                {isMultiItem && (
                  <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                    Quick Edit
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Inline Quick Quantity Controls (If single cart item line) */}
          {!isMultiItem && singleCartLine && (
            <div className="flex items-center gap-1 bg-on-primary/15 p-1 rounded-full shrink-0">
              <button
                type="button"
                onClick={handleReduceSingleQuantity}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Reduce quantity"
                aria-label="Reduce quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[12px] font-extrabold text-white px-1 min-w-[16px] text-center">
                {singleCartLine.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncreaseSingleQuantity}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* View Cart Action Button */}
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="flex h-9 sm:h-10 shrink-0 items-center gap-1.5 rounded-full bg-surface px-3.5 sm:px-4 text-[12px] sm:text-[13px] font-extrabold text-primary shadow-xs hover:bg-surface-container active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            aria-label="View cart"
          >
            <span>View Cart</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
          </button>

          {/* Far Right: Direct Clear/Delete (✕) Button */}
          <button
            type="button"
            onClick={handleBarClear}
            className="w-8 h-8 rounded-full bg-on-primary/15 hover:bg-error hover:text-white text-white/90 flex items-center justify-center transition-colors shrink-0 cursor-pointer active:scale-90"
            title="Clear cart or remove item"
            aria-label="Clear cart or remove item"
          >
            <X className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
