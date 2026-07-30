import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Percent, Copy, Check, ChevronRight, Sparkles, Tag, Gift, Zap } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import CouponTicketModal from './CouponTicketModal';

const OFFERS = [
  {
    id: 'flat150',
    title: 'Flat ₹150 off',
    code: 'DELICIOUS',
    minOrder: 'ABOVE ₹599',
    badgeText: 'HOT',
    badgeColor: 'bg-highlight text-on-background',
    iconBg: 'bg-gradient-to-br from-highlight to-tertiary',
    accentColor: '#C9953D',
    footerText: 'Free Del + Extra 10% off above ₹1999',
    footerTag: 'one',
    footerTagBg: 'bg-error text-on-error',
  },
  {
    id: 'percent20',
    title: '20% OFF up to ₹120',
    code: 'MANGAMMA20',
    minOrder: 'NO MIN ORDER',
    badgeText: 'NEW',
    badgeColor: 'bg-success text-on-success',
    iconBg: 'bg-gradient-to-br from-success to-secondary',
    accentColor: '#4B651F',
    footerText: 'Instant ₹50 Cashback on UPI Payments',
    footerTag: 'PAY',
    footerTagBg: 'bg-information text-on-info',
  },
  {
    id: 'freeDessert',
    title: 'FREE Royal Gulab Jamun',
    code: 'DESSERT',
    minOrder: 'ABOVE ₹799',
    badgeText: 'GIFT',
    badgeColor: 'bg-tertiary text-on-tertiary',
    iconBg: 'bg-gradient-to-br from-tertiary to-primary',
    accentColor: '#985D2E',
    footerText: 'Complimentary Sweet Box with Special Meals',
    footerTag: 'FREE',
    footerTagBg: 'bg-tertiary text-on-tertiary',
  },
  {
    id: 'familyFeast',
    title: 'Flat ₹200 OFF Combos',
    code: 'FEAST200',
    minOrder: 'ABOVE ₹1199',
    badgeText: 'PROMO',
    badgeColor: 'bg-primary text-on-primary',
    iconBg: 'bg-gradient-to-br from-primary to-maroon-950',
    accentColor: '#7A1F24',
    footerText: 'Priority Kitchen Prep + Free Beverage Jug',
    footerTag: 'VIP',
    footerTagBg: 'bg-highlight text-on-background',
  },
];

const OfferBanner = ({ onApplyCoupon }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next (left swipe), -1 = prev (right swipe)
  const [copiedId, setCopiedId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedOfferForModal, setSelectedOfferForModal] = useState(null);
  const { showToast } = useToast();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentOffer = OFFERS[currentIndex];

  // Auto-advance banner carousel every 4.5 seconds unless hovered/dragged/touched
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % OFFERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % OFFERS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + OFFERS.length) % OFFERS.length);
  };

  // Drag End handler for Framer Motion gestures
  const handleDragEnd = (event, info) => {
    setIsPaused(false);
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -200) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 200) {
      handlePrev();
    }
  };

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 40;

    if (diff > swipeThreshold) {
      handleNext();
    } else if (diff < -swipeThreshold) {
      handlePrev();
    }
  };

  const handleOpenTicketModal = (e, offer) => {
    if (e) e.stopPropagation();
    setSelectedOfferForModal(offer || currentOffer);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <>
      <div
        className="w-full relative overflow-hidden select-none touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Container Card */}
        <div
          onClick={(e) => handleOpenTicketModal(e, currentOffer)}
          className="bg-surface rounded-[22px] border border-outline-variant/80 shadow-[0_4px_20px_rgba(26,18,13,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_6px_26px_rgba(26,18,13,0.1)] cursor-pointer"
        >
          {/* Upper Offer Content Block */}
          <div className="p-4 sm:p-4.5 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentOffer.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsPaused(true)}
                onDragEnd={handleDragEnd}
                className="flex items-center justify-between gap-3"
              >
                {/* Left Side: Scalloped Offer Badge Icon & Text */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative shrink-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[15px] ${currentOffer.iconBg} text-surface flex items-center justify-center shadow-md transform rotate-[-3deg]`}
                    >
                      <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-surface stroke-[2.5]" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-surface border border-outline-variant text-on-surface shadow-2xs">
                      %
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-[16px] sm:text-[17px] leading-tight text-on-surface truncate">
                        {currentOffer.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 text-[12px] font-bold text-on-surface-variant/80 tracking-wide uppercase">
                      <span className="text-primary font-extrabold tracking-wider">{currentOffer.code}</span>
                      <span className="text-outline-variant font-normal">|</span>
                      <span className="truncate">{currentOffer.minOrder}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Apply Button + Slide Indicators */}
                <div className="flex flex-col items-end shrink-0 gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11.5px] font-bold text-on-surface-variant">
                      <strong className="text-primary">{currentIndex + 1}</strong>/{OFFERS.length}
                    </span>
                    <div className="flex gap-1 ml-1.5">
                      {OFFERS.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? 'w-4 bg-primary'
                              : 'w-1.5 bg-outline-variant hover:bg-on-surface-variant/40'
                          }`}
                          aria-label={`Go to offer ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Apply Button opening Ticket Dialog */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenTicketModal(e, currentOffer)}
                    className="h-8 px-3.5 rounded-full text-[12px] font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs bg-primary/10 hover:bg-primary text-primary hover:text-on-primary border border-primary/20"
                    title="View coupon details & copy code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dark Footer Strip Attached to Bottom */}
          <div className="bg-on-background px-4 py-2.5 flex items-center justify-between text-surface text-[12px] font-medium border-t border-surface/10">
            <div className="flex items-center gap-2 truncate pr-2">
              <Sparkles className="w-3.5 h-3.5 text-highlight shrink-0 animate-pulse" />
              <span className="truncate text-surface/90 font-medium text-[12.5px]">
                {currentOffer.footerText}
              </span>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${currentOffer.footerTagBg}`}
            >
              {currentOffer.footerTag}
            </span>
          </div>
        </div>
      </div>

      {/* Ticket-shaped Detailed Coupon Modal */}
      <CouponTicketModal
        isOpen={Boolean(selectedOfferForModal)}
        onClose={() => setSelectedOfferForModal(null)}
        offer={selectedOfferForModal}
        onApplyCoupon={onApplyCoupon}
      />
    </>
  );
};

export default OfferBanner;
