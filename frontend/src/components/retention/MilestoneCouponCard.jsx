import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Clock,
  Copy,
  Gift,
  HelpCircle,
  Phone,
  ShieldCheck,
  Ticket,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { restaurantConfig } from '../../config/restaurantConfig';
import { loyaltyCouponConfig } from '../../config/loyaltyCouponConfig';
import { deriveInvoiceNumber, formatMenuPrice } from '../../utils/formatters';
import {
  buildCouponClaimMessage,
  createWhatsAppUrl,
  maskMobile,
  openWhatsAppUrl,
} from '../../utils/whatsapp';
import { stockImages } from '../../data/imageManifest';
import CouponClaimBottomSheet from './CouponClaimBottomSheet';
import CouponConditionsSheet from './CouponConditionsSheet';
import Modal from '../common/Modal';

const CONFIRMED_STATUSES = [
  'CUSTOMER_CONFIRMED_SENT',
  'AWAITING_RESTAURANT_REVIEW',
  'VERIFIED',
  'COUPON_ISSUED',
];

const humanizeValue = (value, fallback) => {
  if (!value) return fallback;
  return String(value)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 2.15.679 4.143 1.835 5.776L2.5 21.5l3.864-1.286A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 0 1-4.103-1.135l-.294-.176-2.296.763.777-2.238-.192-.307A7.957 7.957 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
  </svg>
);

