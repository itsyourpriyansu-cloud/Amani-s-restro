import React, { useState } from 'react';
import { X, TicketPlus } from 'lucide-react';
import PhoneNumberField from '../../common/PhoneNumberField';
import { parseIndianMobile, maskMobile } from '../../../utils/whatsapp';
import { validateFirstName } from '../../../utils/guestFieldValidation';
import { useToast } from '../../../context/ToastContext';

const CouponCreateDrawer = ({ isOpen, onClose, onCreate, staffName }) => {
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [tableId, setTableId] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  const [visitCount, setVisitCount] = useState('');
  const [fulfilmentConsent, setFulfilmentConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const resetAndClose = () => {
    setFirstName('');
    setPhoneDigits('');
    setInvoiceId('');
    setOrderId('');
    setTableId('');
    setCampaignName('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('');
    setValidityDays('30');
    setVisitCount('');
    setFulfilmentConsent(false);
    setMarketingConsent(false);
    setErrors({});
    onClose();
  };

  const validate = () => {
    const phoneResult = parseIndianMobile(phoneDigits);
    const value = Number(discountValue);
    const days = Number(validityDays);
    const nextErrors = {};

    const nameErr = validateFirstName(firstName);
    if (nameErr) nextErrors.firstName = nameErr;
    if (!phoneResult.isValid) nextErrors.phone = 'Enter a valid 10-digit WhatsApp number';
    if (!invoiceId.trim()) nextErrors.invoiceId = 'Enter a source invoice reference';
    if (!campaignName.trim()) nextErrors.campaignName = 'Enter a campaign name or reason';
    if (!discountValue || value <= 0) nextErrors.discountValue = 'Enter a discount value greater than 0';
    if (discountType === 'PERCENTAGE' && value > 100) nextErrors.discountValue = 'Percentage discount cannot exceed 100%';
    if (!validityDays || days <= 0) nextErrors.validityDays = 'Enter a validity period in days';
    if (!fulfilmentConsent) nextErrors.consent = 'Confirm the guest has agreed to this coupon before issuing it';

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, phoneResult };
  };

  const handleSubmit = () => {
    const { valid, phoneResult } = validate();
    if (!valid) return;

    const trimmedName = firstName.trim();
    const newRequest = onCreate({
      customer: {
        firstName: trimmedName,
        maskedMobile: maskMobile(phoneResult.digits10),
        formattedMobile: phoneResult.e164,
      },
      orderReference: {
        invoiceId: invoiceId.trim(),
        orderId: orderId.trim() || null,
        tableId: tableId.trim() ? `TABLE-${tableId.trim().replace(/^TABLE-/, '')}` : null,
      },
      campaignName: campaignName.trim(),
      discountType,
      discountValue: Number(discountValue),
      validityDays: Number(validityDays),
      completedVisits: visitCount.trim() ? Number(visitCount) : null,
      marketingGranted: marketingConsent,
    }, staffName);

    showToast(`Coupon ${newRequest.coupon.code} created and issued!`, 'success');
    resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={resetAndClose} />
      <div className="relative w-full sm:w-[480px] h-full bg-surface-container-lowest border-l border-outline-variant shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-surface-container-lowest px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <TicketPlus className="w-4.5 h-4.5 text-primary" /> Create Coupon
            </h3>
            <p className="text-[11px] text-on-surface-variant">Issue a custom coupon directly, without a customer WhatsApp request.</p>
          </div>
          <button onClick={resetAndClose} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant" aria-label="Close create coupon form">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="create-first-name" className="font-bold text-on-surface block mb-1">First name *</label>
              <input
                id="create-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Guest first name"
                className={`w-full p-2.5 rounded-xl border bg-surface ${errors.firstName ? 'border-error' : 'border-outline-variant'}`}
              />
              {errors.firstName && <p className="text-error font-semibold mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="create-visits" className="font-bold text-on-surface block mb-1">Completed visits (optional)</label>
              <input
                id="create-visits"
                type="number"
                min="0"
                value={visitCount}
                onChange={(e) => setVisitCount(e.target.value)}
                placeholder="e.g. 3"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface"
              />
            </div>
          </div>

          <PhoneNumberField id="create-phone" value={phoneDigits} onChange={setPhoneDigits} error={errors.phone} />

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="create-invoice" className="font-bold text-on-surface block mb-1">Invoice *</label>
              <input
                id="create-invoice"
                type="text"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                placeholder="INV-1082"
                className={`w-full p-2.5 rounded-xl border bg-surface ${errors.invoiceId ? 'border-error' : 'border-outline-variant'}`}
              />
            </div>
            <div>
              <label htmlFor="create-order" className="font-bold text-on-surface block mb-1">Order</label>
              <input
                id="create-order"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ORD-1082"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface"
              />
            </div>
            <div>
              <label htmlFor="create-table" className="font-bold text-on-surface block mb-1">Table</label>
              <input
                id="create-table"
                type="text"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                placeholder="05"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface"
              />
            </div>
          </div>
          {errors.invoiceId && <p className="text-error font-semibold -mt-2">{errors.invoiceId}</p>}

          <div>
            <label htmlFor="create-campaign" className="font-bold text-on-surface block mb-1">Campaign name / reason *</label>
            <input
              id="create-campaign"
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Diwali Special, Service Recovery Goodwill"
              className={`w-full p-2.5 rounded-xl border bg-surface ${errors.campaignName ? 'border-error' : 'border-outline-variant'}`}
            />
            {errors.campaignName && <p className="text-error font-semibold mt-1">{errors.campaignName}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-on-surface block mb-1">Discount type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface"
              >
                <option value="PERCENTAGE">% Percentage</option>
                <option value="FLAT">₹ Flat amount</option>
              </select>
            </div>
            <div>
              <label htmlFor="create-value" className="font-bold text-on-surface block mb-1">
                Value {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} *
              </label>
              <input
                id="create-value"
                type="number"
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'PERCENTAGE' ? '15' : '100'}
                className={`w-full p-2.5 rounded-xl border bg-surface ${errors.discountValue ? 'border-error' : 'border-outline-variant'}`}
              />
            </div>
            <div>
              <label htmlFor="create-validity" className="font-bold text-on-surface block mb-1">Valid for (days) *</label>
              <input
                id="create-validity"
                type="number"
                min="1"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                className={`w-full p-2.5 rounded-xl border bg-surface ${errors.validityDays ? 'border-error' : 'border-outline-variant'}`}
              />
            </div>
          </div>
          {(errors.discountValue || errors.validityDays) && (
            <p className="text-error font-semibold -mt-2">{errors.discountValue || errors.validityDays}</p>
          )}

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={fulfilmentConsent}
              onChange={(e) => setFulfilmentConsent(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary shrink-0"
            />
            <div>
              <span className="font-semibold text-on-surface">
                I confirm the guest has agreed to receive this coupon code and related communication on WhatsApp.
              </span>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Required — staff-attested consent, since this coupon is issued directly rather than via the customer's own WhatsApp request.
              </p>
            </div>
          </label>
          {errors.consent && <p className="text-error font-semibold -mt-2">{errors.consent}</p>}

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary shrink-0"
            />
            <div>
              <span className="font-semibold text-on-surface">
                Guest has separately agreed to receive occasional offers and food-event updates on WhatsApp.
              </span>
              <p className="text-[11px] text-on-surface-variant mt-1">Optional — not required to issue the coupon.</p>
            </div>
          </label>

          <div className="flex gap-2 pt-1">
            <button onClick={resetAndClose} className="flex-1 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-xl">
              Cancel
            </button>
            <button onClick={handleSubmit} className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow">
              Create & Issue Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCreateDrawer;
