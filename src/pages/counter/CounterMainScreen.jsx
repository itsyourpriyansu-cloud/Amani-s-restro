import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import CounterLayout from '../../components/layout/CounterLayout';
import CounterNav from '../../components/counter/CounterNav';
import BillingView from '../../components/counter/BillingView';
import PaymentsView from '../../components/counter/PaymentsView';
import ReceiptsView from '../../components/counter/ReceiptsView';
import ReportsView from '../../components/counter/ReportsView';

const CounterMainScreen = () => {
  const { billRequests, receipts } = useOrder();
  
  // Tab state: 'billing' | 'payments' | 'receipts' | 'reports'
  const [activeTab, setActiveTab] = useState('billing');

  // Currently selected bill order passed between Billing & Payments views
  const [selectedBillOrder, setSelectedBillOrder] = useState(null);

  const pendingBillsCount = billRequests.filter((b) => b.status === 'pending').length;
  const receiptsTodayCount = receipts.length;

  const handleProceedToPayment = (finalBillData) => {
    setSelectedBillOrder(finalBillData);
    setActiveTab('payments');
  };

  const handlePaymentComplete = () => {
    setSelectedBillOrder(null);
    setActiveTab('billing');
  };

  const handleNavigateToReceipts = () => {
    setActiveTab('receipts');
  };

  return (
    <CounterLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Counter Navigation Bar */}
      <CounterNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingBillsCount={pendingBillsCount}
        receiptsTodayCount={receiptsTodayCount}
      />

      {/* Dynamic View Switcher */}
      {activeTab === 'billing' && (
        <BillingView
          onProceedToPayment={handleProceedToPayment}
          selectedBillOrder={selectedBillOrder}
          setSelectedBillOrder={setSelectedBillOrder}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentsView
          billOrder={selectedBillOrder}
          onPaymentComplete={handlePaymentComplete}
          onNavigateToReceipts={handleNavigateToReceipts}
        />
      )}

      {activeTab === 'receipts' && (
        <ReceiptsView />
      )}

      {activeTab === 'reports' && (
        <ReportsView />
      )}
    </CounterLayout>
  );
};

export default CounterMainScreen;
