import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Copy,
  HelpCircle,
  Info,
  MessageCircle,
  Phone,
  ShieldCheck,
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

const CouponProgress = ({ activeStep, currentStepTitle }) => (
  <div
    className="space-y-2"
    role="group"
    aria-label={`Coupon request progress: step ${activeStep} of 3, ${currentStepTitle}`}
  >
    <div className="flex items-baseline justify-between gap-4">
      <p className="min-w-0 text-[15px] font-semibold leading-5 text-on-surface">
        {currentStepTitle}
      </p>
      <p className="shrink-0 text-[12px] font-medium text-on-surface-variant">
        Step {activeStep} of 3
      </p>
    </div>
    <div
      className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high"
      role="progressbar"
      aria-valuemin="1"
      aria-valuemax="3"
      aria-valuenow={activeStep}
      aria-valuetext={`Step ${activeStep} of 3`}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
        style={{ width: `${(activeStep / 3) * 100}%` }}
      />
    </div>
    <p className="text-[12px] leading-4 text-on-surface-variant" aria-hidden="true">
      <span className={activeStep === 1 ? 'font-semibold text-primary' : undefined}>Prepared</span>
      <span className="px-1.5">·</span>
      <span className={activeStep === 2 ? 'font-semibold text-primary' : undefined}>WhatsApp</span>
      <span className="px-1.5">·</span>
      <span className={activeStep === 3 ? 'font-semibold text-primary' : undefined}>Review</span>
    </p>
  </div>
);

const CurrentStepPanel = ({ opened }) => (
  <div className="flex items-start gap-3 rounded-xl bg-secondary-container px-3.5 py-3 text-left">
    <MessageCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-whatsapp-action" aria-hidden="true" />
    <div className="min-w-0">
      <p className="text-[14px] font-semibold leading-5 text-on-surface">
        {opened ? 'Return here after sending' : 'WhatsApp message ready'}
      </p>
      <p className="mt-0.5 text-[13px] leading-5 text-on-surface-variant">
        {opened
          ? 'Send the prepared message in WhatsApp, then confirm it below.'
          : 'The prepared coupon request is ready to send.'}
      </p>
    </div>
  </div>
);

const CouponRequestSummary = ({
  guestLabel,
  offerLabel,
  requestId,
  canEdit,
  onEdit,
}) => (
  <div className="flex min-w-0 items-center justify-between gap-4 border-t border-outline-variant pt-4">
    <div className="min-w-0">
      <p className="text-[12px] font-medium leading-4 text-on-surface-variant">Coupon request</p>
      <p className="mt-0.5 break-words text-[14px] font-semibold leading-5 text-on-surface">
        {guestLabel} · {offerLabel}
      </p>
      {requestId && (
        <p className="mt-0.5 break-all font-mono text-[11px] leading-4 text-on-surface-variant">
          {requestId}
        </p>
      )}
    </div>
    {canEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="min-h-11 shrink-0 rounded-lg px-3 text-[13px] font-semibold text-primary transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Edit coupon request details or preferences"
      >
        Edit
      </button>
    )}
  </div>
);

const WhatsAppPrimaryAction = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-whatsapp-action px-4 text-[15px] font-semibold text-white transition-[filter,transform] duration-150 hover:brightness-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-action focus-visible:ring-offset-2"
    aria-label="Open WhatsApp to send the prepared coupon request"
  >
    <MessageCircle className="h-5 w-5" aria-hidden="true" />
    Open WhatsApp
  </button>
);

const MessageConfirmationAction = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-4 text-[15px] font-semibold text-on-primary transition-[filter,transform] duration-150 hover:brightness-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    aria-label="Confirm that the prepared WhatsApp message was sent"
  >
    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
    I sent the message
  </button>
);

