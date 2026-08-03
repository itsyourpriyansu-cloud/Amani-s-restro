import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Receipt,
  UtensilsCrossed,
  ShieldCheck,
  ArrowRight,
  Store,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { formatInvoiceAmount } from '../../utils/formatters';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import BillingSummary from '../../components/common/BillingSummary';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';

// Collapses cart lines that share the same dish + modifiers + note into a single
// receipt row (summing quantity) so identical items never render as separate
// "duplicate" rows — only genuinely different customizations get their own line.
const mergeDuplicateItems = (items = []) => {
  const merged = [];
  const indexByKey = new Map();

  items.forEach((item) => {
    const modifierLabels = (item.selectedCustomizations || [])
      .map((c) => c.label || c.name)
      .filter(Boolean)
      .sort();
    const key = JSON.stringify({
      name: item.name,
      modifiers: modifierLabels,
      note: (item.itemNote || item.specialInstructions || '').trim(),
    });

    if (indexByKey.has(key)) {
      const existing = merged[indexByKey.get(key)];
      existing.quantity += item.quantity;
    } else {
      indexByKey.set(key, merged.length);
      merged.push({ ...item, modifierLabels });
    }
  });

  return merged;
};

const BillScreen = () => {
  const navigate = useNavigate();
  const { activeOrder } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isNotifyingStaff, setIsNotifyingStaff] = useState(false);
  const [isNavigatingToPay, setIsNavigatingToPay] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);

  const handlePayAtCounter = async () => {
    setIsNotifyingStaff(true);
    try {
      await orderService.requestAssistance(tableNumber, 'Cash Settlement at Counter');
      showToast(`Staff notified for cash collection at Table ${tableNumber}.`, 'success');
      setIsCashModalOpen(false);
    } catch (err) {
      showToast('Error notifying staff', 'error');
    } finally {
      setIsNotifyingStaff(false);
    }
  };

  const handleProceedToPayment = () => {
    setIsNavigatingToPay(true);
    navigate('/payment');
  };

  const mergedItems = useMemo(() => mergeDuplicateItems(activeOrder?.items), [activeOrder?.items]);

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF9F5] via-[#FFFDFC] to-[#F9F1EB] flex flex-col font-sans">
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#FFF9F5]/95 backdrop-blur-md border-b border-[#5B3021]/10 px-4 h-14 flex items-center justify-between max-w-[540px] mx-auto w-full">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            aria-label="Go to menu"
            className="w-9 h-9 rounded-full bg-white border border-[#5B3021]/15 flex items-center justify-center text-[#24130E] hover:bg-[#F5ECE6] active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-[#24130E]" />
          </button>
          <span className="font-bold text-sm text-[#24130E]">Review order</span>
          <span className="w-9" />
        </header>

        <main className="flex-1 pt-24 px-4 max-w-[480px] mx-auto w-full flex flex-col justify-center">
          <EmptyState
            icon={() => <Receipt className="w-12 h-12 text-[#87351F]" />}
            title="No active bill found"
            description="Place an order from our menu to generate a table bill."
            actionLabel="Go to Menu"
            onAction={() => navigate('/menu')}
          />
        </main>
        <BottomNavBar />
      </div>
    );
  }

  const totals = activeOrder.totals || {
    subtotal: activeOrder.subtotal || 0,
    discountAmount: activeOrder.discount || 0,
    packagingCharge: activeOrder.packagingCharge || 0,
    gst: activeOrder.gst || activeOrder.tax || 0,
    cgst: activeOrder.cgst || (activeOrder.gst || activeOrder.tax || 0) / 2,
    sgst: activeOrder.sgst || (activeOrder.gst || activeOrder.tax || 0) / 2,
    tipAmount: activeOrder.tip || 0,
    totalPayable: activeOrder.totalPayable || activeOrder.grandTotal || 0,
  };

  const itemCount = mergedItems.reduce((acc, item) => acc + item.quantity, 0);
  const formattedTableNo = tableNumber ? String(tableNumber).padStart(2, '0') : '05';
  const invoiceRef = activeOrder.invoiceId || `#INV-${activeOrder.orderId || '1329'}`;
  const orderTypeLabel =
    activeOrder.orderType === 'takeaway'
      ? 'Takeaway order'
      : activeOrder.orderType === 'delivery'
      ? 'Delivery order'
      : 'Dine-in order';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F5] via-[#FFFDFC] to-[#F9F1EB] text-[#24130E] font-sans antialiased pb-44">
      {/* Unified Fixed Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#FFF9F5]/96 backdrop-blur-md border-b border-[#5B3021]/10 px-4 h-14 flex items-center justify-between max-w-[540px] mx-auto w-full">
        {/* Left: 44px Target Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-white border border-[#5B3021]/15 shadow-2xs flex items-center justify-center text-[#24130E] hover:bg-[#F5ECE6] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4.5 h-4.5 text-[#24130E]" />
        </button>

        {/* Center: Order Progress Indicator */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5ECE6] border border-[#5B3021]/12 text-[11.5px] font-semibold text-[#786B65]"
          aria-label="Checkout Progress: Step 1 of 3 (Review order)"
        >
          <span className="flex items-center gap-1 text-[#87351F] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#87351F]" />
            Review
          </span>
          <span className="text-[#5B3021]/25">─</span>
          <span className="text-[#786B65]">Payment</span>
          <span className="text-[#5B3021]/25">─</span>
          <span className="text-[#786B65]/50">Done</span>
        </div>

        {/* Right: Table Context Chip */}
        <button
          type="button"
          onClick={() => setShowTrustModal(true)}
          className="h-8 px-2.5 rounded-full bg-[#F5ECE6] border border-[#5B3021]/12 text-xs font-bold text-[#24130E] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
          aria-label={`Table ${formattedTableNo}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#87351F]" />
          <span>Table {formattedTableNo}</span>
        </button>
      </header>

      <main className="max-w-[480px] mx-auto w-full px-4 sm:px-4.5 pt-18">
        {/* Page Title & Subtitle */}
        <header className="pt-2 pb-2">
          <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#24130E] tracking-tight leading-tight">
            Review order
          </h1>
          <p className="text-[13.5px] sm:text-[14px] text-[#786B65] mt-0.5 max-w-md leading-snug">
            Check your items before continuing to payment.
          </p>
        </header>


        {/* Unified Order Context Strip */}
        <section
          aria-label="Order information"
          className="my-3 p-3.5 sm:p-4 rounded-[18px] bg-[#F5ECE6] border border-[#5B3021]/11 flex items-center justify-between gap-3 shadow-[0_2px_12px_rgba(55,26,17,0.03)]"
        >
          {/* Table Details */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#87351F]/10 border border-[#87351F]/20 flex items-center justify-center shrink-0 text-[#87351F]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#786B65] uppercase tracking-wider">Table</span>
                <span className="text-[15px] font-extrabold text-[#24130E]">{formattedTableNo}</span>
              </div>
              <span className="text-[12px] text-[#786B65] font-medium truncate block">{orderTypeLabel}</span>
            </div>
          </div>

          {/* Invoice Reference */}
          <div className="flex items-center gap-2.5 shrink-0 text-right pl-2 border-l border-[#5B3021]/15">
            <Receipt className="w-4 h-4 text-[#87351F] shrink-0" />
            <div>
              <span className="text-[10.5px] font-semibold text-[#786B65] uppercase tracking-wider block">
                Order Ref
              </span>
              <span className="text-[13.5px] font-bold text-[#24130E] tabular-nums">{invoiceRef}</span>
            </div>
          </div>
        </section>

        {/* Your Order Section */}
        <section aria-labelledby="your-order-heading" className="my-4">
          {/* Items Header */}
          <div className="flex items-center justify-between px-1 mb-2.5">
            <div className="flex items-center gap-2">
              <h2 id="your-order-heading" className="text-[17px] sm:text-[18px] font-bold text-[#24130E]">
                Your order
              </h2>
              <span className="text-[12px] font-semibold text-[#786B65] bg-[#F5ECE6] px-2.5 py-0.5 rounded-full border border-[#5B3021]/10">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="text-xs font-bold text-[#87351F] hover:text-[#672413] flex items-center gap-0.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-[#87351F]/8 transition-colors"
            >
              <span>Edit order</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Items Surface Card */}
          <div className="bg-white rounded-[22px] border border-[#5B3021]/11 shadow-[0_8px_28px_rgba(55,26,17,0.06)] overflow-hidden">
            <ul className="divide-y divide-[#5B3021]/10">
              {mergedItems.map((item, idx) => {
                const unitPrice = item.unitPrice || item.price || 0;
                const lineTotal = unitPrice * item.quantity;
                return (
                  <li key={item.cartItemId || item.id || idx} className="p-4 sm:p-4.5 flex items-start justify-between gap-3">
                    {/* Quantity Badge */}
                    <div className="w-9 h-7 rounded-[9px] bg-[#87351F]/8 border border-[#87351F]/18 text-[#87351F] text-[12px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {item.quantity}×
                    </div>

                    {/* Item Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#24130E] leading-snug line-clamp-2">
                          {item.name}
                        </h3>

                        {/* Unobtrusive Item Status Chip */}
                        {(item.readinessStatus === 'SERVED' || item.status === 'served') && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#237A4B] bg-[#237A4B]/10 px-2 py-0.5 rounded-md border border-[#237A4B]/20 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-[#237A4B]" />
                            Served
                          </span>
                        )}
                        {(item.readinessStatus === 'PREPARING' || item.status === 'preparing') && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded-md border border-[#D97706]/20 shrink-0">
                            Preparing
                          </span>
                        )}
                      </div>

                      <p className="text-[12.5px] text-[#786B65] mt-0.5 font-medium [font-variant-numeric:tabular-nums]">
                        {formatInvoiceAmount(unitPrice)} each
                      </p>

                      {/* Modifiers Chips */}
                      {item.modifierLabels && item.modifierLabels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.modifierLabels.map((label, mIdx) => (
                            <span
                              key={mIdx}
                              className="px-2.5 py-0.5 rounded-[8px] bg-[#F5ECE6] text-[#672413] text-[11.5px] font-medium border border-[#5B3021]/8"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special Note */}
                      {(item.itemNote || item.specialInstructions) && (
                        <div className="mt-2 text-[12px] text-[#786B65] italic flex items-start gap-1.5 bg-[#FFF9F5] px-2.5 py-1 rounded-[8px] border border-[#5B3021]/8">
                          <MessageSquare className="w-3.5 h-3.5 text-[#87351F] shrink-0 mt-0.5" />
                          <span className="leading-tight">Note: {item.itemNote || item.specialInstructions}</span>
                        </div>
                      )}
                    </div>

                    {/* Line Total */}
                    <div className="text-[15px] sm:text-[16px] font-extrabold text-[#24130E] shrink-0 text-right [font-variant-numeric:tabular-nums]">
                      {formatInvoiceAmount(lineTotal)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Payment Breakdown Card (BillingSummary) */}
        <section aria-label="Payment summary" className="my-4">
          <BillingSummary totals={totals} showTipSelector={false} />
        </section>

        {/* Payment Assurance Indicator */}
        <div className="my-4 flex items-center justify-center gap-2 text-xs text-[#786B65] font-medium py-1">
          <ShieldCheck className="w-4 h-4 text-[#237A4B] shrink-0" />
          <span>Your payment details are securely processed.</span>
        </div>

        {/* Secondary Link: Report billing issue */}
        <div className="text-center pt-1 pb-4">
          <button
            type="button"
            onClick={() => navigate('/report-issue')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786B65] hover:text-[#DC2626] transition-colors py-1 px-3 rounded-lg"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Report a billing issue
          </button>
        </div>
      </main>

      {/* Sticky Payment Dock (Fixed at bottom) */}
      <aside
        aria-label="Payment action dock"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9F5]/96 backdrop-blur-md border-t border-[#5B3021]/15 shadow-[0_-8px_24px_rgba(55,26,17,0.08)] px-4 py-3"
        style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-[480px] mx-auto flex items-center justify-between gap-3">
          {/* Total Payable Summary */}
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-[#786B65] uppercase tracking-wider block">
              Total payable
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#24130E] tabular-nums block leading-tight">
              {formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}
            </span>
          </div>

          {/* Actions Column */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cash / Counter Option */}
            <button
              type="button"
              onClick={() => setIsCashModalOpen(true)}
              className="min-h-[50px] px-3.5 rounded-[16px] border border-[#5B3021]/20 bg-[#F5ECE6]/80 text-[#87351F] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F5ECE6] active:scale-95 transition-all cursor-pointer"
              title="Pay Cash at Counter"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Pay Cash</span>
            </button>

            {/* Primary Proceed to Pay Button */}
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={isNavigatingToPay}
              className="min-h-[52px] px-6 bg-gradient-to-r from-[#8E391F] to-[#682412] text-white rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_9px_24px_rgba(135,53,31,0.22)] active:scale-[0.98] hover:opacity-95 transition-all disabled:opacity-75 cursor-pointer"
            >
              <span>{isNavigatingToPay ? 'Preparing payment...' : 'Proceed to Pay'}</span>
              {!isNavigatingToPay && <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Pay At Counter Staff Notification Modal */}
      <Modal isOpen={isCashModalOpen} onClose={() => setIsCashModalOpen(false)} title="Pay At Counter / Cash Settlement">
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 bg-[#87351F]/10 text-[#87351F] rounded-full flex items-center justify-center mx-auto border border-[#87351F]/20">
            <Store className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#24130E]">Cash Payment at Table {tableNumber}</h3>
            <p className="text-xs text-[#786B65] leading-relaxed mt-1">
              Would you like to notify restaurant staff to come to Table {tableNumber} for cash/counter settlement of{' '}
              <span className="font-extrabold text-[#24130E]">
                {formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}
              </span>?
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handlePayAtCounter}
              disabled={isNotifyingStaff}
              className="w-full h-12 bg-[#87351F] text-white rounded-xl font-bold text-sm disabled:opacity-60 hover:bg-[#672413] transition-colors cursor-pointer shadow-sm"
            >
              {isNotifyingStaff ? 'Notifying Staff...' : 'Notify Staff for Cash Payment'}
            </button>

            <button
              type="button"
              onClick={() => setIsCashModalOpen(false)}
              className="w-full h-11 border border-[#5B3021]/20 text-[#24130E] rounded-xl font-semibold text-xs hover:bg-[#F5ECE6]/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <RestaurantTrustProfileModal isOpen={showTrustModal} onClose={() => setShowTrustModal(false)} />
    </div>
  );
};


export default BillScreen;

