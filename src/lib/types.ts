export type RankedRow = {
  name: string;
  subtitle?: string;
  value: string;
  barPct: number;
};

export type OrderItem = {
  id: string;
  name: string;
  sku: string;
  imageSrc: string | null;
  priceCents: number;
  quantity: number;
  attribute: string | null;
};

export type Order = {
  id: string;
  status: string;
  totalCents: number;
  refundedCents: number;
  carrier: string | null;
  trackingNumber: string | null;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  paymentIntent: string;
  createdAt: string;
  items: OrderItem[];
};

export type FlatCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  viewCount: number | null;
  productCount: number;
  depth: number;
  hasChildren: boolean;
  isLeaf: boolean;
  ancestorIds: string[];
};

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

export type LeafEntry = {
  id: string;
  name: string;
  path: string;
  breadcrumbs: string[];
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sale: boolean;
  featured: boolean;
  variable: boolean;
  minPriceCents: number;
  maxPriceCents: number;
  salePriceCents: number | null;
  categories: string[];
  image: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};
