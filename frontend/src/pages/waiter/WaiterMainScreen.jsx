import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import WaiterLayout from '../../components/layout/WaiterLayout';
import WaiterBottomNav from '../../components/layout/WaiterBottomNav';
import WaiterHomeScreen from './WaiterHomeScreen';
import WaiterTablesScreen from './WaiterTablesScreen';
import WaiterReadyOrdersScreen from './WaiterReadyOrdersScreen';
import WaiterStaffRequestsScreen from './WaiterStaffRequestsScreen';
import WaiterProfileScreen from './WaiterProfileScreen';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

const TAB_TITLES = {
  home: 'Waiter Dashboard',
  tables: 'Floor Plan & Tables',
  orders: 'Kitchen Ready Pass',
  requests: 'Staff Requests',
  profile: 'Waiter Shift Profile'
};

const WaiterMainScreen = () => {
  const navigate = useNavigate();
  const { kitchenOrders, assistanceRequests, billRequests } = useOrder();

  // 'home' | 'tables' | 'orders' | 'requests' | 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [requestsSubTab, setRequestsSubTab] = useState('customer');

  const readyCount = kitchenOrders.filter((o) => o.status === 'ready').length;
  const requestsCount = assistanceRequests.filter((r) => r.status === 'pending').length;
  const billsCount = billRequests.filter((b) => b.status === 'pending').length;

  const openRequests = (subTab) => {
    setRequestsSubTab(subTab);
    setActiveTab('requests');
  };

  return (
    <WaiterLayout>
      <div className="space-y-4">
        {/* Top Mobile Header */}
        <header className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/menu')}
              className="p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors shadow-xs"
              title="Customer View"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-9 h-9 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md">
              <UtensilsCrossed className="w-4 h-4" />
            </div>

            <div>
              <h1 className="text-base font-serif font-bold text-primary leading-tight">
                {TAB_TITLES[activeTab]}
              </h1>
              <p className="text-[10px] text-on-surface-variant font-mono font-medium">
                WAITER MOBILE PORTAL • AMANI'S KITCHEN
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 bg-secondary-container/25 border border-secondary-container/60 rounded-full text-[11px] font-bold text-on-secondary-container flex items-center gap-1 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Elena V.</span>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'home' && (
          <WaiterHomeScreen
            onNavigateTables={() => setActiveTab('tables')}
            onNavigateOrders={() => setActiveTab('orders')}
            onOpenRequests={openRequests}
          />
        )}
        {activeTab === 'tables' && <WaiterTablesScreen />}
        {activeTab === 'orders' && <WaiterReadyOrdersScreen />}
        {activeTab === 'requests' && (
          <WaiterStaffRequestsScreen subTab={requestsSubTab} setSubTab={setRequestsSubTab} />
        )}
        {activeTab === 'profile' && <WaiterProfileScreen />}
      </div>

      {/* Stitch Mobile Bottom Navigation */}
      <WaiterBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        readyCount={readyCount}
        requestsCount={requestsCount}
        billsCount={billsCount}
      />
    </WaiterLayout>
  );
};

export default WaiterMainScreen;
