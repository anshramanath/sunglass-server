# Public API Remaining Improvements

## Status

The major issues have been resolved:

* ✅ Category filtering now uses `categoryId`
* ✅ Parent categories include descendant categories
* ✅ Search is sanitized
* ✅ Sort no longer defaults to nonexistent `featured`
* ✅ Filters are returned in the response
* ✅ Product detail includes variation images

The API is now ready to support the public BikerShades frontend.

---

# Improvement 1: Nest Variation Images Into Variations

## Current Response

```json
{
  "variations": [...],
  "variationImages": [...]
}
```

Frontend must manually join:

```ts
variation.id === image.variation_id
```

every time a product page loads.

---

## Recommended Response

```json
{
  "variations": [
    {
      "id": "...",
      "sku": "...",
      "attribute": ["blue-smoke"],
      "images": [
        {
          "id": "...",
          "src": "..."
        }
      ]
    }
  ]
}
```

---

## Suggested Implementation

Create a lookup table:

```ts
const imagesByVariationId: Record<string, typeof variationImages> = {};

for (const image of variationImages ?? []) {
  imagesByVariationId[image.variation_id] ??= [];
  imagesByVariationId[image.variation_id].push(image);
}
```

Attach images to each variation:

```ts
const variationsWithImages = (variations ?? []).map((variation) => ({
  ...variation,
  images: imagesByVariationId[variation.id] ?? [],
}));
```

Return:

```ts
return ok({
  product,
  variations: variationsWithImages,
  categories,
  productImages,
  descriptionImages,
});
```

Remove:

```ts
variationImages
```

from the top-level response.

---

# Improvement 2: Verify Product Stock Strategy

Current filtering:

```ts
if (inStockOnly) {
  query = query.gt("stock", 0);
}
```

---

## Question

For variable products:

```txt
Product
 ├── Variation A → stock 0
 ├── Variation B → stock 5
 └── Variation C → stock 0
```

What should:

```txt
products.stock
```

contain?

---

## Option A (Recommended)

Keep product stock synchronized with variation stock.

Examples:

```txt
Any variation in stock
→ product.stock > 0
```

```txt
All variations out of stock
→ product.stock = 0
```

Benefits:

* Simple filtering
* Fast queries
* No variation joins required

Current endpoint already works.

---

## Option B

Store stock only on variations.

Then:

```txt
inStockOnly
```

must query variations.

This adds complexity and additional joins.

Not recommended unless product stock cannot be trusted.

---

## Action Item

Document the invariant:

```txt
products.stock > 0
iff
at least one variation is available
```

and enforce it during imports/admin edits.

---

# Future Enhancements (Not Required)

## Search Description

Current:

```ts
name.ilike
sku.ilike
```

Future:

```ts
description.ilike
summary.ilike
```

---

## Category Breadcrumb Endpoint

Potential endpoint:

```txt
POST /api/public/categories/breadcrumbs
```

Request:

```json
{
  "categoryId": "..."
}
```

Response:

```json
[
  {
    "id": "...",
    "name": "Sunglasses"
  },
  {
    "id": "...",
    "name": "Brands"
  },
  {
    "id": "...",
    "name": "Wiley X"
  }
]
```

Useful for category pages.

---

## Product Search Caching

Once catalog traffic increases:

```txt
brands
categories/tree
product detail
```

are excellent candidates for caching.

Not necessary for current catalog size.

---

# Conclusion

The public read API is effectively production-ready for the initial BikerShades website.

Only the variation-image nesting improvement should be considered before frontend development begins.

Everything else can be deferred until after the public site is live.
