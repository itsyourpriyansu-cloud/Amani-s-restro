import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import {
  IndianRupee,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  PieChart,
  BarChart2,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';

const ReportsView = () => {
  const { receipts, registerSession } = useOrder();

  // Calculations from receipts
  const paidReceipts = receipts.filter((r) => r.status === 'paid');
  const totalGrossRevenue = paidReceipts.reduce((sum, r) => sum + (r.grandTotal || 0), 0);
  const totalTaxCollected = paidReceipts.reduce((sum, r) => sum + (r.tax || r.gst || 0), 0);
  const totalNetRevenue = totalGrossRevenue - totalTaxCollected;
  const avgOrderValue = paidReceipts.length > 0 ? totalGrossRevenue / paidReceipts.length : 0;

  // Breakdown by method
  const cashSales = paidReceipts
    .filter((r) => r.paymentMethod.toLowerCase().includes('cash'))
    .reduce((sum, r) => sum + (r.grandTotal || 0), 0);

  const cardSales = paidReceipts
    .filter((r) => r.paymentMethod.toLowerCase().includes('card') || r.paymentMethod.toLowerCase().includes('credit'))
    .reduce((sum, r) => sum + (r.grandTotal || 0), 0);

  const upiSales = paidReceipts
    .filter((r) => r.paymentMethod.toLowerCase().includes('upi') || r.paymentMethod.toLowerCase().includes('qr'))
    .reduce((sum, r) => sum + (r.grandTotal || 0), 0);

  const cashPct = totalGrossRevenue > 0 ? (cashSales / totalGrossRevenue) * 100 : 0;
  const cardPct = totalGrossRevenue > 0 ? (cardSales / totalGrossRevenue) * 100 : 0;
  const upiPct = totalGrossRevenue > 0 ? (upiSales / totalGrossRevenue) * 100 : 0;

  // Popular item aggregated statistics
  const itemCounts = {};
  paidReceipts.forEach((r) => {
    (r.items || []).forEach((it) => {
      itemCounts[it.name] = (itemCounts[it.name] || 0) + (it.quantity || 1);
    });
  });

  const topDishes = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ReceiptNo,Table,PaymentMethod,GrandTotal,Timestamp\n";
    paidReceipts.forEach((r) => {
      csvContent += `${r.receiptNo},${r.tableNumber},${r.paymentMethod},${r.grandTotal},${r.timestamp}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Mangamma_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Actions */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-600" />
            Counter Daily Financial & Register Report
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            Register: {registerSession.registerId} • Cashier: {registerSession.cashierName}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-xs font-mono font-bold text-stone-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintZReport}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Z-Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-mono">
            <span>Gross Sales Today</span>
            <IndianRupee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">{formatInvoiceAmount(totalGrossRevenue)}</div>
          <div className="text-[11px] text-stone-500 font-mono">
            {paidReceipts.length} Settled Transactions
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-mono">
            <span>Net Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{formatInvoiceAmount(totalNetRevenue)}</div>
          <div className="text-[11px] text-stone-500 font-mono">
            Excludes GST ({formatInvoiceAmount(totalTaxCollected)})
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-mono">
            <span>Average Check Size</span>
            <PieChart className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700">{formatInvoiceAmount(avgOrderValue)}</div>
          <div className="text-[11px] text-stone-500 font-mono">
            Per Table Check
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-mono">
            <span>Cash in Till Drawer</span>
            <Banknote className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-700">
            {formatInvoiceAmount(registerSession.openingFloat + cashSales)}
          </div>
          <div className="text-[11px] text-stone-500 font-mono">
            Float: {formatInvoiceAmount(registerSession.openingFloat)} + Cash: {formatInvoiceAmount(cashSales)}
          </div>
        </div>
      </div>

      {/* Main Reports Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Payment Methods & Till Reconciliation */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Payment Method Breakdown */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              Payment Methods Breakdown
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* Credit Card */}
              <div>
                <div className="flex justify-between text-stone-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    Credit / Debit Cards:
                  </span>
                  <span className="font-bold">{formatInvoiceAmount(cardSales)} ({cardPct.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${cardPct}%` }} />
                </div>
              </div>

              {/* Cash */}
              <div>
                <div className="flex justify-between text-stone-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    Cash Payments:
                  </span>
                  <span className="font-bold">{formatInvoiceAmount(cashSales)} ({cashPct.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${cashPct}%` }} />
                </div>
              </div>

              {/* UPI */}
              <div>
                <div className="flex justify-between text-stone-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-purple-600" />
                    UPI / QR Code Digital:
                  </span>
                  <span className="font-bold">{formatInvoiceAmount(upiSales)} ({upiPct.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${upiPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Cash Register Till Session Summary */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Register Till Reconciliation Status
            </h3>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2 text-stone-700">
              <div className="flex justify-between">
                <span>Opening Cash Float:</span>
                <span>{formatInvoiceAmount(registerSession.openingFloat)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Sales Collected:</span>
                <span className="text-emerald-700">+{formatInvoiceAmount(cashSales)}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-900">
                <span>Expected Cash In Drawer:</span>
                <span className="text-amber-700">{formatInvoiceAmount(registerSession.openingFloat + cashSales)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Top Selling Dishes Analytics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Top Selling Dishes Today
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              {topDishes.length === 0 ? (
                <p className="text-stone-400">No item data recorded yet.</p>
              ) : (
                topDishes.map(([dishName, count], idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <span className="text-stone-800 font-sans font-semibold truncate max-w-[180px]">
                        {dishName}
                      </span>
                    </div>
                    <span className="font-bold text-amber-700">
                      {count} Sold
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportsView;
