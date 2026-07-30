import { stockImages, categoryImageKey } from '../data/imageManifest';

export const RESTAURANT_INFO = {
  name: 'Mangamma Ruchulu',
  nativeName: 'మంగమ్మ రుచులు',
  tagline: 'A Journey of Tradition. A Legacy of Flavour.',
  established: '2014',
  // Prototype placeholders — the source menu (MGM_Menu.pdf) does not list a street address.
  // Restaurant-provided information required before go-live.
  location: 'Address on file — update required',
  address: 'Address on file — update required',
  gstin: '36ABCDE1234F1Z5', // Prototype placeholder — update required
  fssai: '12345678901234', // Prototype placeholder — update required
  logo: null, // No official logo asset supplied — UI uses a text-based brand lockup instead
  heroImage: stockImages.restaurantInterior.url,
  taxRate: 0.05, // 5% GST
};

export const CATEGORIES = [
  { id: 'all', name: 'Full Menu', icon: 'Utensils' },
  { id: 'starters', name: 'Starters', icon: 'Flame' },
  { id: 'meals', name: 'Meals', icon: 'UtensilsCrossed' },
  { id: 'biryanis', name: 'Biryanis', icon: 'ChefHat' },
  { id: 'rotis_breads', name: 'Indian Breads', icon: 'Wheat' },
  { id: 'desserts', name: 'Desserts', icon: 'Cake' },
  { id: 'drinks', name: 'Cooldrinks', icon: 'CupSoda' },
];

// Every dish is filed under exactly one of the master categories above (dish.category).
// dish.subCategory retains the finer-grained original grouping for internal use
// (kitchen station routing, dish detail copy) without affecting menu navigation.
const MASTER_CATEGORY_MAP = {
  meals: 'meals',
  biryanis: 'biryanis',
  veg_soups: 'starters',
  nonveg_soups: 'starters',
  nonveg_starters: 'starters',
  chinese_veg_starters: 'starters',
  fish_prawns: 'starters',
  tandoor: 'starters',
  main_course_veg: 'meals',
  main_course_nonveg: 'meals',
  rotis_breads: 'rotis_breads',
  veg_pulaos: 'meals',
  rice_varieties: 'meals',
  fried_rice_noodles: 'meals',
  desserts: 'desserts',
  drinks: 'drinks',
};

// -----------------------------------------------------------------------------
// Dish data. 150 dishes across 16 categories, sourced from MGM_Menu.pdf (verified
// against the printed prices — see project chat history). Category-level defaults
// (representative image, prep time, spice, modifier groups) are filled in by
// buildDish() below so each source row only needs to state what's different for
// that dish, rather than repeating the full ~30-field schema 150 times.
// -----------------------------------------------------------------------------

const VEG = 'VEG';
const NONVEG = 'NONVEG';
const EGG = 'EGG';

const CATEGORY_META = {
  meals: { image: stockImages[categoryImageKey.meals].url, prep: 25, spice: 'MEDIUM' },
  biryanis: { image: stockImages[categoryImageKey.biryanis].url, prep: 25, spice: 'MEDIUM' },
  veg_soups: { image: stockImages[categoryImageKey.veg_soups].url, prep: 12, spice: 'MILD' },
  nonveg_soups: { image: stockImages[categoryImageKey.nonveg_soups].url, prep: 14, spice: 'MILD' },
  nonveg_starters: { image: stockImages[categoryImageKey.nonveg_starters].url, prep: 20, spice: 'SPICY' },
  chinese_veg_starters: { image: stockImages[categoryImageKey.chinese_veg_starters].url, prep: 18, spice: 'MEDIUM' },
  fish_prawns: { image: stockImages[categoryImageKey.fish_prawns].url, prep: 22, spice: 'SPICY' },
  tandoor: { image: stockImages[categoryImageKey.tandoor].url, prep: 22, spice: 'MEDIUM' },
  main_course_veg: { image: stockImages[categoryImageKey.main_course_veg].url, prep: 18, spice: 'MEDIUM' },
  main_course_nonveg: { image: stockImages[categoryImageKey.main_course_nonveg].url, prep: 22, spice: 'MEDIUM' },
  rotis_breads: { image: stockImages[categoryImageKey.rotis_breads].url, prep: 10, spice: null },
  veg_pulaos: { image: stockImages[categoryImageKey.veg_pulaos].url, prep: 20, spice: 'MILD' },
  rice_varieties: { image: stockImages[categoryImageKey.rice_varieties].url, prep: 15, spice: 'MILD' },
  fried_rice_noodles: { image: stockImages[categoryImageKey.fried_rice_noodles].url, prep: 16, spice: 'MEDIUM' },
  desserts: { image: stockImages[categoryImageKey.desserts].url, prep: 5, spice: null },
  drinks: { image: stockImages[categoryImageKey.drinks].url, prep: 5, spice: null },
};

const foodTypeFor = (type) => (type === VEG ? 'VEGETARIAN' : type === NONVEG ? 'NON_VEGETARIAN' : 'CONTAINS_EGG');

