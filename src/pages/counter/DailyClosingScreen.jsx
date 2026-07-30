import React, { useMemo, useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import CounterShell from '../../components/layout/CounterShell';
import {
  ShoppingBasket,
  Banknote,
  Undo2,
  Wallet,
  BarChart3,
  CreditCard,
  QrCode,
  TrendingUp,
  FileText,
  FileDown,
  Lock,
  Loader2
} from 'lucide-react';

const CIRCUMFERENCE = 2 * Math.PI * 80;

const DailyClosingScreen = () => {
  const { receipts, registerSession } = useOrder();
  const [notes, setNotes] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const paidReceipts = receipts.filter((r) => r.status === 'paid');
  const refundedReceipts = receipts.filter((r) => r.status === 'refunded');

  const totalGrossRevenue = paidReceipts.reduce((sum, r) => sum + (r.totalPayable || r.grandTotal || 0), 0);
  const totalTaxCollected = paidReceipts.reduce((sum, r) => sum + (r.gst || r.tax || 0), 0);
  const totalDiscounts = paidReceipts.reduce((sum, r) => sum + (r.discount || 0), 0);
  const totalNetRevenue = totalGrossRevenue - totalTaxCollected;
  const totalRefunds = refundedReceipts.reduce((sum, r) => sum + (r.totalPayable || r.grandTotal || 0), 0);

  const cashSales = paidReceipts.filter((r) => r.paymentMethod === 'Cash');
  const cardSales = paidReceipts.filter((r) => /card|credit/i.test(r.paymentMethod));
  const upiSales = paidReceipts.filter((r) => !/cash/i.test(r.paymentMethod) && !/card|credit/i.test(r.paymentMethod));

  const cashTotal = cashSales.reduce((s, r) => s + r.grandTotal, 0);
  const cardTotal = cardSales.reduce((s, r) => s + r.grandTotal, 0);
  const upiTotal = upiSales.reduce((s, r) => s + r.grandTotal, 0);

  const cashPct = totalGrossRevenue > 0 ? (cashTotal / totalGrossRevenue) * 100 : 0;
  const cardPct = totalGrossRevenue > 0 ? (cardSales / totalGrossRevenue) * 100 : 0;
  const upiPct = totalGrossRevenue > 0 ? (upiSales / totalGrossRevenue) * 100 : 0;

  const cashInDrawer = registerSession.openingFloat + registerSession.cashCollected;

  const hourlyBuckets = useMemo(() => {
    const buckets = {};
    paidReceipts.forEach((r) => {
      const hour = new Date(r.timestamp).getHours();
      buckets[hour] = (buckets[hour] || 0) + r.grandTotal;
    });
    const hours = Object.keys(buckets).map(Number).sort((a, b) => a - b);
    const max = Math.max(1, ...Object.values(buckets));
    return hours.map((h) => ({ hour: h, pct: Math.max(8, (buckets[h] / max) * 100) }));
  }, [paidReceipts]);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ReceiptNo,Table,PaymentMethod,GrandTotal,Timestamp\n';
    paidReceipts.forEach((r) => {
      csvContent += `${r.receiptNo},${r.tableNumber},${r.paymentMethod},${r.grandTotal},${r.timestamp}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daily_Closing_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFinalize = () => {
    if (isClosed) return;
    if (!confirm('Are you sure you want to finalize the closing? This will lock the terminal for the current shift.')) return;
    setIsFinalizing(true);
    setTimeout(() => {
      setIsFinalizing(false);
      setIsClosed(true);
    }, 1200);
  };

  return (
    <CounterShell
      title="Daily Closing Summary"
      subtitle={new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
      showSearch={false}
    >
      <div className="p-6 pb-32 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Total Orders</span>
              <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center">
                <ShoppingBasket className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="text-3xl font-bold text-on-surface">{paidReceipts.length}</span>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Settled today
            </span>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Net Revenue</span>
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <span className="text-3xl font-bold text-on-surface">{formatInvoiceAmount(totalNetRevenue)}</span>
            <span className="text-xs text-on-surface-variant">Excludes {formatInvoiceAmount(totalTaxCollected)} GST (5%)</span>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Total Refunds</span>
              <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center">
                <Undo2 className="w-5 h-5 text-error" />
              </div>
            </div>
            <span className="text-3xl font-bold text-on-surface">{formatInvoiceAmount(totalRefunds)}</span>
            <span className="text-xs text-on-surface-variant">{refundedReceipts.length} transactions total</span>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Cash in Drawer</span>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-700" />
              </div>
            </div>
            <span className="text-3xl font-bold text-on-surface">{formatInvoiceAmount(cashInDrawer)}</span>
            <span className="text-xs text-on-surface-variant">Opening float + cash sales</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Financial Breakdown
            </h3>
            <table className="w-full text-left">
              <thead>
                <tr className="text-on-surface-variant border-b border-outline-variant/20 text-sm">
                  <th className="py-3">Category</th>
                  <th className="py-3 text-right">Transactions</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr>
                  <td className="py-3 flex items-center gap-2 text-on-surface"><Banknote className="w-4 h-4 text-on-surface-variant" /> Cash</td>
                  <td className="py-3 text-right text-on-surface">{cashSales.length}</td>
                  <td className="py-3 text-right font-semibold text-on-surface">{formatInvoiceAmount(cashTotal)}</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2 text-on-surface"><CreditCard className="w-4 h-4 text-on-surface-variant" /> Credit / Debit Card</td>
                  <td className="py-3 text-right text-on-surface">{cardSales.length}</td>
                  <td className="py-3 text-right font-semibold text-on-surface">{formatInvoiceAmount(cardTotal)}</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2 text-on-surface"><QrCode className="w-4 h-4 text-on-surface-variant" /> UPI / Digital</td>
                  <td className="py-3 text-right text-on-surface">{upiSales.length}</td>
                  <td className="py-3 text-right font-semibold text-on-surface">{formatInvoiceAmount(upiTotal)}</td>
                </tr>
                <tr className="bg-surface-container-low/30">
                  <td className="py-3 italic text-on-surface-variant">Discounts Applied</td>
                  <td className="py-3 text-right">-</td>
                  <td className="py-3 text-right text-error">-{formatInvoiceAmount(totalDiscounts)}</td>
                </tr>
                <tr className="bg-surface-container-low/30">
                  <td className="py-3 italic text-on-surface-variant">Taxes Collected</td>
                  <td className="py-3 text-right">-</td>
                  <td className="py-3 text-right text-secondary">{formatInvoiceAmount(totalTaxCollected)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-bold text-lg">
                  <td className="pt-4 pb-2">Total Net Revenue</td>
                  <td />
                  <td className="pt-4 pb-2 text-right text-primary">{formatInvoiceAmount(totalNetRevenue)}</td>
                </tr>
              </tfoot>
            </table>

            <div className="mt-6">
              <label htmlFor="shift-notes" className="block text-sm text-on-surface-variant mb-2">
                Shift Notes &amp; Discrepancies
              </label>
              <textarea
                id="shift-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter details about petty cash, discrepancies or terminal issues..."
                className="w-full bg-background border border-outline-variant/30 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/20">
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant mb-6 font-semibold">
                Payment Method Breakdown
              </h3>
              <div className="relative flex items-center justify-center py-2">
                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 192 192">
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="var(--color-primary)" strokeWidth="16" strokeDasharray={`${(cardPct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`} />
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="var(--color-secondary-container)" strokeWidth="16" strokeDasharray={`${(cashPct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`} strokeDashoffset={-((cardPct / 100) * CIRCUMFERENCE)} />
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="var(--color-tertiary)" strokeWidth="16" strokeDasharray={`${(upiPct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`} strokeDashoffset={-(((cardPct + cashPct) / 100) * CIRCUMFERENCE)} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-bold text-xl text-on-surface">{paidReceipts.length ? '100%' : '0%'}</span>
                  <span className="text-xs text-on-surface-variant">Settled</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-on-surface">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> Card ({cardPct.toFixed(0)}%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary-container" /> Cash ({cashPct.toFixed(0)}%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-tertiary" /> Digital ({upiPct.toFixed(0)}%)</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/20">
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant mb-6 font-semibold">
                Hourly Sales Trend
              </h3>
              {hourlyBuckets.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-10">No settled sales recorded yet today.</p>
              ) : (
                <>
                  <div className="h-40 flex items-end gap-1.5 px-1">
                    {hourlyBuckets.map(({ hour, pct }) => (
                      <div
                        key={hour}
                        className="flex-1 rounded-t-sm"
                        style={{ height: `${pct}%`, background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-container) 100%)' }}
                        title={`${hour}:00`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant">
                    <span>{hourlyBuckets[0].hour}:00</span>
                    <span>{hourlyBuckets[hourlyBuckets.length - 1].hour}:00</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <footer className="sticky bottom-0 left-0 right-0 h-24 bg-surface-container-lowest flex items-center justify-between px-6 border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-5 h-14 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 h-14 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <FileDown className="w-5 h-5" />
            Export PDF
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Total Revenue Today</span>
            <p className="font-bold text-xl text-primary">{formatInvoiceAmount(totalGrossRevenue)}</p>
          </div>
          <button
            onClick={handleFinalize}
            disabled={isFinalizing || isClosed}
            className="px-8 h-14 bg-primary text-on-primary font-bold rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.15)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70"
          >
            {isFinalizing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : isClosed ? (
              <>
                <Lock className="w-5 h-5" /> Shift Closed
              </>
            ) : (
              <>
                Finalize &amp; Close Shift
                <Lock className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </CounterShell>
  );
};

export default DailyClosingScreen;
