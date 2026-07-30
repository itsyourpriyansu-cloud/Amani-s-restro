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
import HonestExpectationBanner from '../../components/order/HonestExpectationBanner';
import { AlertTriangle, Edit3, Trash2, Plus, Minus } from 'lucide-react';

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

  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
                <div key={item.cartItemId || item.id} className="bg-surface-container-lowest rounded-2xl p-4 border border-border shadow-card flex flex-col gap-3">
                  <div className="flex gap-4 items-start">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-border" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1 w-3.5 h-3.5 shrink-0 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-success' : 'border-danger'}`}
                          aria-hidden="true"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-success' : 'bg-danger'}`} />
                        </span>
                        <h3 className="font-bold text-ink text-base leading-snug min-w-0">{item.name}</h3>
                      </div>
                      <span className="text-xs text-maroon-800 font-semibold pl-[22px]">{formatMenuPrice(singleUnitPrice)} each</span>

                      {hasModifiers && (
                        <div className="mt-2 text-xs space-y-1 bg-cream p-2.5 rounded-xl border border-border">
                          {item.makeVegan && <div className="text-success font-semibold flex items-center gap-1"><span>🌱 Vegan Preparation</span></div>}
                          {item.jainPreparation && <div className="text-success font-semibold flex items-center gap-1"><span>🌿 Jain Preparation</span></div>}
                          {item.selectedCustomizations?.map((mod, idx) => (
                            <div key={idx} className="text-text font-medium flex justify-between">
                              <span>• {mod.label || mod.name}</span>
                              {mod.priceDelta && mod.priceDelta > 0 ? <span className="text-maroon-800">+{formatMenuPrice(mod.priceDelta)}</span> : null}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.allergyAlert && (
                        <div className="mt-2 bg-danger/10 border-l-4 border-danger p-2.5 rounded-r-xl text-xs text-ink space-y-0.5">
                          <div className="font-bold uppercase tracking-wider flex items-center gap-1 text-danger">
                            <AlertTriangle className="w-4 h-4" />
                            <span>ALLERGY ALERT</span>
                          </div>
                          <p className="font-semibold">{item.allergyAlert}</p>
                        </div>
                      )}

                      {item.itemNote && <div className="mt-1 text-xs text-muted italic"><span>Special instruction: "{item.itemNote}"</span></div>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                    {/* Secondary actions — deliberately low emphasis, plain text links */}
                    <div className="flex items-center gap-4">
                      {item.originalDish?.customizationAvailable !== false && (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="min-h-[40px] flex items-center gap-1 text-maroon-800 hover:text-maroon-900 text-xs font-bold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        className="min-h-[40px] flex items-center gap-1 text-muted hover:text-danger text-xs font-bold transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Quantity + line total — the one place quantity and price appear together */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-surface-container rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest shadow-sm text-text hover:bg-surface-container-low active:scale-90"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-7 text-center text-sm text-ink" aria-live="polite">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest shadow-sm text-text hover:bg-surface-container-low active:scale-90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="font-bold text-maroon-800 text-base [font-variant-numeric:tabular-nums]">{formatInvoiceAmount(itemTotalPrice)}</span>
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

            {/* Card: promo code — empty / success / error states */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-border shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="sell" className="text-saffron-600" />
                  <span className="text-xs font-bold text-ink">Promo Code or Voucher</span>
                </div>
                <span className="text-[10px] text-muted font-medium">Try: MANGAMMA10</span>
              </div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-success">{appliedPromo.code}</span>
                    <p className="text-[10px] text-success">{appliedPromo.description}</p>
                  </div>
                  <button onClick={() => setAppliedPromo(null)} className="min-h-[40px] px-2 text-[11px] font-bold text-danger underline">Remove</button>
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
                      placeholder="Enter promo code"
                      aria-invalid={!!promoError}
                      className={`flex-1 min-h-[44px] px-3 bg-surface-container border rounded-xl text-xs uppercase font-bold outline-none ${promoError ? 'border-danger focus:ring-2 focus:ring-danger/30' : 'border-border focus:ring-2 focus:ring-maroon-700/30'}`}
                    />
                    <button
                      type="submit"
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      className="min-h-[44px] px-4 bg-saffron-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-saffron-500 flex items-center gap-1.5"
                    >
                      {isApplyingPromo && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                      <span>{isApplyingPromo ? 'Applying…' : 'Apply'}</span>
                    </button>
                  </form>
                  {promoError && (
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-danger">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {promoError}
                    </p>
                  )}
                </>
              )}
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
                className="flex-1 max-w-md h-14 bg-saffron-600 text-white rounded-xl font-bold hover:bg-saffron-500 transition-opacity active:scale-95 shadow-floating disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                {isPlacingOrder && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
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
        className="md:hidden fixed left-0 w-full bg-surface-container-lowest p-4 z-40 border-t border-border shadow-xl"
        style={{ bottom: 'calc(90px + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full h-14 bg-saffron-600 text-white rounded-xl font-bold active:scale-95 shadow-md text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isPlacingOrder && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          <span>
            {isPlacingOrder ? 'Sending to Kitchen…' : `Send to Kitchen • ${formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}`}
          </span>
        </button>
      </div>

      <BottomNavBar />
    </>
  );
};

export default CartScreen;