function modifierGroupsFor(catId, type, hasSpice) {
  const groups = [];

  if (hasSpice) {
    groups.push({
      id: 'spice', label: 'Spice Level', type: 'SINGLE_SELECT', required: true,
      options: [
        { id: 'mild', label: 'Mild', priceDelta: 0 },
        { id: 'medium', label: 'Medium', priceDelta: 0 },
        { id: 'spicy', label: 'Spicy', priceDelta: 0 },
      ],
    });
  }

  if (['biryanis', 'main_course_veg', 'main_course_nonveg', 'meals'].includes(catId)) {
    groups.push({
      id: 'size', label: 'Portion Size', type: 'SINGLE_SELECT', required: true,
      options: [
        { id: 'regular', label: 'Regular · Serves 1', priceDelta: 0 },
        { id: 'family', label: 'Family · Serves 3–4', priceDelta: catId === 'biryanis' ? 420 : 350 },
      ],
    });
  }

  if (catId === 'biryanis') {
    groups.push({
      id: 'extras', label: 'Add Extras', type: 'MULTI_SELECT', required: false,
      options: [
        ...(type !== VEG ? [{ id: 'extra-meat', label: 'Extra Meat Pieces', priceDelta: 90 }] : []),
        { id: 'extra-raita', label: 'Extra Raita', priceDelta: 30 },
        { id: 'boiled-egg', label: 'Add Boiled Egg', priceDelta: 25 },
      ],
    });
    groups.push({
      id: 'remove', label: 'Remove Ingredients', type: 'MULTI_SELECT', required: false,
      options: [
        { id: 'fried-onions', label: 'Remove Fried Onions', priceDelta: 0 },
        { id: 'mint', label: 'No Fresh Mint Leaves', priceDelta: 0 },
      ],
    });
  }

  if (catId === 'main_course_veg') {
    groups.push({
      id: 'oil', label: 'Cooking Preference', type: 'SINGLE_SELECT', required: false,
      options: [
        { id: 'standard', label: 'Standard Recipe', priceDelta: 0 },
        { id: 'less-oil', label: 'Less Oil', priceDelta: 0 },
      ],
    });
    groups.push({
      id: 'extras', label: 'Add Extras', type: 'MULTI_SELECT', required: false,
      options: [{ id: 'extra-paneer', label: 'Extra Paneer', priceDelta: 60 }],
    });
  }

  if (['nonveg_starters', 'chinese_veg_starters', 'fish_prawns', 'tandoor'].includes(catId)) {
    groups.push({
      id: 'remove', label: 'Remove Ingredients', type: 'MULTI_SELECT', required: false,
      options: [
        { id: 'onion', label: 'No Onion', priceDelta: 0 },
        { id: 'garlic', label: 'No Garlic', priceDelta: 0 },
      ],
    });
  }

  if (catId === 'rotis_breads') {
    groups.push({
      id: 'butter', label: 'Butter', type: 'SINGLE_SELECT', required: false,
      options: [
        { id: 'no-butter', label: 'No Butter', priceDelta: 0 },
        { id: 'with-butter', label: 'With Extra Butter', priceDelta: 15 },
      ],
    });
  }

  if (['veg_soups', 'nonveg_soups'].includes(catId)) {
    groups.push({
      id: 'extras', label: 'Add Extras', type: 'MULTI_SELECT', required: false,
      options: [{ id: 'extra-crackers', label: 'Extra Crispy Noodles', priceDelta: 10 }],
    });
  }

  return groups;
}

/**
 * Expands one compact source row into the full dish schema consumed by FoodCard,
 * FoodDetailsScreen, CustomizationModal, ManagerMenuView and cart logic.
 * Row shape: [id, name, price|null, categoryId, type, spiceOverride|null, shortDescription, extra]
 */
function buildDish([id, name, price, catId, type, spiceOverride, desc, extra = {}]) {
  const cat = CATEGORY_META[catId];
  const spiceLevel = spiceOverride !== undefined ? spiceOverride : cat.spice;
  const hasSpice = !!spiceLevel;
  const prep = extra.prep || cat.prep;
  const allergens = extra.allergens || [];
  const orderableInApp = extra.orderableInApp !== false;
  const customizationAvailable = (extra.customizationAvailable !== undefined ? extra.customizationAvailable : true) && orderableInApp;
  const displayName = extra.extraName ? `${name} (${extra.extraName})` : name;

  return {
    id,
    name: displayName,
    shortDescription: desc,
    price,
    priceDisplay: extra.priceDisplay || null,
    image: cat.image,
    category: MASTER_CATEGORY_MAP[catId],
    subCategory: catId,

    foodType: foodTypeFor(type),
    containsEgg: type === EGG,
    veganAvailable: type === VEG && !allergens.includes('DAIRY'),
    jainAvailable: type === VEG,

    spiceLevel: hasSpice ? spiceLevel : null,
    allergens,
    glutenStatus: allergens.includes('GLUTEN') ? 'CONTAINS_GLUTEN' : 'GLUTEN_FREE_RECIPE',

    portionLabel: extra.portionLabel || 'Regular',
    serves: extra.serves || '1 person',

    bestseller: !!extra.bestseller,
    bestsellerReason: extra.bestsellerReason || '',

    preparationTimeMinutes: prep,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [],

    customizationAvailable,
    orderableInApp,
    newCustomerRecommendation: !!extra.newCustomerRecommendation,
    newCustomerReason: extra.newCustomerReason || '',

    culturalStory: '',

    // Backward-compatibility fields (some components still read these directly)
    isVeg: type === VEG,
    isSpicy: spiceLevel === 'SPICY',
    description: desc,
    prepTime: `${prep} min`,

    modifierGroups: customizationAvailable ? modifierGroupsFor(catId, type, hasSpice) : [],
  };
}

