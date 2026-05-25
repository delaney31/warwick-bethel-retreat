/** Property imagery — place your photos in public/images/property/ with these filenames. */
export const PROPERTY_IMAGES = {
  hero: "/images/property/hero.jpg",
  living: "/images/property/living-vaulted.jpg",
  bedroom: "/images/property/bedroom-pink.jpg",
  deck: "/images/property/outdoor-deck.jpg",
  daybed: "/images/property/cozy-daybed.jpg",
  windows: "/images/property/natural-light.jpg",
  floors: "/images/property/hardwood.jpg",
  kitchen: "/images/property/coffee-station.jpg",
} as const;

/** Unsplash fallbacks until local photos are added */
export const PROPERTY_IMAGE_FALLBACKS: Record<keyof typeof PROPERTY_IMAGES, string> = {
  hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85",
  living: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85",
  bedroom: "https://images.unsplash.com/photo-1616594039914-ae87df899b07?w=1200&q=85",
  deck: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=1200&q=85",
  daybed: "https://images.unsplash.com/photo-1600210492486-724fe3c67fbf?w=1200&q=85",
  windows: "https://images.unsplash.com/photo-1600566753190-17f0baa8806c?w=1200&q=85",
  floors: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
  kitchen: "https://images.unsplash.com/photo-1600585154363-707a988b0fbf?w=1200&q=85",
};

export function getPropertyImage(key: keyof typeof PROPERTY_IMAGES): string {
  return PROPERTY_IMAGES[key];
}

export const GALLERY_IMAGES = [
  { src: PROPERTY_IMAGES.hero, alt: "Luxury cottage exterior in wooded setting", key: "hero" as const },
  { src: PROPERTY_IMAGES.living, alt: "Vaulted ceilings and natural light in living area", key: "living" as const },
  { src: PROPERTY_IMAGES.bedroom, alt: "Premium bedding in serene bedroom", key: "bedroom" as const },
  { src: PROPERTY_IMAGES.deck, alt: "Wooded outdoor deck surrounded by trees", key: "deck" as const },
  { src: PROPERTY_IMAGES.daybed, alt: "Cozy daybed reading nook", key: "daybed" as const },
  { src: PROPERTY_IMAGES.windows, alt: "Large windows with scenic woodland views", key: "windows" as const },
  { src: PROPERTY_IMAGES.floors, alt: "Hardwood floors and warm minimal interiors", key: "floors" as const },
  { src: PROPERTY_IMAGES.kitchen, alt: "Coffee station and kitchenette amenities", key: "kitchen" as const },
];

export const AMENITIES = [
  "2 Bedrooms · 1.5 Bathrooms",
  "Sleeps 2 included (+$25/night per extra guest)",
  "Vaulted ceilings & premium natural light",
  "Hardwood floors throughout",
  "Microwave & mini fridge",
  "Coffee station",
  "Beautiful wooded outdoor deck",
  "Quiet luxury retreat atmosphere",
  "15 minutes from Warwick Bethel",
];

export const PROPERTY_SPECS = {
  bedrooms: 2,
  bathrooms: 1.5,
  sleepsIncluded: 2,
  maxGuests: 6,
  baseRate: 150,
  extraGuestRate: 25,
};
