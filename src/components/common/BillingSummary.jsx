import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatInvoiceAmount } from '../../utils/formatters';
import { restaurantConfig } from '../../config/restaurantConfig';
import Icon from './Icon';

const BillingSummary = ({
  totals = {},
  showTipSelector = true,
  tipPercentage = 0,
  setTipPercentage = () => {},
  customTipAmount = '',
  setCustomTipAmount = () => {},
  selectedTipOption = '0', // '0' | '5' | '10' | 'custom'
  setSelectedTipOption = () => {},
  className = '',
}) => {
  const [isTaxExpanded, setIsTaxExpanded] = useState(false);
  const [isExplainerExpanded, setIsExplainerExpanded] = useState(false);

  const subtotal = totals.subtotal || 0;
  const discountAmount = totals.discountAmount || 0;
  const packagingCharge = totals.packagingCharge || 0;
  const totalTaxRate = (restaurantConfig.taxStructure.totalRate || 5) / 100;
  const gst = totals.gst ?? totals.tax ?? (subtotal * totalTaxRate);
  const cgst = totals.cgst ?? (gst / 2);
  const sgst = totals.sgst ?? (gst / 2);
  const total = totals.total ?? (subtotal - discountAmount + packagingCharge + gst);
  const tipAmount = totals.tipAmount || 0;
  const totalPayable = totals.totalPayable ?? totals.grandTotal ?? (total + tipAmount);

  // Tip options from configuration
  const tipOptions = [
    { id: '0', label: 'No Tip', percentage: 0 },
    { id: '5', label: '5%', percentage: 5 },
    { id: '10', label: '10%', percentage: 10 },
    { id: 'custom', label: 'Custom', percentage: null },
  ];

  const handleTipOptionChange = (optionId) => {
    setSelectedTipOption(optionId);
    if (optionId === '0') {
      setTipPercentage(0);
      setCustomTipAmount('');
    } else if (optionId === '5') {
      setTipPercentage(5);
      setCustomTipAmount('');
    } else if (optionId === '10') {
      setTipPercentage(10);
      setCustomTipAmount('');
    } else if (optionId === 'custom') {
      setTipPercentage(0);
    }
  };

  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 ${className}`}>
      <h2 className="text-base font-bold text-on-surface mb-4 uppercase tracking-wide">Payment Breakdown</h2>

      {/* Primary Line Items */}
      <div className="space-y-3 text-sm text-on-surface-variant pb-4 border-b border-outline-variant/30 [font-variant-numeric:tabular-nums]">
        <div className="flex justify-between items-center font-medium">
          <span>Subtotal</span>
          <span className="text-on-surface font-semibold">{formatInvoiceAmount(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-medium">
            <span>Discount</span>
            <span className="font-semibold">-{formatInvoiceAmount(discountAmount)}</span>
          </div>
        )}

        {packagingCharge > 0 && (
          <div className="flex justify-between items-center font-medium">
            <span>Packaging Charge</span>
            <span className="text-on-surface font-semibold">{formatInvoiceAmount(packagingCharge)}</span>
          </div>
        )}

        {/* GST @ 5% with Expandable Breakdown */}
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between items-center font-medium">
            <button
              type="button"
              onClick={() => setIsTaxExpanded(!isTaxExpanded)}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-left focus:outline-none py-1 -my-1"
              aria-expanded={isTaxExpanded}
            >
              <span>{restaurantConfig.taxStructure.taxName || 'GST'} @ {restaurantConfig.taxStructure.totalRate || 5}%</span>
              <motion.span
                animate={{ rotate: isTaxExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block text-xs"
              >
                <Icon name="expand_more" />
              </motion.span>
            </button>
            <span className="text-on-surface font-semibold">{formatInvoiceAmount(gst)}</span>
          </div>

          <AnimatePresence>
            {isTaxExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pl-4 space-y-1 text-xs text-on-surface-variant/80 border-l-2 border-primary/30 my-1 py-1"
              >
                <div className="flex justify-between items-center">
                  <span>CGST @ {restaurantConfig.taxStructure.cgstRate || 2.5}%</span>
                  <span>{formatInvoiceAmount(cgst)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SGST @ {restaurantConfig.taxStructure.sgstRate || 2.5}%</span>
                  <span>{formatInvoiceAmount(sgst)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Staff tip — only shown as a line item once an amount is actually selected,
            so this figure never appears twice with the interactive selector below. */}
        {tipAmount > 0 && (
          <div className="flex justify-between items-center font-medium text-secondary">
            <span>Staff Tip</span>
            <motion.span key={tipAmount} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="font-semibold">
              {formatInvoiceAmount(tipAmount)}
            </motion.span>
          </div>
        )}

        {/* Total (Before Tip) */}
        <div className="flex justify-between items-center font-bold text-on-surface pt-2 border-t border-outline-variant/20">
          <span>Invoice Total</span>
          <span className="text-base">{formatInvoiceAmount(total)}</span>
        </div>
      </div>

      {/* Tip Selector — the one and only place "tip" is labeled on this card */}
      {showTipSelector && (
        <div className="py-4 border-b border-outline-variant/30 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-on-surface">Add a tip for the staff</span>
            <span className="text-xs font-semibold text-secondary">{tipAmount > 0 ? formatInvoiceAmount(tipAmount) : 'No tip'}</span>
          </div>

          {/* Accessible Radio Option Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Staff Tip Options">
            {tipOptions.map((option) => {
              const isSelected = selectedTipOption === option.id;
              let calculatedAmount = 0;
              if (option.percentage) {
                calculatedAmount = (subtotal * option.percentage) / 100;
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleTipOptionChange(option.id)}
                  className={`min-h-[44px] px-2.5 py-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-sm ring-2 ring-primary/30'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high border-outline-variant/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-on-primary bg-on-primary' : 'border-outline-variant'}`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </span>
                    <span>{option.label}</span>
                  </div>
                  {option.percentage > 0 && (
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-on-primary/90' : 'text-on-surface-variant'}`}>
                      ({formatInvoiceAmount(calculatedAmount)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Tip Input */}
          {selectedTipOption === 'custom' && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-bold text-on-surface-variant">₹</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={customTipAmount}
                  onChange={(e) => setCustomTipAmount(e.target.value)}
                  placeholder="Enter custom tip amount"
                  aria-label="Custom tip amount"
                  className="w-full min-h-[44px] bg-surface-container-low border border-outline-variant rounded-xl py-2 pl-7 pr-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          )}

          {/* Mandatory Helper Text */}
          <p className="text-[11px] text-on-surface-variant/80 italic leading-tight pt-1">
            The staff tip is optional and selected by the customer.
          </p>
        </div>
      )}

      {/* Total Payable — the single strongest billing element on the card */}
      <div className="mt-4 mb-2 flex justify-between items-center bg-primary/[0.08] border-2 border-primary/20 rounded-xl px-4 py-4 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider text-on-surface font-bold block">Total Payable</span>
          <span className="text-[11px] text-on-surface-variant/70">Inclusive of all taxes</span>
        </div>
        <motion.span key={totalPayable} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-3xl md:text-4xl font-extrabold text-primary [font-variant-numeric:tabular-nums]">
          {formatInvoiceAmount(totalPayable)}
        </motion.span>
      </div>

      {/* Expandable Section: How was this total calculated? */}
      <div className="mt-4 pt-4 border-t border-outline-variant/30">
        <button
          type="button"
          onClick={() => setIsExplainerExpanded(!isExplainerExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <Icon name="help_outline" className="text-sm" />
            How was this total calculated?
          </span>
          <motion.span animate={{ rotate: isExplainerExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <Icon name="expand_more" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isExplainerExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden text-xs text-on-surface-variant space-y-3 pt-3"
            >
              <div>
                <span className="font-bold block text-on-surface">Government Tax</span>
                <p>GST ({restaurantConfig.taxStructure.totalRate}%) applied to the taxable restaurant bill.</p>
              </div>
              <div>
                <span className="font-bold block text-on-surface">Packaging Charge</span>
                <p>Applied only when packaging is required.</p>
              </div>
              <div>
                <span className="font-bold block text-on-surface">Restaurant Service Charge</span>
                <p>No restaurant service charge has been added.</p>
              </div>
              <div>
                <span className="font-bold block text-on-surface">Voluntary Staff Tip</span>
                <p>An optional amount selected by the customer.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BillingSummary;
