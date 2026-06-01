# Public Read API Documentation

## Sunglass Monster Backend v1

All endpoints are read-only and publicly accessible.

The frontend never talks to Supabase directly. All requests go through the Next.js backend, which uses the Supabase service role client.

---

# Base URL

```txt
/api/public
```

---

# Common Patterns

All read endpoints use POST requests.

Request:

```json
{
  ...
}
```

Response:

```json
{
  "success": true,
  "data": ...
}
```

Error:

```json
{
  "success": false,
  "error": "message"
}
```

---

# 1. Category Tree

## Endpoint

```txt
POST /api/public/categories/tree
```

## Request

```json
{
  "brandSlug": "bikershades"
}
```

## Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Sunglasses",
      "slug": "sunglasses",
      "children": [
        {
          "id": "uuid",
          "name": "Brands",
          "slug": "brands",
          "children": [
            {
              "id": "uuid",
              "name": "7eye",
              "slug": "7eye",
              "productCount": 20
            }
          ]
        }
      ]
    }
  ]
}
```

Purpose:

* Navbar dropdowns
* Mobile menu
* Category page navigation
* Footer navigation

---

# 2. Product Search

## Endpoint

```txt
POST /api/public/products/search
```

## Request

```json
{
  "brandSlug": "bikershades",
  "categorySlug": "polarized",
  "page": 1,
  "limit": 24,
  "search": "",
  "saleOnly": false,
  "inStockOnly": false,
  "sort": "featured"
}
```

All fields except brandSlug are optional.

## Response

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Wiley X Gravity",
        "slug": "wiley-x-gravity",
        "priceMin": 4999,
        "priceMax": 6999,
        "sale": false,
        "stock": 1,
        "thumbnail": "..."
      }
    ],
    "page": 1,
    "totalPages": 8,
    "totalProducts": 173
  }
}
```

Purpose:

* Category pages
* Search results
* Brand collections
* Sale pages

---

# 3. Product Detail

## Endpoint

```txt
POST /api/public/products/detail
```

## Request

```json
{
  "brandSlug": "bikershades",
  "productSlug": "wiley-x-gravity"
}
```

## Response

```json
{
  "success": true,
  "data": {
    "product": {},
    "variations": [],
    "categories": [],
    "productImages": [],
    "descriptionImages": []
  }
}
```

Returns:

* Product record
* Variations
* Categories
* Product gallery
* Description images

Purpose:

* Product page

---

# 4. Brand List

## Endpoint

```txt
POST /api/public/brands
```

## Request

```json
{}
```

## Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "BikerShades",
      "slug": "bikershades"
    }
  ]
}
```

Purpose:

* Future multi-brand selector
* Platform landing page

---

# 5. Category Detail

## Endpoint

```txt
POST /api/public/categories/detail
```

## Request

```json
{
  "brandSlug": "bikershades",
  "categorySlug": "polarized"
}
```

## Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Polarized",
    "slug": "polarized",
    "parent": {
      "name": "Lens Type",
      "slug": "lens-type"
    },
    "children": [],
    "productCount": 55
  }
}
```

Purpose:

* Breadcrumbs
* Category landing pages

---

# Query Strategy

All endpoints should:

1. Use `createAdminClient()`
2. Validate request body
3. Query Supabase
4. Return JSON
5. Never expose internal implementation details

Example:

```ts
const supabase = createAdminClient();

const { data, error } = await supabase
  .from("products")
  .select("*");
```

No browser code should ever call Supabase directly.

All reads flow through these endpoints.

---

# Initial Build Order

1. POST /api/public/categories/tree
2. POST /api/public/products/search
3. POST /api/public/products/detail
4. POST /api/public/brands
5. POST /api/public/categories/detail

Once these five endpoints exist, the public-facing BikerShades website can be built entirely against the backend API.
