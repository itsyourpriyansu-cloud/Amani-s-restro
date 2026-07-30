import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Toast from '../common/Toast';
import KitchenSidebar from '../kitchen/KitchenSidebar';
import KitchenTopBar from '../kitchen/KitchenTopBar';
import AssistanceCallsDrawer from '../kitchen/AssistanceCallsDrawer';
import { useOrder } from '../../context/OrderContext';

const PAGE_META = [
  {
    match: (p) => p.startsWith('/kitchen/orders/'),
    title: 'Order Details',
    subtitle: 'Kitchen Ticket'
  },
  {
    match: (p) => p.startsWith('/kitchen/history'),
    title: 'Order History',
    subtitle: 'Completed & active kitchen tickets'
  },
  {
    match: (p) => p.startsWith('/kitchen/summary'),
    title: 'Item Summary',
    subtitle: 'Batch cook aggregation queue'
  },
  {
    match: (p) => p.startsWith('/kitchen/assistance'),
    title: 'Assistance Calls',
    subtitle: 'Live table request feed'
  },
  {
    match: (p) => p.startsWith('/kitchen/settings'),
    title: 'Kitchen Settings',
    subtitle: 'Kitchen Module'
  },
  {
    match: (p) => p === '/kitchen',
    title: null,
    subtitle: null,
    showSearch: true,
    searchPlaceholder: 'Search table, order or dish'
  }
];

const KitchenLayout = ({ children, staffAuth, pendingCallsCount = 0, onResetData, searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistanceDrawerOpen, setIsAssistanceDrawerOpen] = useState(false);

  let assistanceRequests = [];
  let resolveAssistanceRequest = null;
  try {
    const orderCtx = useOrder();
    assistanceRequests = orderCtx.assistanceRequests || [];
    resolveAssistanceRequest = orderCtx.resolveAssistanceRequest;
  } catch (e) {
    // If used outside OrderProvider
  }

  if (!staffAuth) {
    return (
      <div className="flex h-screen w-full bg-[#F7F5F2] overflow-hidden items-center justify-center">
        <Toast />
        {children}
      </div>
    );
  }

  const meta = PAGE_META.find((m) => m.match(location.pathname)) || {};

  return (
    <div className="flex h-screen w-full bg-[#F7F5F2] overflow-hidden">
      <Toast />
      <KitchenSidebar
        pendingCallsCount={pendingCallsCount}
        onResetData={onResetData}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenAssistanceDrawer={() => setIsAssistanceDrawerOpen(true)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <KitchenTopBar
          title={meta.title}
          subtitle={meta.subtitle}
          showSearch={meta.showSearch}
          searchPlaceholder={meta.searchPlaceholder}
          staffAuth={staffAuth}
          pendingCallsCount={pendingCallsCount}
          onOpenAssistanceDrawer={() => setIsAssistanceDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 overflow-y-auto p-3.5 min-h-0 flex flex-col">
          {children}
        </main>
      </div>

      <AssistanceCallsDrawer
        isOpen={isAssistanceDrawerOpen}
        onClose={() => setIsAssistanceDrawerOpen(false)}
        requests={assistanceRequests}
        onResolveRequest={resolveAssistanceRequest}
      />
    </div>
  );
};

export default KitchenLayout;
