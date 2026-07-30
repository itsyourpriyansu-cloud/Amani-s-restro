import React, { useState } from 'react';
import { X, User, Receipt, ShieldAlert, MessageCircle, CalendarClock, Ticket, Ban, Eye } from 'lucide-react';
import CouponStatusBadge from './CouponStatusBadge';
import CouponAuditTimeline from './CouponAuditTimeline';
import { formatRupeesFromPaise, formatDiscountLabel, getCampaignLabel } from '../../../utils/couponFormatting';
import { useToast } from '../../../context/ToastContext';

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

const CouponDetailsDrawer = ({
  request,
  ledgerStatus,
  onClose,
  staffName,
  permissions,
  onOpenRedemption,
  onOpenResend,
  onOpenRevoke,
  onExtendExpiry,
  onRevealPhone,
}) => {
  const { showToast } = useToast();
  const [revealedNumber, setRevealedNumber] = useState(null);
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [extendReason, setExtendReason] = useState('');

  if (!request) return null;
  const coupon = request.coupon;

  const handleReveal = () => {
    const number = onRevealPhone(request.requestId, staffName);
    setRevealedNumber(number);
    showToast('Full mobile number revealed — this action was logged.', 'info');
  };

  const handleExtend = () => {
    if (!newExpiryDate || !extendReason.trim()) return;
    onExtendExpiry(request.requestId, newExpiryDate, extendReason.trim(), staffName);
    setShowExtendForm(false);
    setNewExpiryDate('');
    setExtendReason('');
    showToast('Coupon expiry extended.', 'success');
  };

  const canRedeem = ledgerStatus === 'ACTIVE' || ledgerStatus === 'EXPIRING_SOON';
  const canRevoke = permissions.canRevoke && (ledgerStatus === 'ACTIVE' || ledgerStatus === 'EXPIRING_SOON');
  const canExtend = permissions.canExtend && (ledgerStatus === 'ACTIVE' || ledgerStatus === 'EXPIRING_SOON');
  const canResend = permissions.canResend && request.consent.fulfilmentGranted && coupon && !coupon.revocation;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full sm:w-[460px] h-full bg-surface-container-lowest border-l border-outline-variant shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-surface-container-lowest px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-on-surface font-mono">{coupon?.code}</h3>
            <div className="mt-1"><CouponStatusBadge status={ledgerStatus} /></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant" aria-label="Close coupon details">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Section icon={User} title="Guest">
            <p><strong>Name:</strong> {request.customer.firstName}</p>
            <p>
              <strong>Guest tier:</strong>{' '}
              {request.milestone.completedVisits != null
                ? `Regular Guest · ${request.milestone.completedVisits} completed visits`
                : 'Manually issued (not milestone-linked)'}
            </p>
            <p className="flex items-center gap-2">
              <strong>Mobile:</strong> {revealedNumber ? `+${revealedNumber.slice(0, 2)} ${revealedNumber.slice(2)}` : request.customer.maskedMobile}
              {!revealedNumber && permissions.canRevealPhone && (
                <button onClick={handleReveal} className="text-primary font-bold text-[11px] flex items-center gap-1 hover:underline">
                  <Eye className="w-3 h-3" /> Reveal Number
                </button>
              )}
            </p>
          </Section>

          <Section icon={Ticket} title="Campaign & Offer">
            <p><strong>Campaign:</strong> {getCampaignLabel(request.couponOffer)}</p>
            <p><strong>Offer:</strong> {formatDiscountLabel(coupon || request.couponOffer)}</p>
            {request.origin === 'MANAGER_CREATED' && (
              <p className="text-[11px] text-on-surface-variant italic pt-1 border-t border-outline-variant/20 mt-1">
                Manually issued by staff — not generated via the customer WhatsApp claim flow.
              </p>
            )}
          </Section>

          <Section icon={Receipt} title="Source Order / Invoice">
            <p><strong>Invoice:</strong> {request.orderReference.invoiceId}</p>
            <p><strong>Order:</strong> {request.orderReference.orderId}</p>
            <p><strong>Table:</strong> {request.orderReference.tableId?.replace('TABLE-', '')}</p>
          </Section>

          <Section icon={ShieldAlert} title="Consent">
            <p>Coupon fulfilment: <strong className={request.consent.fulfilmentGranted ? 'text-emerald-700' : 'text-error'}>{request.consent.fulfilmentGranted ? 'Granted' : 'Not Granted'}</strong></p>
            <p>Marketing: <strong className={request.consent.marketingGranted ? 'text-emerald-700' : 'text-on-surface-variant'}>{request.consent.marketingGranted ? 'Granted' : 'Not Granted'}</strong></p>
          </Section>

          <Section icon={MessageCircle} title="WhatsApp Fulfilment">
            <p>Request confirmed sent: {request.whatsapp.customerConfirmedSentAt ? 'Yes' : 'No'}</p>
            <p>Restaurant message received: {request.whatsapp.restaurantConfirmedReceivedAt ? 'Yes' : 'No'}</p>
            {coupon?.sentAt && <p>Coupon reply sent: {coupon.sentAt}</p>}
          </Section>

          <Section icon={CalendarClock} title="Validity">
            <p><strong>Issued:</strong> {coupon?.issuedAt}</p>
            <p><strong>Expires:</strong> {coupon?.validUntil}</p>
            {coupon?.expiryHistory?.length > 0 && (
              <div className="pt-1 border-t border-outline-variant/20 mt-1 space-y-0.5">
                {coupon.expiryHistory.map((h, i) => (
                  <p key={i} className="text-[10px] text-on-surface-variant">
                    Extended by {h.changedBy} on {h.changedAt} — {h.reason}
                  </p>
                ))}
              </div>
            )}
          </Section>

          {coupon?.redemption && (
            <Section icon={Ticket} title="Redemption">
              <p><strong>Redemption ID:</strong> <span className="font-mono">{coupon.redemption.redemptionId}</span></p>
              <p><strong>Bill:</strong> {coupon.redemption.sourceBillId || '—'}</p>
              <p><strong>Discount:</strong> {formatRupeesFromPaise(coupon.redemption.discountPaise)}</p>
              <p><strong>Final Payable:</strong> {formatRupeesFromPaise(coupon.redemption.finalPayablePaise)}</p>
              <p><strong>Redeemed by:</strong> {coupon.redemption.redeemedBy} at {coupon.redemption.redeemedAt}</p>
            </Section>
          )}

          {coupon?.revocation && (
            <Section icon={Ban} title="Revocation">
              <p><strong>Reason:</strong> {coupon.revocation.reason}</p>
              {coupon.revocation.note && <p>{coupon.revocation.note}</p>}
              <p className="text-on-surface-variant">By {coupon.revocation.revokedBy} at {coupon.revocation.revokedAt}</p>
            </Section>
          )}

          <CouponAuditTimeline entries={request.auditHistory} />

          {showExtendForm && (
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
              <label className="font-bold text-on-surface text-xs block">New Expiry Date *</label>
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-outline-variant bg-surface text-xs"
              />
              <label className="font-bold text-on-surface text-xs block">Reason *</label>
              <textarea
                value={extendReason}
                onChange={(e) => setExtendReason(e.target.value)}
                rows={2}
                className="w-full p-2 rounded-lg border border-outline-variant bg-surface text-xs"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowExtendForm(false)} className="flex-1 py-2 bg-surface-container-high text-on-surface font-semibold rounded-lg text-xs">
                  Cancel
                </button>
                <button onClick={handleExtend} disabled={!newExpiryDate || !extendReason.trim()} className="flex-1 py-2 bg-primary text-on-primary font-bold rounded-lg text-xs disabled:opacity-40">
                  Save New Expiry
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 space-y-2 border-t border-outline-variant/30">
            {canRedeem && (
              <button
                onClick={() => onOpenRedemption(coupon.code)}
                className="w-full py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow"
              >
                Redeem Coupon
              </button>
            )}
            <div className="flex gap-2">
              {canResend && (
                <button onClick={() => onOpenResend(request)} className="flex-1 py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> Resend via WhatsApp
                </button>
              )}
              {canExtend && !showExtendForm && (
                <button onClick={() => setShowExtendForm(true)} className="flex-1 py-2.5 bg-surface-container-high text-on-surface font-bold text-xs rounded-xl border border-outline-variant/40">
                  Extend Expiry
                </button>
              )}
            </div>
            {canRevoke && (
              <button onClick={() => onOpenRevoke(request)} className="w-full py-2.5 bg-error/10 text-error font-bold text-xs rounded-xl border border-error/30">
                Revoke Coupon
              </button>
            )}
            {!permissions.canRevoke && !permissions.canResend && !permissions.canExtend && (
              <p className="text-[11px] text-on-surface-variant italic">You do not have permission to perform this action.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponDetailsDrawer;
