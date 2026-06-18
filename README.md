# sunglass-monster-server

Next.js API server for the proSPORT multi-brand sunglasses platform. Serves product catalog, search, and authenticated user data (cart + bookmarks) to a separate frontend deployment.

## Stack

- **Next.js 16** — API routes only, no frontend pages
- **Supabase** — Postgres database, auth token verification
- **Admin client** — for public catalog reads (bypasses RLS)
- **User client** — for authed endpoints (validates Bearer token, respects RLS)

## Getting Started

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000`.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # admin client — server only
```

## API Overview

All endpoints return:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "Message" }
```

### Public Endpoints — no auth required

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public/brands` | All brands |
| GET | `/api/public/categories?brandSlug=` | Category tree for a brand |
| GET | `/api/public/products?brandSlug=&categoryId=&filter=&page=&size=` | Paginated products for a leaf category |
| GET | `/api/public/sale?brandSlug=&filter=&page=&size=` | Paginated sale products |
| GET | `/api/public/item?brandSlug=&productId=` | Full product detail |
| GET | `/api/public/search?brandSlug=&q=` | Product name search (up to 6 results) |

#### Filter slugs (`/products` and `/sale`)
| Slug | Effect |
|------|--------|
| `under-15` | `min_price_cents < 1500` |
| `15-25` | `1500 ≤ min_price_cents < 2500` |
| `25-plus` | `min_price_cents ≥ 2500` |
| `sale` | `sale = true` (products only) |

Filters are resolved server-side via a hardcoded `FILTER_MAP` — price logic is never exposed in the URL.

### Authenticated Endpoints — Bearer token required

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/user/cart?brandSlug=` | Fetch cart items for a brand |
| PUT | `/api/user/cart` | Replace cart items for a brand (full sync) |
| GET | `/api/user/bookmarks?brandSlug=` | Fetch bookmarks for a brand |
| PUT | `/api/user/bookmarks` | Replace bookmarks for a brand (full sync) |

Auth: `Authorization: Bearer <supabase_access_token>`. The user client validates the token against Supabase and all queries are scoped to `user_id` + `brand_slug` via RLS.

Cart and bookmark PUT is a full replace (delete + insert) scoped to the brand — not a patch. The frontend handles merging before calling PUT.

## Project Structure

```
src/
├── app/api/
│   ├── public/
│   │   ├── brands/route.ts
│   │   ├── categories/route.ts
│   │   ├── products/route.ts      # categoryId required, optional filter
│   │   ├── sale/route.ts          # always sale=true, optional price filter
│   │   ├── item/route.ts
│   │   └── search/route.ts        # ilike name search, limit 6
│   └── user/
│       ├── cart/route.ts
│       └── bookmarks/route.ts
└── lib/
    ├── api.ts                     # ok() / err() response helpers
    ├── supabase/
    │   ├── admin.ts               # Service role client (public catalog)
    │   └── user.ts                # User client from Bearer token (authed endpoints)
    └── db/
        ├── 001_initial_schema.sql      # Full current schema
        ├── 002_user_cart_bookmarks.sql # Historical — cart and bookmarks initial migration
        └── drop_schema.sql
```

## Database

Schema is in `src/lib/db/001_initial_schema.sql`. Apply it to a fresh database to get the full schema including RLS policies.

Key tables: `brands`, `categories`, `products`, `product_variations`, `product_images`, `cart_items`, `bookmarks`.

### Brand scoping
All tables use `brand_slug text references brands(slug) on delete cascade` rather than a `brand_id` UUID. This means:
- Queries filter directly by `brand_slug` — no intermediate brand lookup needed
- Deleting a brand cascades to all related rows across every table
- Invalid brand slugs are rejected by the FK constraint

### Unique constraints
- `products`: `unique(brand_slug, slug)` and `unique(brand_slug, name)` — slugs and names must be unique within a brand but can collide across brands
- `description_images`: `unique(brand_slug, src)`
- `bookmarks`: `unique(user_id, brand_slug, product_slug)`

### RLS
`cart_items` and `bookmarks` have RLS enabled — rows are scoped to `auth.uid()`. The authenticated Supabase client enforces this automatically.
