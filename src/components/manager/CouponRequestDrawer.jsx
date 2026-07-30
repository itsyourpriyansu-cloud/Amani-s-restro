import React, { useState } from 'react';
import { X, User, Receipt, ShieldCheck, MessageCircle, History, ShieldAlert, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DECLINE_REASONS = [
  'Milestone not verified',
  'Invoice not found',
  'Coupon already issued for this milestone',
  'Request withdrawn',
  'Invalid contact details',
  'Other',
];

const STATUS_LABELS = {
  CUSTOMER_CONFIRMED_SENT: 'Awaiting WhatsApp Message',
  AWAITING_RESTAURANT_REVIEW: 'Awaiting Restaurant Review',
  VERIFIED: 'Verified — Ready to Issue',
  DECLINED: 'Declined',
  CANCELLED: 'Cancelled (by customer)',
  WHATSAPP_OPENED: 'WhatsApp Opened (not yet confirmed)',
  FORM_STARTED: 'Form Started',
};

const Section = ({ icon: SectionIcon, title, children }) => (
  <div className="space-y-1.5">
    <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
      <SectionIcon className="w-3.5 h-3.5" />
      {title}
    </h4>
    <div className="text-xs text-on-surface space-y-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
      {children}
    </div>
  </div>
);

/**
 * Pre-issuance coupon request review drawer — handles the "Awaiting Review"
 * bucket only (mark message received -> verify eligibility -> issue, or
 * decline). Once a coupon is issued, the row moves into the main Coupon &
 * Loyalty ledger and is managed via CouponDetailsDrawer instead.
 */
const CouponRequestDrawer = ({
  request,
  onClose,
  staffName = 'Sundaram Pillai',
  onMarkMessageReceived,
  onVerifyEligibility,
  onDecline,
  onIssueCoupon,
  onWithdrawMarketingConsent,
}) => {
  const { showToast } = useToast();
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState(DECLINE_REASONS[0]);
  const [declineNote, setDeclineNote] = useState('');

  if (!request) return null;

  const handleDeclineConfirm = () => {
    onDecline(request.requestId, declineReason, declineNote, staffName);
    setShowDeclineForm(false);
    showToast('Coupon request declined.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full sm:w-[440px] h-full bg-surface-container-lowest border-l border-outline-variant shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-surface-container-lowest px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-on-surface font-mono">{request.requestId}</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {STATUS_LABELS[request.status] || request.status}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant" aria-label="Close request details">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Section icon={User} title="Customer">
            <p><strong>Name:</strong> {request.customer.firstName}</p>
            <p><strong>WhatsApp:</strong> +91 •••••{request.customer.maskedMobile?.replace('******', '')}</p>
          </Section>

          <Section icon={ShieldCheck} title="Visit Milestone">
            <p><strong>Eligibility:</strong> {request.milestone.completedVisits} completed visits</p>
            <p><strong>Level:</strong> Regular Guest milestone unlocked</p>
          </Section>

          <Section icon={Receipt} title="Invoice / Order References">
            <p><strong>Invoice:</strong> {request.orderReference.invoiceId}</p>
            <p><strong>Order:</strong> {request.orderReference.orderId}</p>
            <p><strong>Table:</strong> {request.orderReference.tableId?.replace('TABLE-', '')}</p>
          </Section>

          <Section icon={ShieldAlert} title="Consent Details">
            <p>
              <strong>Coupon Fulfilment Consent:</strong>{' '}
              <span className={request.consent.fulfilmentGranted ? 'text-emerald-700 font-bold' : 'text-error font-bold'}>
                {request.consent.fulfilmentGranted ? `Granted at ${request.consent.fulfilmentGrantedAt}` : 'Not Granted'}
              </span>
            </p>
            <p>
              <strong>Marketing WhatsApp Consent:</strong>{' '}
              <span className={request.consent.marketingGranted ? 'text-emerald-700 font-bold' : 'text-on-surface-variant font-bold'}>
                {request.consent.marketingGranted ? `Granted at ${request.consent.marketingGrantedAt}` : 'Not Granted'}
              </span>
            </p>
            <p className="text-[11px] text-on-surface-variant italic pt-1 border-t border-outline-variant/20 mt-1">
              Coupon fulfilment communication is permitted. Promotional WhatsApp messaging is {request.consent.marketingGranted ? 'permitted.' : 'not permitted.'}
            </p>
            {request.consent.marketingGranted && (
              <button
                onClick={() => {
                  onWithdrawMarketingConsent(request.requestId, staffName);
                  showToast('Marketing consent withdrawn.', 'info');
                }}
                className="mt-1.5 text-error text-[11px] font-bold hover:underline"
              >
                Withdraw Marketing Consent
              </button>
            )}
          </Section>

          <Section icon={MessageCircle} title="WhatsApp Request State">
            <p><strong>Deep link opened:</strong> {request.whatsapp.deepLinkOpenedAt || '—'}</p>
            <p><strong>Customer confirmed sent:</strong> {request.whatsapp.customerConfirmedSentAt || '—'}</p>
            <p><strong>Restaurant confirmed received:</strong> {request.whatsapp.restaurantConfirmedReceivedAt || '—'}</p>
          </Section>

          {request.status === 'DECLINED' && (
            <Section icon={XCircle} title="Decline Reason">
              <p className="font-bold text-error">{request.declineReason}</p>
              {request.declineNote && <p className="text-on-surface-variant">{request.declineNote}</p>}
            </Section>
          )}

          <Section icon={History} title="Audit History">
            <div className="space-y-1.5">
              {(request.auditHistory || []).map((entry, idx) => (
                <div key={idx} className="flex gap-2 text-[11px]">
                  <span className="text-on-surface-variant font-mono shrink-0">{entry.time}</span>
                  <span>{entry.text}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Contextual Actions */}
          <div className="pt-2 space-y-2 border-t border-outline-variant/30">
            {request.status === 'CUSTOMER_CONFIRMED_SENT' && (
              <button
                onClick={() => onMarkMessageReceived(request.requestId, staffName)}
                className="w-full py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow"
              >
                Mark WhatsApp Message Received
              </button>
            )}

            {request.status === 'AWAITING_RESTAURANT_REVIEW' && !showDeclineForm && (
              <div className="flex gap-2">
                <button
                  onClick={() => onVerifyEligibility(request.requestId, staffName)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Verify Eligibility
                </button>
                <button
                  onClick={() => setShowDeclineForm(true)}
                  className="flex-1 py-2.5 bg-error/10 text-error font-bold text-xs rounded-xl border border-error/30"
                >
                  Decline Request
                </button>
              </div>
            )}

            {request.status === 'VERIFIED' && !showDeclineForm && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onIssueCoupon(request.requestId, staffName);
                    showToast('Prototype coupon issued!', 'success');
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow"
                >
                  Issue Coupon
                </button>
                <button
                  onClick={() => setShowDeclineForm(true)}
                  className="flex-1 py-2.5 bg-error/10 text-error font-bold text-xs rounded-xl border border-error/30"
                >
                  Decline Request
                </button>
              </div>
            )}

            {showDeclineForm && (
              <div className="p-3 bg-error/5 border border-error/20 rounded-xl space-y-2 text-xs">
                <label className="font-bold text-on-surface block">Decline Reason *</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface text-xs"
                >
                  {DECLINE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <textarea
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  placeholder="Optional note..."
                  rows={2}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface text-xs"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowDeclineForm(false)} className="flex-1 py-2 bg-surface-container-high text-on-surface font-semibold rounded-lg">
                    Cancel
                  </button>
                  <button onClick={handleDeclineConfirm} className="flex-1 py-2 bg-error text-on-error font-bold rounded-lg">
                    Confirm Decline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponRequestDrawer;
