import React, { useState } from 'react';
import Modal from '../../common/Modal';
import { MessageCircle, Send } from 'lucide-react';
import { buildCouponReplyMessage, createWhatsAppUrl, openWhatsAppUrl } from '../../../utils/whatsapp';
import { getCampaignLabel } from '../../../utils/couponFormatting';
import { useToast } from '../../../context/ToastContext';

const CouponWhatsAppPreview = ({ request, onClose, onReplyOpened, onMarkSent, staffName }) => {
  const { showToast } = useToast();
  const [opened, setOpened] = useState(false);

  if (!request?.coupon) return null;
  const { firstName, maskedMobile, formattedMobile } = request.customer;
  const { code, discountType, discountValue, validUntil } = request.coupon;

  const message = buildCouponReplyMessage({
    firstName,
    code,
    discountType,
    discountValue,
    validUntil,
    campaignName: getCampaignLabel(request.couponOffer),
  });

  const handleOpenWhatsApp = () => {
    const url = createWhatsAppUrl(message, formattedMobile);
    openWhatsAppUrl(url);
    onReplyOpened(request.requestId, staffName);
    setOpened(true);
  };

  const handleMarkSent = () => {
    onMarkSent(request.requestId, staffName);
    showToast('Coupon message marked sent.', 'success');
    onClose();
  };

  return (
    <Modal isOpen={!!request} onClose={onClose} title={opened ? 'WhatsApp Reply Opened' : 'Resend Coupon on WhatsApp'}>
      <div className="space-y-4 text-left">
        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs space-y-0.5">
          <p><strong>Guest:</strong> {firstName}</p>
          <p><strong>Mobile:</strong> {maskedMobile}</p>
          <p><strong>Coupon:</strong> <span className="font-mono">{code}</span></p>
          <p><strong>Valid until:</strong> {validUntil}</p>
        </div>

        <div className="p-3 bg-[#25D366]/5 rounded-xl border border-[#25D366]/20 text-xs whitespace-pre-line text-on-surface">
          {message}
        </div>

        {!opened ? (
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl">
              Cancel
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Open WhatsApp
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] text-on-surface-variant">
              Opening WhatsApp doesn't confirm the message was sent — confirm manually once you've sent it.
            </p>
            <button
              onClick={handleMarkSent}
              className="w-full py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Mark as Sent
            </button>
            <button onClick={onClose} className="w-full py-2 text-on-surface-variant font-semibold text-xs">
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CouponWhatsAppPreview;
