import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Plus, Minus, AlertTriangle, Sparkles, Info } from 'lucide-react';
import { formatMenuPrice } from '../../utils/formatters';
import ResponsiveImage from '../common/ResponsiveImage';

export default function CustomizationModal({ isOpen, onClose, dish, onAddToCart, initialSelections = null }) {
  // Initialize state based on dish modifier groups and initialSelections (for edit flow)
  const [selectedOptions, setSelectedOptions] = useState({});
  const [makeVegan, setMakeVegan] = useState(false);
  const [makeJain, setMakeJain] = useState(false);
  const [allergyChecked, setAllergyChecked] = useState(false);
  const [allergyText, setAllergyText] = useState('');
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [conflictMessage, setConflictMessage] = useState('');

  const shouldReduceMotion = useReducedMotion();
  const sheetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);

  // Lock background scroll and hide it from the page behind the sheet while open.
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('customization-modal-open');
    return () => document.body.classList.remove('customization-modal-open');
  }, [isOpen]);

  // Escape closes the sheet; focus moves to the close button on open and is
  // restored to whatever triggered the sheet once it closes.
  useEffect(() => {
    if (!isOpen) return;
    restoreFocusRef.current = document.activeElement;
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab' && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      if (restoreFocusRef.current && typeof restoreFocusRef.current.focus === 'function') {
        restoreFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Initialize defaults on open or dish change
  useEffect(() => {
    if (!dish) return;

    if (initialSelections) {
      setSelectedOptions(initialSelections.selectedOptions || {});
      setMakeVegan(initialSelections.makeVegan || false);
      setMakeJain(initialSelections.jainPreparation || false);
      setAllergyChecked(!!initialSelections.allergyAlert);
      setAllergyText(initialSelections.allergyAlert || '');
      setSpecialInstruction(initialSelections.specialInstruction || '');
      setQuantity(initialSelections.quantity || 1);
    } else {
      const defaults = {};
      (dish.modifierGroups || []).forEach(group => {
        if (group.type === 'SINGLE_SELECT') {
          // Default required groups to first free option or first option
          if (group.required) {
            const freeOption = group.options.find(o => o.priceDelta === 0) || group.options[0];
            if (freeOption) {
              defaults[group.id] = [freeOption.id];
            }
          } else {
            // Default non-required single select (like combo) to 'none' or unselected
            const noneOption = group.options.find(o => o.id === 'none');
            if (noneOption) {
              defaults[group.id] = [noneOption.id];
            }
          }
        } else if (group.type === 'MULTI_SELECT') {
          defaults[group.id] = [];
        }
      });
      setSelectedOptions(defaults);
      setMakeVegan(false);
      setMakeJain(false);
      setAllergyChecked(false);
      setAllergyText('');
      setSpecialInstruction('');
      setQuantity(1);
    }
    setConflictMessage('');
  }, [dish, isOpen, initialSelections]);

  // Handle single select option change
  const handleSingleSelect = (groupId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: [optionId]
    }));
  };

  // Handle multi select option toggle
  const handleMultiSelect = (groupId, optionId) => {
    setSelectedOptions(prev => {
      const current = prev[groupId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter(id => id !== optionId) };
      } else {
        return { ...prev, [groupId]: [...current, optionId] };
      }
    });
  };

  // Vegan Toggle Handler with conflict checks
  const handleVeganToggle = (e) => {
    const isChecked = e.target.checked;
    setMakeVegan(isChecked);
    if (isChecked) {
      // Conflict check: check if dairy cooking fat or cheese is selected
      const currentFat = selectedOptions['cooking-fat']?.[0];
      const currentExtras = selectedOptions['extras'] || [];
      let conflict = '';

      if (currentFat === 'butter' || currentFat === 'ghee') {
        // Reset cooking fat to oil
        handleSingleSelect('cooking-fat', 'oil');
        conflict = 'Butter/Ghee reset to Standard Oil for Vegan preparation.';
      }
      if (currentExtras.includes('extra-cheese') || currentExtras.includes('cheese')) {
        setSelectedOptions(prev => ({
          ...prev,
          extras: (prev.extras || []).filter(id => id !== 'extra-cheese' && id !== 'cheese')
        }));
        conflict = 'Extra cheese removed as it is incompatible with Vegan preparation.';
      }
      if (conflict) {
        setConflictMessage(conflict);
        setTimeout(() => setConflictMessage(''), 4000);
      }
    }
  };

  // Jain Toggle Handler
  const handleJainToggle = (e) => {
    const isChecked = e.target.checked;
    setMakeJain(isChecked);
    if (isChecked) {
      // Auto select onion/garlic removals if remove group exists
      const removeGroup = (dish.modifierGroups || []).find(g => g.id === 'remove');
      if (removeGroup) {
        const jainRemovals = removeGroup.options.map(o => o.id);
        setSelectedOptions(prev => ({
          ...prev,
          remove: Array.from(new Set([...(prev.remove || []), ...jainRemovals]))
        }));
      }
    }
  };

  // Calculate Unit Price and Total Price
  const calculatedUnitPrice = useMemo(() => {
    let unitPrice = dish?.price || 0;

    (dish?.modifierGroups || []).forEach(group => {
      const selectedIds = selectedOptions[group.id] || [];
      group.options.forEach(option => {
        if (selectedIds.includes(option.id)) {
          unitPrice += (option.priceDelta || option.price || 0);
        }
      });
    });

    return unitPrice;
  }, [dish, selectedOptions]);

  const itemTotal = calculatedUnitPrice * quantity;

  // Validation: Check if required single selects have selection
  const isValid = useMemo(() => {
    for (const group of (dish?.modifierGroups || [])) {
      if (group.required) {
        const selected = selectedOptions[group.id];
        if (!selected || selected.length === 0) {
          return false;
        }
      }
    }
    if (allergyChecked && !allergyText.trim()) {
      return false;
    }
    return true;
  }, [dish, selectedOptions, allergyChecked, allergyText]);

  // Handle Add to Cart submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    // Collect structured selected modifier summaries for display
    const formattedModifiers = [];

    (dish.modifierGroups || []).forEach(group => {
      const selectedIds = selectedOptions[group.id] || [];
      group.options.forEach(option => {
        if (selectedIds.includes(option.id) && option.id !== 'none') {
          formattedModifiers.push({
            groupId: group.id,
            groupLabel: group.label,
            optionId: option.id,
            label: option.label || option.name,
            priceDelta: option.priceDelta || 0,
          });
        }
      });
    });

    if (makeVegan) {
      formattedModifiers.unshift({
        groupId: 'dietary-vegan',
        groupLabel: 'Dietary Preparation',
        optionId: 'vegan-prep',
        label: 'Vegan Preparation (Dairy removed/replaced)',
        priceDelta: 0
      });
    }

    if (makeJain) {
      formattedModifiers.unshift({
        groupId: 'dietary-jain',
        groupLabel: 'Dietary Preparation',
        optionId: 'jain-prep',
        label: 'Jain Preparation (No onion, garlic, root veg)',
        priceDelta: 0
      });
    }

    const payload = {
      dish,
      quantity,
      unitPrice: calculatedUnitPrice,
      totalPrice: itemTotal,
      selectedOptions,
      formattedModifiers,
      makeVegan,
      jainPreparation: makeJain,
      allergyAlert: allergyChecked ? allergyText.trim() : null,
      specialInstruction: specialInstruction.trim(),
    };

    onAddToCart(payload);
    onClose();
  };

  if (!isOpen || !dish) return null;

  const ctaLabel = initialSelections
    ? `Update Cart · ${formatMenuPrice(itemTotal)}`
    : `Add to Cart · ${formatMenuPrice(itemTotal)}`;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : undefined}
          onClick={onClose}
          className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Sheet */}
        <motion.div
          ref={sheetRef}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute inset-x-0 bottom-0 flex flex-col bg-background rounded-t-[20px] shadow-2xl overflow-hidden"
          style={{ maxHeight: 'calc(100dvh - 12px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="customization-title"
          aria-describedby="customization-subtitle"
        >
          {/* Sticky Header */}
          <div className="shrink-0 px-4 py-3.5 border-b border-border flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 id="customization-title" className="text-base font-bold text-ink leading-snug line-clamp-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span className="truncate">Customize {dish.name}</span>
              </h2>
              <p id="customization-subtitle" className="text-xs text-muted mt-0.5">Base price: {formatMenuPrice(dish.price)}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="w-11 h-11 -m-1 shrink-0 rounded-full hover:bg-surface-container transition-colors text-muted flex items-center justify-center"
              aria-label="Close customization"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conflict Alert Banner */}
          {conflictMessage && (
            <div className="shrink-0 bg-warning/10 border-l-4 border-warning text-ink p-3 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{conflictMessage}</span>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-5 text-sm" style={{ touchAction: 'pan-y' }}>
            {/* Dish Quick Summary */}
            <div className="flex gap-3 items-center bg-surface-container p-3 rounded-xl border border-border">
              {dish.image && (
                <ResponsiveImage src={dish.image} alt={dish.name} aspectRatio="1 / 1" rounded="rounded-lg" className="w-16 h-16 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs text-muted line-clamp-2">{dish.shortDescription || dish.description}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-muted">
                  <span>Portion: {dish.portionLabel || 'Regular'}</span>
                  <span aria-hidden="true">•</span>
                  <span>Serves: {dish.serves || '1 person'}</span>
                </div>
              </div>
            </div>

            {/* Special Dietary Preparation Switches */}
            {(dish.veganAvailable || dish.jainAvailable) && (
              <div className="space-y-3 bg-success/10 border border-success/30 p-4 rounded-xl">
                <h3 className="font-semibold text-success text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Dietary Preparation Options
                </h3>

                {dish.veganAvailable && (
                  <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={makeVegan}
                      onChange={handleVeganToggle}
                      className="mt-0.5 rounded accent-success focus:ring-success h-4 w-4"
                    />
                    <div>
                      <span className="font-medium text-ink">Make it Vegan</span>
                      <p className="text-xs text-muted">Butter and dairy toppings will be removed or replaced.</p>
                    </div>
                  </label>
                )}

                {dish.jainAvailable && (
                  <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={makeJain}
                      onChange={handleJainToggle}
                      className="mt-0.5 rounded accent-success focus:ring-success h-4 w-4"
                    />
                    <div>
                      <span className="font-medium text-ink">Jain preparation</span>
                      <p className="text-xs text-muted">
                        Prepared without onion, garlic, and root vegetables where supported by this recipe.
                      </p>
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* Modifier Groups */}
            {(dish.modifierGroups || []).map((group) => {
              const selectedIds = selectedOptions[group.id] || [];

              return (
                <div key={group.id} className="space-y-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-ink text-[15px]">
                      {group.label}
                      {group.required && <span className="text-danger ml-1 text-xs font-normal">*Required</span>}
                    </h3>
                    <span className="text-xs text-muted">
                      {group.type === 'SINGLE_SELECT' ? 'Select 1 option' : 'Select optional extras'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((option) => {
                      const isSelected = selectedIds.includes(option.id);
                      // Incompatibility check for vegan mode
                      const isVeganIncompatible =
                        makeVegan &&
                        (option.id === 'butter' || option.id === 'ghee' || option.id === 'extra-cheese' || option.id === 'cheese');

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between min-h-[48px] p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isVeganIncompatible
                              ? 'bg-surface-container border-border opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'bg-primary-container border-primary text-on-primary-container'
                              : 'bg-surface-container-lowest border-border hover:border-outline text-text'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type={group.type === 'SINGLE_SELECT' ? 'radio' : 'checkbox'}
                              name={`group-${group.id}`}
                              disabled={isVeganIncompatible}
                              checked={isSelected}
                              onChange={() => {
                                if (isVeganIncompatible) {
                                  setConflictMessage(`${option.label} is unavailable with the vegan preparation option.`);
                                  setTimeout(() => setConflictMessage(''), 3500);
                                  return;
                                }
                                if (group.type === 'SINGLE_SELECT') {
                                  handleSingleSelect(group.id, option.id);
                                } else {
                                  handleMultiSelect(group.id, option.id);
                                }
                              }}
                              className="accent-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="font-medium">{option.label || option.name}</span>
                          </div>
                          <span className="text-muted font-mono text-[11px]">
                            {option.priceDelta && option.priceDelta > 0
                              ? `+${formatMenuPrice(option.priceDelta)}`
                              : ''}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Allergy Declaration Section */}
            <div className="bg-danger/10 border border-danger/30 p-4 rounded-xl space-y-3">
              <h3 className="font-semibold text-danger text-xs tracking-wider uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Allergy Information
              </h3>
              <p className="text-xs text-text -mt-2">Tell the kitchen if this order needs allergy review.</p>

              <label className="flex items-start gap-2.5 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={allergyChecked}
                  onChange={(e) => {
                    setAllergyChecked(e.target.checked);
                    if (!e.target.checked) setAllergyText('');
                  }}
                  className="mt-0.5 rounded accent-danger focus:ring-danger h-4 w-4"
                />
                <span className="font-medium text-ink text-xs">
                  I need the kitchen to review an allergy concern
                </span>
              </label>

              {allergyChecked && (
                <div className="space-y-2 pt-1">
                  <label htmlFor="allergy-description" className="block text-xs font-medium text-danger">
                    Describe the allergy:
                  </label>
                  <textarea
                    id="allergy-description"
                    rows={2}
                    value={allergyText}
                    onChange={(e) => setAllergyText(e.target.value)}
                    placeholder="e.g. Peanut allergy, severe dairy allergy..."
                    className="w-full text-xs p-2.5 border border-danger/40 rounded-lg focus:ring-2 focus:ring-danger focus:border-danger bg-surface-container-lowest"
                    required
                  />
                  <p className="text-[11px] text-danger flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    The restaurant will review the request, but cross-contact may still be possible.
                  </p>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label htmlFor="special-instructions" className="block text-xs font-semibold text-text">
                Special Instructions (Optional)
              </label>
              <textarea
                id="special-instructions"
                rows={3}
                value={specialInstruction}
                onChange={(e) => setSpecialInstruction(e.target.value)}
                placeholder="e.g. Keep chutney separate or use less oil"
                className="w-full text-xs p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest"
              />
            </div>
          </div>

          {/* Sticky Footer — quantity and Add to Cart always stay together and visible */}
          <div
            className="shrink-0 border-t border-border bg-background/98 px-4 pt-3 flex items-center gap-3"
            style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1 shrink-0" role="group" aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center hover:bg-surface-container-high text-text disabled:opacity-40 cursor-pointer"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-7 text-center font-bold text-ink text-sm" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center hover:bg-surface-container-high text-text cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 min-w-0 min-h-[46px] h-12 bg-primary hover:brightness-90 disabled:bg-surface-container-high disabled:text-muted text-on-primary font-bold px-4 rounded-xl transition-colors shadow-md flex items-center justify-between gap-2 whitespace-nowrap cursor-pointer text-sm"
              aria-live="polite"
            >
              <span className="truncate">{initialSelections ? 'Update Cart' : 'Add to Cart'}</span>
              <span className="bg-on-primary/20 px-2.5 py-1 rounded-lg text-xs font-extrabold shrink-0">
                {formatMenuPrice(itemTotal)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
