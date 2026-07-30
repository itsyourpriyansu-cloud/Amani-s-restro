import React, { useState } from 'react';
import ManagerLayout from '../../components/layout/ManagerLayout';
import ManagerDashboardView from '../../components/manager/ManagerDashboardView';
import ManagerMenuView from '../../components/manager/ManagerMenuView';
import ManagerEmployeeView from '../../components/manager/ManagerEmployeeView';
import ManagerReportsView from '../../components/manager/ManagerReportsView';
import ManagerTablesView from '../../components/manager/ManagerTablesView';
import ManagerSettingsView from '../../components/manager/ManagerSettingsView';
import ManagerProfileView from '../../components/manager/ManagerProfileView';
import ManagerNotificationsView from '../../components/manager/ManagerNotificationsView';
import GuestFlowView from '../../components/manager/GuestFlowView';
import CouponManagementScreen from './CouponManagementScreen';

const ManagerMainScreen = () => {
  // Tab state: 'dashboard' | 'menu' | 'employee' | 'reports' | 'tables' | 'settings' | 'profile' | 'guestflow' | 'couponManagement'
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ManagerLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <ManagerDashboardView onNavigateTab={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === 'menu' && (
        <ManagerMenuView />
      )}

      {activeTab === 'employee' && (
        <ManagerEmployeeView />
      )}

      {activeTab === 'reports' && (
        <ManagerReportsView />
      )}

      {activeTab === 'tables' && (
        <ManagerTablesView />
      )}

      {activeTab === 'settings' && (
        <ManagerSettingsView />
      )}

      {activeTab === 'profile' && (
        <ManagerProfileView />
      )}

      {activeTab === 'notifications' && (
        <ManagerNotificationsView />
      )}

      {activeTab === 'guestflow' && (
        <GuestFlowView />
      )}

      {activeTab === 'couponManagement' && (
        <CouponManagementScreen />
      )}
    </ManagerLayout>
  );
};

export default ManagerMainScreen;
