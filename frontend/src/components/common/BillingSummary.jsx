import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatInvoiceAmount } from '../../utils/formatters';
import { restaurantConfig } from '../../config/restaurantConfig';
import Icon from './Icon';
import { ChevronDown, Info, ShieldCheck, Ticket } from 'lucide-react';

const BillingSummary = ({
  totals = {},
  showTipSelector = true,
  tipPercentage = 0,
  setTipPercentage = () => {},
  customTipAmount = '',
  setCustomTipAmount = () => {},
  selectedTipOption = '0',
  setSelectedTipOption = () => {},
  className = '',
}) => {
  const [isTaxExpanded, setIsTaxExpanded] = useState(false);
  const [isExplainerExpanded, setIsExplainerExpanded] = useState(false);

  const subtotal = totals.subtotal || 0;
  const discountAmount = totals.discountAmount || 0;
  const packagingCharge = totals.packagingCharge || 0;
  const totalTaxRate = (restaurantConfig?.taxStructure?.totalRate || 5) / 100;
  const gst = totals.gst ?? totals.tax ?? (subtotal * totalTaxRate);
  const cgst = totals.cgst ?? (gst / 2);
  const sgst = totals.sgst ?? (gst / 2);
  const total = totals.total ?? (subtotal - discountAmount + packagingCharge + gst);
  const tipAmount = totals.tipAmount || 0;
  const totalPayable = totals.totalPayable ?? totals.grandTotal ?? (total + tipAmount);

  const taxName = restaurantConfig?.taxStructure?.taxName || 'GST';
  const taxRate = restaurantConfig?.taxStructure?.totalRate || 5;
  const cgstRate = restaurantConfig?.taxStructure?.cgstRate || 2.5;
  const sgstRate = restaurantConfig?.taxStructure?.sgstRate || 2.5;

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
    <div
      className={`bg-white rounded-[22px] p-4 sm:p-5 border border-[#5B3021]/11 shadow-[0_8px_28px_rgba(55,26,17,0.06)] ${className}`}
    >
      <h2 className="text-[17px] font-bold text-[#24130E] mb-3.5 tracking-tight">Payment details</h2>

      {/* Savings summary badge when discount is applied */}
      {discountAmount > 0 && (
        <div className="mb-4 p-3 rounded-[14px] bg-[#237A4B]/8 border border-[#237A4B]/20 flex items-center gap-2.5 text-[#237A4B]">
          <Ticket className="w-4 h-4 shrink-0 text-[#237A4B]" />
          <span className="text-[13px] font-semibold">
            You saved {formatInvoiceAmount(discountAmount)} on this order
          </span>
        </div>
      )}

      {/* Financial Line Items */}
      <div className="space-y-3 text-[13.5px] text-[#786B65] pb-4 border-b border-[#5B3021]/10 [font-variant-numeric:tabular-nums]">
        <div className="flex justify-between items-center font-medium">
          <span>Subtotal</span>
          <span className="text-[#24130E] font-semibold">{formatInvoiceAmount(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-[#237A4B] font-medium">
            <span>Discount</span>
            <span className="font-bold">-{formatInvoiceAmount(discountAmount)}</span>
          </div>
        )}

        {packagingCharge > 0 && (
          <div className="flex justify-between items-center font-medium">
            <span>Packaging charge</span>
            <span className="text-[#24130E] font-semibold">{formatInvoiceAmount(packagingCharge)}</span>
          </div>
        )}

        {/* GST @ X% with Expandable Breakdown */}
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between items-center font-medium">
            <button
              type="button"
              onClick={() => setIsTaxExpanded(!isTaxExpanded)}
              className="flex items-center gap-1.5 text-[#786B65] hover:text-[#87351F] transition-colors text-left focus:outline-none py-0.5"
              aria-expanded={isTaxExpanded}
              aria-label="Toggle GST tax breakdown details"
            >
              <span>{taxName} ({taxRate}%)</span>
              <motion.span
                animate={{ rotate: isTaxExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                <ChevronDown className="w-3.5 h-3.5 text-[#786B65]" />
              </motion.span>
              <span className="text-[11px] font-normal text-[#87351F] bg-[#87351F]/8 px-1.5 py-0.2 rounded">
                details
              </span>
            </button>
            <span className="text-[#24130E] font-semibold">{formatInvoiceAmount(gst)}</span>
          </div>

          <AnimatePresence>
            {isTaxExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-3.5 border-l-2 border-[#87351F]/30 my-1.5 space-y-1 text-xs text-[#786B65]"
              >
                <div className="flex justify-between items-center">
                  <span>CGST ({cgstRate}%)</span>
                  <span className="tabular-nums">{formatInvoiceAmount(cgst)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SGST ({sgstRate}%)</span>
                  <span className="tabular-nums">{formatInvoiceAmount(sgst)}</span>
                </div>
                <p className="text-[11px] text-[#786B65]/80 italic pt-0.5">
                  Taxes are calculated according to the restaurant’s billing configuration.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Voluntary Staff Tip (if set) */}
        {tipAmount > 0 && (
          <div className="flex justify-between items-center font-medium text-[#672413]">
            <span>Staff tip</span>
            <span className="font-semibold">{formatInvoiceAmount(tipAmount)}</span>
          </div>
        )}
      </div>

      {/* Interactive Tip Selector (if enabled) */}
      {showTipSelector && (
        <div className="py-3.5 border-b border-[#5B3021]/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#24130E]">Add a tip for the staff</span>
            <span className="text-xs font-semibold text-[#87351F]">
              {tipAmount > 0 ? formatInvoiceAmount(tipAmount) : 'Optional'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Staff Tip Options">
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
                  className={`min-h-[42px] px-2 py-1.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#87351F] text-white border-[#87351F] shadow-2xs'
                      : 'bg-[#F5ECE6]/60 text-[#24130E] hover:bg-[#F5ECE6] border-[#5B3021]/15'
                  }`}
                >
                  <span>{option.label}</span>
                  {option.percentage > 0 && (
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-white/90' : 'text-[#786B65]'
                      }`}
                    >
                      ({formatInvoiceAmount(calculatedAmount)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedTipOption === 'custom' && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[#786B65]">₹</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={customTipAmount}
                  onChange={(e) => setCustomTipAmount(e.target.value)}
                  placeholder="Enter custom tip amount"
                  aria-label="Custom tip amount"
                  className="w-full min-h-[40px] bg-[#F5ECE6]/40 border border-[#5B3021]/20 rounded-xl py-1.5 pl-7 pr-3 text-xs font-bold text-[#24130E] focus:outline-none focus:ring-2 focus:ring-[#87351F]"
                />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Total Payable Summary Row */}
      <div className="pt-3.5 flex justify-between items-baseline">
        <div>
          <span className="text-[15px] font-bold text-[#24130E]">Total payable</span>
          <span className="text-[11.5px] text-[#786B65] block font-medium">Inclusive of all taxes</span>
        </div>
        <span className="text-xl sm:text-2xl font-extrabold text-[#87351F] [font-variant-numeric:tabular-nums]">
          {formatInvoiceAmount(totalPayable)}
        </span>
      </div>

      {/* How was this total calculated explainer */}
      <div className="mt-3.5 pt-3 border-t border-[#5B3021]/10">
        <button
          type="button"
          onClick={() => setIsExplainerExpanded(!isExplainerExpanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#786B65] hover:text-[#87351F] transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#786B65]" />
            How was this total calculated?
          </span>
          <motion.span animate={{ rotate: isExplainerExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isExplainerExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden text-xs text-[#786B65] space-y-2 pt-2.5"
            >
              <div>
                <span className="font-bold text-[#24130E] block">Government GST ({taxRate}%)</span>
                <p>Calculated on the net eligible food subtotal.</p>
              </div>
              <div>
                <span className="font-bold text-[#24130E] block">Packaging & Service</span>
                <p>Only standard packaging and configured bill charges are included.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BillingSummary;

