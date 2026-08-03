import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { paymentService } from '../../services/paymentService';
import { formatInvoiceAmount, deriveInvoiceNumber } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import DiagnosticFeedbackModal from '../../components/retention/DiagnosticFeedbackModal';
import SignatureDishStoryModal from '../../components/retention/SignatureDishStoryModal';
import ContentRemovalModal from '../../components/retention/ContentRemovalModal';
import MilestoneCouponCard from '../../components/retention/MilestoneCouponCard';
import { CheckCircle2, MessageSquare, Camera, ShieldCheck, Download, UtensilsCrossed } from 'lucide-react';

const PaymentSuccessSummary = ({ amount, tableNumber, invoiceNumber }) => (
  <section
    aria-labelledby="payment-success-title"
    className="flex w-full items-center gap-3.5 rounded-2xl border border-outline-variant bg-surface p-4 text-left"
    role="status"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-success">
      <CheckCircle2 className="h-[22px] w-[22px]" aria-hidden="true" />
    </div>
    <div className="min-w-0 flex-1">
      <h1 id="payment-success-title" className="text-[14px] font-semibold leading-5 text-on-surface">
        Payment successful
      </h1>
      <p className="mt-0.5 break-words text-[23px] font-semibold leading-7 tracking-[-0.015em] text-primary">
        {amount !== null ? `${formatInvoiceAmount(amount)} paid` : 'Payment amount unavailable'}
      </p>
      {(tableNumber || invoiceNumber) && (
        <p className="mt-0.5 break-words text-[12px] leading-[18px] text-on-surface-variant">
          {tableNumber && `Table ${tableNumber}`}
          {tableNumber && invoiceNumber && ' · '}
          {invoiceNumber && `Invoice ${invoiceNumber}`}
        </p>
      )}
    </div>
  </section>
);

const ThankYouScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, clearOrder, customerMemory, saveCustomerMemory, forgetCustomerMemory } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);

  const [isDiagnosticFeedbackOpen, setIsDiagnosticFeedbackOpen] = useState(false);
  const [isSignatureDishOpen, setIsSignatureDishOpen] = useState(false);
  const [isRemovalModalOpen, setIsRemovalModalOpen] = useState(false);

  const handleDownloadReceipt = async () => {
    if (!activeOrder?.orderId) {
      showToast('Receipt details are unavailable for this payment.', 'error');
      return;
    }

    setIsDownloading(true);
    try {
      const res = await paymentService.downloadReceipt(activeOrder.orderId, activeOrder.transaction);
      const blob = new Blob([res.data.receiptText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', res.data.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Receipt downloaded to your device!', 'success');
    } catch {
      showToast('Could not download receipt', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleVisitAgain = () => {
    clearOrder();
    navigate('/');
  };

  const totalPaid =
    activeOrder?.transaction?.amount ??
    activeOrder?.totals?.totalPayable ??
    activeOrder?.totals?.grandTotal ??
    activeOrder?.grandTotal ??
    null;
  const invoiceNumber = activeOrder ? deriveInvoiceNumber(activeOrder) : null;

  return (
    <div className="w-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* 1. Compact Customer Header */}
      <TopAppBar variant="brand" />

      <main
        className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-4 pb-6 sm:px-5"
        style={{
          paddingTop: 'calc(80px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        }}
      >
        <PaymentSuccessSummary
          amount={totalPaid}
          tableNumber={tableNumber}
          invoiceNumber={invoiceNumber}
        />

        <div className="mt-6">
          <MilestoneCouponCard
            activeOrder={activeOrder}
            onOpenPrivacyControls={() => setIsRemovalModalOpen(true)}
          />
        </div>

        {/* 6. Connected Guest Experience Section */}
        <section aria-label="Connected Guest Experience" className="mt-8 w-full space-y-3 pt-2 text-left">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="font-bold text-xs text-primary uppercase tracking-wider">
              Connected Guest Experience
            </h2>
            <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
              Optional
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Feedback Card */}
            <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between gap-3 min-h-[78px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-on-surface truncate">Share Useful Feedback</h3>
                  <p className="text-[12px] text-on-surface-variant leading-tight mt-0.5">
                    Help us improve food, service, speed, cleanliness & value.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDiagnosticFeedbackOpen(true)}
                className="min-h-11 px-3.5 py-1.5 bg-surface border border-primary text-primary hover:bg-primary-container font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                Feedback
              </button>
            </div>

            {/* Dish Story Card */}
            <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between gap-3 min-h-[78px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-on-surface truncate">Share a Dish Moment</h3>
                  <p className="text-[12px] text-on-surface-variant leading-tight mt-0.5">
                    Watch a dish story or share authentic content.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSignatureDishOpen(true)}
                className="min-h-11 px-3.5 py-1.5 bg-surface border border-error text-error hover:bg-error-container font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                Dish Story
              </button>
            </div>

            {/* 7. Privacy & Communication Controls */}
            <div
              onClick={() => setIsRemovalModalOpen(true)}
              className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between gap-2.5 text-xs min-h-[48px] cursor-pointer hover:bg-surface-container/50 transition-colors"
            >
              <div className="flex items-start gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold text-on-surface text-xs block">Privacy & Communication</span>
                  <span className="text-on-surface-variant text-[11px] leading-tight block">
                    Review coupon consent, WhatsApp preferences and content permissions.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRemovalModalOpen(true);
                }}
                className="min-h-11 text-primary font-bold text-xs hover:underline shrink-0 px-2 py-1"
              >
                Manage
              </button>
            </div>
          </div>
        </section>

        {/* 8. Receipt Actions */}
        <div className="w-full pt-6">
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="w-full h-12 bg-surface border border-outline-variant text-on-surface rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low text-xs disabled:opacity-60 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-primary" />
            {isDownloading ? 'Downloading...' : 'Download Receipt'}
          </button>
        </div>

        {/* 9. Visit Again */}
        <div className="w-full flex justify-center pb-2">
          <button
            onClick={handleVisitAgain}
            className="h-11 px-6 text-primary font-bold flex items-center justify-center gap-2 hover:underline text-xs min-h-[44px] cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Visit Again
          </button>
        </div>
      </main>

      {/* Connected Systems Retention Modals */}
      <DiagnosticFeedbackModal
        isOpen={isDiagnosticFeedbackOpen}
        onClose={() => setIsDiagnosticFeedbackOpen(false)}
        order={activeOrder}
      />

      <SignatureDishStoryModal
        isOpen={isSignatureDishOpen}
        onClose={() => setIsSignatureDishOpen(false)}
        dish={{ id: 'biryani-chicken-dum', name: 'Chicken Dum Biryani' }}
      />

      <ContentRemovalModal
        isOpen={isRemovalModalOpen}
        onClose={() => setIsRemovalModalOpen(false)}
      />

      <CustomerPreferencesModal
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
        customerMemory={customerMemory}
        onSaveMemory={saveCustomerMemory}
        onForgetMemory={forgetCustomerMemory}
      />
    </div>
  );
};

export default ThankYouScreen;
