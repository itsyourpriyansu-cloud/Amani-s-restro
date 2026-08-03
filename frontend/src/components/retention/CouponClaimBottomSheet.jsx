import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import PhoneNumberField from '../common/PhoneNumberField';
import { useOrder } from '../../context/OrderContext';
import { loyaltyCouponConfig } from '../../config/loyaltyCouponConfig';
import { parseIndianMobile, maskMobile, buildCouponClaimMessage, createWhatsAppUrl, openWhatsAppUrl } from '../../utils/whatsapp';
import { validateFirstName } from '../../utils/guestFieldValidation';
import { MessageCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

const CouponClaimBottomSheet = ({
  isOpen,
  onClose,
  invoiceNumber,
  orderNumber,
  tableId,
  existingRequest,
  onOpenPrivacyControls,
  onOpenConditions,
}) => {
  const {
    customerMembership,
    createCouponRequest,
    markCouponWhatsAppOpened,
    confirmCouponRequestSent,
    cancelCouponRequest,
  } = useOrder();

  const startsMidFlow = existingRequest && ['FORM_STARTED', 'WHATSAPP_OPENED'].includes(existingRequest.status);

  const [step, setStep] = useState(startsMidFlow ? 'WHATSAPP_OPENED' : 'FORM');
  const [requestId, setRequestId] = useState(existingRequest?.requestId || null);
  const [firstName, setFirstName] = useState(existingRequest?.customer?.firstName || '');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [fulfilmentConsent, setFulfilmentConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showInfoDetail, setShowInfoDetail] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep(startsMidFlow ? 'WHATSAPP_OPENED' : 'FORM');
      setRequestId(existingRequest?.requestId || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const phoneResult = parseIndianMobile(phoneDigits);
  const nameCheck = validateFirstName(firstName);
  const canSubmit = !nameCheck && phoneResult.isValid && fulfilmentConsent;

  const handleSubmit = () => {
    const nameErr = validateFirstName(firstName);
    const phoneErr = phoneResult.isValid ? '' : 'Enter your 10-digit WhatsApp number';
    setNameError(nameErr);
    setPhoneError(phoneErr);
    if (nameErr || phoneErr || !fulfilmentConsent) return;

    const trimmedName = firstName.trim();
    const nowLabel = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const request = createCouponRequest({
      customer: {
        firstName: trimmedName,
        maskedMobile: maskMobile(phoneResult.digits10),
        formattedMobile: phoneResult.e164,
      },
      milestone: {
        completedVisits: customerMembership?.completedVisits || loyaltyCouponConfig.milestoneVisits,
        level: 'REGULAR_GUEST',
        eligible: true,
        unlockedAt: nowLabel,
      },
      orderReference: { orderId: orderNumber, invoiceId: invoiceNumber, tableId },
      couponOffer: {
        campaignId: loyaltyCouponConfig.id,
        discountType: loyaltyCouponConfig.discountType,
        discountValue: loyaltyCouponConfig.discountValue,
      },
      consent: {
        fulfilmentGranted: true,
        fulfilmentGrantedAt: nowLabel,
        marketingGranted: marketingConsent,
        marketingGrantedAt: marketingConsent ? nowLabel : null,
        consentVersion: 'WHATSAPP-COUPON-V1',
      },
    });

    const message = buildCouponClaimMessage({
      firstName: trimmedName,
      discountValue: loyaltyCouponConfig.discountValue,
      milestoneVisits: loyaltyCouponConfig.milestoneVisits,
      invoiceNumber,
      orderNumber,
      requestId: request.requestId,
    });
    const url = createWhatsAppUrl(message);

    openWhatsAppUrl(url);
    markCouponWhatsAppOpened(request.requestId);
    setRequestId(request.requestId);
    setLastWhatsAppUrl(url);
    setStep('WHATSAPP_OPENED');
  };

  const handleOpenAgain = () => {
    if (lastWhatsAppUrl) {
      openWhatsAppUrl(lastWhatsAppUrl);
    }
  };

  const handleConfirmSent = () => {
    if (requestId) confirmCouponRequestSent(requestId);
    setStep('CONFIRMED');
  };

  const handleCancelRequest = () => {
    if (requestId) cancelCouponRequest(requestId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 'FORM'
          ? `Claim Your ${loyaltyCouponConfig.discountValue}% OFF Regular Guest Coupon`
          : step === 'WHATSAPP_OPENED'
          ? 'Complete Your WhatsApp Request'
          : 'Coupon Request Recorded'
      }
      position="bottom"
    >
      <div aria-live="polite" className="space-y-4 text-left">
        {step === 'FORM' && (
          <>
            <p className="text-xs text-on-surface-variant">
              Enter your name and WhatsApp number below. We'll prepare a message for you to send to Amani's Kitchen.
            </p>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs text-on-surface">
              <span className="font-bold">{customerMembership?.completedVisits || loyaltyCouponConfig.milestoneVisits} completed visits</span> · Regular Guest milestone unlocked ·{' '}
              <span className="font-bold text-primary">{loyaltyCouponConfig.discountValue}% OFF</span> eligible
            </div>

            <div className="space-y-1">
              <label htmlFor="coupon-first-name" className="font-bold text-on-surface text-xs block">
                First name
              </label>
              <input
                id="coupon-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'coupon-first-name-error' : undefined}
                className={`w-full p-2.5 rounded-xl border bg-surface text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                  nameError ? 'border-error' : 'border-outline-variant'
                }`}
              />
              {nameError && (
                <p id="coupon-first-name-error" className="text-[11px] text-error font-semibold" role="alert">
                  {nameError}
                </p>
              )}
            </div>

            <PhoneNumberField
              id="coupon-whatsapp-number"
              value={phoneDigits}
              onChange={setPhoneDigits}
              error={phoneError}
            />

            {/* Required coupon-fulfilment consent */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={fulfilmentConsent}
                onChange={(e) => setFulfilmentConsent(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary shrink-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-on-surface">
                  I agree to share my first name, WhatsApp number, invoice reference, and milestone eligibility with Amani's Kitchen to process this coupon request.
                </span>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  This information will be used to review and fulfil this coupon request.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowInfoDetail((v) => !v);
                  }}
                  className="text-primary font-semibold text-[11px] mt-1 flex items-center gap-1 hover:underline"
                >
                  How we use this information
                  {showInfoDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showInfoDetail && (
                  <ul className="mt-1.5 space-y-1 text-[11px] text-on-surface-variant list-disc pl-4">
                    <li>Name helps restaurant staff identify the request</li>
                    <li>WhatsApp number allows communication about this coupon</li>
                    <li>Invoice reference confirms the completed visit</li>
                    <li>Milestone status confirms coupon eligibility</li>
                    <li>This consent applies to coupon fulfilment</li>
                    <li>It does not automatically subscribe you to promotional messages</li>
                  </ul>
                )}
              </div>
            </label>

            {/* Optional marketing consent */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary shrink-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-on-surface">
                  Send me occasional Amani's Kitchen offers and food-event updates on WhatsApp.
                </span>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Optional. You can claim the coupon without agreeing to promotional messages.
                </p>
              </div>
            </label>

            {/* Privacy summary */}
            <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 text-[11px] text-on-surface-variant flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <div>
                Your details are used only according to the choices above. You can request removal or update your communication preferences later.
                {onOpenPrivacyControls && (
                  <button
                    type="button"
                    onClick={onOpenPrivacyControls}
                    className="text-primary font-bold ml-1 hover:underline"
                  >
                    Privacy Controls
                  </button>
                )}
              </div>
            </div>

            {onOpenConditions && (
              <button
                type="button"
                onClick={onOpenConditions}
                className="text-primary font-semibold text-xs hover:underline"
              >
                View coupon conditions
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              aria-label="Send coupon request on WhatsApp"
              className="w-full h-13 min-h-[50px] rounded-2xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 shadow disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] transition-opacity"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              Send Request on WhatsApp
            </button>
            <p className="text-[11px] text-on-surface-variant text-center">
              Your coupon request will open in WhatsApp. Send the prepared message to complete your request.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-on-surface-variant font-semibold text-xs"
            >
              Cancel
            </button>
          </>
        )}

        {step === 'WHATSAPP_OPENED' && (
          <>
            <div className="p-4 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/30 space-y-1.5 text-xs text-on-surface">
              <div className="flex items-center gap-2 font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp Opened
              </div>
              <p className="text-on-surface-variant">
                Send the prepared message in WhatsApp to complete your coupon request.
              </p>
            </div>

            <button
              onClick={handleConfirmSent}
              className="w-full h-12 min-h-[44px] rounded-2xl bg-primary text-on-primary font-bold text-sm shadow hover:bg-primary/90 transition-colors"
            >
              I've Sent the Message
            </button>
            <button
              onClick={handleOpenAgain}
              className="w-full h-12 min-h-[44px] rounded-2xl bg-surface-container-high text-on-surface font-bold text-sm border border-outline-variant/40 hover:bg-surface-container-highest transition-colors"
            >
              Open WhatsApp Again
            </button>
            <button
              onClick={handleCancelRequest}
              className="w-full py-2.5 text-error font-semibold text-xs"
            >
              Cancel Request
            </button>
          </>
        )}

        {step === 'CONFIRMED' && (
          <>
            <div className="p-4 bg-success/10 rounded-2xl border border-success/30 space-y-1.5 text-xs text-on-background">
              <div className="font-bold text-sm text-success">Coupon Request Recorded</div>
              <p className="text-on-background/90">
                Your request has been recorded in this prototype. Amani's Kitchen will review the WhatsApp message and update the coupon status.
              </p>
              <p className="font-mono font-semibold pt-1">Request ID: {requestId}</p>
              <p className="font-semibold">Status: Awaiting Restaurant Review</p>
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 min-h-[44px] rounded-2xl bg-primary text-on-primary font-bold text-sm shadow hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CouponClaimBottomSheet;
