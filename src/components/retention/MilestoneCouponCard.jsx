import React, { useState, useEffect } from 'react';
import {
  Award,
  MessageCircle,
  CheckCircle2,
  Clock,
  Info,
  Copy,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { restaurantConfig } from '../../config/restaurantConfig';
import { loyaltyCouponConfig } from '../../config/loyaltyCouponConfig';
import { deriveInvoiceNumber } from '../../utils/formatters';
import { buildCouponClaimMessage, createWhatsAppUrl, openWhatsAppUrl, maskMobile } from '../../utils/whatsapp';
import CouponClaimBottomSheet from './CouponClaimBottomSheet';
import CouponConditionsSheet from './CouponConditionsSheet';
import Modal from '../common/Modal';

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

  const orderId = activeOrder?.orderId || 'ORD-1048';
  const invoiceNumber = deriveInvoiceNumber(activeOrder);
  const tableId = `TABLE-${tableNumber}`;

  const request = getCouponRequestForOrder(orderId);
  const completedVisits = customerMembership?.completedVisits || 1;
  const isEligible = completedVisits >= loyaltyCouponConfig.milestoneVisits;

  // Derive request status: default to ELIGIBLE if eligible and no request yet
  const status = request?.status || (isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE');
  const discountValue = request?.couponOffer?.discountValue || loyaltyCouponConfig.discountValue;

  // Handle building and opening WhatsApp deep-link
  const handleOpenWhatsApp = () => {
    let currentRequest = request;
    let targetUrl = null;

    if (!currentRequest) {
      // Auto-create request for customer if not created yet
      const firstName = customerMemory?.firstName || 'Guest';
      const phoneDigits = customerMemory?.phone || '9876543210';
      const nowLabel = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

      currentRequest = createCouponRequest({
        customer: {
          firstName,
          maskedMobile: maskMobile(phoneDigits),
          formattedMobile: `+91${phoneDigits}`,
        },
        milestone: {
          completedVisits,
          level: 'REGULAR_GUEST',
          eligible: true,
          unlockedAt: nowLabel,
        },
        orderReference: { orderId, invoiceId: invoiceNumber, tableId },
        couponOffer: {
          campaignId: loyaltyCouponConfig.id,
          discountType: loyaltyCouponConfig.discountType,
          discountValue: loyaltyCouponConfig.discountValue,
        },
        consent: {
          fulfilmentGranted: true,
          fulfilmentGrantedAt: nowLabel,
          marketingGranted: false,
          marketingGrantedAt: null,
          consentVersion: 'WHATSAPP-COUPON-V1',
        },
      });
    }

    const message = buildCouponClaimMessage({
      firstName: currentRequest.customer?.firstName || 'Guest',
      discountValue: currentRequest.couponOffer?.discountValue || loyaltyCouponConfig.discountValue,
      milestoneVisits: loyaltyCouponConfig.milestoneVisits,
      invoiceNumber,
      orderNumber: orderId,
      requestId: currentRequest.requestId,
    });
    targetUrl = createWhatsAppUrl(message);

    openWhatsAppUrl(targetUrl);
    markCouponWhatsAppOpened(currentRequest.requestId);
    showToast('WhatsApp opened with prepared coupon request', 'info');
  };

  // Handle primary completion action "I've Sent the Message"
  const handleConfirmSent = () => {
    let reqId = request?.requestId;
    if (!reqId) {
      // Auto create if not exist
      const firstName = customerMemory?.firstName || 'Guest';
      const phoneDigits = customerMemory?.phone || '9876543210';
      const nowLabel = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

      const newReq = createCouponRequest({
        customer: {
          firstName,
          maskedMobile: maskMobile(phoneDigits),
          formattedMobile: `+91${phoneDigits}`,
        },
        milestone: {
          completedVisits,
          level: 'REGULAR_GUEST',
          eligible: true,
          unlockedAt: nowLabel,
        },
        orderReference: { orderId, invoiceId: invoiceNumber, tableId },
        couponOffer: {
          campaignId: loyaltyCouponConfig.id,
          discountType: loyaltyCouponConfig.discountType,
          discountValue: loyaltyCouponConfig.discountValue,
        },
        consent: {
          fulfilmentGranted: true,
          fulfilmentGrantedAt: nowLabel,
          marketingGranted: false,
          marketingGrantedAt: null,
          consentVersion: 'WHATSAPP-COUPON-V1',
        },
      });
      reqId = newReq.requestId;
    }

    confirmCouponRequestSent(reqId);
    showToast('Request submitted for restaurant review!', 'success');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast('Coupon code copied to clipboard!', 'success');
  };

  if (!isEligible && !request) {
    return null;
  }

  // Calculate current active step (1: Prepared, 2: WhatsApp Message, 3: Restaurant Review)
  const isConfirmedOrLater = ['CUSTOMER_CONFIRMED_SENT', 'AWAITING_RESTAURANT_REVIEW', 'VERIFIED', 'COUPON_ISSUED'].includes(status);
  const isMessagePrepared = ['FORM_STARTED', 'WHATSAPP_OPENED'].includes(status) || status === 'ELIGIBLE' || isConfirmedOrLater;
  const isSent = isConfirmedOrLater;
  const isReviewed = ['VERIFIED', 'COUPON_ISSUED'].includes(status);

  let activeStep = 2; // Default to step 2 (Customer sends message)
  if (isConfirmedOrLater) {
    activeStep = 3; // Step 3: Restaurant review
  } else if (!request) {
    activeStep = 1;
  }

  return (
    <>
      <section
        aria-label="Coupon Request Progress"
        className="w-full p-4 bg-white rounded-2xl border border-[#EADFD6] shadow-sm space-y-4 text-left"
      >
        {/* Card Header & Milestone Context */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBECEF] flex items-center justify-center text-[#A30F3B] shrink-0 mt-0.5">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FBECEF] text-[#A30F3B] text-[11px] font-bold tracking-tight">
                Regular Guest · {discountValue}% OFF Coupon
              </span>
              {request?.requestId && (
                <span className="px-2 py-0.5 rounded-md bg-[#FFF8F1] border border-[#EADFD6] text-[#6E5F58] font-mono text-[11px] font-semibold">
                  Request {request.requestId}
                </span>
              )}
            </div>

            {isConfirmedOrLater ? (
              <>
                <h2 className="text-[19px] font-bold text-[#211917] leading-tight">
                  {status === 'COUPON_ISSUED'
                    ? `Your ${request.coupon.discountValue}% OFF Coupon Is Ready`
                    : 'Request Sent for Review'}
                </h2>
                <p className="text-[13px] text-[#6E5F58] mt-1 leading-snug">
                  {status === 'COUPON_ISSUED'
                    ? 'Show this code on your next visit to redeem.'
                    : 'Your WhatsApp coupon request is now awaiting restaurant review.'}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-[19px] font-bold text-[#211917] leading-tight">
                  Complete Your Coupon Request
                </h2>
                <p className="text-[13px] text-[#6E5F58] mt-1 leading-snug">
                  Send the prepared WhatsApp message, then confirm below.
                </p>
              </>
            )}
          </div>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="w-full pt-1 pb-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[#A30F3B] uppercase tracking-wider mb-2">
            <span>Progress Status</span>
            <span>Step {activeStep} of 3</span>
          </div>

          <ol className="relative flex items-center justify-between w-full">
            {/* Connecting line */}
            <div className="absolute top-3 left-6 right-6 h-0.5 bg-[#EADFD6] z-0" />
            <div
              className="absolute top-3 left-6 h-0.5 bg-[#138A5B] z-0 transition-all duration-300"
              style={{
                width: isConfirmedOrLater ? 'calc(100% - 48px)' : 'calc(50% - 24px)',
              }}
            />

            {/* Step 1: Details Prepared */}
            <li
              className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-1.5 cursor-default"
              aria-current={activeStep === 1 ? 'step' : undefined}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isMessagePrepared
                    ? 'bg-[#138A5B] text-white shadow-xs'
                    : 'bg-[#A30F3B] text-white ring-4 ring-[#FBECEF]'
                }`}
              >
                ✓
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight ${
                  isMessagePrepared ? 'text-[#138A5B]' : 'text-[#A30F3B]'
                }`}
              >
                Prepared
              </span>
            </li>

            {/* Step 2: Customer Sends WhatsApp */}
            <li
              className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-1.5 cursor-default"
              aria-current={activeStep === 2 ? 'step' : undefined}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isSent
                    ? 'bg-[#138A5B] text-white shadow-xs'
                    : activeStep === 2
                    ? 'bg-[#A30F3B] text-white ring-4 ring-[#FBECEF]'
                    : 'bg-white border-2 border-[#93847D] text-[#93847D]'
                }`}
              >
                {isSent ? '✓' : '●'}
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight ${
                  isSent
                    ? 'text-[#138A5B]'
                    : activeStep === 2
                    ? 'text-[#A30F3B] font-bold'
                    : 'text-[#93847D]'
                }`}
              >
                WhatsApp
              </span>
            </li>

            {/* Step 3: Restaurant Review */}
            <li
              className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-1.5 cursor-default"
              aria-current={activeStep === 3 ? 'step' : undefined}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isReviewed
                    ? 'bg-[#138A5B] text-white shadow-xs'
                    : activeStep === 3
                    ? 'bg-[#A30F3B] text-white ring-4 ring-[#FBECEF]'
                    : 'bg-white border-2 border-[#93847D] text-[#93847D]'
                }`}
              >
                {isReviewed ? '✓' : '○'}
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight ${
                  isReviewed
                    ? 'text-[#138A5B]'
                    : activeStep === 3
                    ? 'text-[#A30F3B] font-bold'
                    : 'text-[#93847D]'
                }`}
              >
                Review
              </span>
            </li>
          </ol>
        </div>

        {/* Current-Step Message Surface */}
        {!isConfirmedOrLater && (
          <div className="p-3 rounded-xl bg-[#EAFBF0] border border-[#25D366]/30 flex items-start gap-2.5 text-xs text-[#211917]">
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-[#128C7E] text-[13px]">
                {status === 'WHATSAPP_OPENED' ? 'WhatsApp opened' : 'WhatsApp is ready'}
              </p>
              <p className="text-[#6E5F58] text-[12px] leading-relaxed">
                {status === 'WHATSAPP_OPENED'
                  ? 'Complete the message in WhatsApp, then return here.'
                  : 'Send the prepared message to Mangamma Ruchulu, then return here and confirm that it was sent.'}
              </p>
            </div>
          </div>
        )}

        {/* Action Priority Area (Pre-Confirmation) */}
        {!isConfirmedOrLater && (
          <div className="space-y-2.5 pt-1">
            {/* Primary Completion Action */}
            <button
              onClick={handleConfirmSent}
              aria-label="Confirm that you sent the WhatsApp message"
              className="w-full h-[52px] min-h-[44px] rounded-xl bg-[#A30F3B] hover:bg-[#7E0D2F] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] focus-visible:ring-offset-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              I’ve Sent the Message
            </button>

            {/* Secondary WhatsApp Action */}
            <button
              onClick={handleOpenWhatsApp}
              aria-label="Open WhatsApp again to send the message"
              className="w-full h-[48px] min-h-[44px] rounded-xl bg-white border-2 border-[#25D366] text-[#128C7E] hover:bg-[#EAFBF0] font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <MessageCircle className="w-4.5 h-4.5 text-[#25D366]" />
              Open WhatsApp Again
            </button>

            <button
              onClick={() => setIsClaimOpen(true)}
              className="w-full text-center py-1 text-xs font-semibold text-[#A30F3B] hover:underline"
            >
              Edit request details or preferences
            </button>
          </div>
        )}

        {/* Confirmed / Awaiting Review State Card & Actions */}
        {isConfirmedOrLater && status !== 'COUPON_ISSUED' && status !== 'DECLINED' && (
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[#FFF8F1] border border-[#EADFD6] space-y-1 text-xs text-[#211917]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A30F3B] text-[13px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Status: Awaiting Restaurant Review
                </span>
              </div>
              <p className="text-[#6E5F58] text-[12px] leading-relaxed pt-0.5">
                Your WhatsApp request has been recorded. Mangamma Ruchulu staff will verify your visit and issue your coupon code.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="w-full h-11 rounded-xl bg-[#A30F3B] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#7E0D2F] transition-colors cursor-pointer"
              >
                View Request Status
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="text-center py-1 text-xs font-semibold text-[#128C7E] hover:underline flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                Open WhatsApp Again
              </button>
            </div>
          </div>
        )}

        {/* Coupon Issued Display */}
        {status === 'COUPON_ISSUED' && (
          <div className="p-3.5 bg-[#FBECEF] rounded-xl border border-[#A30F3B]/20 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#A30F3B] uppercase font-bold tracking-wide">Issued Coupon Code</p>
                <p className="font-mono font-bold text-[#A30F3B] text-lg">{request.coupon.code}</p>
              </div>
              <button
                onClick={() => handleCopyCode(request.coupon.code)}
                className="px-3 py-1.5 bg-[#A30F3B] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#7E0D2F] transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </button>
            </div>
            <p className="text-[11px] text-[#6E5F58]">Valid until: {request.coupon.validUntil || '30 days'}</p>
          </div>
        )}

        {/* Declined Display */}
        {status === 'DECLINED' && (
          <div className="space-y-2">
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900">
              <p className="font-bold">Request Declined</p>
              <p className="mt-0.5 text-red-700">{request.declineReason || 'Please speak with restaurant staff.'}</p>
            </div>
            <a
              href={`tel:${restaurantConfig.contact.phone}`}
              className="w-full h-11 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 border border-outline-variant/40 hover:bg-surface-container-highest transition-colors"
            >
              <Phone className="w-4 h-4" />
              Contact Restaurant
            </a>
          </div>
        )}

        {/* "What Happens Next?" Expandable Accordion */}
        <div className="border-t border-[#F0E7E0] pt-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#A30F3B] hover:underline cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#A30F3B]" />
              What happens next?
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isExpanded && (
            <div className="mt-2.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EADFD6] space-y-1.5 text-xs text-[#6E5F58]">
              <p className="leading-relaxed">
                Mangamma Ruchulu will review your completed-visit milestone and WhatsApp request.
              </p>
              <p className="leading-relaxed">
                After verification, your coupon status will be updated here. You do not need to submit the request again.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-[#93847D] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#93847D]" />
                Typical review: During restaurant operating hours
              </div>
            </div>
          )}
        </div>

        {/* Coupon Conditions Link */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <button
            onClick={() => setIsConditionsOpen(true)}
            className="text-[#A30F3B] font-semibold text-xs hover:underline flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            View coupon conditions
          </button>

          {onOpenPrivacyControls && (
            <button
              onClick={onOpenPrivacyControls}
              className="text-[#6E5F58] hover:text-[#A30F3B] font-semibold text-xs flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy Controls
            </button>
          )}
        </div>
      </section>

      {/* Claim / Edit Bottom Sheet */}
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

      <CouponConditionsSheet isOpen={isConditionsOpen} onClose={() => setIsConditionsOpen(false)} />

      {/* Status Details Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Coupon Request Status"
        position="bottom"
      >
        <div className="space-y-4 text-left text-xs">
          <div className="p-3.5 bg-[#FFF8F1] rounded-xl border border-[#EADFD6] space-y-2">
            <div className="flex items-center justify-between font-bold text-sm text-[#A30F3B]">
              <span>Request Reference</span>
              <span className="font-mono text-xs">{request?.requestId || 'CPN-REQ-2048'}</span>
            </div>
            <p className="text-[#6E5F58]">
              Submitted on: {request?.createdAt || new Date().toLocaleString('en-IN')}
            </p>
            <p className="text-[#6E5F58]">
              Current state: <span className="font-bold text-[#A30F3B]">Awaiting Restaurant Review</span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-[#211917]">Audit Activity</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {(request?.auditHistory || [
                { time: 'Just now', text: 'Customer confirmed message sent on WhatsApp' },
                { time: '2 mins ago', text: 'Customer opened WhatsApp with prepared message' },
              ]).map((item, idx) => (
                <div key={idx} className="p-2 bg-surface-container-low rounded-lg text-[11px]">
                  <span className="font-bold text-[#A30F3B]">{item.time}:</span>{' '}
                  <span className="text-[#6E5F58]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsStatusModalOpen(false)}
            className="w-full h-11 rounded-xl bg-[#A30F3B] text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MilestoneCouponCard;

