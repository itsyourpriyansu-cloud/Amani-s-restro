import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import CounterShell from '../../components/layout/CounterShell';
import {
  Banknote,
  Clock,
  CreditCard,
  QrCode,
  Receipt,
  TrendingUp,
  Wallet,
  History
} from 'lucide-react';

const timeAgo = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return 'just now';
  if (mins === 1) return '1m ago';
  return `${mins}m ago`;
};

const CounterDashboardScreen = () => {
  const navigate = useNavigate();
  const { billRequests, receipts, registerSession } = useOrder();

  const pendingBills = billRequests.filter((b) => b.status === 'pending');
  const urgentCount = pendingBills.filter(
    (b) => Date.now() - new Date(b.requestedAt).getTime() > 10 * 60 * 1000
  ).length;

  const todaysRevenue =
    registerSession.cashCollected + registerSession.cardCollected + registerSession.upiCollected;
  const cashInDrawer = registerSession.openingFloat + registerSession.cashCollected;

  const handleProcessPayment = (bill) => {
    navigate('/counter/payment', { state: { bill } });
  };

  return (
    <CounterShell showSearch searchPlaceholder="Search bills or tables...">
      <div className="p-8 space-y-8">
        <section>
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Counter Overview</h2>
              <p className="text-sm text-on-surface-variant">Real-time billing activity and revenue tracking.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface-variant uppercase">Register Opened Since</p>
              <p className="text-sm font-medium text-on-surface">
                {new Date(registerSession.shiftStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' '}&middot; Cashier: {registerSession.cashierName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-5">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-on-surface-variant">Today's Total Revenue</p>
                <h3 className="text-4xl font-black text-primary mt-1 tracking-tight">₹{todaysRevenue.toFixed(2)}</h3>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-green-700 bg-green-50 w-fit px-2 py-1 rounded">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5% from yesterday</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-on-surface-variant">Pending Bills</p>
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-on-surface">{pendingBills.length}</h3>
                <p className="text-xs text-orange-600 font-medium">
                  {urgentCount > 0 ? `${urgentCount} immediate action required` : 'All within target wait time'}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-on-surface-variant">Cash in Drawer</p>
                <Wallet className="w-5 h-5 text-secondary" />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-on-surface">₹{cashInDrawer.toFixed(2)}</h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Opening balance: ₹{registerSession.openingFloat.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Cash Total', value: registerSession.cashCollected, icon: Banknote },
              { label: 'Card Total', value: registerSession.cardCollected, icon: CreditCard },
              { label: 'UPI Total', value: registerSession.upiCollected, icon: QrCode },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-surface-container-high/40 rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 bg-surface-container-lowest rounded-md text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{label}</p>
                  <p className="text-lg font-bold text-on-surface">₹{value.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-on-surface">Recent Bill Requests</h2>
              <button
                onClick={() => navigate('/counter/pending-bills')}
                className="text-primary text-sm font-bold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/20">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Table</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Waiter</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Time</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {pendingBills.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant text-sm">
                        No pending bill requests right now.
                      </td>
                    </tr>
                  ) : (
                    pendingBills.map((bill) => {
                      const urgent = Date.now() - new Date(bill.requestedAt).getTime() > 10 * 60 * 1000;
                      return (
                        <tr key={bill.id} className="hover:bg-surface-container-low/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                                {bill.tableNumber}
                              </div>
                              <span className="font-semibold text-sm text-on-surface">Table {bill.tableNumber}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-on-surface">{bill.serverName}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className={`flex items-center gap-1 ${urgent ? 'text-red-500 font-bold' : 'text-on-surface-variant'}`}>
                              <Clock className={`w-3.5 h-3.5 ${urgent ? 'animate-pulse' : ''}`} />
                              <span>{timeAgo(bill.requestedAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-on-surface">₹{bill.grandTotal.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleProcessPayment(bill)}
                              className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded hover:brightness-110 transition-all"
                            >
                              Process Payment
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-on-surface">Recent Payments</h2>
              <button onClick={() => navigate('/counter/receipt')} className="text-on-surface-variant hover:text-primary transition-colors">
                <History className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-4 flex flex-col gap-4">
              {receipts.slice(0, 4).map((rec) => {
                const isCard = rec.paymentMethod.toLowerCase().includes('card') || rec.paymentMethod.toLowerCase().includes('credit');
                const isCash = rec.paymentMethod.toLowerCase() === 'cash';
                const Icon = isCard ? CreditCard : isCash ? Banknote : QrCode;
                const iconBg = isCard ? 'bg-green-50 text-green-700' : isCash ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700';
                return (
                  <div
                    key={rec.receiptNo}
                    className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 hover:border-primary transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded flex items-center justify-center ${iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Table {rec.tableNumber}</p>
                        <p className="text-[11px] text-on-surface-variant uppercase font-bold">
                          {rec.paymentMethod} &middot;{' '}
                          {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-on-surface">₹{rec.grandTotal.toFixed(2)}</p>
                      <p className={`text-[10px] font-bold uppercase ${rec.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                        {rec.status === 'paid' ? 'Success' : rec.status}
                      </p>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => navigate('/counter/daily-closing')}
                className="mt-2 w-full py-2 border border-outline-variant/40 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Download Daily Log
              </button>
            </div>
          </section>
        </div>

        <section
          className="mt-4 rounded-2xl overflow-hidden relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${RESTAURANT_INFO.heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center px-12 text-on-primary max-w-xl">
            <h3 className="text-2xl font-bold italic mb-2">"Annam Parabrahma Swaroopam."</h3>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Food is the embodiment of the divine. Ensure every guest leaves with the warmth of {RESTAURANT_INFO.name} hospitality.
            </p>
            <div className="mt-4 flex gap-4">
              <button className="px-6 py-2 bg-on-primary text-primary rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all">
                Staff Handbook
              </button>
              <button className="px-6 py-2 border border-on-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-wider hover:bg-on-primary hover:text-primary transition-all">
                Support Center
              </button>
            </div>
          </div>
        </section>
      </div>
    </CounterShell>
  );
};

export default CounterDashboardScreen;
