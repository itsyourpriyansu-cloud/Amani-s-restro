import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { KitchenPrefsProvider } from '../../context/KitchenPrefsContext';
import {
  getStoredKitchenAuth,
  setStoredKitchenAuth,
  clearStoredKitchenAuth
} from '../../utils/storage';
import KitchenLayout from '../../components/layout/KitchenLayout';
import KitchenLoginScreen from './KitchenLoginScreen';
import KitchenDashboardScreen from './KitchenDashboardScreen';
import OrderDetailsScreen from './OrderDetailsScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import KitchenSettingsScreen from './KitchenSettingsScreen';
import ItemSummaryView from '../../components/kitchen/ItemSummaryView';
import AssistanceStreamView from '../../components/kitchen/AssistanceStreamView';

const KitchenDisplayScreen = () => {
  const {
    kitchenOrders,
    assistanceRequests,
    updateKitchenOrderStatus,
    toggleKitchenItemDone,
    toggleRushOrder,
    resolveAssistanceRequest,
    resetKitchenDemoData
  } = useOrder();

  const [staffAuth, setStaffAuth] = useState(() => getStoredKitchenAuth());

  const handleLoginSuccess = (authData) => {
    const fullAuth = {
      ...authData,
      loggedInAt: new Date().toISOString()
    };
    setStoredKitchenAuth(fullAuth);
    setStaffAuth(fullAuth);
  };

  const handleLogoutStaff = () => {
    clearStoredKitchenAuth();
    setStaffAuth(null);
  };

  if (!staffAuth) {
    return (
      <KitchenPrefsProvider>
        <KitchenLayout staffAuth={null} onLogoutStaff={handleLogoutStaff}>
          <KitchenLoginScreen onLoginSuccess={handleLoginSuccess} />
        </KitchenLayout>
      </KitchenPrefsProvider>
    );
  }

  const pendingAssistanceCount = assistanceRequests.filter((r) => r.status === 'pending').length;

  return (
    <KitchenPrefsProvider>
      <KitchenLayout
        staffAuth={staffAuth}
        onLogoutStaff={handleLogoutStaff}
        pendingCallsCount={pendingAssistanceCount}
        onResetData={resetKitchenDemoData}
      >
        <Routes>
          <Route
            index
            element={
              <KitchenDashboardScreen
                orders={kitchenOrders}
                onUpdateStatus={updateKitchenOrderStatus}
                onToggleItemDone={toggleKitchenItemDone}
                onToggleRush={toggleRushOrder}
                onResetData={resetKitchenDemoData}
                defaultStation={staffAuth.station || 'All'}
              />
            }
          />
          <Route
            path="history"
            element={<OrderHistoryScreen orders={kitchenOrders} />}
          />
          <Route
            path="orders/:orderId"
            element={
              <OrderDetailsScreen
                orders={kitchenOrders}
                onUpdateStatus={updateKitchenOrderStatus}
                onToggleItemDone={toggleKitchenItemDone}
                onToggleRush={toggleRushOrder}
              />
            }
          />
          <Route
            path="summary"
            element={
              <ItemSummaryView orders={kitchenOrders} selectedStation={staffAuth.station || 'All'} />
            }
          />
          <Route
            path="assistance"
            element={
              <AssistanceStreamView
                requests={assistanceRequests}
                onResolveRequest={resolveAssistanceRequest}
              />
            }
          />
          <Route
            path="settings"
            element={<KitchenSettingsScreen staffAuth={staffAuth} onLogoutStaff={handleLogoutStaff} />}
          />
          <Route path="*" element={<Navigate to="/kitchen" replace />} />
        </Routes>
      </KitchenLayout>
    </KitchenPrefsProvider>
  );
};

export default KitchenDisplayScreen;
