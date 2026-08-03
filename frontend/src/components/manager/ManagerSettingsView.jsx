import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getStoredManagerSettings, setStoredManagerSettings, addAuditLog } from '../../services/managerService';
import { restaurantConfig } from '../../config/restaurantConfig';
import { useToast } from '../../context/ToastContext';
import {
  Globe,
  Coins,
  Clock,
  Receipt,
  Percent,
  HeartHandshake,
  FileText,
  Users,
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';

const ManagerSettingsView = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(() => getStoredManagerSettings());

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setStoredManagerSettings(settings);
    addAuditLog('Regional Settings Updated', 'Updated regional, currency, tax, invoice & payroll display preferences', 'system');
    showToast('Regional & Billing configuration saved successfully!', 'success');
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6">

      {/* Top Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-primary" />
            Regional &amp; Billing Configuration
          </h2>
          <p className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-secondary shrink-0" />
            These settings control how values are displayed across the customer, waiter, counter and manager interfaces.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-primary hover:brightness-110 text-on-primary font-semibold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </motion.div>

      {/* 7 Logically Structured Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Section 1: Region */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Globe className="w-4 h-4 text-primary" />
            1. Region &amp; Country
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Country Name</label>
              <input
                type="text"
                value={settings.country || restaurantConfig.countryName}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Country Code (ISO)</label>
              <input
                type="text"
                value={settings.countryCode || restaurantConfig.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium uppercase focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Section 2: Currency */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Coins className="w-4 h-4 text-secondary" />
            2. Currency &amp; Formatting
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Currency Code</label>
                <input
                  type="text"
                  value={settings.currencyCode || restaurantConfig.currencyCode}
                  onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium uppercase focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={settings.currency || restaurantConfig.currencySymbol}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Currency Formatting Sample</label>
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl font-mono text-sm text-primary font-bold">
                ₹1,25,000.00 <span className="text-xs text-on-surface-variant font-sans font-normal">(Indian digit grouping format)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Date and Time */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Clock className="w-4 h-4 text-tertiary" />
            3. Time Zone &amp; Date Formats
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Timezone Location</label>
              <input
                type="text"
                readOnly
                value={restaurantConfig.timezone}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface-variant font-mono focus:outline-none cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Date Display Format</label>
                <input
                  type="text"
                  readOnly
                  value="27 Jul 2026 (DD MMM YYYY)"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface-variant font-medium focus:outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Time Display Format</label>
                <input
                  type="text"
                  readOnly
                  value="5:54 PM (12-hour)"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface-variant font-medium focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 4: Tax Display */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Percent className="w-4 h-4 text-amber-600" />
            4. Tax Structure &amp; Pricing Mode
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Tax Structure</label>
                <input
                  type="text"
                  readOnly
                  value="GST @ 5%"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-semibold focus:outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">CGST Component</label>
                <input
                  type="text"
                  readOnly
                  value="CGST @ 2.5%"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-semibold focus:outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">SGST Component</label>
                <input
                  type="text"
                  readOnly
                  value="SGST @ 2.5%"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-semibold focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 rounded-xl text-on-surface-variant text-[11px] space-y-1">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Price Mode: Tax Exclusive
              </p>
              <p>
                Prices are displayed net of GST. GST @ 5% is calculated on the bill subtotal during checkout.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 5: Tips and Charges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            5. Tips &amp; Billing Policy
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Service Charge Status</label>
                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface-variant font-semibold">
                  Disabled (0%)
                </div>
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Default Tip Selection</label>
                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface-variant font-semibold">
                  No Tip (0%)
                </div>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Packaging Charge Policy</label>
              <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface-variant font-semibold">
                Enabled for takeout &amp; delivery orders
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 6: Invoice Information */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <FileText className="w-4 h-4 text-cyan-600" />
            6. Invoice &amp; Tax Identifiers
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Document Title</label>
                <input
                  type="text"
                  value={settings.documentTitle || restaurantConfig.invoiceRules.documentTitle}
                  onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Invoice Prefix</label>
                <input
                  type="text"
                  value={settings.invoicePrefix || restaurantConfig.invoiceRules.invoicePrefix}
                  onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium uppercase focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={settings.gstin || restaurantConfig.invoiceRules.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono font-bold uppercase focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">FSSAI License Number</label>
                <input
                  type="text"
                  value={settings.fssai || restaurantConfig.invoiceRules.fssaiNumber}
                  onChange={(e) => handleInputChange('fssai', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono font-bold focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 7: Payroll Display */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4 lg:col-span-2">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Users className="w-4 h-4 text-indigo-600" />
            7. Payroll &amp; Staff Compensation Display
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Default Salary Period</label>
              <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-on-surface">
                Monthly (₹/month)
              </div>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Payroll Currency</label>
              <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-on-surface">
                Indian Rupee (INR)
              </div>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Overtime Display Mode</label>
              <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-on-surface">
                Hourly Overtime Rate (e.g. ₹120/hour)
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </form>
  );
};

export default ManagerSettingsView;
