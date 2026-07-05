const BRANDS = {
  "bikershades": {
    slug: "bikershades",
    name: "BikerShades",
    accent: "#C93A2B",
    logo: "/bikershades/logo.jpg",
  },
  "prosport-sunglasses": {
    slug: "prosport-sunglasses",
    name: "proSPORT Sunglasses",
    accent: "#2EA3DC",
    logo: "/prosport-sunglasses/logo.jpg",
  },
  "sunglass-monster": {
    slug: "sunglass-monster",
    name: "Sunglass Monster",
    accent: "#E0522D",
    logo: "/sunglass-monster/logo.jpg",
  },
} as const;

export function getBrandBySlug(slug: string) {
  return BRANDS[slug as keyof typeof BRANDS] ?? null;
}

export function getAllBrands() {
  return Object.values(BRANDS);
}
