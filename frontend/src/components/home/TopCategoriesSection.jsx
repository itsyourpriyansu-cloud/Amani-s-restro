import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import biryaniIcon from '../../assets/categories/biryani.png';
import curriesIcon from '../../assets/categories/curries.png';
import mealsIcon from '../../assets/categories/meals.png';
import drinksIcon from '../../assets/categories/drinks.png';
import { ChevronRight, Sparkles, Star, Utensils, Zap } from 'lucide-react';

/* ─────────────────────────────────────────────
   4 Base Categories configured for a 2x2 grid layout
   with transparent floating 3D icons & authentic South Indian styling.
───────────────────────────────────────────── */
const BASE_CATEGORIES = [
  {
    id: 'biryanis',
    title: 'Biryani',
    subtitle: 'Slow-cooked dum classics',
    badge: 'Most Loved',
    icon: biryaniIcon,
    accentColor: '#87351F',
    cardBg: 'bg-[#FFF9F4]',
    borderColor: 'border-[#87351F]/12',
    hoverBorder: 'hover:border-[#87351F]/35',
    badgeBg: 'bg-[#87351F] text-white',
    badgeIcon: Star,
  },
  {
    id: 'starters',
    title: 'Starters',
    subtitle: 'Rich Andhra-style gravies',
    badge: 'Chef Special',
    icon: curriesIcon,
    accentColor: '#EAA52E',
    cardBg: 'bg-[#FFF9F4]',
    borderColor: 'border-[#EAA52E]/20',
    hoverBorder: 'hover:border-[#EAA52E]/45',
    badgeBg: 'bg-[#642313] text-white',
    badgeIcon: Sparkles,
  },
  {
    id: 'meals',
    title: 'Meals',
    subtitle: 'Banana leaf thalis',
    badge: 'Best Value',
    icon: mealsIcon,
    accentColor: '#2E7D3E',
    cardBg: 'bg-[#FFF9F4]',
    borderColor: 'border-[#2E7D3E]/18',
    hoverBorder: 'hover:border-[#2E7D3E]/40',
    badgeBg: 'bg-[#2E7D3E] text-white',
    badgeIcon: Utensils,
  },
  {
    id: 'drinks',
    title: 'Drinks',
    subtitle: 'Coolers & sodas',
    badge: 'Fresh Picks',
    icon: drinksIcon,
    accentColor: '#17675D',
    cardBg: 'bg-[#FFF9F4]',
    borderColor: 'border-[#17675D]/18',
    hoverBorder: 'hover:border-[#17675D]/40',
    badgeBg: 'bg-[#17675D] text-white',
    badgeIcon: Zap,
  },
];

/* ─────────────────────────────────────────────
   TopCategoriesSection Component
───────────────────────────────────────────── */
const TopCategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate('/menu', { state: { category: categoryId } });
  };

  return (
    <section 
      aria-label="Top categories"
      className="w-full px-4 mt-6 mb-4 flex flex-col max-w-[640px] mx-auto font-sans"
    >
      {/* Compact Section Heading */}
      <div className="w-full mb-3.5 flex flex-col items-start gap-0.5 px-0.5">
        <h2 className="text-[19px] sm:text-[20px] font-bold text-[#21100B] tracking-tight leading-tight">
          Explore Amani's Menu
        </h2>
        <p className="text-[12.5px] text-[#74645D] font-medium">
          Choose what you’re craving
        </p>
      </div>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {BASE_CATEGORIES.map((cat, index) => {
          const BadgeIcon = cat.badgeIcon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCategoryClick(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.id)}
              className={`group relative overflow-hidden rounded-[24px] p-3.5 sm:p-4 flex flex-col justify-between border ${cat.cardBg} ${cat.borderColor} ${cat.hoverBorder} shadow-[0_4px_16px_rgba(33,13,8,0.04)] hover:shadow-[0_12px_28px_rgba(100,35,19,0.10)] transition-all duration-300 cursor-pointer min-h-[190px] sm:min-h-[205px]`}
            >
              {/* Settled Top Tag Badge */}
              <div className="w-full flex items-center justify-start gap-2 z-10">
                <span className={`inline-flex items-center gap-1.5 px-2.5 h-[27px] rounded-full text-[11px] font-semibold tracking-tight whitespace-nowrap shadow-2xs ${cat.badgeBg}`}>
                  <BadgeIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>{cat.badge}</span>
                </span>
              </div>

              {/* Seamless Floating 3D Object */}
              <div className="relative my-1 flex items-center justify-center w-full h-[92px] sm:h-[105px]">
                {/* Soft ambient color glow behind object */}
                <div 
                  className="absolute w-16 h-16 rounded-full blur-lg opacity-20 pointer-events-none"
                  style={{ backgroundColor: cat.accentColor }}
                />
                
                <img
                  src={cat.icon}
                  alt={`${cat.title} category`}
                  className="w-full h-full object-contain mix-blend-multiply filter drop-shadow-sm transition-transform duration-400 group-hover:scale-108 group-hover:-translate-y-1"
                  loading="lazy"
                />
              </div>

              {/* Category Title & Subtitle */}
              <div className="w-full text-center z-10">
                <div className="flex items-center justify-center gap-0.5">
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#21100B] leading-tight group-hover:text-[#87351F] transition-colors">
                    {cat.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-[#87351F] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                </div>

                <p className="text-[12px] text-[#74645D] mt-0.5 font-medium line-clamp-1">
                  {cat.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopCategoriesSection;
