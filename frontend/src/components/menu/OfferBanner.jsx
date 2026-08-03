import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Tag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import CouponTicketModal from './CouponTicketModal';

import biryaniDish from '../../assets/categories/biryani.png';
import curriesDish from '../../assets/categories/curries.png';
import mealsDish from '../../assets/categories/meals.png';
import drinksDish from '../../assets/categories/drinks.png';

const OFFERS = [
  {
    id: 'flat150',
    title: 'Flat ₹150 OFF',
    subtitle: 'South Thalis & Meals above ₹599',
    code: 'DELICIOUS',
    minOrder: 'ABOVE ₹599',
    badgeText: 'HOT DEAL',
    ctaText: 'Order Meals',
    gradient: 'from-[#093527] via-[#0f5441] to-[#1bb587]',
    pillBg: 'bg-black/30 hover:bg-black/40 text-white',
    activeDotBg: 'bg-[#0f5441] dark:bg-emerald-400',
    accentColor: '#0f5441',
    image: mealsDish,
    imageAlt: 'South Indian Meal Thali',
    footerText: 'Free Delivery + Extra 10% OFF above ₹1999',
    footerTag: 'ONE',
    footerTagBg: 'bg-error text-on-error',
  },
  {
    id: 'percent20',
    title: '20% OFF Biryanis',
    subtitle: 'Slow-cooked Dum Biryanis & Pulaos',
    code: 'AMANI20',
    minOrder: 'NO MIN ORDER',
    badgeText: 'TOP SELLER',
    ctaText: 'Order Biryani',
    gradient: 'from-[#3b1904] via-[#6d3007] to-[#d97706]',
    pillBg: 'bg-black/30 hover:bg-black/40 text-white',
    activeDotBg: 'bg-[#6d3007] dark:bg-amber-400',
    accentColor: '#6d3007',
    image: biryaniDish,
    imageAlt: 'Hyderabadi Dum Biryani',
    footerText: 'Instant ₹50 Cashback on UPI Payments',
    footerTag: 'PAY',
    footerTagBg: 'bg-information text-on-info',
  },
  {
    id: 'freeDessert',
    title: 'FREE Gulab Jamun',
    subtitle: 'Complimentary sweet box above ₹799',
    code: 'DESSERT',
    minOrder: 'ABOVE ₹799',
    badgeText: 'SPECIAL GIFT',
    ctaText: 'Claim Dessert',
    gradient: 'from-[#420315] via-[#751029] to-[#e11d48]',
    pillBg: 'bg-black/30 hover:bg-black/40 text-white',
    activeDotBg: 'bg-[#751029] dark:bg-rose-400',
    accentColor: '#751029',
    image: drinksDish,
    imageAlt: 'Royal Sweets & Drinks',
    footerText: 'Freshly prepared authentic homemade sweets',
    footerTag: 'FREE',
    footerTagBg: 'bg-tertiary text-on-tertiary',
  },
  {
    id: 'familyFeast',
    title: 'Flat ₹200 OFF',
    subtitle: 'Family Combos & Starters above ₹1199',
    code: 'FEAST200',
    minOrder: 'ABOVE ₹1199',
    badgeText: 'FAMILY PROMO',
    ctaText: 'Order Combos',
    gradient: 'from-[#171542] via-[#312c7d] to-[#6366f1]',
    pillBg: 'bg-black/30 hover:bg-black/40 text-white',
    activeDotBg: 'bg-[#312c7d] dark:bg-indigo-400',
    accentColor: '#312c7d',
    image: curriesDish,
    imageAlt: 'Andhra Curries & Starters',
    footerText: 'Priority Kitchen Prep + Free Beverage Jug',
    footerTag: 'VIP',
    footerTagBg: 'bg-highlight text-on-background',
  },
];

const OfferBanner = ({ onApplyCoupon }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
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
      <div className="w-full select-none touch-pan-y">
        {/* Minimal Banner Card Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => handleOpenTicketModal(e, currentOffer)}
          className="relative w-full rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg group"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentOffer.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={handleDragEnd}
              className={`w-full bg-gradient-to-r ${currentOffer.gradient} min-h-[142px] sm:min-h-[156px] px-5 py-4.5 flex items-center justify-between relative overflow-hidden`}
            >
              {/* Ambient radial lighting glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_70%)] pointer-events-none" />

              {/* Minimal Left Content */}
              <div className="flex flex-col justify-between h-full z-10 w-[62%] sm:w-[60%] relative py-0.5">
                <div>
                  <span className="inline-block text-[9.5px] sm:text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs w-fit mb-2 border border-white/20 shadow-2xs">
                    {currentOffer.badgeText}
                  </span>

                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-tight drop-shadow-xs">
                    {currentOffer.title}
                  </h3>

                  <p className="text-[11.5px] sm:text-[12.5px] text-white/90 font-medium leading-tight mt-1.5 truncate">
                    {currentOffer.subtitle}
                  </p>
                </div>

                {/* Minimal CTA Pill Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenTicketModal(e, currentOffer);
                  }}
                  className={`mt-3.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all duration-200 flex items-center gap-1 border border-white/20 backdrop-blur-xs w-fit ${currentOffer.pillBg}`}
                >
                  <span>{currentOffer.ctaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>

              {/* Floating Dish PNG Cutout (No Background) */}
              <div className="absolute right-2 sm:right-4 bottom-[-10px] top-[-10px] w-[42%] sm:w-[38%] flex items-center justify-end pointer-events-none z-0">
                <img
                  src={currentOffer.image}
                  alt={currentOffer.imageAlt}
                  className="max-h-[125%] w-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] transform rotate-[-2deg] scale-105 group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Centered Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2 mb-0.5">
          {OFFERS.map((offer, idx) => (
            <button
              key={offer.id}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? `w-5 sm:w-6 ${currentOffer.activeDotBg}`
                  : 'w-1.5 bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400'
              }`}
              aria-label={`Go to offer slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Coupon Ticket Popup Modal */}
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


