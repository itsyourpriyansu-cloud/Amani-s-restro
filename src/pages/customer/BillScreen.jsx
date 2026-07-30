import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { formatInvoiceAmount } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import BillingSummary from '../../components/common/BillingSummary';
import { AlertCircle } from 'lucide-react';

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

  const mergedItems = useMemo(() => mergeDuplicateItems(activeOrder?.items), [activeOrder?.items]);

  if (!activeOrder) {
    return (
      <>
        <TopAppBar variant="brand" />
        <main className="flex-1 pt-20 px-4">
          <EmptyState
            icon={() => <Icon name="receipt_long" className="text-4xl" />}
            title="No active bill found"
            description="Place an order from our menu to generate a table bill."
            actionLabel="Go to Menu"
            onAction={() => navigate('/menu')}
          />
        </main>
        <BottomNavBar />
      </>
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

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 pt-20 pb-28 max-w-[1280px] mx-auto w-full px-4 md:px-10">
        {/* Order Identity Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
              <Icon name="table_restaurant" className="text-sm" />
              Table {tableNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-semibold">
              <Icon name="receipt_long" className="text-sm" />
              {activeOrder.invoiceId || `#${activeOrder.orderId}`}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface leading-tight">Bill Summary</h1>
          <p className="text-sm text-on-surface-variant mt-1.5 max-w-md">
            Review your order before proceeding to secure payment.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="md:col-span-7 space-y-6">
            <section
              aria-labelledby="items-ordered-heading"
              className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
                <h2 id="items-ordered-heading" className="text-sm font-bold text-on-surface uppercase tracking-wide">
                  Items Ordered
                </h2>
                <span className="text-xs font-semibold text-on-surface-variant">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <ul>
                {mergedItems.map((item, idx) => {
                  const unitPrice = item.unitPrice || item.price;
                  const lineTotal = unitPrice * item.quantity;
                  return (
                    <li
                      key={item.cartItemId || item.id || idx}
                      className={`px-5 py-4 flex items-start justify-between gap-4 ${
                        idx > 0 ? 'border-t border-outline-variant/15' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-on-surface leading-snug">{item.name}</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5 [font-variant-numeric:tabular-nums]">
                          {item.quantity} × {formatInvoiceAmount(unitPrice)}
                        </p>

                        {item.modifierLabels && item.modifierLabels.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.modifierLabels.map((label, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-2 py-0.5 rounded-md bg-secondary-container/30 text-secondary text-[11px] font-medium"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        {(item.itemNote || item.specialInstructions) && (
                          <p className="text-[11px] text-on-surface-variant/80 italic mt-1.5">
                            Note: {item.itemNote || item.specialInstructions}
                          </p>
                        )}
                      </div>

                      <p className="text-[15px] font-bold text-on-surface flex-shrink-0 [font-variant-numeric:tabular-nums]">
                        {formatInvoiceAmount(lineTotal)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="md:sticky md:top-24 space-y-5">
              <BillingSummary totals={totals} showTipSelector={false} />

              {/* Payment actions */}
              <section
                aria-label="Payment options"
                className="bg-surface-container-lowest p-5 md:p-6 rounded-2xl border border-outline-variant/30 shadow-sm"
              >
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/payment')}
                    className="w-full min-h-[52px] bg-primary text-on-primary rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
                  >
                    <Icon name="payments" />
                    Proceed to Payment
                  </button>
                  <button
                    onClick={() => setIsCashModalOpen(true)}
                    className="w-full min-h-[52px] bg-transparent border-2 border-primary text-primary rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-[0.98] transition-all"
                  >
                    <Icon name="storefront" />
                    Pay at Counter
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center gap-2.5 text-on-surface-variant/70">
                  <Icon name="verified_user" className="text-base" />
                  <p className="text-[11px] leading-snug">Secure, encrypted payment processing</p>
                </div>
              </section>

              {/* Tertiary support link */}
              <button
                onClick={() => navigate('/report-issue')}
                className="w-full min-h-[44px] flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:underline"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Report Billing Issue
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />

      <Modal isOpen={isCashModalOpen} onClose={() => setIsCashModalOpen(false)} title="Pay At Counter / Cash Settlement">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-secondary-container/30 text-secondary rounded-full flex items-center justify-center mx-auto">
            <Icon name="storefront" className="text-3xl" />
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Would you like to notify staff to come to Table {tableNumber} for cash/counter settlement of{' '}
            <span className="font-bold text-on-surface">{formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}</span>?
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={handlePayAtCounter}
              disabled={isNotifyingStaff}
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-semibold disabled:opacity-60"
            >
              {isNotifyingStaff ? 'Notifying...' : 'Notify Staff for Cash Payment'}
            </button>
            <button
              onClick={() => setIsCashModalOpen(false)}
              className="w-full h-12 border border-outline-variant text-on-surface rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BillScreen;
