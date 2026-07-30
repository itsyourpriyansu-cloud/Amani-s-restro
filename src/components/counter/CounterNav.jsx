import React from 'react';
import { CreditCard, Receipt, BarChart3, Calculator, FileText } from 'lucide-react';

const CounterNav = ({ activeTab, setActiveTab, pendingBillsCount, receiptsTodayCount }) => {
  const tabs = [
    {
      id: 'billing',
      label: 'Billing',
      icon: Calculator,
      badge: pendingBillsCount > 0 ? pendingBillsCount : null,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      description: 'Table checks & calculation'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      badge: null,
      description: 'Checkout & terminal tender'
    },
    {
      id: 'receipts',
      label: 'Receipts',
      icon: Receipt,
      badge: receiptsTodayCount > 0 ? receiptsTodayCount : null,
      badgeColor: 'bg-stone-200 text-stone-700',
      description: 'Printable invoice history'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      badge: null,
      description: 'Sales & drawer analytics'
    }
  ];

  return (
    <nav className="flex items-center justify-between bg-white border border-stone-200 p-1.5 rounded-2xl mb-6 shadow-xs overflow-x-auto">
      <div className="flex items-center gap-1.5 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 transition-all relative ${
                isActive
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/20'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
              <span className="tracking-wide">{tab.label}</span>

              {tab.badge !== null && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold font-mono ${
                    isActive
                      ? 'bg-white text-amber-800'
                      : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CounterNav;