const MilestoneCouponCard = ({ activeOrder, onOpenPrivacyControls }) => {
  const {
    customerMembership,
    getCouponRequestForOrder,
    createCouponRequest,
    markCouponWhatsAppOpened,
    confirmCouponRequestSent,
    customerMemory,
  } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [isConditionsOpen, setIsConditionsOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);
  const [isCtaInView, setIsCtaInView] = useState(true);

  const mainCtaRef = useRef(null);

  const orderId = activeOrder?.orderId;
  const invoiceNumber = activeOrder ? deriveInvoiceNumber(activeOrder) : null;
  const tableId = tableNumber ? `TABLE-${tableNumber}` : null;
  const request = orderId ? getCouponRequestForOrder(orderId) : null;
  const completedVisits = customerMembership?.completedVisits || 0;
  const isEligible = completedVisits >= loyaltyCouponConfig.milestoneVisits;

  // Sticky CTA Intersection Observer
  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCtaInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if ((!isEligible && !request) || !orderId || !invoiceNumber) {
    return null;
  }

  const status = request?.status || 'ELIGIBLE';
  const discountType = request?.couponOffer?.discountType || loyaltyCouponConfig.discountType;
  const discountValue = request?.couponOffer?.discountValue ?? loyaltyCouponConfig.discountValue;
  const guestLabel = humanizeValue(request?.milestone?.level, 'Regular Guest');
  const offerLabel =
    discountType === 'FLAT'
      ? `${formatMenuPrice(discountValue)} off`
      : `${discountValue}% OFF`;

  const createRequestIfNeeded = () => {
    if (request) return request;

    const firstName = customerMemory?.firstName || 'Guest';
    const phoneDigits = customerMemory?.phone || '';
    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    return createCouponRequest({
      customer: {
        firstName,
        maskedMobile: maskMobile(phoneDigits),
        formattedMobile: phoneDigits ? `+91${phoneDigits}` : '',
      },
      milestone: {
        completedVisits,
        level: 'REGULAR_GUEST',
        eligible: true,
        unlockedAt: timestamp,
      },
      orderReference: { orderId, invoiceId: invoiceNumber, tableId },
      couponOffer: {
        campaignId: loyaltyCouponConfig.id,
        discountType: loyaltyCouponConfig.discountType,
        discountValue: loyaltyCouponConfig.discountValue,
      },
      consent: {
        fulfilmentGranted: true,
        fulfilmentGrantedAt: timestamp,
        marketingGranted: false,
        marketingGrantedAt: null,
        consentVersion: 'WHATSAPP-COUPON-V1',
      },
    });
  };

  const handleOpenWhatsApp = () => {
    setIsOpeningWhatsApp(true);
    const currentRequest = createRequestIfNeeded();
    const message = buildCouponClaimMessage({
      firstName: currentRequest.customer?.firstName || 'Guest',
      discountValue:
        currentRequest.couponOffer?.discountValue ?? loyaltyCouponConfig.discountValue,
      milestoneVisits: loyaltyCouponConfig.milestoneVisits,
      invoiceNumber,
      orderNumber: orderId,
      requestId: currentRequest.requestId,
    });

    setTimeout(() => {
      try {
        openWhatsAppUrl(createWhatsAppUrl(message));
        markCouponWhatsAppOpened(currentRequest.requestId);
        showToast('WhatsApp opened with prepared coupon request', 'info');
      } catch {
        showToast('WhatsApp could not be opened. Please try again.', 'error');
      } finally {
        setIsOpeningWhatsApp(false);
      }
    }, 200);
  };

  const handleConfirmSent = () => {
    const currentRequest = createRequestIfNeeded();
    confirmCouponRequestSent(currentRequest.requestId);
    showToast('Request submitted for restaurant review!', 'success');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast('Coupon code copied to clipboard!', 'success');
  };

  const isConfirmedOrLater = CONFIRMED_STATUSES.includes(status);
  const isWhatsAppOpened = status === 'WHATSAPP_OPENED';
  const isDeclined = status === 'DECLINED';
  const isIssued = status === 'COUPON_ISSUED';
  const isReviewed = ['VERIFIED', 'COUPON_ISSUED'].includes(status);

  const supportingText = isIssued
    ? 'Saved to your WhatsApp. Use on your next visit.'
    : isDeclined
      ? request?.declineReason || 'Try sending the WhatsApp message again.'
      : isConfirmedOrLater
        ? 'Your request is recorded. We’ll update this screen after verification.'
        : isWhatsAppOpened
          ? 'Confirm to activate your coupon.'
          : 'Get your coupon on WhatsApp.';

  // Select rich restaurant food imagery for card background texture
  const cardBgImage = stockImages?.biryani?.url || stockImages?.traditionalBananaLeafMeal?.url;

  return (
    <>
      <section aria-labelledby="reward-card-title" className="w-full text-left">
        {/* ── Main Reward Card with Unblurred Visible Background Photo & Dark Espresso Gradient Overlay ── */}
        <div
          className="animate-fluid-gradient relative w-full overflow-hidden rounded-[28px] p-6 text-white shadow-2xl transition-all duration-300"
          style={{
            minHeight: '340px',
            background: isIssued
              ? 'linear-gradient(135deg, rgba(8, 40, 18, 0.94), rgba(21, 128, 61, 0.88), rgba(10, 50, 22, 0.95))'
              : isDeclined
                ? 'linear-gradient(135deg, rgba(40, 6, 6, 0.94), rgba(153, 27, 27, 0.88), rgba(30, 5, 5, 0.95))'
                : 'linear-gradient(145deg, rgba(12, 5, 3, 0.92) 0%, rgba(26, 10, 6, 0.88) 25%, rgba(59, 20, 10, 0.85) 55%, rgba(99, 33, 17, 0.82) 80%, rgba(15, 7, 4, 0.92) 100%)',
          }}
        >
          {/* Unblurred Crisp Background Food Photo */}
          {cardBgImage && (
            <img
              src={cardBgImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-50 mix-blend-overlay pointer-events-none scale-105 transition-opacity duration-300"
            />
          )}

          {/* Transparent Vignette Layer */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(12, 5, 3, 0.15) 0%, rgba(8, 3, 2, 0.78) 100%)',
            }}
          />

          {/* Fluid Ambient Glowing Spheres */}
          <div
            className="animate-fluid-blob-1 pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-50 blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(242, 176, 62, 0.35) 0%, rgba(217, 119, 6, 0.12) 70%, transparent 100%)',
            }}
          />
          <div
            className="animate-fluid-blob-2 pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full opacity-40 blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(135, 53, 31, 0.35) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Reward Visual Medallion */}
            <div className="relative mb-4 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/15 p-1 backdrop-blur-xs shadow-inner">
              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#FFF3E7] shadow-md">
                {isIssued ? (
                  <CheckCircle2 className="h-7 w-7 text-[#166534]" />
                ) : isDeclined ? (
                  <AlertCircle className="h-7 w-7 text-[#991B1B]" />
                ) : isConfirmedOrLater ? (
                  <Clock className="h-7 w-7 text-[#7D2E19]" />
                ) : (
                  <Gift className="h-7 w-7 text-[#7D2E19]" />
                )}
              </div>
            </div>

            {/* Reward Eyebrow */}
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-[#FFF3E7]/90 drop-shadow-xs">
              {isIssued ? 'REWARD ACTIVATED' : 'YOUR REWARD'}
            </p>

            {/* Primary Value */}
            <h2
              id="reward-card-title"
              className="mt-1 text-[48px] sm:text-[52px] font-extrabold leading-none tracking-tight text-white tabular-nums drop-shadow-md"
            >
              {offerLabel}
            </h2>

            {/* Reward Name */}
            <p className="mt-1.5 text-[16px] font-semibold text-white/95 drop-shadow-xs">
              {guestLabel} Coupon
            </p>

            {/* Supporting copy */}
            <p className="mt-2.5 max-w-[280px] text-[13px] leading-snug text-white/85 drop-shadow-xs">
              {supportingText}
            </p>

            {/* ── STATE A: READY / READY TO SEND ── */}
            {!isConfirmedOrLater && !isDeclined && !isWhatsAppOpened && (
              <div className="mt-6 w-full space-y-2.5" ref={mainCtaRef}>
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  disabled={isOpeningWhatsApp}
                  className="flex h-[56px] w-full items-center justify-center gap-2.5 rounded-[18px] bg-[#FFF8F1] px-4 text-[15.5px] font-bold text-[#6E2615] shadow-[0_10px_24px_rgba(0,0,0,0.4)] transition-all duration-150 hover:bg-white active:scale-[0.985] disabled:opacity-75 cursor-pointer"
                  aria-label={`Get ${discountValue} percent coupon on WhatsApp`}
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  <span>{isOpeningWhatsApp ? 'Opening WhatsApp…' : 'Get Coupon on WhatsApp'}</span>
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-white/80">
                  <Clock className="h-3.5 w-3.5 text-white/85" />
                  <span>Takes only a few seconds</span>
                </p>
              </div>
            )}

            {/* ── STATE C: RETURNED / NEEDS CONFIRMATION ── */}
            {isWhatsAppOpened && !isConfirmedOrLater && !isDeclined && (
              <div className="mt-5 w-full space-y-2.5" ref={mainCtaRef}>
                {/* Compact status bar under 34px */}
                <div className="mx-auto flex h-[28px] max-w-[240px] items-center justify-center gap-2 rounded-full bg-white/15 px-3 text-[11px] font-semibold text-white backdrop-blur-xs">
                  <span className="flex items-center gap-1 text-[#25D366]">● Sent</span>
                  <span className="text-white/40">—</span>
                  <span className="flex items-center gap-1 text-white/90">○ Confirm below</span>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmSent}
                  className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#FFF8F1] px-4 text-[15px] font-bold text-[#6E2615] shadow-[0_10px_24px_rgba(0,0,0,0.4)] transition-all duration-150 hover:bg-white active:scale-[0.985] cursor-pointer"
                  aria-label="Confirm that the WhatsApp message was sent"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#15803D]" />
                  <span>Yes, I Sent It</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[14px] bg-white/15 px-4 text-[13.5px] font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20 active:scale-[0.985] cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 h-4 text-white/90" />
                  <span>Open WhatsApp Again</span>
                </button>
              </div>
            )}

            {/* ── STATE D: RECORDED / AWAITING REVIEW ── */}
            {isConfirmedOrLater && !isIssued && (
              <div className="mt-5 w-full space-y-2.5">
                <div className="rounded-2xl bg-black/30 p-3 text-left backdrop-blur-xs border border-white/15 shadow-inner">
                  <div className="flex items-center justify-between text-[13px] font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#FFF3E7]" />
                      {isReviewed ? 'Request verified' : 'Awaiting review'}
                    </span>
                    <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10.5px]">In Progress</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="flex h-[48px] w-full items-center justify-center rounded-[16px] bg-[#FFF8F1] px-4 text-[14px] font-bold text-[#6E2615] shadow-md transition-all hover:bg-white active:scale-[0.985] cursor-pointer"
                >
                  View Request Status
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex h-[42px] w-full items-center justify-center gap-1.5 rounded-[12px] bg-black/25 text-[13px] font-semibold text-white transition-all hover:bg-black/35 cursor-pointer border border-white/10"
                >
                  <WhatsAppIcon className="h-4 h-4 text-white/90" />
                  <span>Open WhatsApp Again</span>
                </button>
              </div>
            )}

            {/* ── STATE E: ISSUED / SUCCESS ── */}
            {isIssued && request?.coupon && (
              <div className="mt-5 w-full space-y-2.5">
                <div className="rounded-2xl bg-white/15 p-3.5 text-left backdrop-blur-xs border border-white/15">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/90">Coupon Code</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-[20px] font-bold tracking-widest text-white">
                      {request.coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(request.coupon.code)}
                      className="flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-[12px] font-bold text-[#166534] shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5 text-[#166534]" />
                      Copy
                    </button>
                  </div>
                  {request.coupon.validUntil && (
                    <p className="mt-1.5 text-[11.5px] text-white/90">
                      Valid until {request.coupon.validUntil}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── STATE F: DECLINED ── */}
            {isDeclined && (
              <div className="mt-5 w-full space-y-2.5">
                <a
                  href={`tel:${restaurantConfig.contact.phone}`}
                  className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[16px] bg-white px-4 text-[14px] font-bold text-[#7F1D1D] shadow-md transition-all hover:bg-white/95 cursor-pointer"
                >
                  <Phone className="h-4.5 w-4.5 text-[#7F1D1D]" />
                  Contact Restaurant
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Collapsible Coupon Details ── */}
        <div className="mt-3.5 w-full rounded-2xl border border-[rgba(98,49,32,0.09)] bg-surface text-left">
          <button
            type="button"
            onClick={() => setIsDetailsExpanded((v) => !v)}
            aria-expanded={isDetailsExpanded}
            className="flex h-[48px] w-full items-center justify-between px-4 text-[13.5px] font-semibold text-on-surface hover:bg-surface-container-low/50 transition-colors cursor-pointer rounded-2xl"
          >
            <span className="flex items-center gap-2 text-on-surface">
              <Ticket className="h-[18px] w-[18px] text-[#7D2E19]" />
              <span>Coupon details</span>
            </span>
            {isDetailsExpanded ? (
              <ChevronUp className="h-[18px] w-[18px] text-on-surface-variant" />
            ) : (
              <ChevronDown className="h-[18px] w-[18px] text-on-surface-variant" />
            )}
          </button>

          {isDetailsExpanded && (
            <div className="border-t border-outline-variant/40 px-4 py-3 text-[12.5px] text-on-surface-variant space-y-2">
              <div className="flex justify-between items-center py-1">
                <span>Reward Type</span>
                <span className="font-semibold text-on-surface">{offerLabel} ({guestLabel})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-outline-variant/20">
                <span>Eligibility</span>
                <span className="font-semibold text-on-surface">{completedVisits} completed visits</span>
              </div>
              {request?.requestId && (
                <div className="flex justify-between items-center py-1 border-t border-outline-variant/20">
                  <span>Reference ID</span>
                  <span className="font-mono font-semibold text-on-surface text-[11.5px]">{request.requestId}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-t border-outline-variant/20">
                <span>Status</span>
                <span className="font-semibold text-primary">{humanizeValue(status, status)}</span>
              </div>
              {!isConfirmedOrLater && !isDeclined && (
                <div className="pt-2 border-t border-outline-variant/20 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsClaimOpen(true)}
                    className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Change number
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Unified Coupon Information Section ── */}
        <div className="mt-3.5 w-full rounded-2xl border border-[rgba(98,49,32,0.09)] bg-surface text-left overflow-hidden divide-y divide-[rgba(98,49,32,0.07)]">
          {/* Row 1: How it works */}
          <div>
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen((v) => !v)}
              aria-expanded={isHowItWorksOpen}
              className="flex h-[46px] w-full items-center justify-between px-4 text-[13px] font-semibold text-on-surface hover:bg-surface-container-low/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="h-[18px] w-[18px] text-[#7D2E19]" />
                <span>How it works</span>
              </span>
              {isHowItWorksOpen ? (
                <ChevronUp className="h-4 w-4 text-on-surface-variant" />
              ) : (
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              )}
            </button>
            {isHowItWorksOpen && (
              <div className="px-4 pb-3.5 pt-1 text-[12px] leading-relaxed text-on-surface-variant bg-surface-container-lowest">
                <p>1. Tap the primary WhatsApp button to open a pre-formatted message.</p>
                <p className="mt-1">2. Send the message to Amani's Kitchen official WhatsApp.</p>
                <p className="mt-1">3. Return here and tap "Yes, I Sent It" to activate your coupon.</p>
              </div>
            )}
          </div>

          {/* Row 2: Terms */}
          <button
            type="button"
            onClick={() => setIsConditionsOpen(true)}
            className="flex h-[46px] w-full items-center justify-between px-4 text-[13px] font-semibold text-on-surface hover:bg-surface-container-low/50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <FileText className="h-[18px] w-[18px] text-[#7D2E19]" />
              <span>Terms & conditions</span>
            </span>
            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
          </button>

          {/* Row 3: Privacy preferences */}
          {onOpenPrivacyControls && (
            <button
              type="button"
              onClick={onOpenPrivacyControls}
              className="flex h-[46px] w-full items-center justify-between px-4 text-[13px] font-semibold text-on-surface hover:bg-surface-container-low/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="h-[18px] w-[18px] text-[#7D2E19]" />
                <span>WhatsApp & privacy settings</span>
              </span>
              <ChevronRight className="h-4 w-4 text-on-surface-variant" />
            </button>
          )}
        </div>
      </section>

      {/* ── Sticky Action Dock (Visible when main CTA scrolls out of view) ── */}
      {!isCtaInView && !isConfirmedOrLater && !isDeclined && (
        <div className="fixed bottom-0 left-0 z-30 w-full border-t border-outline-variant/60 bg-[#FFFDFB]/95 p-3 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-[460px] items-center justify-between gap-3 px-1">
            <div>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Amani's Reward</p>
              <p className="text-[13.5px] font-extrabold text-on-surface">{offerLabel} Ready</p>
            </div>
            <button
              type="button"
              onClick={isWhatsAppOpened ? handleConfirmSent : handleOpenWhatsApp}
              className="flex h-[44px] items-center gap-2 rounded-xl bg-[#6E2615] px-4 text-[13.5px] font-bold text-white shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="h-4 h-4 text-[#25D366]" />
              <span>{isWhatsAppOpened ? 'Yes, I Sent It' : 'Get on WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals & Sheets preserved */}
      <CouponClaimBottomSheet
        isOpen={isClaimOpen}
        onClose={() => setIsClaimOpen(false)}
        invoiceNumber={invoiceNumber}
        orderNumber={orderId}
        tableId={tableId}
        existingRequest={request}
        onOpenPrivacyControls={() => {
          setIsClaimOpen(false);
          onOpenPrivacyControls?.();
        }}
        onOpenConditions={() => setIsConditionsOpen(true)}
      />

      <CouponConditionsSheet
        isOpen={isConditionsOpen}
        onClose={() => setIsConditionsOpen(false)}
      />

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Coupon Request Status"
        position="bottom"
      >
        <div className="space-y-4 text-left text-xs">
          <div className="space-y-2 rounded-xl bg-surface-container p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-primary">
              <span>Request reference</span>
              <span className="break-all font-mono text-xs">{request?.requestId}</span>
            </div>
            {request?.createdAt && (
              <p className="text-on-surface-variant">Submitted on {request.createdAt}</p>
            )}
            <p className="text-on-surface-variant">
              Current state: <span className="font-semibold text-primary">{humanizeValue(status, status)}</span>
            </p>
          </div>

          {request?.auditHistory?.length > 0 && (
            <div className="space-y-2">
              <p className="font-semibold text-on-surface">Activity</p>
              <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                {request.auditHistory.map((item, index) => (
                  <div key={`${item.time}-${index}`} className="rounded-lg bg-surface-container-low p-2 text-[11px]">
                    <span className="font-semibold text-primary">{item.time}:</span>{' '}
                    <span className="text-on-surface-variant">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsStatusModalOpen(false)}
            className="min-h-11 w-full rounded-xl bg-primary px-4 font-semibold text-on-primary cursor-pointer"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MilestoneCouponCard;
