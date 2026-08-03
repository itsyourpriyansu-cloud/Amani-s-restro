import React, { useEffect, useRef, useState } from 'react';
import { RESTAURANT_TRUST_PROFILE, VERIFIED_CUSTOMER_PHOTOS, VERIFIED_CUSTOMER_REVIEWS } from '../../data/restaurantPrototypeData';
import Icon from '../common/Icon';
import {
  ShieldCheck,
  Utensils,
  Award,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  FileBadge,
  Star,
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Utensils },
  { id: 'hygiene', label: 'Hygiene', icon: ShieldCheck },
  { id: 'credentials', label: 'Credentials', icon: FileBadge },
];

const RestaurantTrustProfileModal = ({ isOpen, onClose, onRequestAssistance }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isChefExpanded, setIsChefExpanded] = useState(false);
  const [isSourcingExpanded, setIsSourcingExpanded] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [showCalculationModal, setShowCalculationModal] = useState(false);

  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);

  // Focus management + focus trap + Escape-to-close, mirroring CustomizationModal's pattern.
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
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
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

  if (!isOpen) return null;

  const profile = RESTAURANT_TRUST_PROFILE;
  const sourcingSummary = (profile.ingredientSourcing || []).map((src) => src.label).join(' · ');
  const reviewCount = VERIFIED_CUSTOMER_REVIEWS.length;
  const photoCount = VERIFIED_CUSTOMER_PHOTOS.length;
  const avgRating =
    reviewCount > 0
      ? (VERIFIED_CUSTOMER_REVIEWS.reduce((sum, rev) => sum + rev.rating, 0) / reviewCount).toFixed(1)
      : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trust-profile-title"
        className="bg-surface border border-outline-variant rounded-t-[20px] sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] sm:max-h-[80vh] flex flex-col overflow-hidden text-on-surface"
      >
        {/* Mobile Grab Handle Bar */}
        <div className="w-12 h-1 bg-outline rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Header — compact, no gradient, no competing badge */}
        <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 border-b border-outline-variant/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/Amanis Logo Final.svg"
              alt="Amani's Kitchen Logo"
              className="h-12 w-auto max-w-[180px] object-contain shrink-0"
            />
            <p className="text-[12.5px] text-on-surface-variant leading-tight border-l border-outline-variant/60 pl-2.5">Kitchen transparency</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close kitchen trust profile"
            className="w-11 h-11 -m-1 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Icon name="close" className="text-lg" />
          </button>
        </div>

        {/* Verification summary — one treatment only, icon + text, never color alone */}
        <div className="px-4 sm:px-5 py-3 flex items-start gap-2.5 border-b border-outline-variant/40 shrink-0">
          <CheckCircle2 className="w-[18px] h-[18px] text-success shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13.5px] leading-snug">
            <span className="font-semibold text-on-surface">Verified kitchen</span>
            <span className="text-on-surface-variant"> · Reviewed {profile.hygieneAudit.lastAuditDate}</span>
          </p>
        </div>

        {/* Segmented tab navigation — exactly 3, never clipped, no horizontal scroll */}
        <div
          role="tablist"
          aria-label="Trust profile sections"
          className="grid grid-cols-3 gap-1.5 px-4 sm:px-5 py-2.5 border-b border-outline-variant/40 shrink-0"
        >
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`trust-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`trust-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`h-[42px] rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <TabIcon className="w-[15px] h-[15px]" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'overview' && (
            <div id="trust-panel-overview" role="tabpanel" aria-labelledby="trust-tab-overview" className="px-4 sm:px-5 py-4">
              {/* Culinary standards */}
              <section>
                <h4 className="text-[15px] font-semibold text-on-surface mb-1.5">Culinary standards</h4>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{profile.shortKitchenIntroduction}</p>
              </section>

              <div className="h-px bg-outline-variant/50 my-4" aria-hidden="true" />

              {/* Chef — compact row, everything else behind "View profile" */}
              <section>
                <div className="flex items-center gap-3">
                  <img
                    src={profile.chefProfile.image}
                    alt={profile.chefProfile.name}
                    className="w-[52px] h-[52px] rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold text-on-surface truncate">{profile.chefProfile.name}</p>
                    <p className="text-[12.5px] text-on-surface-variant truncate">
                      {profile.chefProfile.role} · {profile.chefProfile.experienceLabel}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChefExpanded((v) => !v)}
                  aria-expanded={isChefExpanded}
                  aria-controls="chef-profile-detail"
                  className="mt-2 text-[13px] font-semibold text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  {isChefExpanded ? 'Hide profile' : 'View profile'}
                  {isChefExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isChefExpanded && (
                  <div id="chef-profile-detail" className="mt-3 space-y-2.5 text-[13px]">
                    <blockquote className="text-on-surface-variant italic leading-relaxed border-l-2 border-primary/30 pl-3">
                      "{profile.chefProfile.philosophy}"
                    </blockquote>
                    <p className="text-on-surface-variant leading-relaxed">{profile.chefProfile.story}</p>
                    <p className="text-on-surface">
                      <span className="font-semibold">Speciality:</span> {profile.chefProfile.speciality}
                    </p>
                  </div>
                )}
              </section>

              <div className="h-px bg-outline-variant/50 my-4" aria-hidden="true" />

              {/* Ingredient sourcing */}
              <section>
                <h4 className="text-[15px] font-semibold text-on-surface mb-1.5">Ingredient sourcing</h4>
                <p className="text-[14px] text-on-surface-variant">{sourcingSummary}</p>
                <button
                  type="button"
                  onClick={() => setIsSourcingExpanded((v) => !v)}
                  aria-expanded={isSourcingExpanded}
                  aria-controls="sourcing-detail"
                  className="mt-2 text-[13px] font-semibold text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  {isSourcingExpanded ? 'Hide sourcing details' : 'View sourcing details'}
                  {isSourcingExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isSourcingExpanded && (
                  <div id="sourcing-detail" className="mt-3 space-y-2.5 text-[13px]">
                    {profile.ingredientSourcing.map((src, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="font-semibold text-on-surface">{src.label}</p>
                          <p className="text-on-surface-variant">{src.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="h-px bg-outline-variant/50 my-4" aria-hidden="true" />

              {/* Verified by guests — folds the old Reviews & Photos tab in as a disclosure */}
              <section>
                <h4 className="text-[15px] font-semibold text-on-surface mb-1.5">Verified by guests</h4>
                <p className="text-[14px] text-on-surface-variant flex items-center gap-1.5 flex-wrap">
                  {avgRating && (
                    <span className="inline-flex items-center gap-1 text-highlight font-semibold" aria-hidden="true">
                      <Star className="w-3.5 h-3.5 fill-current" /> {avgRating}
                    </span>
                  )}
                  <span>
                    {avgRating && <span className="sr-only">{avgRating} out of 5 stars, </span>}
                    {reviewCount} verified review{reviewCount === 1 ? '' : 's'} · {photoCount} photo{photoCount === 1 ? '' : 's'}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setIsReviewsExpanded((v) => !v)}
                  aria-expanded={isReviewsExpanded}
                  aria-controls="reviews-detail"
                  className="mt-2 text-[13px] font-semibold text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  {isReviewsExpanded ? 'Hide reviews & photos' : 'View reviews & photos'}
                  {isReviewsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isReviewsExpanded && (
                  <div id="reviews-detail" className="mt-3 space-y-4">
                    <div>
                      <h5 className="text-[13px] font-semibold text-on-surface mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        Verified customer dish photos
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {VERIFIED_CUSTOMER_PHOTOS.map((photo) => (
                          <div key={photo.photoId} className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/60">
                            <img src={photo.image} alt={photo.caption} className="w-full h-32 object-cover" />
                            <div className="p-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-semibold text-success inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Verified order
                                </span>
                                <span className="text-[10px] text-on-surface-variant shrink-0">{photo.submittedAt}</span>
                              </div>
                              <p className="text-[12px] font-semibold text-on-surface mt-1">{photo.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[13px] font-semibold text-on-surface mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        Verified guest reviews
                      </h5>
                      <div className="space-y-2.5">
                        {VERIFIED_CUSTOMER_REVIEWS.map((rev) => (
                          <div key={rev.reviewId} className="bg-surface-container rounded-xl p-3 border border-outline-variant/60 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-0.5 text-highlight" aria-label={`${rev.rating} out of 5 stars`}>
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                                ))}
                              </div>
                              <span className="text-[10px] font-semibold text-success inline-flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3 h-3" /> Verified order
                              </span>
                            </div>
                            <p className="text-[12px] text-on-surface-variant italic leading-snug">"{rev.reviewText}"</p>
                            <div className="flex items-center justify-between text-[10.5px] text-on-surface-variant pt-1 border-t border-outline-variant/50">
                              <span className="font-semibold text-on-surface">{rev.displayName}</span>
                              <span>{rev.submittedAt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'hygiene' && (
            <div id="trust-panel-hygiene" role="tabpanel" aria-labelledby="trust-tab-hygiene" className="px-4 sm:px-5 py-4">
              <section>
                <h4 className="text-[15px] font-semibold text-on-surface mb-2.5">Hygiene audit</h4>
                <dl className="grid grid-cols-3 gap-3 text-[13px]">
                  <div>
                    <dt className="text-on-surface-variant text-[11.5px]">Last review</dt>
                    <dd className="font-semibold text-on-surface mt-0.5">{profile.hygieneAudit.lastAuditDate}</dd>
                  </div>
                  <div>
                    <dt className="text-on-surface-variant text-[11.5px]">Standard</dt>
                    <dd className="font-semibold text-on-surface mt-0.5">{profile.hygieneAudit.auditType}</dd>
                  </div>
                  <div>
                    <dt className="text-on-surface-variant text-[11.5px]">Next review</dt>
                    <dd className="font-semibold text-on-surface mt-0.5">{profile.hygieneAudit.nextReviewDate}</dd>
                  </div>
                </dl>
              </section>

              <div className="h-px bg-outline-variant/50 my-4" aria-hidden="true" />

              <section>
                <h4 className="text-[15px] font-semibold text-on-surface mb-1.5">Dietary & workstation separation</h4>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed mb-2.5">{profile.kitchenSeparation.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Veg workstation
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-warning">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Color-coded utensils
                  </span>
                </div>
              </section>

              <div className="h-px bg-outline-variant/50 my-4" aria-hidden="true" />

              <section>
                <h4 className="text-[15px] font-semibold text-on-surface mb-1.5">Allergy-handling policy</h4>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed">{profile.allergyPolicy.summary}</p>
                <p className="text-[12.5px] text-on-surface-variant mt-1.5">
                  <span className="font-semibold text-on-surface">Notice:</span> {profile.allergyPolicy.crossContactWarning}
                </p>
                {onRequestAssistance && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRequestAssistance('Allergy assistance');
                    }}
                    className="mt-3 w-full min-h-11 py-2.5 bg-warning hover:brightness-90 text-on-warning rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                    Speak to staff about an allergy
                  </button>
                )}
              </section>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div id="trust-panel-credentials" role="tabpanel" aria-labelledby="trust-tab-credentials" className="px-4 sm:px-5 py-4">
              <section>
                <h4 className="text-[15px] font-semibold text-on-surface mb-1.5">FSSAI licence</h4>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono font-semibold text-[14px] text-primary tracking-wide">{profile.fssai.number}</span>
                  <span className="text-[11.5px] font-semibold text-success inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Verified licence
                  </span>
                </div>
              </section>

              <div className="h-px bg-outline-variant/50 my-4" aria-hidden="true" />

              <section>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-[15px] font-semibold text-on-surface">Preparation reliability</h4>
                  <span className="text-[13px] font-semibold text-primary">{profile.preparationAccuracy.value}%</span>
                </div>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed">{profile.servicePromise.description}</p>
                <p className="text-[12px] text-on-surface-variant mt-1">
                  {profile.preparationAccuracy.label} · {profile.preparationAccuracy.sampleSize} orders ({profile.preparationAccuracy.period})
                </p>
                <button
                  type="button"
                  onClick={() => setShowCalculationModal(true)}
                  className="mt-2 text-[13px] font-semibold text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  Calculation details
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Preparation Accuracy Calculation Sub-Modal — unchanged behavior, now triggered from Credentials */}
      {showCalculationModal && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="calc-modal-title" className="bg-surface p-5 rounded-2xl max-w-md w-full border border-outline-variant space-y-3.5 text-on-surface shadow-2xl">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h4 id="calc-modal-title" className="font-extrabold text-[15px] flex items-center gap-2 text-primary">
                <Icon name="analytics" className="text-base" />
                How Accuracy Is Calculated
              </h4>
              <button
                type="button"
                onClick={() => setShowCalculationModal(false)}
                aria-label="Close calculation details"
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-outline-variant cursor-pointer"
              >
                <Icon name="close" className="text-sm" />
              </button>
            </div>
            <div className="text-[12px] space-y-2 text-on-surface-variant leading-relaxed">
              <p>{profile.preparationAccuracy.calculationExplanation}</p>
              <div className="bg-surface-container p-3 rounded-xl border border-outline-variant space-y-1">
                <p className="font-bold text-on-surface">Audit Parameters:</p>
                <p>• Period: <strong>{profile.preparationAccuracy.period}</strong></p>
                <p>• Sample Size: <strong>{profile.preparationAccuracy.sampleSize} orders</strong></p>
                <p>• Last Updated: <strong>{profile.preparationAccuracy.lastUpdated}</strong></p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCalculationModal(false)}
              className="w-full py-2 bg-primary text-on-primary rounded-xl font-bold text-[12px] cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantTrustProfileModal;
