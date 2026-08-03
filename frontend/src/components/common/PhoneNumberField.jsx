import React from 'react';
import { ChevronDown } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurantConfig';

/**
 * India-only WhatsApp mobile number field. Displays a fixed +91 country prefix
 * and accepts a 10-digit local number. Callers own validation via `error`.
 */
const PhoneNumberField = ({ id, value, onChange, error, label = 'WhatsApp Number' }) => {
  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    onChange(digitsOnly);
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="font-bold text-on-surface text-xs block">
        {label}
      </label>
      <div
        className={`flex items-stretch rounded-xl border bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 ${
          error ? 'border-error' : 'border-outline-variant'
        }`}
      >
        <div className="flex items-center gap-1 px-3 bg-surface-container-low border-r border-outline-variant text-xs font-bold text-on-surface-variant shrink-0">
          <span>{restaurantConfig.countryName}</span>
          <span>+{restaurantConfig.whatsapp.countryCode}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </div>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={value}
          onChange={handleChange}
          placeholder="98765 43210"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-transparent outline-none text-on-surface"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[11px] text-error font-semibold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberField;