const DISH_SOURCE = [
  // MEALS
  ['meals-aritaku-veg', 'Aritaku Bojanam (Veg)', 250, 'meals', VEG, 'MEDIUM', 'A complete traditional banana-leaf meal with rice, dal, sambar, rasam, curries, pickle and sweet.', { serves: '1 person', portionLabel: 'Full banana-leaf meal', bestseller: true, bestsellerReason: 'Our signature complete regional meal', newCustomerRecommendation: true, newCustomerReason: 'A complete traditional banana-leaf meal' }],
  ['meals-aritaku-nonveg', 'Aritaku Bojanam (Non-Veg)', 471, 'meals', NONVEG, 'MEDIUM', 'A complete traditional banana-leaf meal with mutton curry, chicken vepudu, fish/prawns fry, rice, dal, sambar, rasam and sweet.', { serves: '1 person', portionLabel: 'Full banana-leaf meal', bestseller: true, bestsellerReason: 'Our signature complete regional meal', allergens: ['SEAFOOD', 'EGG'] }],
  ['meals-parcel', 'Meals Parcel', 300, 'meals', VEG, 'MEDIUM', 'A packed traditional meal with rice, flavoured rice, dal, curries, pickle and sweet — ready to carry.', { serves: '1 person', portionLabel: 'Parcel' }],
  ['meals-raagi-mudda', 'Raagi Mudda with Chicken Curry', 351, 'meals', NONVEG, 'MEDIUM', 'Steamed ragi (finger millet) mudda served with home-style chicken curry. Served only during lunch hours.', { serves: '1 person', prep: 20 }],

  // BIRYANIS
  ['biryani-veg', 'Veg Biryani', 200, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice layered with mixed vegetables and biryani spices.', {}],
  ['biryani-paneer', 'Paneer Biryani', 250, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice with paneer cubes and aromatic biryani spices.', {}],
  ['biryani-mushroom', 'Mushroom Biryani', 250, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice with mushrooms and aromatic biryani spices.', {}],
  ['biryani-egg', 'Egg Biryani', 220, 'biryanis', EGG, 'MEDIUM', 'Dum-cooked rice with boiled eggs and aromatic biryani spices.', { allergens: ['EGG'] }],
  ['biryani-chicken-dum', 'Chicken Dum Biryani', 250, 'biryanis', NONVEG, 'MEDIUM', 'Traditional dum-cooked rice with spiced chicken, sealed and slow-cooked for depth of flavour.', { bestseller: true, bestsellerReason: 'A familiar, balanced dum biryani', newCustomerRecommendation: true, newCustomerReason: 'A familiar, balanced dum biryani' }],
  ['biryani-chicken-special', 'Special Chicken Dum Biryani', 300, 'biryanis', NONVEG, 'MEDIUM', 'Fragrant dum-cooked rice with spiced chicken, prepared with extra care and richer garnish.', { bestseller: true, bestsellerReason: 'Our most-loved biryani upgrade' }],
  ['biryani-chicken-fry-piece', 'Chicken Fry Piece Biryani', 250, 'biryanis', NONVEG, 'MEDIUM', 'Dum-cooked rice served with fried chicken pieces on top.', {}],
  ['biryani-mutton-dum', 'Mutton Dum Biryani', 381, 'biryanis', NONVEG, 'SPICY', 'Traditional dum-cooked rice with tender mutton pieces, slow-cooked with layered spices.', { prep: 30 }],

  // VEG SOUPS
  ['soup-sweet-corn-veg', 'Sweet Corn Soup', 99, 'veg_soups', VEG, 'MILD', 'Mildly sweet soup with sweet corn kernels.', {}],
  ['soup-manchow-veg', 'Veg Manchow Soup', 99, 'veg_soups', VEG, 'SPICY', 'Indo-Chinese style spiced vegetable soup topped with crispy noodles.', {}],
  ['soup-hot-sour-veg', 'Hot and Sour Soup', 99, 'veg_soups', VEG, 'SPICY', 'Tangy and peppery vegetable soup in the Indo-Chinese style.', {}],
  ['soup-tomato', 'Tomato Soup', 99, 'veg_soups', VEG, 'MILD', 'Classic tomato soup, lightly spiced.', {}],

  // NON-VEG SOUPS
  ['soup-sweet-corn-chicken', 'Chicken Sweet Corn Soup', 119, 'nonveg_soups', NONVEG, 'MILD', 'Mildly sweet soup with shredded chicken and sweet corn.', {}],
  ['soup-manchow-chicken', 'Chicken Manchow Soup', 119, 'nonveg_soups', NONVEG, 'SPICY', 'Indo-Chinese style spiced chicken soup topped with crispy noodles.', {}],
  ['soup-hot-sour-chicken', 'Chicken Hot and Sour Soup', 119, 'nonveg_soups', NONVEG, 'SPICY', 'Tangy and peppery chicken soup in the Indo-Chinese style.', {}],
  ['soup-mgm-special', 'MGM Special Soup', 119, 'nonveg_soups', NONVEG, 'MEDIUM', "Mangamma Ruchulu's own house-special chicken soup.", {}],

  // NON-VEG STARTERS
  ['starter-crispy-fried-chicken', 'Crispy Fried Chicken', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Deep-fried chicken pieces finished crisp and spiced.', {}],
  ['starter-chicken-popcorn', 'Chicken Pop Corn', 351, 'nonveg_starters', NONVEG, 'MEDIUM', 'Bite-sized crispy fried chicken pieces, easy to share.', {}],
  ['starter-kaju-chicken-pakoda', 'Kaju Chicken Pakoda', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Spiced fried chicken pakoda garnished with cashews.', { allergens: ['NUTS'] }],
  ['starter-fish-rava-fry', 'Fish Rava Fry', 401, 'nonveg_starters', NONVEG, 'MEDIUM', 'Fish fillets coated in semolina and shallow-fried.', { allergens: ['SEAFOOD'] }],
  ['starter-chicken-65', 'Chicken 65', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Classic deep-fried, deeply spiced chicken starter from Tamil Nadu.', { bestseller: true, bestsellerReason: 'A regional Indo-Chinese favourite' }],
  ['starter-karivepaku-kodi', 'Karivepaku Kodi', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Regional chicken starter tempered generously with curry leaves.', { bestseller: true, bestsellerReason: 'Curry-leaf spiced regional favourite', newCustomerRecommendation: false }],
  ['starter-vellulli-karam-kodi', 'Vellulli Karam Kodi', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Garlic-forward spicy chicken starter.', {}],
  ['starter-chicken-lollipop', 'Chicken Lollipop Dry', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Frenched chicken wings, deep-fried and tossed dry in spices.', {}],
  ['starter-chicken-manchurian', 'Chicken Manchurian', 351, 'nonveg_starters', NONVEG, 'MEDIUM', 'Indo-Chinese chicken starter tossed in a savoury Manchurian sauce.', {}],
  ['starter-chilli-chicken', 'Chilli Chicken', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Indo-Chinese chicken starter tossed with peppers, onion and chilli.', {}],
  ['starter-chicken-satay', 'Chicken Satay', 351, 'nonveg_starters', NONVEG, 'MEDIUM', 'Skewered, grilled chicken starter with a lightly spiced marinade.', {}],
  ['starter-pepper-chicken', 'Pepper Chicken', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Chicken starter tossed generously in crushed black pepper.', {}],
  ['starter-chicken-sizzler', 'Chicken Sizzler', 411, 'nonveg_starters', NONVEG, 'MEDIUM', 'Grilled chicken starter served on a sizzling plate.', { prep: 25 }],
  ['starter-chicken-majestic', 'Chicken Majestic', 351, 'nonveg_starters', NONVEG, 'SPICY', 'Andhra-style deep-fried chicken starter, curry-leaf and chilli tempered.', {}],
  ['starter-honey-chicken', 'Honey Chicken', 381, 'nonveg_starters', NONVEG, 'MEDIUM', 'Crisp fried chicken tossed in a mildly sweet honey glaze.', {}],

  // CHINESE VEG STARTERS
  ['cveg-manchurian', 'Veg Manchurian', 220, 'chinese_veg_starters', VEG, 'MEDIUM', 'Vegetable dumplings tossed in a savoury Indo-Chinese Manchurian sauce.', { bestseller: true, bestsellerReason: 'Crisp Indo-Chinese starter suitable for sharing', newCustomerRecommendation: true, newCustomerReason: 'Crisp Indo-Chinese starter suitable for sharing' }],
  ['cveg-crispy-corn', 'Crispy Corn Kernel', 250, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crispy fried corn kernels tossed in Indo-Chinese seasoning.', {}],
  ['cveg-gobi-65', 'Gobi 65', 220, 'chinese_veg_starters', VEG, 'SPICY', 'Deep-fried, deeply spiced cauliflower starter.', {}],
  ['cveg-paneer-manchurian', 'Paneer Manchurian', 320, 'chinese_veg_starters', VEG, 'MEDIUM', 'Paneer cubes tossed in a savoury Indo-Chinese Manchurian sauce.', { allergens: ['DAIRY'] }],
  ['cveg-paneer-chilli', 'Paneer Chilli', 320, 'chinese_veg_starters', VEG, 'SPICY', 'Paneer cubes tossed with peppers, onion and chilli.', { allergens: ['DAIRY'] }],
  ['cveg-paneer-65', 'Paneer 65', 320, 'chinese_veg_starters', VEG, 'SPICY', 'Deep-fried, deeply spiced paneer starter.', { allergens: ['DAIRY'] }],
  ['cveg-paneer-satay', 'Paneer Satay', 379, 'chinese_veg_starters', VEG, 'MEDIUM', 'Skewered, grilled paneer starter with a lightly spiced marinade.', { allergens: ['DAIRY'] }],
  ['cveg-mushroom-manchurian', 'Mushroom Manchurian', 320, 'chinese_veg_starters', VEG, 'MEDIUM', 'Mushrooms tossed in a savoury Indo-Chinese Manchurian sauce.', {}],
  ['cveg-mushroom-65', 'Mushroom 65', 320, 'chinese_veg_starters', VEG, 'SPICY', 'Deep-fried, deeply spiced mushroom starter.', {}],
  ['cveg-baby-corn-65', 'Baby Corn 65', 250, 'chinese_veg_starters', VEG, 'SPICY', 'Deep-fried, deeply spiced baby corn starter.', {}],

  // FISH & PRAWNS
  ['fish-apollo', 'Apollo Fish', 381, 'fish_prawns', NONVEG, 'SPICY', 'Boneless fish cubes, deep-fried and tossed in a spiced Andhra-style masala.', { allergens: ['SEAFOOD'] }],
  ['fish-fingers', 'Fish Fingers', 391, 'fish_prawns', NONVEG, 'MEDIUM', 'Breaded fish fingers, deep-fried until golden.', { allergens: ['SEAFOOD', 'GLUTEN'] }],
  ['fish-chilli', 'Fish Chilli', 381, 'fish_prawns', NONVEG, 'SPICY', 'Fish cubes tossed with peppers, onion and chilli.', { allergens: ['SEAFOOD'] }],
  ['fish-corn', 'Fish Corn', 381, 'fish_prawns', NONVEG, 'MEDIUM', 'Fish cubes tossed with sweet corn in a light sauce.', { allergens: ['SEAFOOD'] }],
  ['prawns-loose', 'Loose Prawns', 381, 'fish_prawns', NONVEG, 'SPICY', 'Pan-fried prawns tossed dry in regional spices.', { allergens: ['SHELLFISH'] }],
  ['prawns-chilli', 'Chilli Prawns', 381, 'fish_prawns', NONVEG, 'SPICY', 'Prawns tossed with peppers, onion and chilli.', { allergens: ['SHELLFISH'] }],
  ['prawns-golden-fried', 'Golden Fried Prawns', 381, 'fish_prawns', NONVEG, 'MEDIUM', 'Batter-fried prawns, fried until golden and crisp.', { allergens: ['SHELLFISH', 'GLUTEN'] }],
  ['prawns-moringa-fried', 'Moringa Fried Prawns', 381, 'fish_prawns', NONVEG, 'SPICY', 'Prawns fried with moringa leaves and regional spices.', { allergens: ['SHELLFISH'] }],

  // TANDOOR
  ['tandoor-chicken-tikka', 'Chicken Tikka', 351, 'tandoor', NONVEG, 'MEDIUM', 'Boneless chicken marinated in yoghurt and spices, grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-chicken-half', 'Tandoori Chicken Half', 351, 'tandoor', NONVEG, 'MEDIUM', 'Half chicken marinated in yoghurt and spices, grilled in the tandoor.', { prep: 28, serves: '1–2 persons', allergens: ['DAIRY'] }],
  ['tandoor-chicken-full', 'Tandoori Chicken Full', 661, 'tandoor', NONVEG, 'MEDIUM', 'Whole chicken marinated in yoghurt and spices, grilled in the tandoor.', { prep: 35, serves: '2–3 persons', allergens: ['DAIRY'] }],
  ['tandoor-tangdi-kebab', 'Tangdi Kebab', 355, 'tandoor', NONVEG, 'MEDIUM', 'Chicken drumsticks marinated and grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-murgh-malai', 'Murgh Malai Kebab', 355, 'tandoor', NONVEG, 'MILD', 'Creamy, mildly spiced chicken kebab grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-lassooni-murgh', 'Lassooni Murgh Tikka', 355, 'tandoor', NONVEG, 'MEDIUM', 'Garlic-marinated chicken tikka grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-kalimirch-murgh', 'Kalimirch Murgh Tikka', 355, 'tandoor', NONVEG, 'SPICY', 'Black pepper marinated chicken tikka grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-reshmi-kebab', 'Reshmi Kebab', 355, 'tandoor', NONVEG, 'MILD', 'Silky, mildly spiced cream-marinated chicken kebab.', { allergens: ['DAIRY'] }],
  ['tandoor-afghani-kebab', 'Afghani Kebab', 355, 'tandoor', NONVEG, 'MILD', 'Mildly spiced, cream-marinated chicken kebab grilled in the tandoor.', { allergens: ['DAIRY'] }],

  // MAIN COURSE VEG
  ['mcveg-mix-veg-curry', 'Mix Veg Curry', 251, 'main_course_veg', VEG, 'MEDIUM', 'Mixed seasonal vegetables simmered in a spiced curry gravy.', {}],
  ['mcveg-kadhai', 'Veg Kadhai', 251, 'main_course_veg', VEG, 'MEDIUM', 'Mixed vegetables cooked kadhai-style with peppers and onion.', {}],
  ['mcveg-kolhapuri', 'Veg Kolhapuri', 251, 'main_course_veg', VEG, 'SPICY', 'Mixed vegetables in a fiery Kolhapuri-style masala.', {}],
  ['mcveg-paneer-butter-masala', 'Paneer Butter Masala', 311, 'main_course_veg', VEG, 'MILD', 'Creamy vegetarian curry with mild-to-medium spice.', { allergens: ['DAIRY', 'NUTS'], bestseller: true, bestsellerReason: 'Creamy vegetarian curry with mild-to-medium spice', newCustomerRecommendation: true, newCustomerReason: 'Creamy vegetarian curry with mild-to-medium spice' }],
  ['mcveg-paneer-kadhai', 'Paneer Kadhai', 321, 'main_course_veg', VEG, 'MEDIUM', 'Paneer cooked kadhai-style with peppers and onion.', { allergens: ['DAIRY'] }],
  ['mcveg-paneer-do-pyaza', 'Paneer Do Pyaza', 321, 'main_course_veg', VEG, 'MEDIUM', 'Paneer curry generously layered with onions.', { allergens: ['DAIRY'] }],
  ['mcveg-kaju-paneer', 'Kaju Paneer', 351, 'main_course_veg', VEG, 'MILD', 'Paneer curry finished with cashew paste for a rich gravy.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcveg-palak-paneer', 'Palak Paneer', 311, 'main_course_veg', VEG, 'MILD', 'Paneer cubes simmered in a spiced spinach gravy.', { allergens: ['DAIRY'] }],
  ['mcveg-methi-chaman', 'Methi Chaman', 311, 'main_course_veg', VEG, 'MILD', 'Paneer curry flavoured with fresh fenugreek leaves.', { allergens: ['DAIRY'] }],
  ['mcveg-dal-fry', 'Dal Fry', 181, 'main_course_veg', VEG, 'MILD', 'Yellow lentils tempered with cumin, garlic and spices.', {}],
  ['mcveg-dal-tadka', 'Dal Tadka', 191, 'main_course_veg', VEG, 'MILD', 'Yellow lentils finished with a smoky ghee tempering.', { allergens: ['DAIRY'] }],

  // MAIN COURSE NON-VEG
  ['mcnv-home-style-chicken', 'Home Style Chicken Curry/Pulusu', 300, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Regional chicken curry prepared in a rich, spiced gravy.', { bestseller: true, bestsellerReason: 'Regional chicken curry prepared in a rich, spiced gravy' }],
  ['mcnv-endu-mirapakaya', 'Endu Mirapakaya Kodi Kura', 311, 'main_course_nonveg', NONVEG, 'SPICY', 'Chicken curry cooked with dry red chillies for deep heat.', {}],
  ['mcnv-kaju-chicken-masala', 'Kaju Chicken Masala', 351, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken curry finished with cashew paste for a rich gravy.', { allergens: ['NUTS'] }],
  ['mcnv-chicken-tikka-masala', 'Chicken Tikka Masala', 371, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Grilled chicken tikka simmered in a spiced tomato-based gravy.', { allergens: ['DAIRY'] }],
  ['mcnv-kadai-chicken', 'Kadai Chicken', 371, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken cooked kadhai-style with peppers and onion.', {}],
  ['mcnv-butter-chicken', 'Butter Chicken', 371, 'main_course_nonveg', NONVEG, 'MILD', 'Grilled chicken simmered in a buttery tomato gravy.', { allergens: ['DAIRY'], bestseller: true, bestsellerReason: 'A familiar, mild North Indian favourite' }],
  ['mcnv-mughlai-chicken', 'Mughlai Chicken Curry', 371, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken curry in a rich Mughlai-style gravy.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcnv-khandhari-chicken', 'Khandhari Chicken Curry', 371, 'main_course_nonveg', NONVEG, 'SPICY', "Chicken curry cooked in the house's Khandhari-style masala.", {}],
  ['mcnv-chicken-kolhapuri', 'Chicken Kolhapuri', 371, 'main_course_nonveg', NONVEG, 'SPICY', 'Chicken in a fiery Kolhapuri-style masala.', {}],
  ['mcnv-chicken-curry-full', 'Chicken Curry Full', 300, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Home-style chicken curry, full portion.', { serves: '2–3 persons', portionLabel: 'Full' }],
  ['mcnv-chicken-curry-half', 'Chicken Curry Half', 150, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Home-style chicken curry, half portion.', { serves: '1 person', portionLabel: 'Half' }],
  ['mcnv-chicken-fry-full', 'Chicken Fry Full', 300, 'main_course_nonveg', NONVEG, 'SPICY', 'Regional dry-fried chicken, full portion.', { serves: '2–3 persons', portionLabel: 'Full' }],
  ['mcnv-chicken-fry-half', 'Chicken Fry Half', 150, 'main_course_nonveg', NONVEG, 'SPICY', 'Regional dry-fried chicken, half portion.', { serves: '1 person', portionLabel: 'Half' }],
  ['mcnv-vellulli-karam-kodi-curry', 'Vellulli Karam Kodi', 351, 'main_course_nonveg', NONVEG, 'SPICY', 'Garlic-forward spicy chicken curry.', { extraName: 'Garlic Spicy Chicken' }],
  ['mcnv-dum-chicken', 'Dum Chicken', 321, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken slow-cooked dum-style with layered spices.', { prep: 28 }],
  ['mcnv-karivepaku-karam-kodi', 'Karvepaku Karam Kodi', 321, 'main_course_nonveg', NONVEG, 'SPICY', 'Chicken curry tempered generously with curry leaves.', { extraName: 'Curry Leaf Spicy Chicken' }],
  ['mcnv-mutton-curry', 'Mutton Curry', 400, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Home-style mutton curry in a spiced gravy.', { prep: 30 }],
  ['mcnv-mutton-rogan-josh', 'Mutton Rogan Josh Curry', 371, 'main_course_nonveg', NONVEG, 'SPICY', 'Mutton curry in an aromatic Kashmiri-style Rogan Josh gravy.', { prep: 32 }],
  ['mcnv-methi-gosht', 'Methi Gosht', 391, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Mutton curry flavoured with fresh fenugreek leaves.', { prep: 32 }],
  ['mcnv-mutton-kalimirch', 'Mutton Kalimirch Curry', 391, 'main_course_nonveg', NONVEG, 'SPICY', 'Mutton curry finished generously with crushed black pepper.', { prep: 32 }],
  ['mcnv-bhuna-mutton', 'Bhuna Mutton Curry', 411, 'main_course_nonveg', NONVEG, 'SPICY', 'Slow-roasted, thick-gravy mutton curry.', { prep: 32 }],
  ['mcnv-prawns-curry', 'Prawns Curry', 411, 'main_course_nonveg', NONVEG, 'SPICY', 'Prawns simmered in a spiced regional curry gravy.', { allergens: ['SHELLFISH'] }],
  ['mcnv-prawns-fish-masala', 'Prawns/Fish Masala Curry', 411, 'main_course_nonveg', NONVEG, 'SPICY', 'Prawns or fish simmered in a spiced masala gravy.', { allergens: ['SEAFOOD', 'SHELLFISH'] }],
  ['mcnv-prawns-iguru', 'Prawns Iguru', 421, 'main_course_nonveg', NONVEG, 'SPICY', 'Prawns cooked Andhra-style in a thick, spiced Iguru gravy.', { allergens: ['SHELLFISH'] }],
  ['mcnv-egg-omelette-masala', 'Double Egg Omelette Masala', 80, 'main_course_nonveg', EGG, 'MEDIUM', 'Two-egg omelette cooked with onions, chillies and spices.', { allergens: ['EGG'], prep: 10 }],
  ['mcnv-egg-bujji', 'Egg Bujji', 120, 'main_course_nonveg', EGG, 'MEDIUM', 'Boiled eggs simmered in a spiced masala gravy.', { allergens: ['EGG'], prep: 12 }],

  // ROTIS & BREADS
  ['roti-tandoori', 'Tandoori Roti', 31, 'rotis_breads', VEG, null, 'Whole-wheat bread baked in the tandoor.', { allergens: ['GLUTEN'] }],
  ['roti-butter', 'Butter Roti', 41, 'rotis_breads', VEG, null, 'Whole-wheat tandoor bread finished with butter.', { allergens: ['GLUTEN', 'DAIRY'] }],
  ['roti-naan', 'Naan', 46, 'rotis_breads', VEG, null, 'Classic leavened tandoor bread.', { allergens: ['GLUTEN'] }],
  ['roti-butter-naan', 'Butter Naan', 59, 'rotis_breads', VEG, null, 'Classic leavened tandoor bread finished with butter.', { allergens: ['GLUTEN', 'DAIRY'] }],
  ['roti-plain-kulcha', 'Plain Kulcha', 41, 'rotis_breads', VEG, null, 'Soft leavened tandoor bread.', { allergens: ['GLUTEN'] }],
  ['roti-masala-kulcha', 'Masala Kulcha', 51, 'rotis_breads', VEG, null, 'Leavened tandoor bread stuffed with a light spiced filling.', { allergens: ['GLUTEN'] }],
  ['roti-lacha-paratha', 'Lacha Paratha', 49, 'rotis_breads', VEG, null, 'Layered, flaky tandoor paratha.', { allergens: ['GLUTEN'] }],
  ['roti-pudina-lacha', 'Pudina Lacha Paratha', 56, 'rotis_breads', VEG, null, 'Layered, flaky tandoor paratha flavoured with mint.', { allergens: ['GLUTEN'] }],
  ['roti-methi-lacha', 'Methi Lacha Paratha', 56, 'rotis_breads', VEG, null, 'Layered, flaky tandoor paratha flavoured with fenugreek.', { allergens: ['GLUTEN'] }],
  ['roti-garlic-naan', 'Garlic Naan', 101, 'rotis_breads', VEG, null, 'Leavened tandoor bread topped with garlic and herbs.', { allergens: ['GLUTEN'] }],
  ['roti-cheese-naan', 'Cheese Naan', 101, 'rotis_breads', VEG, null, 'Leavened tandoor bread stuffed with cheese.', { allergens: ['GLUTEN', 'DAIRY'] }],
  ['roti-ki-tokri', 'Roti Ki Tokri', 261, 'rotis_breads', VEG, null, 'An assorted basket of tandoor breads for sharing.', { allergens: ['GLUTEN'], serves: '2–3 persons', portionLabel: 'Basket' }],
  ['roti-pulka', 'Pulka', 20, 'rotis_breads', VEG, null, 'Light, unleavened whole-wheat bread.', { allergens: ['GLUTEN'] }],
  ['roti-chapathi', 'Chapathi', 35, 'rotis_breads', VEG, null, 'Soft, unleavened whole-wheat bread.', { allergens: ['GLUTEN'] }],
  ['roti-tawa-paratha', 'Tawa Paratha', 35, 'rotis_breads', VEG, null, 'Griddle-cooked layered whole-wheat paratha.', { allergens: ['GLUTEN'] }],

  // VEGETARIAN PULAOS
  ['pulao-veg', 'Veg Pulao', 200, 'veg_pulaos', VEG, 'MILD', 'Lightly spiced rice cooked with mixed vegetables.', {}],
  ['pulao-paneer', 'Paneer Pulao', 250, 'veg_pulaos', VEG, 'MILD', 'Lightly spiced rice cooked with paneer cubes.', { allergens: ['DAIRY'] }],
  ['pulao-kaju-ghee', 'Kaju Ghee Pulao', 250, 'veg_pulaos', VEG, 'MILD', 'Ghee rice finished with cashews.', { allergens: ['DAIRY', 'NUTS'] }],
  ['pulao-mushroom', 'Mushroom Pulao', 250, 'veg_pulaos', VEG, 'MILD', 'Lightly spiced rice cooked with mushrooms.', {}],

  // RICE VARIETIES
  ['rice-white', 'White Rice', 91, 'rice_varieties', VEG, null, 'Steamed plain white rice.', {}],
  ['rice-ghee-sambar', 'Ghee Sambar Rice', 200, 'rice_varieties', VEG, 'MEDIUM', 'Steamed rice mixed with ghee and sambar.', { allergens: ['DAIRY'] }],
  ['rice-jeera', 'Jeera Rice', 200, 'rice_varieties', VEG, 'MILD', 'Steamed rice tempered with cumin.', {}],
  ['rice-mudda-pappu-avakaya', 'Mudda Pappu Avakaya Rice', 200, 'rice_varieties', VEG, 'SPICY', 'Steamed rice served with mudda pappu and Andhra avakaya pickle.', {}],
  ['rice-ragi-sangati-veg', 'Ragi Sangati (Veg)', 181, 'rice_varieties', VEG, 'MEDIUM', 'Steamed ragi (finger millet) mudda, a regional staple.', {}],
  ['rice-curd', 'Curd Rice', 180, 'rice_varieties', VEG, 'MILD', 'Steamed rice mixed with curd, tempered lightly.', { allergens: ['DAIRY'] }],
  ['rice-bagaara', 'Bagaara Rice', 120, 'rice_varieties', VEG, 'MEDIUM', 'Regional spiced rice tempered with whole spices.', {}],

  // FRIED RICE & NOODLES
  ['fr-veg', 'Veg Fried Rice', 221, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed rice with mixed vegetables, Indo-Chinese style.', {}],
  ['fr-veg-schezwan', 'Veg Schezwan Fried Rice', 251, 'fried_rice_noodles', VEG, 'SPICY', 'Wok-tossed rice with vegetables in a fiery schezwan sauce.', {}],
  ['fr-egg', 'Egg Fried Rice', 251, 'fried_rice_noodles', EGG, 'MEDIUM', 'Wok-tossed rice with egg, Indo-Chinese style.', { allergens: ['EGG'] }],
  ['fr-egg-schezwan', 'Egg Schezwan Fried Rice', 269, 'fried_rice_noodles', EGG, 'SPICY', 'Wok-tossed rice with egg in a fiery schezwan sauce.', { allergens: ['EGG'] }],
  ['fr-chicken', 'Chicken Fried Rice', 269, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed rice with chicken, Indo-Chinese style.', {}],
  ['fr-chicken-schezwan', 'Chicken Schezwan Fried Rice', 281, 'fried_rice_noodles', NONVEG, 'SPICY', 'Wok-tossed rice with chicken in a fiery schezwan sauce.', {}],
  ['noodles-veg-soft', 'Veg Soft Noodles', 221, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed noodles with mixed vegetables.', { allergens: ['GLUTEN'] }],
  ['noodles-veg-schezwan', 'Veg Schezwan Noodles', 241, 'fried_rice_noodles', VEG, 'SPICY', 'Wok-tossed noodles with vegetables in a fiery schezwan sauce.', { allergens: ['GLUTEN'] }],
  ['noodles-egg-soft', 'Egg Soft Noodles', 241, 'fried_rice_noodles', EGG, 'MEDIUM', 'Wok-tossed noodles with egg.', { allergens: ['GLUTEN', 'EGG'] }],
  ['noodles-egg-schezwan', 'Egg Schezwan Noodles', 269, 'fried_rice_noodles', EGG, 'SPICY', 'Wok-tossed noodles with egg in a fiery schezwan sauce.', { allergens: ['GLUTEN', 'EGG'] }],
  ['noodles-chicken-soft', 'Chicken Soft Noodles', 269, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed noodles with chicken.', { allergens: ['GLUTEN'] }],
  ['noodles-chicken-schezwan', 'Chicken Schezwan Noodles', 281, 'fried_rice_noodles', NONVEG, 'SPICY', 'Wok-tossed noodles with chicken in a fiery schezwan sauce.', { allergens: ['GLUTEN'] }],
  ['chopsuey-american-veg', 'American Chopsuey Veg', 269, 'fried_rice_noodles', VEG, 'MEDIUM', 'Crispy fried noodles topped with a sweet-savoury vegetable gravy.', { allergens: ['GLUTEN'] }],
  ['chopsuey-american-chicken', 'American Chopsuey Chicken', 281, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Crispy fried noodles topped with a sweet-savoury chicken gravy.', { allergens: ['GLUTEN'] }],
  ['chopsuey-chinese-veg', 'Chinese Chopsuey Veg', 251, 'fried_rice_noodles', VEG, 'MEDIUM', 'Crispy fried noodles topped with a savoury vegetable gravy.', { allergens: ['GLUTEN'] }],
  ['chopsuey-chinese-chicken', 'Chinese Chopsuey Chicken', 281, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Crispy fried noodles topped with a savoury chicken gravy.', { allergens: ['GLUTEN'] }],

  // DESSERTS
  ['dessert-gulab-jamun', 'Gulab Jamun, 3 Pieces', 100, 'desserts', VEG, null, 'Warm milk-solid dumplings soaked in sugar syrup, 3 pieces.', { allergens: ['DAIRY', 'GLUTEN'], bestseller: true, bestsellerReason: 'Our most-ordered dessert', portionLabel: '3 pieces' }],
  ['dessert-carrot-halwa', 'Carrot Halwa', 120, 'desserts', VEG, null, 'Slow-cooked grated carrot dessert finished with ghee and nuts.', { allergens: ['DAIRY', 'NUTS'] }],

  // REFRESHING DRINKS
  ['drink-lime-mint', 'Lime & Mint', 120, 'drinks', VEG, null, 'Refreshing lime juice with fresh mint.', {}],
  ['drink-blue-curacao', 'Blue Curacao', 120, 'drinks', VEG, null, 'Refreshing blue-hued citrus mocktail.', {}],
  ['drink-strawberry', 'Strawberry', 120, 'drinks', VEG, null, 'Refreshing strawberry-flavoured cooler.', {}],
  ['drink-sweet-lassi', 'Sweet Lassi', 100, 'drinks', VEG, null, 'Traditional sweetened, churned yoghurt drink.', { allergens: ['DAIRY'] }],
  ['drink-butter-milk', 'Butter Milk', 55, 'drinks', VEG, null, 'Spiced, churned buttermilk.', { allergens: ['DAIRY'] }],
  ['drink-water-bottle', 'Water Bottle', null, 'drinks', VEG, null, 'Packaged drinking water.', { priceDisplay: 'MRP', customizationAvailable: false, orderableInApp: false }],
  ['drink-cool-drinks', 'Cool Drinks', null, 'drinks', VEG, null, 'Assorted packaged soft drinks.', { priceDisplay: 'MRP', customizationAvailable: false, orderableInApp: false }],
];

export const DISHES = DISH_SOURCE.map(buildDish);

// Six items curated for the "Mangamma Favourites" section (see spec §14).
export const FAVOURITE_DISH_IDS = [
  'meals-aritaku-veg',
  'meals-aritaku-nonveg',
  'biryani-chicken-special',
  'mcnv-home-style-chicken',
  'mcveg-paneer-butter-masala',
  'starter-karivepaku-kodi',
];

// Four items curated for the "New here? Start with these" section (see spec §14).
export const NEW_GUEST_DISH_IDS = [
  'mcveg-paneer-butter-masala',
  'biryani-chicken-dum',
  'tandoor-chicken-tikka',
  'cveg-manchurian',
];
