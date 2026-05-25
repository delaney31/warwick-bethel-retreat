/** Property imagery — photos in public/images/property/ */
export const PROPERTY_IMAGES = {
  hero: "/images/property/hero.png",
  living: "/images/property/living-vaulted.png",
  bedroom: "/images/property/bedroom-pink.png",
  deck: "/images/property/outdoor-deck.png",
  daybed: "/images/property/cozy-daybed.png",
  windows: "/images/property/bedroom-master.png",
  floors: "/images/property/bedroom-guest.png",
  kitchen: "/images/property/kitchenette.png",
} as const;

/** Unsplash fallbacks if a local file fails to load */
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
  { src: "/images/property/hero.png", alt: "Tuxedo Retreat — luxury home exterior in a wooded setting", key: "hero" as const },
  { src: "/images/property/living-vaulted.png", alt: "Vaulted studio living area with deck access and garden views", key: "living" as const },
  { src: "/images/property/living-studio.png", alt: "Bright studio suite with dining table, retro kitchenette, and hardwood floors", key: "living" as const },
  { src: "/images/property/bedroom-pink.png", alt: "Serene bedroom with premium bedding and woodland views", key: "bedroom" as const },
  { src: "/images/property/bedroom-master.png", alt: "Spacious master bedroom with vaulted ceilings and private deck door", key: "windows" as const },
  { src: "/images/property/bedroom-window.png", alt: "Guest bedroom with in-room coffee station and forest views", key: "kitchen" as const },
  { src: "/images/property/bedroom-guest.png", alt: "Flexible guest room with queen and twin beds — sleeps families comfortably", key: "floors" as const },
  { src: "/images/property/bedroom-daybed-room.png", alt: "Cozy second bedroom with daybed, TV, and woven accents", key: "daybed" as const },
  { src: "/images/property/cozy-daybed.png", alt: "Floral daybed nook with natural light and reading space", key: "daybed" as const },
  { src: "/images/property/kitchenette.png", alt: "Kitchenette with mini fridge, coffee maker, and curated breakfast station", key: "kitchen" as const },
  { src: "/images/property/coffee-station.png", alt: "Keurig coffee station, toaster, and storage in the guest suite", key: "kitchen" as const },
  { src: "/images/property/outdoor-deck.png", alt: "Private wooded deck with Adirondack seating overlooking the garden", key: "deck" as const },
] as const;

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
