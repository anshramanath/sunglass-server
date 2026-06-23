# API Reference

All endpoints return:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "Message" }
```

Authenticated endpoints require `Authorization: Bearer <supabase_access_token>`.

---

## Public Endpoints

### GET /api/public/brands

Returns all brands.

**Response**
```json
[
  { "name": "BikerShades", "slug": "bikershades" }
]
```

---

### GET /api/public/categories

Returns the full category tree for a brand, sorted by `sortOrder` at every level.

**Query Params**
| Param | Required | Description |
|-------|----------|-------------|
| brandSlug | yes | Brand slug |

**Response**
```json
[
  {
    "id": "uuid",
    "name": "Sunglasses",
    "slug": "sunglasses",
    "sortOrder": 1,
    "children": [
      { "id": "uuid", "name": "Sport", "slug": "sport", "sortOrder": 1 }
    ]
  }
]
```

---

### GET /api/public/products

Paginated products for a category. Default page size is 20. Returns one product image and one image per unique color variation.

**Query Params**
| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| brandSlug | yes | — | Brand slug |
| categoryId | yes | — | Category UUID |
| filter | no | — | Filter slug (see below) |
| page | no | 1 | Page number |
| size | no | 20 | Results per page (max 100) |

**Filter slugs**
| Slug | Effect |
|------|--------|
| `under-15` | `min_price_cents ≤ 1500` |
| `15-25` | `1500 ≤ min_price_cents ≤ 2500` |
| `25-plus` | `min_price_cents ≥ 2500` |
| `sale` | `sale = true` |

**Response**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Sport Sunglasses",
      "slug": "sport-sunglasses",
      "minPriceCents": 1650,
      "maxPriceCents": 1995,
      "salePriceCents": null,
      "featured": false,
      "sale": false,
      "imageSrc": "https://...",
      "imageName": "Sport Sunglasses Front",
      "variations": [
        {
          "id": "uuid",
          "option": "Gloss Black",
          "slug": "gloss-black",
          "value": "#000000",
          "imageSrc": "https://...",
          "imageName": "Gloss Black Angle"
        }
      ]
    }
  ],
  "page": 1,
  "size": 20,
  "totalPages": 3,
  "totalProducts": 62,
  "hasNextPage": true
}
```

---

### GET /api/public/sale

Paginated sale products (`sale = true`). Same response shape as `/products` except `sale` field is omitted (implied). No `sale` filter slug needed.

**Query Params**
| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| brandSlug | yes | — | Brand slug |
| filter | no | — | `under-15`, `15-25`, or `25-plus` |
| page | no | 1 | Page number |
| size | no | 20 | Results per page (max 100) |

**Response** — same shape as `/products` without the `sale` field on each product.

---

### GET /api/public/item

Full product detail including all variations, all images, and description images.

**Query Params**
| Param | Required | Description |
|-------|----------|-------------|
| brandSlug | yes | Brand slug |
| slug | yes | Product slug |

**Response**
```json
{
  "name": "Sport Sunglasses",
  "slug": "sport-sunglasses",
  "sku": null,
  "description": "Full description...",
  "summary": ["Feature 1", "Feature 2"],
  "attributes": [
    {
      "name": "color",
      "options": [
        { "option": "Gloss Black", "slug": "gloss-black", "value": "#000000" },
        { "option": "Tortoise", "slug": "tortoise", "value": "#8b4513" }
      ]
    },
    {
      "name": "size",
      "options": [
        { "option": "Standard", "slug": "standard" },
        { "option": "Large", "slug": "large" }
      ]
    }
  ],
  "featured": false,
  "sale": false,
  "minPriceCents": 1650,
  "maxPriceCents": 1995,
  "salePriceCents": null,
  "variations": [
    {
      "sku": "SKU-BLK-STD",
      "attribute": [
        { "name": "color", "slug": "gloss-black" },
        { "name": "size", "slug": "standard" }
      ],
      "sale": false,
      "regularPriceCents": 1650,
      "salePriceCents": null,
      "images": [{ "src": "https://...", "name": "Black Front", "sortOrder": 1 }]
    }
  ],
  "productImages": [{ "src": "https://...", "name": "Front", "sortOrder": 1 }],
  "descriptionImages": [{ "src": "https://...", "name": "Diagram" }]
}
```

Note: variation `attribute` entries are `{ name, slug }` only — use the top-level `attributes` to look up display labels and hex values by slug. `value` is only present on `color` options there.

---

### GET /api/public/search

Case-insensitive product name search. Returns up to 6 results.

**Query Params**
| Param | Required | Description |
|-------|----------|-------------|
| brandSlug | yes | Brand slug |
| search | yes | Search query |

**Response**
```json
[
  {
    "id": "uuid",
    "name": "Sport Sunglasses",
    "slug": "sport-sunglasses",
    "minPriceCents": 1650,
    "maxPriceCents": 1995,
    "salePriceCents": null,
    "featured": false,
    "sale": false,
    "imageSrc": "https://...",
    "imageName": "Sport Sunglasses Front"
  }
]
```

