import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { formatInvoiceAmount, formatMenuPrice, formatTime, deriveInvoiceNumber } from '../../utils/formatters';
import Icon from '../../components/common/Icon';
import TopAppBar from '../../components/layout/TopAppBar';
import { CheckCircle2, ChefHat, Clock, Flame, Soup, PartyPopper, Plus } from 'lucide-react';

const NEXT_STEPS = [
  { key: 'received', label: 'Order received', icon: CheckCircle2, status: 'done' },
  { key: 'preparing', label: 'Being prepared', icon: Flame, status: 'active' },
  { key: 'ready', label: 'Ready to serve', icon: Soup, status: 'upcoming' },
];

/** Merges cart line items that share the same dish + modifiers so the same dish never appears twice. */
const groupOrderItems = (items = []) => {
  const grouped = [];
  const indexByKey = new Map();

  items.forEach((item) => {
    const modifierKey = [
      item.makeVegan ? 'vegan' : '',
      item.jainPreparation ? 'jain' : '',
      ...(item.selectedCustomizations || []).map((mod) => `${mod.label || mod.name}:${mod.priceDelta || 0}`),
      item.itemNote || '',
    ].join('|');
    const key = `${item.name}__${modifierKey}`;

    if (indexByKey.has(key)) {
      grouped[indexByKey.get(key)].quantity += item.quantity;
    } else {
      indexByKey.set(key, grouped.length);
      grouped.push({ ...item });
    }
  });

  return grouped;
};

const OrderConfirmationScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, kitchenLoad } = useOrder();
  const { tableNumber } = useTable();

  const orderTime = formatTime(activeOrder?.createdAt || new Date());
  const totals = activeOrder?.totals || { subtotal: 0, gst: 0, totalPayable: 0 };
  const prepMinStart = kitchenLoad?.averagePreparationMinutes || 20;
  const prepRange = `${prepMinStart}–${prepMinStart + 5} mins`;
  const invoiceNumber = deriveInvoiceNumber(activeOrder);
  const orderItems = useMemo(() => groupOrderItems(activeOrder?.items || []), [activeOrder?.items]);
  const itemCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <TopAppBar variant="brand" />
      <main className="flex-1 flex flex-col bg-surface-container min-h-screen">
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col px-4 pt-20 pb-4">
        {/* Success card: confirmation state, ETA, and order meta in one clear unit */}
        <section
          aria-labelledby="order-confirmed-heading"
          className="bg-surface-container-lowest rounded-3xl shadow-sm border border-border overflow-hidden mb-4"
        >
          <div className="text-center px-5 pt-7 pb-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-on-success shadow-sm">
                <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
              </div>
            </div>

            <h1 id="order-confirmed-heading" className="text-xl font-bold text-ink">
              Order confirmed!
            </h1>
            <p className="text-text text-sm mt-1.5 leading-snug">
              Your order has been sent to the kitchen and the chefs are on it.
            </p>

            <span className="inline-flex items-center gap-1.5 mt-3 bg-success/10 text-success text-xs font-bold px-3 py-1.5 rounded-full">
              <ChefHat className="w-3.5 h-3.5" aria-hidden="true" />
              Sent to kitchen
            </span>
          </div>

          {/* Order meta: id, table, time */}
          <dl className="grid grid-cols-3 gap-px bg-border border-t border-border">
            <div className="bg-surface-container-lowest text-center px-2 py-3">
              <dt className="text-[10px] uppercase tracking-wider text-muted font-bold">Order ID</dt>
              <dd className="text-maroon-800 font-bold text-sm mt-0.5">{invoiceNumber}</dd>
            </div>
            <div className="bg-surface-container-lowest text-center px-2 py-3">
              <dt className="text-[10px] uppercase tracking-wider text-muted font-bold">Table</dt>
              <dd className="font-bold text-sm text-ink mt-0.5">{tableNumber}</dd>
            </div>
            <div className="bg-surface-container-lowest text-center px-2 py-3">
              <dt className="text-[10px] uppercase tracking-wider text-muted font-bold">Order time</dt>
              <dd className="font-bold text-sm text-ink mt-0.5">{orderTime}</dd>
            </div>
          </dl>

          {/* ETA strip */}
          <div className="flex items-center gap-3 px-5 py-4 border-t border-border bg-primary-container/60">
            <div className="bg-surface-container-lowest p-2 rounded-xl text-maroon-800 flex-shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] text-muted font-semibold">Estimated preparation window</p>
              <p className="font-bold text-base text-ink leading-tight">{prepRange}</p>
            </div>
          </div>
        </section>

        {/* What happens next */}
        <section aria-label="Order progress" className="bg-surface-container-lowest rounded-2xl p-4 border border-border shadow-sm mb-4">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">What happens next</h2>
          <ol className="flex items-start justify-between">
            {NEXT_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';
              return (
                <li key={step.key} className="flex-1 flex flex-col items-center text-center relative">
                  {idx > 0 && (
                    <span
                      className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${isDone || isActive ? 'bg-primary' : 'bg-border'}`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isDone
                        ? 'bg-success border-success text-on-success'
                        : isActive
                        ? 'bg-primary border-primary text-on-primary animate-pulse'
                        : 'bg-surface-container-lowest border-border text-muted'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className={`text-[11px] font-semibold mt-2 leading-tight px-1 ${isDone || isActive ? 'text-ink' : 'text-muted'}`}>
                    {step.label}
                    {isActive && <span className="sr-only"> (current stage)</span>}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="text-xs text-muted mt-3 text-center leading-relaxed">
            You'll get a live update on this screen as your food moves through each stage.
          </p>
        </section>

        {/* Order items */}
        <section aria-labelledby="order-items-heading" className="bg-surface-container-lowest rounded-2xl p-4 border border-border shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="order-items-heading" className="font-bold text-base text-ink">
              Your order
            </h2>
            <span className="text-[11px] font-bold text-muted bg-surface-container px-2.5 py-1 rounded-full">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="space-y-3">
            {orderItems.map((item, idx) => {
              const itemTotalPrice = (item.unitPrice !== undefined ? item.unitPrice : item.price) * item.quantity;
              const hasModifiers = (item.selectedCustomizations && item.selectedCustomizations.length > 0) || item.makeVegan || item.jainPreparation;

              return (
                <article key={idx} className="rounded-xl border border-border p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                      {item.image ? (
                        <img alt="" className="w-full h-full object-cover" src={item.image} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          <Icon name="restaurant" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-ink text-sm leading-snug">{item.name}</p>
                        <p className="font-bold text-maroon-800 text-sm font-mono whitespace-nowrap">{formatInvoiceAmount(itemTotalPrice)}</p>
                      </div>
                      <span className="inline-block text-[11px] text-muted font-semibold bg-surface-container px-2 py-0.5 rounded-full mt-1">
                        Qty {item.quantity}
                      </span>
                    </div>
                  </div>

                  {hasModifiers && (
                    <div className="mt-2.5 bg-primary-container/70 p-2.5 rounded-xl border border-primary/30 text-xs space-y-1 text-on-primary-container">
                      {item.makeVegan && <div className="font-semibold text-success">Vegan preparation</div>}
                      {item.jainPreparation && <div className="font-semibold text-success">Jain preparation</div>}
                      {item.selectedCustomizations?.map((mod, mIdx) => (
                        <div key={mIdx} className="flex justify-between gap-2">
                          <span>{mod.label || mod.name}</span>
                          {mod.priceDelta > 0 && <span className="font-mono text-maroon-800 whitespace-nowrap">+{formatMenuPrice(mod.priceDelta)}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.allergyAlert && (
                    <div className="mt-2.5 bg-error-container/50 border-l-4 border-error p-2.5 rounded-r-xl text-xs text-on-error-container font-bold space-y-0.5">
                      <div className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <Flame className="w-3.5 h-3.5 text-error" aria-hidden="true" />
                        <span>Allergy alert</span>
                      </div>
                      <p className="text-on-error-container font-normal">{item.allergyAlert}</p>
                    </div>
                  )}

                  {item.itemNote && (
                    <p className="mt-2 text-xs text-text italic">Note: &ldquo;{item.itemNote}&rdquo;</p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Billing summary — visually separate from items and CTAs */}
        <section aria-labelledby="bill-summary-heading" className="bg-surface-container-lowest rounded-2xl p-4 border border-border shadow-sm mb-5">
          <h2 id="bill-summary-heading" className="font-bold text-base text-ink mb-3">
            Bill summary
          </h2>
          <div className="space-y-2.5 text-sm text-text">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">{formatInvoiceAmount(totals.subtotal || 0)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span className="font-mono">-{formatInvoiceAmount(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST @ 5%</span>
              <span className="font-mono">{formatInvoiceAmount(totals.gst ?? totals.tax ?? 0)}</span>
            </div>
            {totals.tipAmount > 0 && (
              <div className="flex justify-between text-maroon-800">
                <span>Optional staff tip</span>
                <span className="font-mono">+{formatInvoiceAmount(totals.tipAmount)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-dashed border-border my-3" />
          <div className="flex justify-between items-center bg-primary-container/60 -mx-4 -mb-4 px-4 py-3.5 rounded-b-2xl">
            <span className="font-bold text-sm text-ink">Total payable</span>
            <span className="font-bold text-xl text-maroon-800 font-mono">
              {formatInvoiceAmount(totals.totalPayable || totals.grandTotal || 0)}
            </span>
          </div>
        </section>

        {/* Primary actions */}
        <footer className="mt-auto space-y-3 pb-6">
          <button
            onClick={() => navigate('/order-tracking')}
            className="w-full min-h-[48px] bg-primary hover:brightness-90 active:brightness-90 text-on-primary font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
          >
            <span>Track order</span>
            <Icon name="chevron_right" />
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="w-full min-h-[48px] bg-surface-container-lowest border border-border hover:bg-surface-container active:bg-surface-container text-ink font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4 text-maroon-800" aria-hidden="true" />
            <span>Order more dishes</span>
          </button>
        </footer>
      </div>
    </main>
    </>
  );
};

export default OrderConfirmationScreen;
