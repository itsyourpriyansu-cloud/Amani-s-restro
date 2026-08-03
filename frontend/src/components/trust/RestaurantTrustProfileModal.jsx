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
  ChefHat,
  Leaf,
  Shield,
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

  // Focus management & Escape key listener
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
  const reviewCount = VERIFIED_CUSTOMER_REVIEWS.length;
  const photoCount = VERIFIED_CUSTOMER_PHOTOS.length;
  const avgRating =
    reviewCount > 0
      ? (VERIFIED_CUSTOMER_REVIEWS.reduce((sum, rev) => sum + rev.rating, 0) / reviewCount).toFixed(1)
      : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trust-profile-title"
        className="bg-surface border border-outline-variant/80 rounded-t-[24px] sm:rounded-[24px] shadow-2xl w-full max-w-lg max-h-[90vh] sm:max-h-[84vh] flex flex-col overflow-hidden text-on-surface"
      >
        {/* Mobile Grab Handle Bar */}
        <div className="w-12 h-1 bg-outline-variant/80 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b border-outline-variant/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/Amanis Logo Final.svg"
              alt="Amani's Kitchen Logo"
              className="h-11 w-auto max-w-[170px] object-contain shrink-0"
            />
            <div className="h-5 w-px bg-outline-variant/60 shrink-0" />
            <span className="text-[12.5px] font-semibold text-on-surface-variant truncate">
              Kitchen Transparency
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close kitchen trust profile"
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer border border-outline-variant/60"
          >
            <Icon name="close" className="text-base" />
          </button>
        </div>

        {/* Verified Kitchen Status Banner Card */}
        <div className="px-4 sm:px-6 py-3 shrink-0 bg-surface-container-lowest border-b border-outline-variant/40">
          <div className="p-3 rounded-2xl bg-success/8 border border-success/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center text-success shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-on-surface leading-tight truncate">
                  Verified Kitchen Partner
                </p>
                <p className="text-[11.5px] text-on-surface-variant font-medium truncate">
                  Audited on {profile.hygieneAudit.lastAuditDate}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-success text-on-success text-[10.5px] font-extrabold tracking-wide uppercase shrink-0 shadow-2xs">
              A+ Rated
            </span>
          </div>
        </div>

        {/* Segmented Tab Navigation */}
        <div
          role="tablist"
          aria-label="Trust profile sections"
          className="grid grid-cols-3 gap-2 px-4 sm:px-6 py-3 border-b border-outline-variant/40 shrink-0 bg-surface"
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
                className={`h-[40px] rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/40'
                }`}
              >
                <TabIcon className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div id="trust-panel-overview" role="tabpanel" aria-labelledby="trust-tab-overview" className="space-y-4">
              
              {/* Card 1: Culinary Standards */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
                  <Utensils className="w-4 h-4 text-primary" />
                  <span>Culinary Standards</span>
                </div>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed font-normal">
                  {profile.shortKitchenIntroduction}
                </p>
              </section>

              {/* Card 2: Executive Chef Profile */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={profile.chefProfile.image}
                      alt={profile.chefProfile.name}
                      className="w-13 h-13 rounded-full object-cover ring-2 ring-primary/20 shrink-0 shadow-xs"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[15px] font-extrabold text-on-surface truncate">
                          {profile.chefProfile.name}
                        </h4>
                        <ChefHat className="w-4 h-4 text-primary shrink-0" />
                      </div>
                      <p className="text-[12.5px] text-on-surface-variant font-medium truncate">
                        {profile.chefProfile.role} · {profile.chefProfile.experienceLabel}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsChefExpanded((v) => !v)}
                    aria-expanded={isChefExpanded}
                    className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer shrink-0 border border-outline-variant/60"
                  >
                    <span>{isChefExpanded ? 'Hide' : 'Bio'}</span>
                    {isChefExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isChefExpanded && (
                  <div className="pt-2 border-t border-outline-variant/50 space-y-2.5 text-[13px] animate-fadeIn">
                    <blockquote className="p-3 rounded-xl bg-surface-container italic text-on-surface-variant leading-relaxed border-l-3 border-primary">
                      "{profile.chefProfile.philosophy}"
                    </blockquote>
                    <p className="text-on-surface-variant leading-relaxed">{profile.chefProfile.story}</p>
                    <div className="p-2.5 rounded-xl bg-primary/8 text-primary font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                      <span>Speciality: {profile.chefProfile.speciality}</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Card 3: Ingredient Sourcing */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
                    <Leaf className="w-4 h-4 text-success" />
                    <span>Ingredient Sourcing</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSourcingExpanded((v) => !v)}
                    aria-expanded={isSourcingExpanded}
                    className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer shrink-0 border border-outline-variant/60"
                  >
                    <span>{isSourcingExpanded ? 'Hide' : 'Details'}</span>
                    {isSourcingExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Pill Badges Summary */}
                <div className="flex flex-wrap gap-2">
                  {(profile.ingredientSourcing || []).map((src, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-surface-container text-on-surface text-[12px] font-semibold border border-outline-variant/50 inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      {src.label}
                    </span>
                  ))}
                </div>

                {isSourcingExpanded && (
                  <div className="pt-2 border-t border-outline-variant/50 space-y-2.5 text-[13px] animate-fadeIn">
                    {profile.ingredientSourcing.map((src, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-surface-container flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-on-surface">{src.label}</p>
                          <p className="text-[12px] text-on-surface-variant mt-0.5">{src.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Card 4: Verified Guest Reviews */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-highlight text-highlight" />
                    <span className="font-bold text-[14px] text-on-surface">Verified Guest Rating</span>
                    {avgRating && (
                      <span className="px-2 py-0.5 rounded-full bg-highlight/15 text-highlight text-[12px] font-extrabold">
                        {avgRating} ★
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReviewsExpanded((v) => !v)}
                    aria-expanded={isReviewsExpanded}
                    className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer shrink-0 border border-outline-variant/60"
                  >
                    <span>{isReviewsExpanded ? 'Hide' : 'Reviews'}</span>
                    {isReviewsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[12.5px] text-on-surface-variant font-medium">
                  Based on {reviewCount} verified dining reviews & {photoCount} customer photos.
                </p>

                {isReviewsExpanded && (
                  <div className="pt-3 border-t border-outline-variant/50 space-y-4 animate-fadeIn">
                    {/* Photos */}
                    <div>
                      <h5 className="text-[13px] font-bold text-on-surface mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        Customer Dish Photos
                      </h5>
                      <div className="grid grid-cols-2 gap-2.5">
                        {VERIFIED_CUSTOMER_PHOTOS.map((photo) => (
                          <div key={photo.photoId} className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/60">
                            <img src={photo.image} alt={photo.caption} className="w-full h-28 object-cover" />
                            <div className="p-2">
                              <p className="text-[11.5px] font-bold text-on-surface truncate">{photo.caption}</p>
                              <span className="text-[10px] text-success font-semibold flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Verified Order
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Snippets */}
                    <div className="space-y-2.5">
                      <h5 className="text-[13px] font-bold text-on-surface flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-primary" />
                        Guest Testimonials
                      </h5>
                      {VERIFIED_CUSTOMER_REVIEWS.map((rev) => (
                        <div key={rev.reviewId} className="bg-surface-container rounded-xl p-3 border border-outline-variant/60 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-0.5 text-highlight">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <span className="text-[10.5px] font-bold text-success flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified Order
                            </span>
                          </div>
                          <p className="text-[12.5px] text-on-surface-variant italic">"{rev.reviewText}"</p>
                          <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/40">
                            <span className="font-bold text-on-surface">{rev.displayName}</span>
                            <span>{rev.submittedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* HYGIENE TAB */}
          {activeTab === 'hygiene' && (
            <div id="trust-panel-hygiene" role="tabpanel" aria-labelledby="trust-tab-hygiene" className="space-y-4">
              
              {/* Hygiene Audit Grid */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>Hygiene Audit Record</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-[12.5px]">
                  <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-center">
                    <span className="block text-[11px] text-on-surface-variant font-medium">Last Audit</span>
                    <span className="block font-extrabold text-on-surface mt-0.5">{profile.hygieneAudit.lastAuditDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-center">
                    <span className="block text-[11px] text-on-surface-variant font-medium">Standard</span>
                    <span className="block font-extrabold text-on-surface mt-0.5">{profile.hygieneAudit.auditType}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-center">
                    <span className="block text-[11px] text-on-surface-variant font-medium">Next Review</span>
                    <span className="block font-extrabold text-on-surface mt-0.5">{profile.hygieneAudit.nextReviewDate}</span>
                  </div>
                </div>
              </section>

              {/* Workstation Separation */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Workstation Separation</span>
                </div>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed">
                  {profile.kitchenSeparation.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full bg-success/12 text-success text-[12px] font-bold inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dedicated Veg Station
                  </span>
                  <span className="px-3 py-1 rounded-full bg-warning/12 text-warning text-[12px] font-bold inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Color-Coded Utensils
                  </span>
                </div>
              </section>

              {/* Allergy Policy */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-warning font-bold text-[14px]">
                  <HelpCircle className="w-4 h-4 text-warning" />
                  <span>Allergy Handling Policy</span>
                </div>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed">
                  {profile.allergyPolicy.summary}
                </p>
                <div className="p-3 rounded-xl bg-warning/8 border border-warning/20 text-[12px] text-on-surface space-y-1">
                  <span className="font-bold text-warning block uppercase tracking-wide text-[10.5px]">Important Notice</span>
                  <p className="text-on-surface-variant leading-normal">{profile.allergyPolicy.crossContactWarning}</p>
                </div>
                {onRequestAssistance && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRequestAssistance('Allergy assistance');
                    }}
                    className="w-full min-h-11 py-2.5 bg-warning hover:brightness-90 text-on-warning rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Speak to Staff About an Allergy
                  </button>
                )}
              </section>

            </div>
          )}

          {/* CREDENTIALS TAB */}
          {activeTab === 'credentials' && (
            <div id="trust-panel-credentials" role="tabpanel" aria-labelledby="trust-tab-credentials" className="space-y-4">
              
              {/* FSSAI Card */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
                    <FileBadge className="w-4 h-4 text-primary" />
                    <span>FSSAI Registration Licence</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-success/15 text-success text-[11px] font-extrabold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-on-surface-variant font-medium block">Licence Number</span>
                    <span className="font-mono font-extrabold text-[15px] text-primary tracking-wide">
                      {profile.fssai.number}
                    </span>
                  </div>
                </div>
              </section>

              {/* Preparation Reliability */}
              <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
                    <Award className="w-4 h-4 text-primary" />
                    <span>Preparation Accuracy</span>
                  </div>
                  <span className="text-[16px] font-black text-primary">
                    {profile.preparationAccuracy.value}%
                  </span>
                </div>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed">
                  {profile.servicePromise.description}
                </p>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-between text-[12px]">
                  <span className="text-on-surface-variant font-medium">
                    Audited across {profile.preparationAccuracy.sampleSize} orders ({profile.preparationAccuracy.period})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCalculationModal(true)}
                    className="text-[12px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Details</span>
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>

            </div>
          )}

        </div>
      </div>

      {/* Calculation Modal */}
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
            <div className="text-[12.5px] space-y-2 text-on-surface-variant leading-relaxed">
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
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl font-bold text-[13px] cursor-pointer shadow-xs active:scale-95 transition-all"
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
