import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { REPORTS_MOCK_DATA, addAuditLog } from '../../services/managerService';
import { formatInvoiceAmount } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import {
  Download,
  IndianRupee,
  CreditCard,
  Banknote,
  QrCode,
  Users,
  UtensilsCrossed,
  Percent,
  Receipt,
  FileSpreadsheet,
  Award
} from 'lucide-react';

const ManagerReportsView = () => {
  const { showToast } = useToast();
  const { receipts } = useOrder();
  const [dateRange, setDateRange] = useState('today'); // 'today' | '7days' | 'month'

  const liveReceiptsTotal = receipts.reduce((sum, r) => sum + (r.grandTotal || 0), 0);
  const baseOverview = REPORTS_MOCK_DATA.salesOverview;

  const grossSales = baseOverview.grossSales + liveReceiptsTotal;
  const netRevenue = baseOverview.netRevenue + liveReceiptsTotal * 0.95;
  const taxCollected = baseOverview.taxCollected + liveReceiptsTotal * 0.05;

  const handleExportCSV = () => {
    addAuditLog('Report Exported', `Exported CSV sales report for period: ${dateRange}`, 'finance');
    showToast('Financial report exported as CSV successfully', 'success');
  };

  const handleExportPDF = () => {
    addAuditLog('Report Exported', `Generated PDF summary report for period: ${dateRange}`, 'finance');
    showToast('PDF executive summary downloaded', 'success');
  };

  return (
    <div className="space-y-6">

      {/* Header & Date Selector */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Reports &amp; Analytics</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Revenue breakdown, GST collections, payment distribution, and staff productivity metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface-container p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setDateRange('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${dateRange === 'today' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('7days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${dateRange === '7days' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${dateRange === 'month' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'}`}
            >
              This Month
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-on-surface text-surface font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-bold tracking-wider">
            <span>Gross Sales</span>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-on-surface">{formatInvoiceAmount(grossSales)}</div>
          <div className="text-[11px] text-on-surface-variant mt-1">
            Net Revenue: <strong className="text-on-surface">{formatInvoiceAmount(netRevenue)}</strong>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-bold tracking-wider">
            <span>GST (5%) Collected</span>
            <Receipt className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-on-surface">{formatInvoiceAmount(taxCollected)}</div>
          <div className="text-[11px] text-on-surface-variant mt-1">
            CGST 2.5% ({formatInvoiceAmount(taxCollected / 2)}) • SGST 2.5% ({formatInvoiceAmount(taxCollected / 2)})
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-bold tracking-wider">
            <span>Discounts &amp; Comps</span>
            <Percent className="w-4 h-4 text-tertiary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-on-surface">{formatInvoiceAmount(baseOverview.discountsGiven)}</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Promotions &amp; manager comps</div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-bold tracking-wider">
            <span>Staff Tips Pool</span>
            <Award className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-on-surface">{formatInvoiceAmount(baseOverview.tipsCollected)}</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Distributed to floor staff</div>
        </div>
      </div>

      {/* Payment Methods & Staff Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Payment Method Breakdown
            </h3>
            <span className="text-xs text-on-surface-variant">100% Reconciled</span>
          </div>

          <div className="space-y-3">
            {REPORTS_MOCK_DATA.paymentSplit.map((pay, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-background border border-outline-variant/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-outline-variant flex items-center justify-center">
                    {pay.method === 'Card' ? <CreditCard className="w-4 h-4 text-primary" /> : pay.method === 'Cash' ? <Banknote className="w-4 h-4 text-secondary" /> : <QrCode className="w-4 h-4 text-tertiary" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{pay.method}</h4>
                    <span className="text-[10px] text-on-surface-variant">{pay.percentage}% of total volume</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-on-surface">{formatInvoiceAmount(pay.amount)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Staff Performance &amp; Sales Leaderboard
            </h3>
            <span className="text-xs text-green-700 font-semibold">Active Shift</span>
          </div>

          <div className="divide-y divide-outline-variant/40">
            {REPORTS_MOCK_DATA.staffPerformance.map((staff, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-container/40 text-on-secondary-container font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{staff.name}</h4>
                    <span className="text-[10px] text-on-surface-variant">{staff.role} • {staff.ordersHandled || 40} Orders</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-on-surface">{formatInvoiceAmount(staff.salesHandled || staff.sales || 0)} sales</div>
                  <div className="text-[10px] text-on-surface-variant font-medium">AOV: {formatInvoiceAmount(staff.avgOrderValue || 275)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance Full Table */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/50 mb-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            Detailed Category Revenue Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-3">Category Name</th>
                <th className="py-2.5 px-3 text-center">Items Sold</th>
                <th className="py-2.5 px-3 text-right">Gross Revenue</th>
                <th className="py-2.5 px-3 text-right">Share of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {REPORTS_MOCK_DATA.categoryPerformance.map((cat, i) => {
                const totalCatSales = REPORTS_MOCK_DATA.categoryPerformance.reduce((s, c) => s + c.sales, 0);
                const sharePercent = Math.round((cat.sales / totalCatSales) * 100);
                return (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-3 font-semibold text-on-surface flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                      {cat.name}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-on-surface-variant">{cat.count} units</td>
                    <td className="py-3 px-3 text-right font-bold text-primary">{formatInvoiceAmount(cat.sales)}</td>
                    <td className="py-3 px-3 text-right font-bold text-on-surface">{sharePercent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerReportsView;
