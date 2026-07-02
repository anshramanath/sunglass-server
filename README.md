# sunglass-server

Next.js API server for a multi-brand sunglasses e-commerce platform. API routes only — no frontend. Multiple storefronts share one codebase and database, scoped by `brand_slug`.

**Stack:** Next.js 16 · Supabase (Postgres + RLS + Auth) · Stripe · TypeScript

---

## Endpoints

All endpoints return:
```json
{ "success": true,  "data": { ... } }            // 2xx
{ "success": false, "message": "..." }            // 4xx / 5xx
{ "success": false, "message": "...", "data": [] } // validate-cart + checkout on 404/409/422
```

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public/brands` | All brands |
| GET | `/api/public/categories` | Full category tree, recursively sorted |
| GET | `/api/public/products` | Paginated products by category, unique color swatches |
| GET | `/api/public/sale` | Paginated sale products |
| GET | `/api/public/item` | Full product detail, all variations and images |
| GET | `/api/public/search` | Product name search, up to 6 results |
| POST | `/api/public/validate-cart` | Check cart items exist and prices match |

Price filters (`under-15`, `15-25`, `25-plus`, `sale`) are resolved server-side.

### Authenticated — `Authorization: Bearer <token>`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/user/cart` | Fetch cart |
| PUT | `/api/user/cart` | Replace cart (full sync) |
| POST | `/api/user/bookmarks` | Fetch bookmarks |
| PUT | `/api/user/bookmarks` | Replace bookmarks (full sync) |
| POST | `/api/user/orders` | Order history with shipping address and line items |
| POST | `/api/user/checkout` | Create Stripe checkout session |

Token is a Supabase JWT passed as a Bearer header. `createUserClient` verifies it via `auth.getUser()` and returns a scoped client. RLS enforces that users only access their own rows.

### Webhooks

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/webhooks/stripe` | Handle `checkout.session.completed` |

Verified via `stripe-signature`. Creates the order and line items, stores Stripe-collected shipping address, increments `total_sales` via an AFTER INSERT trigger on `order_items`. Idempotent via unique constraint on `stripe_session_id`.

---

## Structure

```
src/
├── app/api/
│   ├── public/
│   │   ├── brands/route.ts
│   │   ├── categories/route.ts
│   │   ├── products/route.ts
│   │   ├── sale/route.ts
│   │   ├── item/route.ts
│   │   ├── search/route.ts
│   │   └── validate-cart/route.ts
│   ├── user/
│   │   ├── cart/route.ts
│   │   ├── bookmarks/route.ts
│   │   ├── orders/route.ts
│   │   └── checkout/route.ts
│   └── webhooks/stripe/route.ts
└── lib/
    ├── api.ts                        # ok() / err() response helpers
    ├── stripe.ts                     # Stripe client singleton
    ├── supabase/
    │   ├── admin.ts                  # service role client — bypasses RLS
    │   └── user.ts                   # Bearer token client — respects RLS
    └── db/
        ├── 001_initial_schema.sql    # source of truth — full schema + RLS policies
        ├── 002_user_cart_bookmarks.sql
        ├── 003_orders.sql
        └── drop_schema.sql           # dev only
```

