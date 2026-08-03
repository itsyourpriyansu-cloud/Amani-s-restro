import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { paymentService } from '../../services/paymentService';
import { formatInvoiceAmount, deriveInvoiceNumber } from '../../utils/formatters';
import { stockImages } from '../../data/imageManifest';
import TopAppBar from '../../components/layout/TopAppBar';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import DiagnosticFeedbackModal from '../../components/retention/DiagnosticFeedbackModal';
import SignatureDishStoryModal from '../../components/retention/SignatureDishStoryModal';
import ContentRemovalModal from '../../components/retention/ContentRemovalModal';
import MilestoneCouponCard from '../../components/retention/MilestoneCouponCard';
import {
  CheckCircle2,
  MessageSquare,
  Camera,
  Download,
  UtensilsCrossed,
} from 'lucide-react';

const PaymentSuccessSummary = ({ amount, tableNumber, invoiceNumber }) => (
  <section
    aria-labelledby="payment-success-title"
    className="flex w-full items-center gap-3.5 rounded-2xl border border-[rgba(98,49,32,0.09)] bg-surface/95 backdrop-blur-xs p-3.5 text-left shadow-2xs mb-4 min-h-[68px]"
    role="status"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
      <CheckCircle2 className="h-[22px] w-[22px] text-[#166534]" aria-hidden="true" />
    </div>
    <div className="min-w-0 flex-1">
      <h1 id="payment-success-title" className="text-[13px] font-semibold leading-tight text-on-surface">
        Payment successful
      </h1>
      <p className="mt-0.5 break-words text-[19px] sm:text-[20px] font-extrabold leading-snug tracking-[-0.015em] text-[#3D180E] tabular-nums">
        {amount !== null ? `${formatInvoiceAmount(amount)} paid` : 'Payment amount unavailable'}
      </p>
      {(tableNumber || invoiceNumber) && (
        <p className="mt-0.5 truncate text-[12px] leading-tight text-on-surface-variant">
          {tableNumber && `Table ${String(tableNumber).padStart(2, '0')}`}
          {tableNumber && invoiceNumber && ' · '}
          {invoiceNumber && (invoiceNumber.startsWith('INV-') ? invoiceNumber : `INV-${invoiceNumber}`)}
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

  // Background restaurant interior photo
  const pageBgImage = stockImages?.restaurantInterior?.url;

  return (
    <div
      className="animate-fluid-gradient relative flex min-h-screen w-full flex-col text-on-surface antialiased overflow-x-hidden"
      style={{
        background: 'linear-gradient(-45deg, #FFF9F4 0%, #FFF3E7 33%, #FAF2EB 66%, #FFFDFB 100%)',
      }}
    >
      {/* Real Photography Background Image (Unblurred & Visible) */}
      {pageBgImage && (
        <img
          src={pageBgImage}
          alt=""
          aria-hidden="true"
          className="fixed inset-0 h-full w-full object-cover object-center opacity-22 mix-blend-multiply pointer-events-none transition-opacity duration-300"
        />
      )}

      {/* Warm Overlay Layer */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,249,244,0.80) 0%, rgba(255,253,251,0.88) 50%, rgba(250,242,235,0.92) 100%)',
        }}
      />

      {/* Background Fluid Ambient Glowing Blobs */}
      <div
        className="animate-fluid-blob-1 pointer-events-none fixed -left-20 top-20 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(135, 53, 31, 0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="animate-fluid-blob-2 pointer-events-none fixed -right-20 top-80 h-96 w-96 rounded-full opacity-35 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(200, 149, 82, 0.22) 0%, transparent 70%)',
        }}
      />

      {/* Top Bar Header */}
      <TopAppBar variant="brand" />

      <main
        className="relative z-10 mx-auto flex w-full max-w-[460px] flex-1 flex-col px-4 max-[359px]:px-3.5 pb-8"
        style={{
          paddingTop: 'calc(76px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
        }}
      >
        {/* 1. Compact Payment Confirmation */}
        <PaymentSuccessSummary
          amount={totalPaid}
          tableNumber={tableNumber}
          invoiceNumber={invoiceNumber}
        />

        {/* 2. Dominant Reward Card & WhatsApp Claim Flow */}
        <MilestoneCouponCard
          activeOrder={activeOrder}
          onOpenPrivacyControls={() => setIsRemovalModalOpen(true)}
        />

        {/* 3. Secondary Actions: "More after your visit" */}
        <section aria-label="More after your visit" className="mt-7 w-full text-left">
          <h2 className="px-0.5 text-[14px] font-bold text-[#623120] tracking-tight mb-3">
            More after your visit
          </h2>

          <div className="grid grid-cols-2 gap-3 max-[350px]:grid-cols-1">
            {/* Action Card 1: Share feedback */}
            <div
              onClick={() => setIsDiagnosticFeedbackOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsDiagnosticFeedbackOpen(true)}
              className="flex min-h-[76px] cursor-pointer flex-col justify-between rounded-2xl border border-[rgba(98,49,32,0.09)] bg-surface/95 backdrop-blur-xs p-3.5 shadow-2xs transition-all hover:border-primary/30 active:scale-[0.985]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#7D2E19]">
                  <MessageSquare className="h-5 w-5 text-[#7D2E19]" aria-hidden="true" />
                </div>
                <h3 className="text-[13.5px] font-semibold leading-tight text-on-surface">Share feedback</h3>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-on-surface-variant">
                Help us improve
              </p>
            </div>

            {/* Action Card 2: Dish story */}
            <div
              onClick={() => setIsSignatureDishOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsSignatureDishOpen(true)}
              className="flex min-h-[76px] cursor-pointer flex-col justify-between rounded-2xl border border-[rgba(98,49,32,0.09)] bg-surface/95 backdrop-blur-xs p-3.5 shadow-2xs transition-all hover:border-primary/30 active:scale-[0.985]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#7D2E19]">
                  <Camera className="h-5 w-5 text-[#7D2E19]" aria-hidden="true" />
                </div>
                <h3 className="text-[13.5px] font-semibold leading-tight text-on-surface">Dish story</h3>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-on-surface-variant">
                Share your favourite dish
              </p>
            </div>
          </div>
        </section>

        {/* 4. Receipt & Exit Actions */}
        <div className="mt-6 w-full space-y-2.5">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(98,49,32,0.12)] bg-surface/95 backdrop-blur-xs text-[13.5px] font-semibold text-on-surface shadow-2xs transition-all hover:bg-surface-container-low active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <Download className="h-4.5 w-4.5 text-[#7D2E19]" aria-hidden="true" />
            <span>{isDownloading ? 'Downloading…' : 'Download receipt'}</span>
          </button>

          <div className="flex w-full justify-center">
            <button
              type="button"
              onClick={handleVisitAgain}
              className="flex h-11 min-h-[44px] items-center justify-center gap-2 px-6 text-[13px] font-bold text-primary transition-all hover:underline cursor-pointer"
            >
              <UtensilsCrossed className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Visit again</span>
            </button>
          </div>
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