const WhatsAppSecondaryAction = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-semibold text-whatsapp-action transition-colors hover:bg-secondary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-action focus-visible:ring-offset-2"
    aria-label="Open WhatsApp again to send the prepared coupon request"
  >
    <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
    Open WhatsApp again
  </button>
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const orderId = activeOrder?.orderId;
  const invoiceNumber = activeOrder ? deriveInvoiceNumber(activeOrder) : null;
  const tableId = tableNumber ? `TABLE-${tableNumber}` : null;
  const request = orderId ? getCouponRequestForOrder(orderId) : null;
  const completedVisits = customerMembership?.completedVisits || 0;
  const isEligible = completedVisits >= loyaltyCouponConfig.milestoneVisits;

  if ((!isEligible && !request) || !orderId || !invoiceNumber) {
    return null;
  }

  const status = request?.status || 'ELIGIBLE';
  const discountType = request?.couponOffer?.discountType || loyaltyCouponConfig.discountType;
  const discountValue = request?.couponOffer?.discountValue ?? loyaltyCouponConfig.discountValue;
  const guestLabel = humanizeValue(request?.milestone?.level, 'Regular guest');
  const offerLabel =
    discountType === 'FLAT'
      ? `${formatMenuPrice(discountValue)} off`
      : `${discountValue}% off`;

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

    try {
      openWhatsAppUrl(createWhatsAppUrl(message));
      markCouponWhatsAppOpened(currentRequest.requestId);
      showToast('WhatsApp opened with prepared coupon request', 'info');
    } catch {
      showToast('WhatsApp could not be opened. Please try again.', 'error');
    }
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

  const activeStep = isConfirmedOrLater || isDeclined ? 3 : 2;
  const currentStepTitle =
    activeStep === 3
      ? (isReviewed || isDeclined ? 'Review complete' : 'Restaurant review')
      : 'Send through WhatsApp';
  const heading = isIssued
    ? `Your ${offerLabel} coupon is ready`
    : isDeclined
      ? 'Coupon request update'
      : isConfirmedOrLater
        ? 'Request sent for review'
        : 'Complete your coupon request';
  const supportingText = isIssued
    ? 'Use this coupon on your next eligible visit.'
    : isDeclined
      ? 'The restaurant could not approve this request.'
      : isConfirmedOrLater
        ? 'Your request is recorded. The restaurant will review it next.'
        : 'Send the prepared WhatsApp message, then return here to confirm.';

  return (
    <>
      <section aria-labelledby="coupon-task-title" className="w-full text-left">
        <p className="text-[12px] font-semibold leading-4 text-primary">{offerLabel} coupon</p>
        <h2
          id="coupon-task-title"
          className="mt-1.5 text-[24px] font-semibold leading-[1.25] tracking-[-0.02em] text-on-surface"
        >
          {heading}
        </h2>
        <p className="mt-2 max-w-[34rem] text-[15px] leading-[1.5] text-on-surface-variant">
          {supportingText}
        </p>

        <div className="mt-5">
          <CouponProgress activeStep={activeStep} currentStepTitle={currentStepTitle} />
        </div>

        {!isConfirmedOrLater && !isDeclined && (
          <div className="mt-4">
            <CurrentStepPanel opened={isWhatsAppOpened} />
          </div>
        )}

        {!isConfirmedOrLater && !isDeclined && (
          <div className="mt-5 space-y-2">
            {isWhatsAppOpened ? (
              <>
                <MessageConfirmationAction onClick={handleConfirmSent} />
                <WhatsAppSecondaryAction onClick={handleOpenWhatsApp} />
              </>
            ) : (
              <WhatsAppPrimaryAction onClick={handleOpenWhatsApp} />
            )}
          </div>
        )}

        {isConfirmedOrLater && !isIssued && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-surface-container-low px-3.5 py-3" role="status">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-on-surface">
                <Clock3 className="h-[18px] w-[18px] text-primary" aria-hidden="true" />
                {isReviewed ? 'Request verified' : 'Awaiting restaurant review'}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-on-surface-variant">
                {isReviewed
                  ? 'Your visit has been verified. Your coupon will be issued next.'
                  : 'Your WhatsApp request is recorded. We’ll update this screen after verification.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className="flex min-h-[50px] w-full items-center justify-center rounded-[14px] bg-primary px-4 text-[15px] font-semibold text-on-primary transition-[filter,transform] duration-150 hover:brightness-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              View request status
            </button>
            <WhatsAppSecondaryAction onClick={handleOpenWhatsApp} />
          </div>
        )}

        {isIssued && request?.coupon && (
          <div className="mt-4 rounded-xl bg-primary-container px-4 py-3.5" role="status">
            <p className="text-[12px] font-medium text-on-primary-container">Coupon code</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <p className="break-all font-mono text-[20px] font-semibold text-on-primary-container">
                {request.coupon.code}
              </p>
              <button
                type="button"
                onClick={() => handleCopyCode(request.coupon.code)}
                className="flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-[13px] font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Copy coupon code ${request.coupon.code}`}
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy
              </button>
            </div>
            {request.coupon.validUntil && (
              <p className="mt-1 text-[12px] text-on-primary-container">
                Valid until {request.coupon.validUntil}
              </p>
            )}
          </div>
        )}

        {isDeclined && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-error-container px-3.5 py-3" role="alert">
              <p className="text-[14px] font-semibold text-on-error-container">Request declined</p>
              <p className="mt-1 text-[13px] leading-5 text-on-error-container">
                {request?.declineReason || 'Please speak with restaurant staff.'}
              </p>
            </div>
            <a
              href={`tel:${restaurantConfig.contact.phone}`}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-4 text-[15px] font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Contact restaurant
            </a>
          </div>
        )}

        <div className="mt-5">
          <CouponRequestSummary
            guestLabel={guestLabel}
            offerLabel={offerLabel}
            requestId={request?.requestId}
            canEdit={!isConfirmedOrLater && !isDeclined}
            onEdit={() => setIsClaimOpen(true)}
          />
        </div>

        <div className="mt-4 border-t border-outline-variant pt-1">
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            aria-expanded={isExpanded}
            className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-[13px] font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              What happens next?
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          {isExpanded && (
            <div className="pb-3 text-[13px] leading-5 text-on-surface-variant">
              <p>Mangamma Ruchulu will review the completed-visit milestone and WhatsApp request.</p>
              <p className="mt-1.5">
                After verification, the coupon status updates here. You do not need to submit again.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 border-t border-outline-variant pt-2 text-[12px]">
          <button
            type="button"
            onClick={() => setIsConditionsOpen(true)}
            className="flex min-h-11 items-center gap-1.5 font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
            Coupon conditions
          </button>
          {onOpenPrivacyControls && (
            <button
              type="button"
              onClick={onOpenPrivacyControls}
              className="flex min-h-11 items-center gap-1.5 font-semibold text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Privacy controls
            </button>
          )}
        </div>
      </section>

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
            className="min-h-11 w-full rounded-xl bg-primary px-4 font-semibold text-on-primary"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MilestoneCouponCard;
