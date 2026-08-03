import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';
import { formatInvoiceAmount, formatMenuPrice } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import BillingSummary from '../../components/common/BillingSummary';
import CustomizationModal from '../../components/menu/CustomizationModal';
import AvailableOffersBottomSheet, { AVAILABLE_OFFERS } from '../../components/menu/AvailableOffersBottomSheet';
import HonestExpectationBanner from '../../components/order/HonestExpectationBanner';
import { AlertTriangle, Edit3, Trash2, Plus, Minus, Percent, ChevronRight, Sparkles, Check } from 'lucide-react';

const CartScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    updateCartItemCustomization,
    clearCart,
    tipPercentage,
    setTipPercentage,
    customTipAmount,
    setCustomTipAmount,
    selectedTipOption,
    setSelectedTipOption,
    appliedPromo,
    setAppliedPromo,
    specialOrderNotes,
    setSpecialOrderNotes,
    totals,
  } = useCart();
  const { placeOrder, kitchenLoad } = useOrder();
  const { showToast } = useToast();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOffersSheetOpen, setIsOffersSheetOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleApplyOfferFromSheet = (offer) => {
    const subtotal = cartItems.reduce((acc, item) => {
      const basePrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
      return acc + (basePrice * item.quantity);
    }, 0);

    if (subtotal < offer.minOrderValue) {
      showToast(`Add ${formatInvoiceAmount(offer.minOrderValue - subtotal)} more to unlock ${offer.code}`, 'error');
      return;
    }

    setAppliedPromo(offer);
    setPromoCodeInput(offer.code);
    setPromoError('');
    
    let savedAmount = 0;
    if (offer.discountPercent) {
      savedAmount = (subtotal * offer.discountPercent) / 100;
    } else if (offer.flatDiscount) {
      savedAmount = offer.flatDiscount;
    }

    showToast(`Coupon "${offer.code}" applied! Saved ${formatInvoiceAmount(savedAmount)}`, 'success');
  };

  const handleRemoveAppliedOffer = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    showToast('Coupon removed from cart', 'info');
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError('');
    try {
      const res = await cartService.applyPromoCode(promoCodeInput);
      if (res.data.success) {
        setAppliedPromo(res.data.promo);
        showToast(`Promo "${res.data.promo.code}" applied successfully!`, 'success');
        setPromoCodeInput('');
      } else {
        setPromoError(res.data.message || 'Invalid promo code. Please check and try again.');
      }
    } catch (err) {
      setPromoError('Could not apply promo code. Please try again.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const payload = { tableNumber, items: cartItems, totals, specialNotes: specialOrderNotes };
      const res = await orderService.createOrder(payload);
      placeOrder(res.data);
      clearCart();
      showToast('Order placed successfully with the kitchen!', 'success');
      navigate('/order-confirmation');
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (newPayload) => {
    if (!editingItem) return;
    updateCartItemCustomization(editingItem.cartItemId, newPayload);
    showToast(`Updated customization for ${editingItem.name}`, 'success');
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <TopAppBar variant="brand" />
        <main className="flex-1 pt-20 px-4">
          <EmptyState
            icon={() => <Icon name="shopping_bag" className="text-4xl" />}
            title="Your cart is empty"
            description="Explore our regional menu of biryanis, curries and tandoor grills, and add items to your cart to begin your order."
            actionLabel="Browse Full Menu"
            onAction={() => navigate('/menu')}
          />
        </main>
        <BottomNavBar />
      </>
    );
  }

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 pt-20 pb-48 md:pb-16 max-w-[1280px] mx-auto w-full px-4 md:px-10">
        <header className="mb-5">
          <h2 className="text-2xl md:text-4xl font-bold text-ink">Your Selection</h2>
          <p className="text-sm text-muted mt-1">Review your order before it's sent to the kitchen.</p>
        </header>

        {/* Card: table & order context — table number itself lives in the top bar chip,
            so this card only adds information that isn't shown there yet. */}
        <section className="mb-4 bg-surface-container-lowest rounded-2xl px-4 py-3 border border-border shadow-card flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-ink font-semibold">
            <Icon name="restaurant" className="text-maroon-800 text-lg" />
            <span>Dine-in &bull; Table {tableNumber}</span>
          </div>
          <span className="text-muted font-medium">{totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}</span>
        </section>

        {/* Card: kitchen status */}
        <section className="mb-6">
          <HonestExpectationBanner
            kitchenLoad={kitchenLoad}
            estimatedRange={`${kitchenLoad?.averagePreparationMinutes || 20}–${(kitchenLoad?.averagePreparationMinutes || 20) + 5} mins`}
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Items */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {cartItems.map((item) => {
              const singleUnitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
              const itemTotalPrice = singleUnitPrice * item.quantity;
              const hasModifiers = (item.selectedCustomizations && item.selectedCustomizations.length > 0) || item.makeVegan || item.jainPreparation;

              return (
                <div
                  key={item.cartItemId || item.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-card flex flex-col gap-3.5 transition-all hover:border-outline-variant"
                >
                  {/* Top Section: Image + Title + Customization Pill Badges */}
                  <div className="flex gap-3.5 items-start">
                    {/* Dish Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover flex-shrink-0 border border-outline-variant/60 shadow-2xs"
                    />

                    {/* Title & Customization Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Veg/Non-Veg Badge */}
                          <span
                            className={`w-3.5 h-3.5 shrink-0 rounded-sm border-2 flex items-center justify-center ${
                              item.isVeg ? 'border-success' : 'border-error'
                            }`}
                            aria-hidden="true"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-success' : 'bg-error'}`} />
                          </span>
                          <h3 className="font-sans font-bold text-on-surface text-sm sm:text-base leading-tight truncate">
                            {item.name}
                          </h3>
                        </div>

                        {/* Total Item Price */}
                        <span className="font-extrabold text-primary text-base shrink-0 [font-variant-numeric:tabular-nums]">
                          {formatInvoiceAmount(itemTotalPrice)}
                        </span>
                      </div>

                      {/* Unit price caption */}
                      <div className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        {formatMenuPrice(singleUnitPrice)} {item.quantity > 1 ? `× ${item.quantity}` : 'each'}
                      </div>

                      {/* Customization Options Badges — Sleek Tag Pills */}
                      {hasModifiers && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.makeVegan && (
                            <span className="px-2.5 py-1 rounded-lg bg-success/10 border border-success/20 text-success text-[11px] font-extrabold flex items-center gap-1">
                              🌱 Vegan
                            </span>
                          )}
                          {item.jainPreparation && (
                            <span className="px-2.5 py-1 rounded-lg bg-success/10 border border-success/20 text-success text-[11px] font-extrabold flex items-center gap-1">
                              🌿 Jain
                            </span>
                          )}
                          {item.selectedCustomizations?.map((mod, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface-variant text-[11px] font-medium flex items-center gap-1"
                            >
                              <span>{mod.label || mod.name}</span>
                              {mod.priceDelta && mod.priceDelta > 0 ? (
                                <span className="text-primary font-bold">+{formatMenuPrice(mod.priceDelta)}</span>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Allergy Alert */}
                      {item.allergyAlert && (
                        <div className="mt-2 bg-error/8 border-l-3 border-error p-2 rounded-r-xl text-[11px] text-on-surface space-y-0.5">
                          <div className="font-bold uppercase tracking-wider flex items-center gap-1 text-error text-[10px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>ALLERGY ALERT</span>
                          </div>
                          <p className="font-medium text-error">{item.allergyAlert}</p>
                        </div>
                      )}

                      {/* Special Instruction */}
                      {item.itemNote && (
                        <div className="mt-1.5 text-[11px] text-on-surface-variant italic">
                          <span>Note: "{item.itemNote}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40 gap-2">
                    {/* Left: Quick Actions */}
                    <div className="flex items-center gap-3">
                      {item.originalDish?.customizationAvailable !== false && (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        className="flex items-center gap-1 text-on-surface-variant hover:text-error text-xs font-bold transition-colors cursor-pointer"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Right: Sleek Quantity Stepper Pill */}
                    <div className="flex items-center bg-surface-container rounded-xl p-1 border border-outline-variant/60 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-lowest shadow-2xs text-on-surface hover:bg-surface-container-high active:scale-90 shrink-0 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold w-8 text-center text-xs text-on-surface" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-lowest shadow-2xs text-on-surface hover:bg-surface-container-high active:scale-95 shrink-0 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Card: special order notes */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-border shadow-card">
              <label htmlFor="special-order-notes" className="text-xs font-bold text-ink mb-1.5 block">
                Special Order Notes <span className="text-muted font-medium">(optional)</span>
              </label>
              <textarea
                id="special-order-notes"
                rows={3}
                maxLength={200}
                value={specialOrderNotes}
                onChange={(e) => setSpecialOrderNotes(e.target.value)}
                placeholder="e.g. Please bring water first, or we'd like a separate bill for the table."
                className="w-full min-h-[84px] bg-surface-container border border-border rounded-xl p-3 focus:ring-2 focus:ring-maroon-700/40 focus:border-maroon-700/40 text-xs placeholder:text-muted shadow-sm resize-none outline-none"
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[11px] text-muted">Visible to kitchen staff only</span>
                <span className="text-[11px] text-muted">{specialOrderNotes.length}/200</span>
              </div>
            </div>

            {/* Unified Card: Offers & Discounts */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-card space-y-3.5">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-extrabold text-xs uppercase tracking-wider">
                  <Percent className="w-4 h-4 text-primary stroke-[2.5]" />
                  <span>Offers & Discounts</span>
                </div>
                {appliedPromo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-success/15 text-success text-[11px] font-extrabold flex items-center gap-1">
                    Coupon Active
                  </span>
                )}
              </div>

              {/* Active Applied Promo vs Code Input */}
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-success/8 border border-success/30 rounded-xl text-xs">
                  <div>
                    <span className="font-extrabold text-success text-sm font-mono tracking-wider">{appliedPromo.code}</span>
                    <p className="text-[11px] text-success font-semibold mt-0.5">{appliedPromo.description || `${appliedPromo.discountPercent}% Discount Applied`}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAppliedOffer()}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-error bg-error/10 hover:bg-error/20 cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value);
                        if (promoError) setPromoError('');
                      }}
                      placeholder="ENTER PROMO CODE"
                      aria-invalid={!!promoError}
                      className={`flex-1 min-h-[44px] px-3.5 bg-surface-container border rounded-xl text-xs uppercase font-extrabold font-mono tracking-wider outline-none ${
                        promoError ? 'border-error focus:ring-2 focus:ring-error/30' : 'border-outline-variant focus:ring-2 focus:ring-primary/30'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      className="min-h-[44px] px-4.5 bg-primary text-on-primary rounded-xl text-xs font-bold disabled:opacity-50 hover:brightness-90 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all whitespace-nowrap"
                    >
                      {isApplyingPromo && <span className="w-3.5 h-3.5 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />}
                      <span>{isApplyingPromo ? 'Applying…' : 'Apply'}</span>
                    </button>
                  </form>
                  {promoError && (
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-error">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {promoError}
                    </p>
                  )}
                </>
              )}

              {/* Integrated Available Offers Banner */}
              <div
                onClick={() => setIsOffersSheetOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsOffersSheetOpen(true)}
                className="p-3 rounded-xl bg-primary/8 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer select-none group flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-extrabold text-on-surface truncate">
                        View Available Deals
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full bg-primary/15 text-primary text-[10px] font-extrabold shrink-0">
                        4 Offers
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      Save up to 20% on your bill
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-primary text-[11.5px] font-bold shrink-0">
                  <span>Browse</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <BillingSummary
                totals={totals}
                showTipSelector={true}
                tipPercentage={tipPercentage}
                setTipPercentage={setTipPercentage}
                customTipAmount={customTipAmount}
                setCustomTipAmount={setCustomTipAmount}
                selectedTipOption={selectedTipOption}
                setSelectedTipOption={setSelectedTipOption}
              />
            </div>

            {/* Desktop CTA — one obvious primary action; "Continue Ordering" stays a low-emphasis text link */}
            <div className="hidden md:flex items-center justify-between gap-4 mt-2">
              <button
                onClick={() => navigate('/menu')}
                className="min-h-[44px] px-2 text-maroon-800 hover:text-maroon-900 font-semibold text-sm underline-offset-2 hover:underline"
              >
                Continue Ordering
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="flex-1 max-w-md h-14 bg-primary text-on-primary rounded-xl font-bold hover:brightness-90 transition-opacity active:scale-95 shadow-floating disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                {isPlacingOrder && <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />}
                <span>{isPlacingOrder ? 'Sending to Kitchen…' : `Send to Kitchen • ${formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}`}</span>
              </button>
            </div>
          </div>

          {/* Right: Desktop Summary */}
          <div className="hidden md:block md:col-span-5">
            <div className="sticky top-24">
              <BillingSummary
                totals={totals}
                showTipSelector={true}
                tipPercentage={tipPercentage}
                setTipPercentage={setTipPercentage}
                customTipAmount={customTipAmount}
                setCustomTipAmount={setCustomTipAmount}
                selectedTipOption={selectedTipOption}
                setSelectedTipOption={setSelectedTipOption}
              />
            </div>
          </div>
        </div>
      </main>

      {editingItem && (
        <CustomizationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          dish={editingItem.originalDish || editingItem}
          initialSelections={{
            selectedOptions: editingItem.selectedOptions || {},
            makeVegan: editingItem.makeVegan,
            jainPreparation: editingItem.jainPreparation,
            allergyAlert: editingItem.allergyAlert,
            specialInstruction: editingItem.itemNote,
            quantity: editingItem.quantity,
          }}
          onAddToCart={handleSaveEdit}
        />
      )}

      {/* Mobile sticky footer — a single obvious primary action.
          Full bill breakdown already lives inline above (BillingSummary), so this
          bar only recaps the payable total instead of duplicating it. "Continue
          ordering" isn't repeated here either — the Menu tab in BottomNavBar covers it. */}
      <div
        className="md:hidden fixed left-0 w-full bg-transparent px-4 py-2 z-40 pointer-events-none flex justify-center"
        style={{ bottom: 'calc(80px + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full max-w-[640px] h-14 bg-primary text-on-primary rounded-xl font-bold active:scale-95 shadow-lg text-sm disabled:opacity-60 flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
        >
          {isPlacingOrder && <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />}
          <span>
            {isPlacingOrder ? 'Sending to Kitchen…' : `Send to Kitchen • ${formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}`}
          </span>
        </button>
      </div>

      <AvailableOffersBottomSheet
        isOpen={isOffersSheetOpen}
        onClose={() => setIsOffersSheetOpen(false)}
        subtotal={cartItems.reduce((acc, item) => acc + ((item.unitPrice !== undefined ? item.unitPrice : item.price) * item.quantity), 0)}
        appliedPromo={appliedPromo}
        onApplyOffer={handleApplyOfferFromSheet}
        onRemoveOffer={handleRemoveAppliedOffer}
      />

      <BottomNavBar />
    </>
  );
};

export default CartScreen;