---

### POST /api/public/validate-cart

Checks whether each cart item's product and variation still exist in the catalog. Call on cart page entry and before creating a checkout session.

**Body**
```json
{
  "brandSlug": "sunglass-monster",
  "items": [
    { "productSlug": "sport-sunglasses", "sku": "SKU-BLK" }
  ]
}
```

**Response**
```json
[
  { "productSlug": "sport-sunglasses", "sku": "SKU-BLK", "exists": true },
  { "productSlug": "old-product", "sku": "SKU-OLD", "exists": false }
]
```

---

## Authenticated Endpoints

All require `Authorization: Bearer <supabase_access_token>`. Queries are scoped to `user_id` + `brand_slug` via RLS.

### GET /api/user/cart

Returns the user's cart items for a brand.

**Query Params**
| Param | Required | Description |
|-------|----------|-------------|
| brandSlug | yes | Brand slug |

**Response**
```json
{
  "items": [
    {
      "productSlug": "sport-sunglasses",
      "sku": "SKU-BLK",
      "attribute": [{ "name": "color", "option": "Gloss Black" }],
      "name": "Sport Sunglasses",
      "imageSrc": "https://...",
      "priceCents": 1650,
      "quantity": 2
    }
  ]
}
```

---

### PUT /api/user/cart

Replaces the user's cart for a brand (delete + insert). Pass an empty array to clear.

**Body**
```json
{
  "brandSlug": "sunglass-monster",
  "items": [
    {
      "productSlug": "sport-sunglasses",
      "sku": "SKU-BLK",
      "attribute": [{ "name": "color", "option": "Gloss Black" }],
      "name": "Sport Sunglasses",
      "imageSrc": "https://...",
      "priceCents": 1650,
      "quantity": 2
    }
  ]
}
```

**Response**
```json
{ "synced": 1 }
```

---

### GET /api/user/bookmarks

Returns the user's bookmarks for a brand.

**Query Params**
| Param | Required | Description |
|-------|----------|-------------|
| brandSlug | yes | Brand slug |

**Response**
```json
{
  "items": [
    {
      "productSlug": "sport-sunglasses",
      "name": "Sport Sunglasses",
      "imageSrc": "https://..."
    }
  ]
}
```

---

### PUT /api/user/bookmarks

Replaces the user's bookmarks for a brand (delete + insert). Pass an empty array to clear.

**Body**
```json
{
  "brandSlug": "sunglass-monster",
  "items": [
    {
      "productSlug": "sport-sunglasses",
      "name": "Sport Sunglasses",
      "imageSrc": "https://..."
    }
  ]
}
```

**Response**
```json
{ "synced": 1 }
```

---

### GET /api/user/orders

Returns the user's order history for a brand, newest first.

**Query Params**
| Param | Required | Description |
|-------|----------|-------------|
| brandSlug | yes | Brand slug |

**Response**
```json
{
  "orders": [
    {
      "id": "uuid",
      "status": "paid",
      "totalCents": 7774,
      "shippingAddress": {
        "name": "John Smith",
        "line1": "123 Main St",
        "line2": null,
        "city": "Austin",
        "state": "TX",
        "postalCode": "78701",
        "country": "US"
      },
      "createdAt": "2026-06-18T18:35:31.167Z",
      "items": [
        {
          "productSlug": "sport-sunglasses",
          "sku": "SKU-BLK",
          "name": "Sport Sunglasses",
          "imageSrc": "https://...",
          "priceCents": 1650,
          "quantity": 2,
          "attribute": [{ "name": "color", "option": "Gloss Black" }]
        }
      ]
    }
  ]
}
```

---

### POST /api/user/checkout

Creates a Stripe checkout session. Returns a redirect URL. Stripe collects the shipping address as part of the flow — no need to collect it on the frontend. Idempotent — same cart and order count returns the same session URL.

**Body**
```json
{
  "brandSlug": "sunglass-monster",
  "items": [
    {
      "productSlug": "sport-sunglasses",
      "sku": "SKU-BLK",
      "name": "Sport Sunglasses",
      "imageSrc": "https://...",
      "priceCents": 1650,
      "quantity": 2,
      "attribute": [{ "name": "color", "option": "Gloss Black" }]
    }
  ],
  "successUrl": "https://yourdomain.com/order/success",
  "cancelUrl": "https://yourdomain.com/cart"
}
```

**Response**
```json
{ "url": "https://checkout.stripe.com/..." }
```

---

## Webhooks

### POST /api/webhooks/stripe

Stripe webhook handler. Verified via `stripe-signature` header. Only handles `checkout.session.completed`.

On payment completion: inserts an `orders` row and `order_items` rows, stores the shipping address collected by Stripe, then atomically increments `total_sales` on the relevant product or variation. Idempotent — duplicate deliveries are ignored via `stripe_session_id` unique constraint.
