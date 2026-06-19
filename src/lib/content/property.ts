/** Property imagery — photos in public/images/property/ */

export type PhotoRoom = "exterior" | "shared" | "main-bedroom" | "second-bedroom";

export type PropertyPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  room: PhotoRoom;
};

export const PHOTO_ROOM_META: Record<
  PhotoRoom,
  { title: string; description: string }
> = {
  exterior: {
    title: "Exterior & deck",
    description: "Wooded setting and private outdoor space.",
  },
  shared: {
    title: "Shared living spaces",
    description: "Vaulted studio, kitchenette, and areas both packages share.",
  },
  "main-bedroom": {
    title: "Main bedroom",
    description:
      "Private queen suite with deck access, desk, and reading chair — the $150/night main-bedroom package.",
  },
  "second-bedroom": {
    title: "Second bedroom",
    description:
      "Grey full bed plus twin/daybed — included when you book both bedrooms ($200/night package).",
  },
};

export const GALLERY_SECTION_ORDER: PhotoRoom[] = [
  "exterior",
  "shared",
  "main-bedroom",
  "second-bedroom",
];

/** Canonical photo library — single source for gallery, rooms, and previews. */
export const PROPERTY_PHOTOS: PropertyPhoto[] = [
  {
    id: "hero",
    room: "exterior",
    src: "/images/property/outdoor-deck.png",
    alt: "Private wooded deck with Adirondack seating at Tuxedo Retreat",
    caption: "Wooded deck — morning coffee before Bethel",
  },
  {
    id: "exterior-approach",
    room: "exterior",
    src: "/images/property/hero.png",
    alt: "Tuxedo Retreat property in a wooded residential setting",
    caption: "Property approach",
  },
  {
    id: "living-vaulted",
    room: "shared",
    src: "/images/property/living-vaulted.png",
    alt: "Vaulted studio living area with arched deck door and garden views",
    caption: "Vaulted living area",
  },
  {
    id: "living-studio",
    room: "shared",
    src: "/images/property/living-studio.png",
    alt: "Studio dining area with retro kitchenette and hardwood floors",
    caption: "Studio dining & kitchenette",
  },
  {
    id: "kitchenette",
    room: "shared",
    src: "/images/property/kitchenette.png",
    alt: "Kitchenette with mini fridge, microwave, and coffee station",
    caption: "Kitchenette",
  },
  {
    id: "coffee-station",
    room: "shared",
    src: "/images/property/coffee-station.png",
    alt: "Keurig coffee station and storage in the shared suite",
    caption: "Coffee station",
  },
  {
    id: "main-bedroom-pink",
    room: "main-bedroom",
    src: "/images/property/bedroom-pink.png",
    alt: "Main bedroom — queen bed with coral bedding, desk, and woodland windows",
    caption: "Main bedroom · queen bed & desk",
  },
  {
    id: "main-bedroom-wide",
    room: "main-bedroom",
    src: "/images/property/bedroom-master.png",
    alt: "Main bedroom — vaulted queen suite with deck door and reading chair",
    caption: "Main bedroom · deck access",
  },
  {
    id: "second-bedroom-both-beds",
    room: "second-bedroom",
    src: "/images/property/bedroom-guest.png",
    alt: "Second bedroom — grey full bed and floral twin daybed in one room",
    caption: "Second bedroom · full + twin beds",
  },
  {
    id: "second-bedroom-grey",
    room: "second-bedroom",
    src: "/images/property/bedroom-window.png",
    alt: "Second bedroom — grey full bed with armoire and forest views",
    caption: "Second bedroom · grey full bed",
  },
  {
    id: "second-bedroom-daybed-tv",
    room: "second-bedroom",
    src: "/images/property/bedroom-daybed-room.png",
    alt: "Second bedroom — floral daybed, TV, and armoire",
    caption: "Second bedroom · daybed & TV",
  },
  {
    id: "second-bedroom-daybed-nook",
    room: "second-bedroom",
    src: "/images/property/cozy-daybed.png",
    alt: "Second bedroom — floral daybed nook with natural light",
    caption: "Second bedroom · daybed nook",
  },
];

export function getPhotoById(id: string): PropertyPhoto | undefined {
  return PROPERTY_PHOTOS.find((photo) => photo.id === id);
}

export function getPhotosByRoom(room: PhotoRoom): PropertyPhoto[] {
  return PROPERTY_PHOTOS.filter((photo) => photo.room === room);
}

