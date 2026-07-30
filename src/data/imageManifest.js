/**
 * Curated real-photography stock library for Mangamma Ruchulu.
 * Every URL is verified (HTTP 200, image/jpeg) — see src/data/imageCredits.js for source pages.
 * Category images are representative, not exact photographs of every dish in that category.
 */
export const stockImages = {
  restaurantInterior: {
    url: 'https://images.pexels.com/photos/23877500/pexels-photo-23877500.jpeg?auto=compress&cs=tinysrgb&w=1600',
    sourcePage: 'https://www.pexels.com/photo/interior-of-restaurant-23877500/',
    alt: 'Warm restaurant dining interior with hanging lights',
  },

  traditionalBananaLeafMeal: {
    url: 'https://images.pexels.com/photos/8820783/pexels-photo-8820783.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/traditional-food-on-stainless-dishware-8820783/',
    alt: 'Traditional Indian meal served on a banana leaf',
  },

  biryani: {
    url: 'https://images.pexels.com/photos/35539329/pexels-photo-35539329.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/traditional-indian-biryani-served-on-banana-leaves-35539329/',
    alt: 'Indian biryani served on banana leaves',
  },

  paneerButterMasala: {
    url: 'https://images.pexels.com/photos/9609838/pexels-photo-9609838.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/paneer-butter-masala-9609838/',
    alt: 'Paneer butter masala in a metal serving bowl',
  },

  curryAndNaan: {
    url: 'https://images.pexels.com/photos/28497406/pexels-photo-28497406.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/delicious-indian-curry-with-naan-bread-28497406/',
    alt: 'Indian curry served with naan',
  },

  tandooriChicken: {
    url: 'https://images.pexels.com/photos/9609832/pexels-photo-9609832.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/paneer-butter-masala-9609838/',
    alt: 'Spiced tandoori-style chicken served with onion and chutney',
  },

  chickenStarter: {
    url: 'https://images.pexels.com/photos/35267270/pexels-photo-35267270.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/spicy-indian-chicken-fry-garnished-with-herbs-35267270/',
    alt: 'Spicy Indian chicken fry garnished with herbs',
  },

  soup: {
    url: 'https://images.pexels.com/photos/20004800/pexels-photo-20004800.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/asian-soup-served-in-a-restaurant-20004800/',
    alt: 'Warm spiced soup garnished with coriander and lime',
  },

  fishCurry: {
    url: 'https://images.pexels.com/photos/35532834/pexels-photo-35532834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourcePage: 'https://www.pexels.com/photo/delicious-indian-fish-curry-with-vegetables-35532834/',
    alt: 'Indian fish curry garnished with vegetables and spices',
  },

  gulabJamun: {
    url: 'https://images.pexels.com/photos/37294501/pexels-photo-37294501.jpeg?auto=compress&cs=tinysrgb&w=1000',
    sourcePage: 'https://www.pexels.com/photo/delicious-indian-gulab-jamun-dessert-in-bowl-37294501/',
    alt: 'Gulab jamun served in a bowl',
  },

  limeMint: {
    url: 'https://images.pexels.com/photos/36268523/pexels-photo-36268523.jpeg?auto=compress&cs=tinysrgb&w=1000',
    sourcePage: 'https://www.pexels.com/photo/refreshing-lime-and-mint-sparkling-drink-36268523/',
    alt: 'Refreshing lime and mint drink with ice',
  },
};

/** category id -> stockImages key, used as the representative image when no exact dish photo exists */
export const categoryImageKey = {
  meals: 'traditionalBananaLeafMeal',
  biryanis: 'biryani',
  veg_soups: 'soup',
  nonveg_soups: 'soup',
  nonveg_starters: 'chickenStarter',
  chinese_veg_starters: 'curryAndNaan',
  fish_prawns: 'fishCurry',
  tandoor: 'tandooriChicken',
  main_course_veg: 'paneerButterMasala',
  main_course_nonveg: 'curryAndNaan',
  rotis_breads: 'curryAndNaan',
  veg_pulaos: 'biryani',
  rice_varieties: 'traditionalBananaLeafMeal',
  fried_rice_noodles: 'curryAndNaan',
  desserts: 'gulabJamun',
  drinks: 'limeMint',
};
