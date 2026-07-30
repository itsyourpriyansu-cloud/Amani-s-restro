import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/* Shared visual language for the manager operations dashboard: status badges,
   compact stat tiles, a segmented control, contextual action buttons, and a
   right-side drawer used for progressive disclosure. Kept together since they
   are small, tightly related, and used across every dashboard section. */

const TONE_CLASSES = {
  neutral: 'bg-surface-container text-on-surface-variant border-outline-variant/40',
  primary: 'bg-primary/10 text-primary border-primary/25',
  amber: 'bg-amber-500/10 text-amber-800 border-amber-500/30',
  red: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
  green: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  violet: 'bg-violet-500/10 text-violet-700 border-violet-500/30',
  blue: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
};

/* An order can be flagged isDelayed before it actually exceeds the 20-minute prep
   baseline (e.g. an ETA push-back just issued). Only show a minute count once that
   baseline is actually exceeded — otherwise "0 min overdue" reads as a contradiction. */
export const overdueLabel = (order) =>
  order.elapsedMinutes > 20 ? `${order.elapsedMinutes - 20} min overdue` : 'Delayed';

export const StatusBadge = ({ tone = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${TONE_CLASSES[tone] || TONE_CLASSES.neutral} ${className}`}
  >
    {children}
  </span>
);

export const StatTile = ({ icon: Icon, label, value, tone = 'neutral', onClick }) => {
  const toneText = {
    neutral: 'text-on-surface',
    amber: 'text-amber-700',
    red: 'text-rose-700',
  }[tone] || 'text-on-surface';

  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-3 text-left ${onClick ? 'hover:bg-surface-container-low transition-colors cursor-pointer rounded-xl' : ''}`}
    >
      {Icon && <Icon className={`w-4 h-4 shrink-0 ${toneText}`} />}
      <div className="min-w-0">
        <div className={`text-xl font-extrabold leading-none tabular-nums ${toneText}`}>{value}</div>
        <div className="text-[11px] font-semibold text-on-surface-variant mt-1 truncate">{label}</div>
      </div>
    </Comp>
  );
};

export const SegmentedControl = ({ options, value, onChange, size = 'md' }) => (
  <div className="inline-flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 gap-0.5">
    {options.map((opt) => {
      const optValue = typeof opt === 'string' ? opt : opt.value;
      const optLabel = typeof opt === 'string' ? opt : opt.label;
      const isActive = value === optValue;
      return (
        <button
          key={optValue}
          type="button"
          onClick={() => onChange(optValue)}
          aria-pressed={isActive}
          className={`rounded-lg font-bold transition-all ${size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} ${
            isActive ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {optLabel}
        </button>
      );
    })}
  </div>
);

const BUTTON_BASE = 'inline-flex items-center justify-center gap-1.5 font-bold transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed';
const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-[11px] rounded-lg',
  md: 'px-4 py-2 text-xs rounded-xl min-h-[40px]',
};
const BUTTON_VARIANTS = {
  primary: 'bg-primary text-on-primary shadow-xs hover:bg-primary-container',
  secondary: 'bg-surface text-primary border border-outline-variant/50 hover:bg-surface-container-low',
  tertiary: 'text-primary hover:underline px-1',
};

export const ContextualButton = ({ children, variant = 'secondary', size = 'md', icon: Icon, className = '', ...rest }) => (
  <button
    type="button"
    className={`${BUTTON_BASE} ${variant === 'tertiary' ? '' : BUTTON_SIZES[size]} ${BUTTON_VARIANTS[variant]} ${className}`}
    {...rest}
  >
    {Icon && <Icon className="w-3.5 h-3.5" />}
    <span>{children}</span>
  </button>
);

/* Right-side panel for progressive disclosure (order/table/bill/issue/feedback detail).
   Traps focus loosely (returns focus to trigger on close) and closes on Escape. */
export const OperationalDrawer = ({ isOpen, onClose, title, eyebrow, children, footer }) => {
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      panelRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-[480px] h-full bg-surface-container-lowest shadow-2xl flex flex-col outline-none"
          >
            <div className="flex items-start justify-between px-6 py-5 border-b border-outline-variant/25 shrink-0">
              <div className="min-w-0">
                {eyebrow && <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-0.5">{eyebrow}</div>}
                <h3 className="text-lg font-bold text-on-surface truncate">{title}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                title="Close"
                className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-outline-variant/25 shrink-0">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-outline-variant/15 last:border-0 text-xs">
    <span className="text-on-surface-variant font-medium">{label}</span>
    <span className="text-on-surface font-bold text-right">{value}</span>
  </div>
);

export const SectionHeading = ({ title, subtitle, count, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-outline-variant/20">
    <div>
      <h3 className="text-base font-bold text-on-surface">{title}</h3>
      {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3 shrink-0">
      {count}
      {action}
    </div>
  </div>
);