/** Shorthand paths for hero, OG, and inline use. */
export const PROPERTY_IMAGES = {
  /** Wooded deck — primary hero/OG (matches cottage retreat copy). */
  hero: "/images/property/outdoor-deck.png",
  exteriorApproach: "/images/property/hero.png",
  living: "/images/property/living-vaulted.png",
  livingStudio: "/images/property/living-studio.png",
  mainBedroom: "/images/property/bedroom-pink.png",
  mainBedroomWide: "/images/property/bedroom-master.png",
  secondBedroomBothBeds: "/images/property/bedroom-guest.png",
  secondBedroomGrey: "/images/property/bedroom-window.png",
  secondBedroomDaybedTv: "/images/property/bedroom-daybed-room.png",
  secondBedroomDaybedNook: "/images/property/cozy-daybed.png",
  deck: "/images/property/outdoor-deck.png",
  kitchenette: "/images/property/kitchenette.png",
  coffeeStation: "/images/property/coffee-station.png",
} as const;

export type PropertyImageKey = keyof typeof PROPERTY_IMAGES;

/** Unsplash fallbacks if a local file fails to load */
export const PROPERTY_IMAGE_FALLBACKS: Record<PropertyImageKey, string> = {
  hero: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=1920&q=85",
  exteriorApproach: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85",
  living: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85",
  livingStudio: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
  mainBedroom: "https://images.unsplash.com/photo-1616594039914-ae87df899b07?w=1200&q=85",
  mainBedroomWide: "https://images.unsplash.com/photo-1600566753190-17f0baa8806c?w=1200&q=85",
  secondBedroomBothBeds: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
  secondBedroomGrey: "https://images.unsplash.com/photo-1600210492486-724fe3c67fbf?w=1200&q=85",
  secondBedroomDaybedTv: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=1200&q=85",
  secondBedroomDaybedNook: "https://images.unsplash.com/photo-1600210492486-724fe3c67fbf?w=1200&q=85",
  deck: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=1200&q=85",
  kitchenette: "https://images.unsplash.com/photo-1600585154363-707a988b0fbf?w=1200&q=85",
  coffeeStation: "https://images.unsplash.com/photo-1600585154363-707a988b0fbf?w=1200&q=85",
};

const PHOTO_FALLBACK_KEY: Record<string, PropertyImageKey> = {
  hero: "hero",
  "exterior-approach": "exteriorApproach",
  "outdoor-deck": "deck",
  "living-vaulted": "living",
  "living-studio": "livingStudio",
  kitchenette: "kitchenette",
  "coffee-station": "coffeeStation",
  "main-bedroom-pink": "mainBedroom",
  "main-bedroom-wide": "mainBedroomWide",
  "second-bedroom-both-beds": "secondBedroomBothBeds",
  "second-bedroom-grey": "secondBedroomGrey",
  "second-bedroom-daybed-tv": "secondBedroomDaybedTv",
  "second-bedroom-daybed-nook": "secondBedroomDaybedNook",
};

export function getPhotoFallbackKey(photo: PropertyPhoto): PropertyImageKey {
  return PHOTO_FALLBACK_KEY[photo.id] ?? "hero";
}

/** @deprecated Use PROPERTY_PHOTOS — kept for components that expect flat gallery list. */
export const GALLERY_IMAGES = PROPERTY_PHOTOS.map((photo) => ({
  ...photo,
  key: getPhotoFallbackKey(photo),
}));

export function getPropertyImage(key: PropertyImageKey): string {
  return PROPERTY_IMAGES[key];
}

/** Shared copy for kitchenette cards and amenity lists. */
export const KITCHENETTE_NOTE =
  "Light meal prep only — microwave, mini fridge, and coffee station (not a full kitchen).";

/** Washer/dryer are on-site; guests request access before or at booking. */
export const LAUNDRY_NOTE =
  "Washer & dryer available on request — mention it in your reservation notes or contact us before arrival.";

export const AMENITIES = [
  "2 Bedrooms · 1.5 Bathrooms",
  "Sleeps 2 included (+$25/night per extra guest)",
  "Vaulted ceilings & premium natural light",
  "Hardwood floors throughout",
  "Kitchenette: microwave, mini fridge & coffee station",
  "Washer & dryer available on request",
  "High-speed Wi‑Fi",
  "Premium bedding & linens",
  "Private wooded deck with Adirondack seating",
  "Quiet luxury retreat atmosphere",
  "~15 minutes from Warwick Bethel",
];

export const PROPERTY_SPECS = {
  bedrooms: 2,
  bathrooms: 1.5,
  sleepsIncluded: 2,
  maxGuests: 6,
  baseRate: 150,
  extraGuestRate: 25,
};
