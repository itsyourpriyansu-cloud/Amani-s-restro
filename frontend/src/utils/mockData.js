import { stockImages, categoryImageKey, DISH_IMAGE_MAP } from '../data/imageManifest';

export const RESTAURANT_INFO = {
  name: "Amani's Kitchen",
  nativeName: '',
  tagline: 'A Taste of the South, Made With Heart.',
  established: '2024',
  location: '142 Heritage Way, Charleston, SC · Gourmet Dining Quarter',
  address: '142 Heritage Way, Charleston, SC · Gourmet Dining Quarter',
  gstin: '36ABCDE1234F1Z5',
  fssai: '12345678901234',
  logo: '/Amanis Logo Final.svg',
  heroImage: '/south_indian_hero_banner.png',
  taxRate: 0.05,
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
// Dish data, sourced from the printed "Amanis Menu" (Amanis Menu 182026.pdf).
// Slash-combos on the printed menu (e.g. "Veg Manchurian/Gobi 65") are expanded
// into individual dishes that share the printed price. Category-level defaults
// (representative image, prep time, spice, modifier groups) are filled in by
// buildDish() below so each source row only needs to state what's different for
// that dish, rather than repeating the full ~30-field schema for every dish.
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
    image: DISH_IMAGE_MAP[id] || extra.image || cat.image,
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
  // ===========================================================================
  // VEG SOUPS  (printed price ₹139 each)
  // ===========================================================================
  ['soup-veg-manchow', 'Veg Manchow Soup', 139, 'veg_soups', VEG, 'SPICY', 'Indo-Chinese style spiced vegetable soup topped with crispy noodles.', {}],
  ['soup-veg-corn', 'Veg Corn Soup', 139, 'veg_soups', VEG, 'MILD', 'Mildly sweet soup with sweet corn kernels and vegetables.', {}],
  ['soup-veg-hot-sour', 'Veg Hot N Sour Soup', 139, 'veg_soups', VEG, 'SPICY', 'Tangy and peppery vegetable soup in the Indo-Chinese style.', {}],
  ['soup-veg-clear', 'Veg Clear Soup', 139, 'veg_soups', VEG, 'MILD', 'Light, clear vegetable broth soup.', {}],
  ['soup-veg-lemon-coriander', 'Veg Lemon Coriander Soup', 139, 'veg_soups', VEG, 'MILD', 'Refreshing vegetable soup flavoured with lemon and coriander.', {}],
  ['soup-cream-tomato', 'Cream of Tomato Soup', 139, 'veg_soups', VEG, 'MILD', 'Classic creamy tomato soup, lightly spiced.', { allergens: ['DAIRY'] }],
  ['soup-veg-noodles', 'Veg Noodles Soup', 139, 'veg_soups', VEG, 'MILD', 'Vegetable broth soup with soft noodles.', { allergens: ['GLUTEN'] }],
  ['soup-veg-canteen', 'Veg Canteen Soup', 139, 'veg_soups', VEG, 'MEDIUM', 'House-style mixed vegetable canteen soup.', {}],
  ['soup-amanis-special', 'Amanis Special Soup', 139, 'veg_soups', VEG, 'MEDIUM', "Amani's Kitchen's own house-special vegetable soup.", {}],
  ['soup-mushroom-kema', 'Mushroom Kema Soup', 139, 'veg_soups', VEG, 'MEDIUM', 'Hearty soup with finely chopped mushroom kema.', {}],
  ['soup-veg-dragon', 'Veg Dragon Soup', 139, 'veg_soups', VEG, 'SPICY', 'Spicy Indo-Chinese dragon-style vegetable soup.', {}],

  // ===========================================================================
  // NON-VEG SOUPS  (printed price ₹159 each)
  // ===========================================================================
  ['soup-chicken-manchow', 'Chicken Manchow Soup', 159, 'nonveg_soups', NONVEG, 'SPICY', 'Indo-Chinese style spiced chicken soup topped with crispy noodles.', {}],
  ['soup-chicken-corn', 'Chicken Corn Soup', 159, 'nonveg_soups', NONVEG, 'MILD', 'Mildly sweet soup with shredded chicken and sweet corn.', {}],
  ['soup-chicken-hot-sour', 'Chicken Hot N Sour Soup', 159, 'nonveg_soups', NONVEG, 'SPICY', 'Tangy and peppery chicken soup in the Indo-Chinese style.', {}],
  ['soup-chicken-clear', 'Chicken Clear Soup', 159, 'nonveg_soups', NONVEG, 'MILD', 'Light, clear chicken broth soup.', {}],
  ['soup-chicken-dragon', 'Chicken Dragon Soup', 159, 'nonveg_soups', NONVEG, 'SPICY', 'Spicy Indo-Chinese dragon-style chicken soup.', {}],
  ['soup-mutton-chaps', 'Mutton Chaps Soup', 159, 'nonveg_soups', NONVEG, 'MEDIUM', 'Rich soup made with mutton chaps.', {}],
  ['soup-chicken-lug-fung', 'Chicken Lug Fung Soup', 159, 'nonveg_soups', NONVEG, 'MEDIUM', 'Chinese-style chicken lug fung soup.', {}],
  ['soup-chicken-seilvar', 'Chicken Seilvar Soup', 159, 'nonveg_soups', NONVEG, 'MEDIUM', 'House-style chicken seilvar soup.', {}],
  ['soup-chicken-tomiyam', 'Chicken Tomiyam Soup', 159, 'nonveg_soups', NONVEG, 'SPICY', 'Thai-inspired hot and sour tom yam chicken soup.', {}],
  ['soup-chicken-lemon-coriander', 'Chicken Lemon Coriander Soup', 159, 'nonveg_soups', NONVEG, 'MILD', 'Chicken soup flavoured with lemon and coriander.', {}],

  // ===========================================================================
  // CHINESE VEG STARTERS
  // ===========================================================================
  ['cveg-french-fries', 'French Fries', 199, 'chinese_veg_starters', VEG, null, 'Golden, crisp deep-fried potato fries.', {}],
  ['cveg-manchurian', 'Veg Manchurian (Dry)', 239, 'chinese_veg_starters', VEG, 'MEDIUM', 'Vegetable dumplings tossed in a savoury Indo-Chinese Manchurian sauce.', { bestseller: true, bestsellerReason: 'Crisp Indo-Chinese starter suitable for sharing', newCustomerRecommendation: true, newCustomerReason: 'Crisp Indo-Chinese starter suitable for sharing' }],
  ['cveg-gobi-manchurian', 'Gobi Manchurian (Dry)', 239, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crispy cauliflower florets tossed in a dry Manchurian sauce.', {}],
  ['cveg-gobi-chilli', 'Gobi Chilli', 239, 'chinese_veg_starters', VEG, 'SPICY', 'Crispy cauliflower tossed with peppers, onion and chilli.', {}],
  ['cveg-gobi-65', 'Gobi 65', 239, 'chinese_veg_starters', VEG, 'SPICY', 'Deep-fried, deeply spiced cauliflower starter.', {}],
  ['cveg-chilly-potato', 'Chilly Potato', 239, 'chinese_veg_starters', VEG, 'SPICY', 'Crispy potato fingers tossed in a spicy chilli sauce.', {}],
  ['cveg-honey-potato', 'Honey Potato', 239, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crispy potato tossed in a mildly sweet honey glaze.', {}],
  ['cveg-crispy-veg', 'Crispy Veg', 239, 'chinese_veg_starters', VEG, 'MEDIUM', 'Assorted vegetables battered and fried crisp, Indo-Chinese style.', {}],
  ['cveg-crispy-corn', 'Crispy Corn', 239, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crispy fried corn kernels tossed in Indo-Chinese seasoning.', {}],
  ['cveg-chilly-baby-corn', 'Chilly Baby Corn', 239, 'chinese_veg_starters', VEG, 'SPICY', 'Crispy baby corn tossed with peppers, onion and chilli.', {}],
  ['cveg-shangai-roll', 'Spring / Shangai Roll', 259, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crisp-fried spring rolls filled with seasoned vegetables.', { allergens: ['GLUTEN'] }],
  ['cveg-baby-corn-manchurian', 'Baby Corn Manchurian', 249, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crispy baby corn tossed in a savoury Manchurian sauce.', {}],
  ['cveg-chilly-mushroom', 'Chilly Mushroom', 249, 'chinese_veg_starters', VEG, 'SPICY', 'Mushrooms tossed with peppers, onion and chilli.', {}],
  ['cveg-mushroom-manchurian', 'Mushroom Manchurian', 249, 'chinese_veg_starters', VEG, 'MEDIUM', 'Mushrooms tossed in a savoury Indo-Chinese Manchurian sauce.', {}],
  ['cveg-mushroom-65', 'Mushroom 65', 249, 'chinese_veg_starters', VEG, 'SPICY', 'Deep-fried, deeply spiced mushroom starter.', {}],
  ['cveg-paneer-chilli', 'Chilly Paneer', 329, 'chinese_veg_starters', VEG, 'SPICY', 'Paneer cubes tossed with peppers, onion and chilli.', { allergens: ['DAIRY'] }],
  ['cveg-paneer-manchurian', 'Paneer Manchurian', 329, 'chinese_veg_starters', VEG, 'MEDIUM', 'Paneer cubes tossed in a savoury Indo-Chinese Manchurian sauce.', { allergens: ['DAIRY'] }],
  ['cveg-paneer-65', 'Paneer 65', 329, 'chinese_veg_starters', VEG, 'SPICY', 'Deep-fried, deeply spiced paneer starter.', { allergens: ['DAIRY'] }],
  ['cveg-paneer-majestic', 'Paneer Majestic', 329, 'chinese_veg_starters', VEG, 'SPICY', 'Crispy paneer strips tossed majestic-style with chilli and curry leaves.', { allergens: ['DAIRY'] }],
  ['cveg-masala-papad', 'Masala Papad (1 Pc)', 129, 'chinese_veg_starters', VEG, null, 'Crisp papad topped with spiced onion, tomato and masala.', {}],
  ['cveg-fried-papad', 'Fried Papad (2 Pcs)', 129, 'chinese_veg_starters', VEG, null, 'Deep-fried crisp papads, 2 pieces.', {}],
  ['cveg-rost-papad', 'Roast Papad (2 Pcs)', 129, 'chinese_veg_starters', VEG, null, 'Flame-roasted crisp papads, 2 pieces.', {}],
  ['cveg-golden-fried-baby-corn', 'Golden Fried Baby Corn', 249, 'chinese_veg_starters', VEG, 'MEDIUM', 'Batter-fried baby corn, fried until golden and crisp.', {}],
  ['cveg-golden-fried-paneer', 'Golden Fried Paneer', 329, 'chinese_veg_starters', VEG, 'MEDIUM', 'Batter-fried paneer, fried until golden and crisp.', { allergens: ['DAIRY'] }],
  ['cveg-veg-bollet', 'Veg Bollet', 299, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crispy fried vegetable bullets, a house starter.', {}],
  ['cveg-veg-gold-coin', 'Veg Gold Coin', 299, 'chinese_veg_starters', VEG, 'MILD', 'Crisp golden coin-shaped vegetable and bread starter.', { allergens: ['GLUTEN'] }],
  ['cveg-corn-cheez-boll', 'Corn Cheez Boll', 299, 'chinese_veg_starters', VEG, 'MILD', 'Crispy fried corn and cheese balls.', { allergens: ['DAIRY'] }],
  ['cveg-paneer-salt-pepper', 'Paneer Salt & Pepper', 329, 'chinese_veg_starters', VEG, 'MEDIUM', 'Paneer tossed with salt, crushed pepper, onion and capsicum.', { allergens: ['DAIRY'] }],
  ['cveg-mushroom-salt-pepper', 'Mushroom Salt & Pepper', 249, 'chinese_veg_starters', VEG, 'MEDIUM', 'Mushrooms tossed with salt, crushed pepper, onion and capsicum.', {}],
  ['cveg-veg-spring-roll', 'Veg Spring Roll', 239, 'chinese_veg_starters', VEG, 'MEDIUM', 'Crisp-fried rolls filled with seasoned vegetables.', { allergens: ['GLUTEN'] }],
  ['cveg-broccoli-malai-kabab', 'Broccoli Malai Kabab', 349, 'chinese_veg_starters', VEG, 'MILD', 'Creamy, mildly spiced broccoli kababs.', { allergens: ['DAIRY'] }],
  ['cveg-green-salad', 'Green Salad', 59, 'chinese_veg_starters', VEG, null, 'Fresh garden salad of seasonal raw vegetables.', {}],

  // ===========================================================================
  // NON-VEG STARTERS (CHINESE)
  // ===========================================================================
  ['starter-chilly-egg', 'Chilly Egg', 249, 'nonveg_starters', EGG, 'SPICY', 'Fried egg tossed with peppers, onion and chilli.', { allergens: ['EGG'] }],
  ['starter-egg-manchurian', 'Egg Manchurian', 249, 'nonveg_starters', EGG, 'MEDIUM', 'Fried egg tossed in a savoury Indo-Chinese Manchurian sauce.', { allergens: ['EGG'] }],
  ['starter-chilli-egg-65', 'Chilli Egg 65', 249, 'nonveg_starters', EGG, 'SPICY', 'Deep-fried, deeply spiced egg 65 starter.', { allergens: ['EGG'] }],
  ['starter-egg-spring-roll', 'Egg Spring Roll', 259, 'nonveg_starters', EGG, 'MEDIUM', 'Crisp-fried spring rolls filled with seasoned egg.', { allergens: ['EGG', 'GLUTEN'] }],
  ['starter-chilli-chicken', 'Chilly Chicken', 339, 'nonveg_starters', NONVEG, 'SPICY', 'Indo-Chinese chicken starter tossed with peppers, onion and chilli.', {}],
  ['starter-chicken-manchurian', 'Chicken Manchurian', 339, 'nonveg_starters', NONVEG, 'MEDIUM', 'Indo-Chinese chicken starter tossed in a savoury Manchurian sauce.', {}],
  ['starter-chicken-65', 'Chicken 65', 339, 'nonveg_starters', NONVEG, 'SPICY', 'Classic deep-fried, deeply spiced chicken starter.', { bestseller: true, bestsellerReason: 'A regional Indo-Chinese favourite' }],
  ['starter-pepper-chicken', 'Pepper Chicken', 359, 'nonveg_starters', NONVEG, 'SPICY', 'Chicken starter tossed generously in crushed black pepper.', {}],
  ['starter-chicken-555', 'Chicken 555', 359, 'nonveg_starters', NONVEG, 'SPICY', 'Signature spicy deep-fried chicken 555 starter.', {}],
  ['starter-rrr-chicken', 'RRR Chicken', 359, 'nonveg_starters', NONVEG, 'SPICY', 'House-special fiery RRR chicken starter.', {}],
  ['starter-chicken-majestic', 'Chicken Majestic', 359, 'nonveg_starters', NONVEG, 'SPICY', 'Andhra-style deep-fried chicken starter, curry-leaf and chilli tempered.', {}],
  ['starter-ginger-chicken', 'Ginger Chicken', 349, 'nonveg_starters', NONVEG, 'MEDIUM', 'Chicken tossed with fresh ginger in a savoury sauce.', {}],
  ['starter-garlic-chicken', 'Garlic Chicken', 349, 'nonveg_starters', NONVEG, 'MEDIUM', 'Chicken tossed with garlic in a savoury sauce.', {}],
  ['starter-schezwan-chicken', 'Schezwan Chicken', 349, 'nonveg_starters', NONVEG, 'SPICY', 'Chicken tossed in a fiery schezwan sauce.', {}],
  ['starter-dragon-chicken', 'Dragon Chicken (Wet/Dry)', 349, 'nonveg_starters', NONVEG, 'SPICY', 'Spicy dragon-style chicken, available wet or dry.', {}],
  ['starter-crispy-chicken', 'Crispy Chicken (With Bone)', 349, 'nonveg_starters', NONVEG, 'SPICY', 'Bone-in chicken pieces deep-fried crisp and spiced.', {}],
  ['starter-chicken-drumsticks', 'Chicken Drumsticks', 349, 'nonveg_starters', NONVEG, 'SPICY', 'Spiced fried chicken drumsticks.', {}],
  ['starter-chicken-lollipop', 'Chicken Lollipop (6 Pcs)', 349, 'nonveg_starters', NONVEG, 'SPICY', 'Frenched chicken wings, deep-fried and tossed in spices, 6 pieces.', { portionLabel: '6 pieces' }],
  ['starter-honey-chicken', 'Honey Chicken', 349, 'nonveg_starters', NONVEG, 'MEDIUM', 'Crisp fried chicken tossed in a mildly sweet honey glaze.', {}],
  ['starter-lemon-coriander-chicken', 'Lemon Coriander Chicken', 349, 'nonveg_starters', NONVEG, 'MEDIUM', 'Crisp chicken tossed with lemon and fresh coriander.', {}],
  ['starter-chilli-chicken-pakoda', 'Chilli Chicken Pakoda', 379, 'nonveg_starters', NONVEG, 'SPICY', 'Spiced fried chicken pakoda tossed with chilli.', {}],
  ['starter-kaju-chicken', 'Kaju Chicken', 379, 'nonveg_starters', NONVEG, 'MEDIUM', 'Chicken starter tossed with roasted cashews.', { allergens: ['NUTS'] }],
  ['starter-bootain-chicken', 'Bootain Chicken', 349, 'nonveg_starters', NONVEG, 'SPICY', 'House-special bootain chicken starter.', {}],
  ['starter-chicken-spring-roll', 'Chicken Spring Roll', 299, 'nonveg_starters', NONVEG, 'MEDIUM', 'Crisp-fried rolls filled with seasoned chicken.', { allergens: ['GLUTEN'] }],

  // ===========================================================================
  // SEE FOOD (FISH & PRAWNS)
  // ===========================================================================
  ['fish-chilli', 'Chilly Fish (Dry/Wet)', 349, 'fish_prawns', NONVEG, 'SPICY', 'Fish cubes tossed with peppers, onion and chilli, dry or wet.', { allergens: ['SEAFOOD'] }],
  ['fish-apollo', 'Apollo Fish (Dry/Wet)', 349, 'fish_prawns', NONVEG, 'SPICY', 'Boneless fish cubes, deep-fried and tossed in a spiced masala.', { allergens: ['SEAFOOD'] }],
  ['fish-ginger', 'Ginger Fish (Dry/Wet)', 349, 'fish_prawns', NONVEG, 'MEDIUM', 'Fish tossed with fresh ginger in a savoury sauce.', { allergens: ['SEAFOOD'] }],
  ['fish-garlic', 'Garlic Fish (Dry/Wet)', 349, 'fish_prawns', NONVEG, 'MEDIUM', 'Fish tossed with garlic in a savoury sauce.', { allergens: ['SEAFOOD'] }],
  ['fish-fingers', 'Fish Fingers', 359, 'fish_prawns', NONVEG, 'MEDIUM', 'Breaded fish fingers, deep-fried until golden.', { allergens: ['SEAFOOD', 'GLUTEN'] }],
  ['fish-rost', 'Fish Roast (South Indian Style)', 359, 'fish_prawns', NONVEG, 'SPICY', 'South Indian style roasted fish with regional spices.', { allergens: ['SEAFOOD'] }],
  ['prawns-chilli', 'Chilly Prawns (Dry/Wet)', 399, 'fish_prawns', NONVEG, 'SPICY', 'Prawns tossed with peppers, onion and chilli, dry or wet.', { allergens: ['SHELLFISH'] }],
  ['prawns-loose', 'Loose Prawns (Dry/Wet)', 399, 'fish_prawns', NONVEG, 'SPICY', 'Pan-fried prawns tossed in regional spices, dry or wet.', { allergens: ['SHELLFISH'] }],
  ['prawns-garlic', 'Garlic Prawns (Dry/Wet)', 399, 'fish_prawns', NONVEG, 'MEDIUM', 'Prawns tossed with garlic in a savoury sauce.', { allergens: ['SHELLFISH'] }],
  ['prawns-ginger', 'Ginger Prawns (Dry/Wet)', 399, 'fish_prawns', NONVEG, 'MEDIUM', 'Prawns tossed with fresh ginger in a savoury sauce.', { allergens: ['SHELLFISH'] }],
  ['prawns-schezwan', 'Shazewani Prawns (Dry/Wet)', 399, 'fish_prawns', NONVEG, 'SPICY', 'Prawns tossed in a fiery schezwan sauce, dry or wet.', { allergens: ['SHELLFISH'] }],

  // ===========================================================================
  // TANDOORI VEG STARTERS
  // ===========================================================================
  ['tandoor-veg-seekh-kebab', 'Veg Seekh Kebab', 279, 'tandoor', VEG, 'MEDIUM', 'Spiced minced vegetable seekh kebabs grilled in the tandoor.', {}],
  ['tandoor-hara-bhara-kebab', 'Hara Bhara Kebab', 279, 'tandoor', VEG, 'MILD', 'Spinach and green pea patties grilled in the tandoor.', {}],
  ['tandoor-moti-seekh-kebab', 'Moti Seekh Kebab', 279, 'tandoor', VEG, 'MEDIUM', 'Soft, rich vegetable moti seekh kebabs grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-paneer-tikka', 'Paneer Tikka', 329, 'tandoor', VEG, 'MEDIUM', 'Paneer marinated in yoghurt and spices, grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-paneer-achari-tikka', 'Paneer Achari Tikka', 329, 'tandoor', VEG, 'MEDIUM', 'Paneer marinated in tangy pickle spices, grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-paneer-malai-tikka', 'Paneer Malai Tikka', 329, 'tandoor', VEG, 'MILD', 'Creamy, mildly spiced paneer tikka grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-paneer-haryali-tikka', 'Paneer Haryali Tikka', 329, 'tandoor', VEG, 'MEDIUM', 'Paneer marinated in a green mint-coriander paste, grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-chilly-cheese-paneer-tikka', 'Chilly Cheese Paneer Tikka', 329, 'tandoor', VEG, 'SPICY', 'Cheesy, chilli-spiced paneer tikka grilled in the tandoor.', { allergens: ['DAIRY'] }],
  ['tandoor-paneer-pasanda-kabab', 'Paneer Pasanda Kabab', 329, 'tandoor', VEG, 'MILD', 'Stuffed paneer pasanda kababs grilled in the tandoor.', { allergens: ['DAIRY', 'NUTS'] }],

  // ===========================================================================
  // TANDOORI NON-VEG STARTERS
  // ===========================================================================
  ['tandoor-chicken-tikka', 'Chicken Tikka (8 Pcs)', 359, 'tandoor', NONVEG, 'MEDIUM', 'Boneless chicken marinated in yoghurt and spices, grilled in the tandoor.', { allergens: ['DAIRY'], portionLabel: '8 pieces' }],
  ['tandoor-chicken-achari-tikka', 'Chicken Achari Tikka (8 Pcs)', 359, 'tandoor', NONVEG, 'MEDIUM', 'Chicken marinated in tangy pickle spices, grilled in the tandoor.', { allergens: ['DAIRY'], portionLabel: '8 pieces' }],
  ['tandoor-chicken-malai-tikka', 'Chicken Malai Tikka (8 Pcs)', 359, 'tandoor', NONVEG, 'MILD', 'Creamy, mildly spiced chicken tikka grilled in the tandoor.', { allergens: ['DAIRY'], portionLabel: '8 pieces' }],
  ['tandoor-chicken-haryali-tikka', 'Chicken Haryali Tikka (8 Pcs)', 359, 'tandoor', NONVEG, 'MEDIUM', 'Chicken marinated in a green mint-coriander paste, grilled in the tandoor.', { allergens: ['DAIRY'], portionLabel: '8 pieces' }],
  ['tandoor-murg-malai-kabab', 'Murg Malai Kabab (8 Pcs)', 359, 'tandoor', NONVEG, 'MILD', 'Creamy, mildly spiced chicken kebab grilled in the tandoor.', { allergens: ['DAIRY'], portionLabel: '8 pieces' }],
  ['tandoor-chicken-garlic-kabab', 'Chicken Garlic Kabab (8 Pcs)', 359, 'tandoor', NONVEG, 'MEDIUM', 'Garlic-marinated chicken kababs grilled in the tandoor.', { allergens: ['DAIRY'], portionLabel: '8 pieces' }],
  ['tandoor-chicken-tangdi-kabab', 'Chicken Tangdi Kabab (8 Pcs)', 359, 'tandoor', NONVEG, 'MEDIUM', 'Chicken drumsticks marinated and grilled in the tandoor.', { allergens: ['DAIRY'], portionLabel: '8 pieces' }],
  ['tandoor-chicken-reshmi-kebab', 'Chicken Reshmi Kebab', 379, 'tandoor', NONVEG, 'MILD', 'Silky, mildly spiced cream-marinated chicken kebab.', { allergens: ['DAIRY'] }],
  ['tandoor-chicken-seekh-kebab', 'Chicken Seekh Kebab', 379, 'tandoor', NONVEG, 'MEDIUM', 'Spiced minced chicken seekh kebabs grilled in the tandoor.', {}],
  ['tandoor-tangdi-kebab', 'Tangdi Kebab (Half / Full)', 199, 'tandoor', NONVEG, 'MEDIUM', 'Marinated chicken drumsticks grilled in the tandoor. Half 2 Pcs ₹199 / Full 4 Pcs ₹389.', { allergens: ['DAIRY'], portionLabel: 'Half 2 Pcs', priceDisplay: '199 / 389' }],
  ['tandoor-kalmi-kebab', 'Kalmi Kebab (Half / Full)', 199, 'tandoor', NONVEG, 'MEDIUM', 'Marinated chicken kalmi kebabs grilled in the tandoor. Half 2 Pcs ₹199 / Full 4 Pcs ₹389.', { allergens: ['DAIRY'], portionLabel: 'Half 2 Pcs', priceDisplay: '199 / 389' }],
  ['tandoor-chicken-half', 'Tandoori Chicken (Half)', 199, 'tandoor', NONVEG, 'MEDIUM', 'Half chicken marinated in yoghurt and spices, grilled in the tandoor.', { prep: 28, serves: '1–2 persons', allergens: ['DAIRY'] }],
  ['tandoor-chicken-full', 'Tandoori Chicken (Full)', 389, 'tandoor', NONVEG, 'MEDIUM', 'Whole chicken marinated in yoghurt and spices, grilled in the tandoor.', { prep: 35, serves: '2–3 persons', allergens: ['DAIRY'] }],
  ['tandoor-mutton-seekh-kebab', 'Mutton Seekh Kebab (8 Pcs)', 399, 'tandoor', NONVEG, 'MEDIUM', 'Spiced minced mutton seekh kebabs grilled in the tandoor.', { portionLabel: '8 pieces' }],
  ['tandoor-mutton-tikka', 'Mutton Tikka (8 Pcs)', 399, 'tandoor', NONVEG, 'SPICY', 'Mutton marinated in spices and grilled in the tandoor.', { portionLabel: '8 pieces' }],
  ['tandoor-fish-tikka', 'Fish Tikka', 349, 'tandoor', NONVEG, 'MEDIUM', 'Fish marinated in spices and grilled in the tandoor.', { allergens: ['SEAFOOD'] }],

  // ===========================================================================
  // BREADS
  // ===========================================================================
  ['roti-plain', 'Roti', 35, 'rotis_breads', VEG, null, 'Whole-wheat bread baked in the tandoor.', { allergens: ['GLUTEN'] }],
  ['roti-butter', 'Butter Roti', 39, 'rotis_breads', VEG, null, 'Whole-wheat tandoor bread finished with butter.', { allergens: ['GLUTEN', 'DAIRY'] }],
  ['roti-naan', 'Plain Naan', 35, 'rotis_breads', VEG, null, 'Classic leavened tandoor bread.', { allergens: ['GLUTEN'] }],
  ['roti-butter-naan', 'Butter Naan', 49, 'rotis_breads', VEG, null, 'Classic leavened tandoor bread finished with butter.', { allergens: ['GLUTEN', 'DAIRY'] }],
  ['roti-kashmiri-naan', 'Kashmiri Naan', 119, 'rotis_breads', VEG, null, 'Sweet, rich naan stuffed with nuts and dried fruit.', { allergens: ['GLUTEN', 'NUTS', 'DAIRY'] }],
  ['roti-lacha-paratha', 'Lacha Paratha', 49, 'rotis_breads', VEG, null, 'Layered, flaky tandoor paratha.', { allergens: ['GLUTEN'] }],
  ['roti-aloo-paratha', 'Aloo Paratha', 49, 'rotis_breads', VEG, null, 'Whole-wheat paratha stuffed with spiced potato.', { allergens: ['GLUTEN'] }],
  ['roti-keema-paratha', 'Keema Paratha (Mutton)', 199, 'rotis_breads', NONVEG, null, 'Paratha stuffed with spiced minced mutton keema.', { allergens: ['GLUTEN'] }],

  // ===========================================================================
  // AMANIS SOUTH — VEG THALI  (master category: Meals)
  // ===========================================================================
  ['meals-aritaku-veg', 'Veg Tali Lunch', 229, 'meals', VEG, 'MEDIUM', 'A complete traditional South Indian thali: sweet, hot, 2 small poori, roti, flavoured rice, kurma, oil fry, dum fry, curry, pappu, sambar, majjiga pulusu, rasam, roti pachadi, curd chilli, vadiyalu or appadam and a sweet paan.', { serves: '1 person', portionLabel: 'Full thali', bestseller: true, bestsellerReason: 'Our signature complete regional meal', newCustomerRecommendation: true, newCustomerReason: 'A complete traditional South Indian thali' }],

  // ===========================================================================
  // AMANIS SOUTH NON-VEG — CURRIES  (master category: Meals)
  // ===========================================================================
  ['mcnv-andhra-chicken-curry', 'Andhra Chicken Curry', 279, 'main_course_nonveg', NONVEG, 'SPICY', 'Fiery Andhra-style chicken curry in a spiced gravy.', { bestseller: true, bestsellerReason: 'A regional Andhra favourite' }],
  ['mcnv-perugu-chicken', 'Perugu Chicken', 279, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken cooked in a tangy yoghurt-based gravy.', { allergens: ['DAIRY'] }],
  ['mcnv-rayalaseema-chicken-fry', 'Rayalaseema Chicken Fry', 279, 'main_course_nonveg', NONVEG, 'SPICY', 'Spicy Rayalaseema-style dry chicken fry.', {}],
  ['mcnv-konaseema-chicken-fry', 'Konaseema Chicken Fry', 279, 'main_course_nonveg', NONVEG, 'SPICY', 'Coastal Konaseema-style dry chicken fry.', {}],
  ['mcnv-chicken-ghee-rost', 'Chicken Ghee Roast', 279, 'main_course_nonveg', NONVEG, 'SPICY', 'Chicken roasted in ghee with a spiced masala.', { allergens: ['DAIRY'] }],
  ['mcnv-natukodi-pulusu', 'Natukodi Pulusu', 299, 'main_course_nonveg', NONVEG, 'SPICY', 'Country chicken cooked in a tangy regional pulusu gravy.', {}],
  ['mcnv-mutton-curry', 'Mutton Curry', 359, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Home-style mutton curry in a spiced gravy.', { prep: 30 }],
  ['mcnv-mutton-ghee-rost', 'Mutton Ghee Roast', 359, 'main_course_nonveg', NONVEG, 'SPICY', 'Mutton roasted in ghee with a spiced masala.', { prep: 30, allergens: ['DAIRY'] }],
  ['mcnv-nellore-chepala-pulusu', 'Nellore Chepala Pulusu (2 Pcs)', 299, 'main_course_nonveg', NONVEG, 'SPICY', 'Nellore-style tangy fish pulusu, 2 pieces.', { allergens: ['SEAFOOD'] }],
  ['mcnv-korameenu-iguru', 'Korameenu Iguru', 359, 'main_course_nonveg', NONVEG, 'SPICY', 'Korameenu fish cooked Andhra-style in a thick, spiced iguru gravy.', { allergens: ['SEAFOOD'] }],
  ['mcnv-bommidala-pulusu', 'Bommidala Pulusu', 359, 'main_course_nonveg', NONVEG, 'SPICY', 'Bommidala fish cooked in a tangy regional pulusu gravy.', { allergens: ['SEAFOOD'] }],
  ['mcnv-prawns-iguru', 'Prawns Iguru', 399, 'main_course_nonveg', NONVEG, 'SPICY', 'Prawns cooked Andhra-style in a thick, spiced iguru gravy.', { allergens: ['SHELLFISH'] }],

  // ===========================================================================
  // AMANIS SOUTH NON-VEG — COMBOS  (rice + curry, master category: Meals)
  // ===========================================================================
  ['meals-combo-chepala-pulusu', 'White Rice - Chepala Pulusu (2 Pcs)', 199, 'meals', NONVEG, 'SPICY', 'White rice served with tangy fish pulusu, 2 pieces.', { serves: '1 person', portionLabel: 'Combo', allergens: ['SEAFOOD'] }],
  ['meals-combo-bommidala-pulusu', 'White Rice - Bommidala Pulusu', 399, 'meals', NONVEG, 'SPICY', 'White rice served with bommidala fish pulusu.', { serves: '1 person', portionLabel: 'Combo', allergens: ['SEAFOOD'] }],
  ['meals-combo-korameenu-iguru', 'White Rice - Korameenu Iguru', 399, 'meals', NONVEG, 'SPICY', 'White rice served with korameenu fish iguru.', { serves: '1 person', portionLabel: 'Combo', allergens: ['SEAFOOD'] }],
  ['meals-combo-mutton-curry', 'White / Bagara Rice - Mutton Curry (8 Pcs, With Bone)', 399, 'meals', NONVEG, 'MEDIUM', 'White or bagara rice served with bone-in mutton curry, 8 pieces.', { serves: '1 person', portionLabel: 'Combo' }],
  ['meals-combo-natukodi-pulusu', 'White / Bagara Rice - Natukodi Pulusu', 399, 'meals', NONVEG, 'SPICY', 'White or bagara rice served with country chicken pulusu.', { serves: '1 person', portionLabel: 'Combo' }],
  ['meals-combo-natukodi-iguru', 'White / Bagara Rice - Natu Kodi Iguru', 399, 'meals', NONVEG, 'SPICY', 'White or bagara rice served with country chicken iguru.', { serves: '1 person', portionLabel: 'Combo' }],
  ['meals-combo-kodi-iguru', 'White / Bagara Rice - Kodi Iguru', 379, 'meals', NONVEG, 'SPICY', 'White or bagara rice served with chicken iguru.', { serves: '1 person', portionLabel: 'Combo' }],
  ['meals-combo-kodi-kura', 'White / Bagara Rice - Kodi Kura', 379, 'meals', NONVEG, 'MEDIUM', 'White or bagara rice served with home-style chicken kura.', { serves: '1 person', portionLabel: 'Combo' }],
  ['meals-combo-ragimuda-mutton', 'Ragi Muda - Mutton Curry', 359, 'meals', NONVEG, 'MEDIUM', 'Steamed ragi mudda served with mutton curry.', { serves: '1 person', portionLabel: 'Combo' }],
  ['meals-combo-ragimuda-natukodi', 'Ragi Muda - Natu Kodi Pulusu', 359, 'meals', NONVEG, 'SPICY', 'Steamed ragi mudda served with country chicken pulusu.', { serves: '1 person', portionLabel: 'Combo' }],
  ['meals-combo-ragimuda-kodikura', 'Ragi Muda - Kodi Kura', 279, 'meals', NONVEG, 'MEDIUM', 'Steamed ragi mudda served with home-style chicken kura.', { serves: '1 person', portionLabel: 'Combo' }],

  // ===========================================================================
  // INDIAN MAIN COURSE — VEG CURRIES
  // ===========================================================================
  ['mcveg-kaju-mushroom', 'Kaju Mushroom', 339, 'main_course_veg', VEG, 'MILD', 'Mushrooms in a rich cashew gravy.', { allergens: ['NUTS'] }],
  ['mcveg-kaju-paneer', 'Kaju Paneer', 339, 'main_course_veg', VEG, 'MILD', 'Paneer in a rich cashew gravy.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcveg-kaju-capsicum-masala', 'Kaju Capsicum Masala', 339, 'main_course_veg', VEG, 'MEDIUM', 'Capsicum in a rich cashew masala gravy.', { allergens: ['NUTS'] }],
  ['mcveg-kaju-tomato', 'Kaju Tomato', 339, 'main_course_veg', VEG, 'MEDIUM', 'Tomato-based curry finished with cashew paste.', { allergens: ['NUTS'] }],
  ['mcveg-paneer-butter-masala', 'Paneer Butter Masala', 339, 'main_course_veg', VEG, 'MILD', 'Creamy vegetarian curry with mild-to-medium spice.', { allergens: ['DAIRY', 'NUTS'], bestseller: true, bestsellerReason: 'Creamy vegetarian curry with mild-to-medium spice', newCustomerRecommendation: true, newCustomerReason: 'Creamy vegetarian curry with mild-to-medium spice' }],
  ['mcveg-paneer-tikka-masala', 'Paneer Tikka Masala', 339, 'main_course_veg', VEG, 'MEDIUM', 'Grilled paneer tikka simmered in a spiced tomato gravy.', { allergens: ['DAIRY'] }],
  ['mcveg-paneer-kadhai', 'Kadai Paneer', 339, 'main_course_veg', VEG, 'MEDIUM', 'Paneer cooked kadhai-style with peppers and onion.', { allergens: ['DAIRY'] }],
  ['mcveg-palak-paneer', 'Palak Paneer', 339, 'main_course_veg', VEG, 'MILD', 'Paneer cubes simmered in a spiced spinach gravy.', { allergens: ['DAIRY'] }],
  ['mcveg-paneer-matar', 'Paneer Matar', 339, 'main_course_veg', VEG, 'MILD', 'Paneer and green peas in a spiced gravy.', { allergens: ['DAIRY'] }],
  ['mcveg-methi-chaman', 'Methi Chaman', 339, 'main_course_veg', VEG, 'MILD', 'Paneer curry flavoured with fresh fenugreek leaves.', { allergens: ['DAIRY'] }],
  ['mcveg-paneer-chatpat', 'Paneer Chatpat', 339, 'main_course_veg', VEG, 'MEDIUM', 'Tangy, spiced paneer chatpat curry.', { allergens: ['DAIRY'] }],
  ['mcveg-paneer-kolhapuri', 'Paneer Kolhapuri', 339, 'main_course_veg', VEG, 'SPICY', 'Paneer in a fiery Kolhapuri-style masala.', { allergens: ['DAIRY'] }],
  ['mcveg-malai-kofta', 'Malai Kofta Curry', 339, 'main_course_veg', VEG, 'MILD', 'Soft vegetable and paneer koftas in a creamy gravy.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcveg-navratna-kurma', 'Navratna Kurma', 339, 'main_course_veg', VEG, 'MILD', 'Mixed vegetables, fruit and nuts in a rich, mildly sweet kurma.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcveg-paneer-shahi-kurma', 'Paneer Shahi Kurma', 339, 'main_course_veg', VEG, 'MILD', 'Paneer in a rich, royal shahi kurma gravy.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcveg-mix-veg-curry', 'Mix Veg Curry', 299, 'main_course_veg', VEG, 'MEDIUM', 'Mixed seasonal vegetables simmered in a spiced curry gravy.', {}],
  ['mcveg-kadhai', 'Kadai Veg Curry', 299, 'main_course_veg', VEG, 'MEDIUM', 'Mixed vegetables cooked kadhai-style with peppers and onion.', {}],
  ['mcveg-veg-do-pyaza', 'Veg Do Pyaza', 299, 'main_course_veg', VEG, 'MEDIUM', 'Mixed vegetables generously layered with onions.', {}],
  ['mcveg-veg-chatpat', 'Veg Chatpat', 299, 'main_course_veg', VEG, 'MEDIUM', 'Tangy, spiced mixed vegetable chatpat curry.', {}],
  ['mcveg-kolhapuri', 'Veg Kolhapuri', 299, 'main_course_veg', VEG, 'SPICY', 'Mixed vegetables in a fiery Kolhapuri-style masala.', {}],
  ['mcveg-mushroom-masala', 'Mushroom Masala', 299, 'main_course_veg', VEG, 'MEDIUM', 'Mushrooms simmered in a spiced masala gravy.', {}],
  ['mcveg-baby-corn-masala', 'Baby Corn Masala', 299, 'main_course_veg', VEG, 'MEDIUM', 'Baby corn simmered in a spiced masala gravy.', {}],
  ['mcveg-aloo-gobi', 'Aloo Gobi', 279, 'main_course_veg', VEG, 'MEDIUM', 'Potato and cauliflower cooked with onion and spices.', {}],
  ['mcveg-jeera-aloo', 'Jeera Aloo', 279, 'main_course_veg', VEG, 'MILD', 'Potatoes tempered with cumin and light spices.', {}],
  ['mcveg-plain-palak', 'Plain Palak', 279, 'main_course_veg', VEG, 'MILD', 'Spiced spinach gravy.', {}],
  ['mcveg-capsicum-masala', 'Capsicum Masala', 279, 'main_course_veg', VEG, 'MEDIUM', 'Capsicum simmered in a spiced masala gravy.', {}],
  ['mcveg-aloo-matar', 'Aloo Matar', 279, 'main_course_veg', VEG, 'MILD', 'Potatoes and green peas in a spiced gravy.', {}],
  ['mcveg-gobi-masala', 'Gobi Masala', 279, 'main_course_veg', VEG, 'MEDIUM', 'Cauliflower simmered in a spiced masala gravy.', {}],

  // DAL ITEMS
  ['mcveg-dal-makhani', 'Dal Makhani', 299, 'main_course_veg', VEG, 'MILD', 'Slow-cooked black lentils in a rich, buttery gravy.', { allergens: ['DAIRY'] }],
  ['mcveg-dal-tadka', 'Dal Tadka', 259, 'main_course_veg', VEG, 'MILD', 'Yellow lentils finished with a smoky ghee tempering.', { allergens: ['DAIRY'] }],
  ['mcveg-dal-fry', 'Dal Fry', 259, 'main_course_veg', VEG, 'MILD', 'Yellow lentils tempered with cumin, garlic and spices.', {}],

  // ===========================================================================
  // INDIAN MAIN COURSE — NON-VEG CURRIES
  // ===========================================================================
  ['mcnv-egg-burji', 'Egg Burji', 199, 'main_course_nonveg', EGG, 'MEDIUM', 'Scrambled eggs cooked with onions, tomato and spices.', { allergens: ['EGG'], prep: 12 }],
  ['mcnv-egg-masala-curry', 'Egg Masala Curry', 199, 'main_course_nonveg', EGG, 'MEDIUM', 'Boiled eggs simmered in a spiced masala gravy.', { allergens: ['EGG'], prep: 12 }],
  ['mcnv-kodi-gudlu-iguru', 'Kodi Gudlu Ulli Iguru', 199, 'main_course_nonveg', EGG, 'SPICY', 'Boiled eggs cooked Andhra-style with onions in a spiced iguru.', { allergens: ['EGG'], prep: 12 }],
  ['mcnv-butter-chicken', 'Butter Chicken', 359, 'main_course_nonveg', NONVEG, 'MILD', 'Grilled chicken simmered in a buttery tomato gravy.', { allergens: ['DAIRY'], bestseller: true, bestsellerReason: 'A familiar, mild North Indian favourite', newCustomerRecommendation: true, newCustomerReason: 'A familiar, mild North Indian favourite' }],
  ['mcnv-chicken-tikka-masala', 'Chicken Tikka Masala', 359, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Grilled chicken tikka simmered in a spiced tomato-based gravy.', { allergens: ['DAIRY'] }],
  ['mcnv-punjab-chicken-curry', 'Punjab Chicken Curry', 349, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Punjabi-style chicken curry in a rich, spiced gravy.', {}],
  ['mcnv-chicken-masala', 'Chicken Masala', 349, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken simmered in a spiced masala gravy.', {}],
  ['mcnv-tangdi-kebab-masala', 'Tangdi Kebab Masala', 349, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken drumsticks simmered in a spiced masala gravy.', { allergens: ['DAIRY'] }],
  ['mcnv-dum-ka-murg', 'Dum Ka Murg (With Bone)', 349, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Bone-in chicken slow-cooked dum-style with layered spices.', { prep: 28, allergens: ['NUTS'] }],
  ['mcnv-afghan-chicken', 'Afghan Chicken', 349, 'main_course_nonveg', NONVEG, 'MILD', 'Mild, creamy Afghani-style chicken curry.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcnv-chicken-navabi', 'Chicken Navabi', 349, 'main_course_nonveg', NONVEG, 'MILD', 'Rich, royal Nawabi-style chicken curry.', { allergens: ['DAIRY', 'NUTS'] }],
  ['mcnv-kadai-chicken', 'Kadai Chicken', 339, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken cooked kadhai-style with peppers and onion.', {}],
  ['mcnv-methi-chicken', 'Methi Chicken', 339, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken curry flavoured with fresh fenugreek leaves.', {}],
  ['mcnv-chicken-do-pyaza', 'Chicken Do Pyaza', 339, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Chicken curry generously layered with onions.', {}],
  ['mcnv-chicken-chatpat', 'Chicken Chatpat', 339, 'main_course_nonveg', NONVEG, 'SPICY', 'Tangy, spiced chatpat chicken curry.', {}],
  ['mcnv-chicken-kolhapuri', 'Chicken Kolhapuri', 339, 'main_course_nonveg', NONVEG, 'SPICY', 'Chicken in a fiery Kolhapuri-style masala.', {}],
  ['mcnv-kadai-mutton', 'Kadai Mutton', 409, 'main_course_nonveg', NONVEG, 'MEDIUM', 'Mutton cooked kadhai-style with peppers and onion.', { prep: 32 }],
  ['mcnv-mutton-rogan-josh', 'Mutton Rogan Josh', 409, 'main_course_nonveg', NONVEG, 'SPICY', 'Mutton curry in an aromatic Kashmiri-style Rogan Josh gravy.', { prep: 32 }],
  ['mcnv-mutton-kema-fry', 'Mutton Kema Fry (Boneless, 8 Pcs)', 409, 'main_course_nonveg', NONVEG, 'SPICY', 'Boneless minced mutton kema, dry-fried with spices, 8 pieces.', { prep: 32, portionLabel: '8 pieces' }],
  ['mcnv-fish-fry-masala', 'Fish Fry Masala', 299, 'main_course_nonveg', NONVEG, 'SPICY', 'Fish simmered in a spiced fry masala gravy.', { allergens: ['SEAFOOD'] }],
  ['mcnv-prawns-masala', 'Prawns Masala', 399, 'main_course_nonveg', NONVEG, 'SPICY', 'Prawns simmered in a spiced masala gravy.', { allergens: ['SHELLFISH'] }],

  // ===========================================================================
  // VEG NOODLES  (printed price ₹219 each)
  // ===========================================================================
  ['noodles-veg-soft', 'Veg Soft Noodles', 219, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed soft noodles with mixed vegetables.', { allergens: ['GLUTEN'] }],
  ['noodles-veg-schezwan', 'Veg Schezwan Noodles', 219, 'fried_rice_noodles', VEG, 'SPICY', 'Wok-tossed noodles with vegetables in a fiery schezwan sauce.', { allergens: ['GLUTEN'] }],
  ['noodles-veg-hakka', 'Veg Hakka Noodles', 219, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed Hakka noodles with mixed vegetables.', { allergens: ['GLUTEN'] }],
  ['noodles-veg-chilli-garlic', 'Veg Chilli Garlic Noodles', 219, 'fried_rice_noodles', VEG, 'SPICY', 'Wok-tossed noodles with vegetables in a chilli-garlic sauce.', { allergens: ['GLUTEN'] }],
  ['noodles-veg-kompho', 'Veg Kompho Noodles', 219, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed kompho-style noodles with mixed vegetables.', { allergens: ['GLUTEN'] }],
  ['noodles-veg-bon-garlic', 'Veg Bon Garlic Noodles', 219, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed garlic noodles with mixed vegetables.', { allergens: ['GLUTEN'] }],

  // ===========================================================================
  // NON-VEG NOODLES
  // ===========================================================================
  ['noodles-egg-soft', 'Egg Soft Noodles', 219, 'fried_rice_noodles', EGG, 'MEDIUM', 'Wok-tossed soft noodles with egg.', { allergens: ['GLUTEN', 'EGG'] }],
  ['noodles-egg-hakka', 'Egg Hakka Noodles', 219, 'fried_rice_noodles', EGG, 'MEDIUM', 'Wok-tossed Hakka noodles with egg.', { allergens: ['GLUTEN', 'EGG'] }],
  ['noodles-egg-schezwan', 'Egg Schezwan Noodles', 219, 'fried_rice_noodles', EGG, 'SPICY', 'Wok-tossed noodles with egg in a fiery schezwan sauce.', { allergens: ['GLUTEN', 'EGG'] }],
  ['noodles-egg-chilli-garlic', 'Egg Chilli Garlic Noodles', 219, 'fried_rice_noodles', EGG, 'SPICY', 'Wok-tossed noodles with egg in a chilli-garlic sauce.', { allergens: ['GLUTEN', 'EGG'] }],
  ['noodles-chicken-soft', 'Chicken Soft Noodles', 249, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed soft noodles with chicken.', { allergens: ['GLUTEN'] }],
  ['noodles-chicken-hakka', 'Chicken Hakka Noodles', 249, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed Hakka noodles with chicken.', { allergens: ['GLUTEN'] }],
  ['noodles-chicken-schezwan', 'Chicken Schezwan Noodles', 279, 'fried_rice_noodles', NONVEG, 'SPICY', 'Wok-tossed noodles with chicken in a fiery schezwan sauce.', { allergens: ['GLUTEN'] }],
  ['noodles-chicken-garlic', 'Chicken Garlic Noodles', 259, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed garlic noodles with chicken.', { allergens: ['GLUTEN'] }],
  ['noodles-chicken-kompho', 'Chicken Kompho Noodles', 289, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed kompho-style noodles with chicken.', { allergens: ['GLUTEN'] }],
  ['noodles-chicken-bon-garlic', 'Chicken Bon Garlic Noodles', 289, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed bon garlic noodles with chicken.', { allergens: ['GLUTEN'] }],
  ['chopsuey-chinese-chicken', 'Chinese Chopsuey', 349, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Crispy fried noodles topped with a savoury chicken gravy.', { allergens: ['GLUTEN'] }],
  ['chopsuey-american-chicken', 'American Chopsuey', 349, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Crispy fried noodles topped with a sweet-savoury chicken gravy.', { allergens: ['GLUTEN'] }],

  // ===========================================================================
  // VEG FRIED RICE
  // ===========================================================================
  ['fr-veg', 'Veg Fried Rice', 199, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed rice with mixed vegetables, Indo-Chinese style.', {}],
  ['fr-veg-schezwan', 'Schezwan Fried Rice', 209, 'fried_rice_noodles', VEG, 'SPICY', 'Wok-tossed rice with vegetables in a fiery schezwan sauce.', {}],
  ['fr-veg-chilli-garlic', 'Veg Chilli Garlic Fried Rice', 209, 'fried_rice_noodles', VEG, 'SPICY', 'Wok-tossed rice with vegetables in a chilli-garlic sauce.', {}],
  ['fr-veg-kompho', 'Veg Kompho Fried Rice', 209, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed kompho-style rice with vegetables.', {}],
  ['fr-veg-bon-garlic', 'Veg Bon Garlic Fried Rice', 209, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed bon garlic rice with vegetables.', {}],
  ['fr-veg-pan', 'Veg Pan Fried Rice', 209, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed pan fried rice with vegetables.', {}],
  ['fr-paneer', 'Paneer Fried Rice', 269, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed rice with paneer cubes and vegetables.', { allergens: ['DAIRY'] }],
  ['fr-kaju-paneer', 'Kaju Paneer Fried Rice', 299, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed rice with paneer and cashews.', { allergens: ['DAIRY', 'NUTS'] }],
  ['fr-manchuria', 'Manchuria Fried Rice', 229, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed rice with vegetable Manchurian.', {}],
  ['fr-sweet-corn', 'Sweet Corn Fried Rice', 229, 'fried_rice_noodles', VEG, 'MILD', 'Wok-tossed rice with sweet corn and vegetables.', {}],
  ['fr-baby-corn-mushroom', 'Baby Corn Mushroom Fried Rice', 249, 'fried_rice_noodles', VEG, 'MEDIUM', 'Wok-tossed rice with baby corn and mushrooms.', {}],

  // ===========================================================================
  // NON-VEG FRIED RICE
  // ===========================================================================
  ['fr-egg', 'Egg Fried Rice', 229, 'fried_rice_noodles', EGG, 'MEDIUM', 'Wok-tossed rice with egg, Indo-Chinese style.', { allergens: ['EGG'] }],
  ['fr-egg-pan', 'Egg Pan Fried Rice', 229, 'fried_rice_noodles', EGG, 'MEDIUM', 'Wok-tossed pan fried rice with egg.', { allergens: ['EGG'] }],
  ['fr-egg-schezwan', 'Schezwan Egg Fried Rice', 249, 'fried_rice_noodles', EGG, 'SPICY', 'Wok-tossed rice with egg in a fiery schezwan sauce.', { allergens: ['EGG'] }],
  ['fr-chicken-schezwan', 'Schezwan Chicken Fried Rice', 289, 'fried_rice_noodles', NONVEG, 'SPICY', 'Wok-tossed rice with chicken in a fiery schezwan sauce.', {}],
  ['fr-chicken-chilli-garlic', 'Chicken Chilli Garlic Fried Rice', 289, 'fried_rice_noodles', NONVEG, 'SPICY', 'Wok-tossed rice with chicken in a chilli-garlic sauce.', {}],
  ['fr-chicken-kompho', 'Chicken Kompho Fried Rice', 289, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed kompho-style rice with chicken.', {}],
  ['fr-chicken-bon', 'Chicken Bon Fried Rice', 289, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed bon-style rice with chicken.', {}],
  ['fr-chicken-pan', 'Chicken Pan Fried Rice', 289, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'Wok-tossed pan fried rice with chicken.', {}],
  ['fr-chicken-special', 'Special Chicken Fried Rice', 319, 'fried_rice_noodles', NONVEG, 'MEDIUM', 'House-special wok-tossed rice loaded with chicken.', {}],

  // ===========================================================================
  // RICE VARIETIES
  // ===========================================================================
  ['rice-jeera', 'Jeera Rice', 209, 'rice_varieties', VEG, 'MILD', 'Steamed rice tempered with cumin.', {}],
  ['rice-curd', 'Curd Rice', 199, 'rice_varieties', VEG, 'MILD', 'Steamed rice mixed with curd, tempered lightly.', { allergens: ['DAIRY'] }],
  ['rice-white', 'White Rice', 149, 'rice_varieties', VEG, null, 'Steamed plain white rice.', {}],
  ['rice-bagara', 'Bagara Rice', 159, 'rice_varieties', VEG, 'MEDIUM', 'Regional spiced rice tempered with whole spices.', {}],
  ['rice-chitti-muthyalu', 'Chitti Muthyalu Pulao (Plain)', 199, 'rice_varieties', VEG, 'MILD', 'Fragrant chitti muthyalu rice pulao, plain.', {}],

  // ===========================================================================
  // VEG PULAVS
  // ===========================================================================
  ['pulao-ulavacharu', 'Ulavacharu Veg Pulav', 259, 'veg_pulaos', VEG, 'MEDIUM', 'Vegetable pulav served with tangy Andhra ulavacharu.', {}],
  ['pulao-raju-gari', 'Amanis Raju Gari Veg Pulav', 259, 'veg_pulaos', VEG, 'MEDIUM', "Amani's signature Raju Gari-style vegetable pulav.", {}],
  ['pulao-panasakaya', 'Panasakaya Pulav', 259, 'veg_pulaos', VEG, 'MEDIUM', 'Pulav cooked with raw jackfruit (panasakaya).', {}],
  ['pulao-matter', 'Matter Pulav', 259, 'veg_pulaos', VEG, 'MILD', 'Lightly spiced rice cooked with green peas.', {}],

  // ===========================================================================
  // VEG BIRIYANIS
  // ===========================================================================
  ['biryani-veg-dum', 'Veg Dum Biriyani', 259, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice layered with mixed vegetables and biryani spices.', {}],
  ['biryani-paneer', 'Paneer Biriyani', 359, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice with paneer cubes and aromatic biryani spices.', { allergens: ['DAIRY'] }],
  ['biryani-kaju-paneer', 'Kaju Paneer Biriyani', 359, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice with paneer and cashews.', { allergens: ['DAIRY', 'NUTS'] }],
  ['biryani-kaju-mushroom', 'Kaju Mashroom Biriyani', 359, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice with mushrooms and cashews.', { allergens: ['NUTS'] }],
  ['biryani-mushroom', 'Mashroom Biriyani', 359, 'biryanis', VEG, 'MEDIUM', 'Dum-cooked rice with mushrooms and aromatic biryani spices.', {}],
  ['biryani-egg', 'Egg Biriyani', 299, 'biryanis', EGG, 'MEDIUM', 'Dum-cooked rice with boiled eggs and aromatic biryani spices.', { allergens: ['EGG'] }],

  // ===========================================================================
  // NON-VEG BIRIYANIS
  // ===========================================================================
  ['biryani-chicken-dum', 'Chicken Dum Biriyani', 359, 'biryanis', NONVEG, 'MEDIUM', 'Traditional dum-cooked rice with spiced chicken, sealed and slow-cooked for depth of flavour.', { bestseller: true, bestsellerReason: 'A familiar, balanced dum biryani', newCustomerRecommendation: true, newCustomerReason: 'A familiar, balanced dum biryani' }],
  ['biryani-chicken-fry-piece', 'Chicken Fry Pieces Biriyani', 359, 'biryanis', NONVEG, 'MEDIUM', 'Dum-cooked rice served with fried chicken pieces on top.', {}],
  ['biryani-chicken-special', 'Special Chicken Biriyani', 359, 'biryanis', NONVEG, 'MEDIUM', 'Fragrant dum-cooked rice with spiced chicken, prepared with extra care and richer garnish.', { bestseller: true, bestsellerReason: 'Our most-loved biryani upgrade' }],
  ['biryani-chicken-kaju', 'Chicken Kaju Biriyani', 389, 'biryanis', NONVEG, 'MEDIUM', 'Dum-cooked chicken biriyani finished with cashews.', { allergens: ['NUTS'] }],
  ['biryani-chicken-tikka', 'Chicken Tikka Biriyani', 389, 'biryanis', NONVEG, 'MEDIUM', 'Dum-cooked rice layered with grilled chicken tikka.', { allergens: ['DAIRY'] }],
  ['biryani-chicken-tangidi', 'Chicken Tangidi Biriyani', 389, 'biryanis', NONVEG, 'MEDIUM', 'Dum-cooked rice with spiced chicken drumsticks.', {}],
  ['biryani-chicken-lollipop', 'Chicken Lali Pop Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Dum-cooked rice served with chicken lollipops.', {}],
  ['biryani-chicken-wings', 'Chicken Wings Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Dum-cooked rice served with spiced chicken wings.', {}],
  ['biryani-chicken-ghee-rost', 'Chicken Ghee Roast Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Dum-cooked rice with ghee-roasted chicken.', { allergens: ['DAIRY'] }],
  ['biryani-chicken-drumstick', 'Chicken Dumstric Biriyani', 389, 'biryanis', NONVEG, 'MEDIUM', 'Dum-cooked rice with spiced chicken drumsticks.', {}],
  ['biryani-ulavacharu-chicken', 'Ulavacharu Chicken Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Chicken biriyani cooked with tangy Andhra ulavacharu.', {}],
  ['biryani-gongura-chicken', 'Gongura Chicken Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Chicken biriyani cooked with tangy gongura (sorrel) leaves.', {}],
  ['biryani-avakai-chicken', 'Avakai Chicken Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Chicken biriyani cooked with spicy Andhra avakai pickle.', {}],
  ['biryani-red-chilli-chicken', 'Red Chilli Chicken Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Fiery red chilli chicken biriyani.', {}],
  ['biryani-palamura-chicken', 'Palamura Chicken Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Palamura-style spiced chicken biriyani.', {}],
  ['biryani-green-mirchi-chicken', 'Green Mrichi Chicken Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Chicken biriyani cooked with fresh green chillies.', {}],
  ['biryani-mughlai-chicken', 'Mugalai Chicken Biriyani', 389, 'biryanis', NONVEG, 'MEDIUM', 'Rich Mughlai-style chicken biriyani.', { allergens: ['DAIRY', 'NUTS'] }],
  ['biryani-mutton-dum', 'Mutton Dum Biriyani', 459, 'biryanis', NONVEG, 'SPICY', 'Traditional dum-cooked rice with tender mutton pieces, slow-cooked with layered spices.', { prep: 32 }],
  ['biryani-mutton-fry', 'Mutton Fry Biriyani', 459, 'biryanis', NONVEG, 'SPICY', 'Dum-cooked rice served with dry-fried mutton pieces.', { prep: 32 }],
  ['biryani-mutton-keema', 'Mutton Keema Biriyani', 459, 'biryanis', NONVEG, 'SPICY', 'Dum-cooked rice with spiced minced mutton keema.', { prep: 32 }],
  ['biryani-gongura-mutton', 'Gongora Mutton Biriyani', 479, 'biryanis', NONVEG, 'SPICY', 'Mutton biriyani cooked with tangy gongura (sorrel) leaves.', { prep: 32 }],
  ['biryani-avakai-mutton', 'Matton Avakai Biriyani', 479, 'biryanis', NONVEG, 'SPICY', 'Mutton biriyani cooked with spicy Andhra avakai pickle.', { prep: 32 }],
  ['biryani-ulavacharu-mutton', 'Uvlavacharu Motton Biriyani', 479, 'biryanis', NONVEG, 'SPICY', 'Mutton biriyani cooked with tangy Andhra ulavacharu.', { prep: 32 }],
  ['biryani-green-mirchi-mutton', 'Green Mrichi Mutton Biriyani', 479, 'biryanis', NONVEG, 'SPICY', 'Mutton biriyani cooked with fresh green chillies.', { prep: 32 }],
  ['biryani-mughlai-mutton', 'Mugalai Mutton Biriyani', 479, 'biryanis', NONVEG, 'MEDIUM', 'Rich Mughlai-style mutton biriyani.', { prep: 32, allergens: ['DAIRY', 'NUTS'] }],
  ['biryani-palamura-mutton', 'Palamura Motton Biriyani', 479, 'biryanis', NONVEG, 'SPICY', 'Palamura-style spiced mutton biriyani.', { prep: 32 }],
  ['biryani-mutton-ghee-rost', 'Mutton Ghee Roast Biriyani', 479, 'biryanis', NONVEG, 'SPICY', 'Mutton biriyani with ghee-roasted mutton.', { prep: 32, allergens: ['DAIRY'] }],
  ['biryani-gongura-prawns', 'Gongura Prawns Biriyani', 389, 'biryanis', NONVEG, 'SPICY', 'Prawns biriyani cooked with tangy gongura (sorrel) leaves.', { allergens: ['SHELLFISH'] }],
  ['biryani-fish', 'Fish Biriyani', 369, 'biryanis', NONVEG, 'SPICY', 'Dum-cooked rice layered with spiced fish.', { allergens: ['SEAFOOD'] }],
  ['biryani-bheemavaram-mix', 'Bheemavaram Mix Biriyani', 489, 'biryanis', NONVEG, 'SPICY', 'Coastal Bheemavaram-style mixed meat and seafood biriyani.', { allergens: ['SEAFOOD', 'SHELLFISH'] }],

  // ===========================================================================
  // NON-VEG PULAOS
  // ===========================================================================
  ['pulao-chitti-royyala', 'Chitti Royyala Pulao', 399, 'biryanis', NONVEG, 'SPICY', 'Chitti muthyalu rice pulao with small prawns.', { allergens: ['SHELLFISH'] }],
  ['pulao-royyala', 'Royyala Pulao', 399, 'biryanis', NONVEG, 'SPICY', 'Fragrant rice pulao with prawns.', { allergens: ['SHELLFISH'] }],
  ['pulao-rajugari-kodi', 'Rajugari Kodi Pulao', 359, 'biryanis', NONVEG, 'SPICY', 'Rajugari-style country chicken pulao.', {}],
  ['pulao-chitti-muthyalu-mutton', 'Chitti Muthyalu Mutton Pulao', 399, 'biryanis', NONVEG, 'SPICY', 'Chitti muthyalu rice pulao with mutton.', { prep: 32 }],
  ['pulao-guntur-mutton', 'Guntur Mutton Pulao (With Bone, 6 Pcs)', 399, 'biryanis', NONVEG, 'SPICY', 'Fiery Guntur-style bone-in mutton pulao, 6 pieces.', { prep: 32, portionLabel: '6 pieces' }],
  ['pulao-natukodi', 'Natukodi Pulao', 359, 'biryanis', NONVEG, 'SPICY', 'Country chicken (natukodi) rice pulao.', {}],
  ['pulao-chicken-chitti-muthyalu', 'Chicken Chitti Muthyalu Pulav', 359, 'biryanis', NONVEG, 'SPICY', 'Chitti muthyalu rice pulao with chicken.', {}],

  // ===========================================================================
  // FAMILY & JUMBO PACKS
  // ===========================================================================
  ['biryani-chicken-family', 'Chicken Dum Biriyani (Family Pack)', 799, 'biryanis', NONVEG, 'MEDIUM', 'Chicken dum biriyani in a family-size pack.', { serves: '3–4 persons', portionLabel: 'Family Pack' }],
  ['biryani-chicken-jumbo', 'Chicken Dum Biriyani (Jumbo Pack)', 1199, 'biryanis', NONVEG, 'MEDIUM', 'Chicken dum biriyani in a jumbo-size pack.', { serves: '6–8 persons', portionLabel: 'Jumbo Pack' }],

  // ===========================================================================
  // BEVERAGES
  // ===========================================================================
  ['drink-mineral-water', 'Mineral Water', 20, 'drinks', VEG, null, 'Packaged mineral drinking water.', {}],
  ['drink-soft-drink', 'Soft Drink (All)', 69, 'drinks', VEG, null, 'Assorted packaged soft drinks.', {}],
  ['drink-fresh-lime-soda', 'Fresh Lime Soda (Sweet/Salt)', 99, 'drinks', VEG, null, 'Refreshing fresh lime soda, sweet or salt.', {}],
  ['drink-butter-milk', 'Butter Milk', 99, 'drinks', VEG, null, 'Spiced, churned buttermilk.', { allergens: ['DAIRY'] }],
  ['drink-sweet-lassi', 'Sweet Lassi', 119, 'drinks', VEG, null, 'Traditional sweetened, churned yoghurt drink.', { allergens: ['DAIRY'] }],
  ['drink-fresh-lime-juice', 'Fresh Lime Juice (Sweet/Salt)', 129, 'drinks', VEG, null, 'Freshly squeezed lime juice, sweet or salt.', {}],
  ['drink-fresh-juice', 'Fresh Juice (Seasonal)', 89, 'drinks', VEG, null, 'Seasonal freshly-squeezed fruit juice.', {}],
  ['drink-masala-cola', 'Masala Cola', 89, 'drinks', VEG, null, 'Cola spiced with a house masala blend.', {}],
  ['drink-red-bull', 'Red Bull', 159, 'drinks', VEG, null, 'Chilled Red Bull energy drink.', {}],
  ['drink-masala-tea', 'Masala Tea', 39, 'drinks', VEG, null, 'Spiced Indian masala chai.', { allergens: ['DAIRY'] }],
  ['drink-cold-coffee', 'Cold Coffee', 89, 'drinks', VEG, null, 'Chilled, frothy cold coffee.', { allergens: ['DAIRY'] }],

  // ===========================================================================
  // MOCKTAILS & MILK SHAKES
  // ===========================================================================
  ['drink-fruit-punch', 'Fruit Punch', 159, 'drinks', VEG, null, 'Pineapple-apple juice, coconut cream and vanilla ice cream.', { allergens: ['DAIRY'] }],
  ['drink-virgin-mojito', 'Virgin Mojito', 219, 'drinks', VEG, null, 'Sprite with a splash of lemon, garnished with mint.', {}],
  ['drink-virgin-pina-colada', 'Virgin Pina Colada', 179, 'drinks', VEG, null, 'Creamy pineapple and coconut mocktail.', { allergens: ['DAIRY'] }],
  ['drink-pink-lady', 'Pink Lady', 179, 'drinks', VEG, null, 'Orange juice, Sprite and rose syrup.', {}],
  ['drink-cinderella', 'Cindrella', 179, 'drinks', VEG, null, 'Pineapple-apple juice, orange juice and ice cream.', { allergens: ['DAIRY'] }],
  ['drink-strawberry-delight', 'Strawberry Delight', 179, 'drinks', VEG, null, 'Strawberry crush, syrup, milk and ice cream.', { allergens: ['DAIRY'] }],
  ['drink-anarkali', 'Anarkali', 179, 'drinks', VEG, null, 'Sprite, khus syrup and tender coconut water.', {}],
  ['drink-paradise-island', 'Paradise Island', 179, 'drinks', VEG, null, 'Pineapple-apple juice and crush, orange juice and crush, banana crush ice cream.', { allergens: ['DAIRY'] }],
  ['drink-white-temple', 'White Temple', 179, 'drinks', VEG, null, 'Pineapple-apple juice, vanilla ice cream and milk.', { allergens: ['DAIRY'] }],

  // ===========================================================================
  // DESSERTS / ICE CREAMS
  // ===========================================================================
  ['dessert-gulab-jamun', 'Gulab Jamun (2 Pcs)', 99, 'desserts', VEG, null, 'Warm milk-solid dumplings soaked in sugar syrup, 2 pieces.', { allergens: ['DAIRY', 'GLUTEN'], bestseller: true, bestsellerReason: 'Our most-ordered dessert', portionLabel: '2 pieces' }],
  ['dessert-gulab-jamun-icecream', 'Gulab Jamun with Ice Cream', 149, 'desserts', VEG, null, 'Warm gulab jamun served with a scoop of ice cream.', { allergens: ['DAIRY', 'GLUTEN'] }],
  ['dessert-leechi-icecream', 'Leechis with Ice Cream', 189, 'desserts', VEG, null, 'Sweet lychees served with a scoop of ice cream.', { allergens: ['DAIRY'] }],
  ['dessert-fruit-salad', 'Fruits Salad', 149, 'desserts', VEG, null, 'Fresh seasonal fruit salad.', {}],
  ['dessert-fruit-salad-icecream', 'Fruits Salad with Ice Cream', 189, 'desserts', VEG, null, 'Fresh seasonal fruit salad topped with ice cream.', { allergens: ['DAIRY'] }],
  ['dessert-apricot-delight', 'Apricot Delight', 189, 'desserts', VEG, null, 'Stewed apricots served with cream or ice cream.', { allergens: ['DAIRY'] }],
  ['dessert-qurhanika-icecream', 'Qurhanika Meta (With Ice Cream)', 179, 'desserts', VEG, null, 'Traditional qurhanika sweet served with ice cream.', { allergens: ['DAIRY', 'NUTS'] }],
  ['dessert-qurhanika-meta', 'Qurhanika Meta / Dubla Ka Meta', 159, 'desserts', VEG, null, 'Traditional rich milk-based qurhanika sweet.', { allergens: ['DAIRY', 'NUTS'] }],
  ['dessert-brownie-icecream', 'Brownie Ice Cream', 149, 'desserts', VEG, null, 'Warm chocolate brownie served with ice cream.', { allergens: ['DAIRY', 'GLUTEN', 'NUTS'] }],
  ['dessert-fried-icecream', 'Fried Ice Cream', 149, 'desserts', VEG, null, 'Crisp-coated fried ice cream.', { allergens: ['DAIRY', 'GLUTEN'] }],
  ['dessert-icecream-vanilla', 'Vanilla Ice Cream', 99, 'desserts', VEG, null, 'Classic vanilla ice cream.', { allergens: ['DAIRY'] }],
  ['dessert-icecream-strawberry', 'Strawberry Ice Cream', 99, 'desserts', VEG, null, 'Classic strawberry ice cream.', { allergens: ['DAIRY'] }],
  ['dessert-icecream-chocolate', 'Chocolate Ice Cream', 99, 'desserts', VEG, null, 'Classic chocolate ice cream.', { allergens: ['DAIRY'] }],
  ['dessert-icecream-butterscotch', 'Butterscotch Ice Cream', 99, 'desserts', VEG, null, 'Classic butterscotch ice cream.', { allergens: ['DAIRY', 'NUTS'] }],
  ['dessert-junnu', 'Junnu', 119, 'desserts', VEG, null, 'Traditional baked colostrum milk pudding.', { allergens: ['DAIRY'] }],
  ['dessert-pot-kulfi', 'Pot Kulfi', 109, 'desserts', VEG, null, 'Rich, slow-set Indian kulfi served in a clay pot.', { allergens: ['DAIRY', 'NUTS'] }],
  ['dessert-carrot-halwa', 'Carrot Halwa', 120, 'desserts', VEG, null, 'Slow-cooked grated carrot dessert finished with ghee and nuts.', { allergens: ['DAIRY', 'NUTS'] }],
];

export const DISHES = DISH_SOURCE.map(buildDish);

// Six items curated for the "Amani's Favourites" section (see spec §14).
export const FAVOURITE_DISH_IDS = [
  'meals-aritaku-veg',
  'biryani-chicken-dum',
  'biryani-mutton-dum',
  'mcveg-paneer-butter-masala',
  'mcnv-butter-chicken',
  'starter-chicken-65',
];

// Four items curated for the "New here? Start with these" section (see spec §14).
export const NEW_GUEST_DISH_IDS = [
  'mcveg-paneer-butter-masala',
  'biryani-chicken-dum',
  'tandoor-chicken-tikka',
  'cveg-manchurian',
];
