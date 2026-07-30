import React, { useState } from 'react';
import Icon from '../common/Icon';

const CustomerPreferencesModal = ({
  isOpen,
  onClose,
  customerMemory,
  onSaveMemory,
  onForgetMemory
}) => {
  const [step, setStep] = useState(customerMemory ? 'VIEW_PREFERENCES' : 'SELECT_CONSENT');

  // Consent states - NONE PRESELECTED
  const [consent, setConsent] = useState({
    favourites: false,
    spicePreference: false,
    dietaryPreference: false,
    allergyInformation: false,
    pastOrders: false,
    preferredSection: false,
    celebrations: false,
    loyalty: false
  });

  const [spiceLevel, setSpiceLevel] = useState('MEDIUM');
  const [dietary, setDietary] = useState('VEGETARIAN');
  const [allergyNote, setAllergyNote] = useState('');
  const [savedAllergyConsent, setSavedAllergyConsent] = useState(false);

  if (!isOpen) return null;

  const handleToggleConsent = (key) => {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = () => {
    const memoryPayload = {
      customerMemoryId: `MEM-${Math.floor(100 + Math.random() * 900)}`,
      sessionType: 'QR_TABLE_SESSION',
      consent,
      favourites: customerMemory?.favourites || ['meals-aritaku-veg', 'mcveg-paneer-butter-masala'],
      spicePreference: consent.spicePreference ? spiceLevel : null,
      dietaryPreference: consent.dietaryPreference ? dietary : null,
      allergies: consent.allergyInformation && savedAllergyConsent && allergyNote ? [allergyNote] : [],
      preferredSection: consent.preferredSection ? 'Window Bay' : null,
      celebrations: consent.celebrations ? ['Birthday - Oct 14'] : [],
      loyaltyBalance: consent.loyalty ? 120 : 0,
      consentUpdatedAt: new Date().toLocaleString()
    };

    onSaveMemory(memoryPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-on-surface">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-high border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
              <Icon name="bookmark_heart" className="text-xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Session Preferences</h3>
              <p className="text-xs text-on-surface-variant">Instant QR Session · No Registration Needed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest"
          >
            <Icon name="close" className="text-sm" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
          {customerMemory && step === 'VIEW_PREFERENCES' ? (
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-success text-xs flex items-center gap-1.5">
                    <Icon name="check_circle" className="text-base" />
                    Session Preferences Saved
                  </span>
                  <span className="text-[11px] font-semibold text-success bg-success/15 px-2 py-0.5 rounded-full">
                    QR Table Session Active
                  </span>
                </div>
                <div className="text-xs space-y-1 text-on-surface-variant pt-1 border-t border-success/20">
                  {customerMemory.dietaryPreference && (
                    <p>• Dietary: <strong>{customerMemory.dietaryPreference}</strong></p>
                  )}
                  {customerMemory.spicePreference && (
                    <p>• Spice: <strong>{customerMemory.spicePreference}</strong></p>
                  )}
                  {customerMemory.favourites?.length > 0 && (
                    <p>• Favourites: <strong>{customerMemory.favourites.length} saved dishes</strong></p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('SELECT_CONSENT')}
                  className="flex-1 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl border border-outline-variant/30"
                >
                  Edit Preferences
                </button>
                <button
                  onClick={() => {
                    onForgetMemory();
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-error/10 hover:bg-error/20 text-error font-semibold text-xs rounded-xl border border-error/30"
                >
                  Reset Session Preferences
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-outline-variant/20 pb-2">
                <h4 className="font-bold text-on-surface text-sm">Choose what you want us to remember</h4>
                <p className="text-xs text-on-surface-variant">All options are opt-in and can be removed at any time.</p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'favourites', label: 'Favourite dishes' },
                  { key: 'spicePreference', label: 'Usual spice preference' },
                  { key: 'dietaryPreference', label: 'Dietary preference (Vegetarian / Non-Veg)' },
                  { key: 'pastOrders', label: 'Past orders history for re-ordering' },
                  { key: 'preferredSection', label: 'Preferred seating area (subject to availability)' },
                  { key: 'celebrations', label: 'Occasion dates (Birthday / Anniversary)' },
                  { key: 'loyalty', label: 'Prototype loyalty balance tracking' }
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-3 p-2.5 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input
                      type="checkbox"
                      checked={consent[opt.key]}
                      onChange={() => handleToggleConsent(opt.key)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-on-surface">{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Sensitive Allergy Option with Separate Consent */}
              <div className="p-3 bg-error/10 border border-error/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={consent.allergyInformation}
                    onChange={() => handleToggleConsent('allergyInformation')}
                    className="w-4 h-4 rounded text-error focus:ring-error mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-error block">Allergy information memory</span>
                    <p className="text-[11px] text-error/80">
                      Allergy information is sensitive and will be used only to help staff review future food requests.
                    </p>
                  </div>
                </div>

                {consent.allergyInformation && (
                  <div className="pt-2 border-t border-error/20 space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. Peanut allergy, Dairy intolerance"
                      value={allergyNote}
                      onChange={(e) => setAllergyNote(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface border border-error/40 rounded-lg text-xs"
                    />
                    <label className="flex items-center gap-2 text-[11px] text-error font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={savedAllergyConsent}
                        onChange={(e) => setSavedAllergyConsent(e.target.checked)}
                        className="rounded text-error"
                      />
                      Explicitly confirm saving this allergy concern
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-surface-container text-on-surface font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-6 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow"
                >
                  Save My Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPreferencesModal;
