# Public API Remaining Fixes

This document captures the remaining fixes for the public read-only API endpoints used by the BikerShades frontend.

The backend architecture is:

```txt
Frontend → Next.js API routes → Supabase using service_role
```

The frontend should never query Supabase tables directly.

---

## 1. Use `categoryId`, Not `categorySlug`, for Product Filtering

### Problem

Category names can repeat, and category slugs are derived from names. That means slugs can also collide.

Because of this, `categorySlug` is not safe as the source of truth.

Current risky pattern:

```ts
.eq("slug", categorySlug)
.eq("brand_id", brand.id)
.single();
```

If two categories in the same brand share the same name/slug, `.single()` can fail or return the wrong assumption.

### Fix

Use `categoryId` in product search requests.

Request body should become:

```ts
type ProductSearchRequest = {
  brandSlug: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  saleOnly?: boolean;
  inStockOnly?: boolean;
  sort?: "name_asc" | "name_desc" | "price_asc" | "price_desc";
};
```

Frontend displays the category name, but sends the category ID.

```tsx
<button onClick={() => searchProducts({ categoryId: category.id })}>
  {category.name}
</button>
```

Backend lookup:

```ts
const { data: category, error: categoryError } = await supabase
  .from("categories")
  .select("id")
  .eq("id", categoryId)
  .eq("brand_id", brand.id)
  .single();

if (categoryError || !category) return err("Category not found", 404);
```

### Rule

```txt
name = what the frontend displays
id = what the backend trusts
slug = optional URL helper only
```

---

## 2. Keep Descendant Category Expansion

### Problem

Products are only assigned to leaf categories. If the user clicks a parent category, direct lookup returns no products.

Bad behavior:

```txt
Brands
  ├── 7eye
  ├── Wiley X
  └── BikerArmour
```

If products are assigned only to `7eye`, `Wiley X`, and `BikerArmour`, then filtering by `Brands` directly returns empty.

### Fix

Keep descendant expansion.

```ts
type CategoryRow = { id: string; parent_id: string | null };

function getDescendantCategoryIds(
  rootId: string,
  categories: CategoryRow[]
): string[] {
  const result = new Set<string>([rootId]);
  let changed = true;

  while (changed) {
    changed = false;

    for (const cat of categories) {
      if (cat.parent_id && result.has(cat.parent_id) && !result.has(cat.id)) {
        result.add(cat.id);
        changed = true;
      }
    }
  }

  return Array.from(result);
}
```

Then query `product_categories` using all descendant category IDs:

```ts
const categoryIds = getDescendantCategoryIds(category.id, allCategories ?? []);

const { data: productCats } = await supabase
  .from("product_categories")
  .select("product_id")
  .in("category_id", categoryIds);
```

---

## 3. Roll Up Product Counts in Category Tree

### Problem

The current category tree count only counts products directly assigned to a category.

Since only leaf nodes have products, parent categories show `productCount: 0`.

Example bad response:

```json
{
  "name": "Brands",
  "productCount": 0,
  "children": [
    { "name": "7eye", "productCount": 20 },
    { "name": "Wiley X", "productCount": 30 }
  ]
}
```

For navbar/sidebar use, parent counts should usually include child counts.

### Fix

After building the category tree, recursively sum child counts into parents.

```ts
function rollupProductCounts(node: CategoryNode): number {
  const childTotal = node.children?.reduce(
    (sum, child) => sum + rollupProductCounts(child),
    0
  ) ?? 0;

  node.productCount = node.productCount + childTotal;
  return node.productCount;
}

for (const root of roots) {
  rollupProductCounts(root);
}
```

### Result

```json
{
  "name": "Brands",
  "productCount": 50,
  "children": [
    { "name": "7eye", "productCount": 20 },
    { "name": "Wiley X", "productCount": 30 }
  ]
}
```

---

## 4. Product Detail Should Include Variation Images

### Problem

The product detail endpoint currently fetches:

```ts
variations
product_categories
product_images
description_images
```

But the schema also has:

```txt
variation_images
```

Variation-specific images are needed when the user selects a color/option.

### Fix

After fetching variations, fetch all variation images for those variation IDs.

```ts
const variationIds = variations?.map((v) => v.id) ?? [];

const { data: variationImages } =
  variationIds.length > 0
    ? await supabase
        .from("variation_images")
        .select("id, variation_id, src, name, sort_order")
        .in("variation_id", variationIds)
        .order("sort_order", { ascending: true })
    : { data: [] };
```

Then return them:

```ts
return ok({
  product,
  variations: variations ?? [],
  categories,
  productImages: productImages ?? [],
  variationImages: variationImages ?? [],
  descriptionImages: descriptionImages ?? [],
});
```

Frontend logic:

```txt
If selected variation has variation images → show those
Else → fallback to productImages
```

---

## 5. Clean Up Search Handling

### Current Improvement

This is better than name-only search:

```ts
query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
```

### Remaining Concern

Supabase `.or()` uses a PostgREST filter string. Special characters in `search` can behave weirdly.

For MVP, this is probably fine.

Later, sanitize or restrict the search string:

```ts
const cleanSearch = String(search)
  .trim()
  .replace(/[,%()]/g, "");
```

Then only apply search if non-empty:

```ts
if (cleanSearch) {
  query = query.or(`name.ilike.%${cleanSearch}%,sku.ilike.%${cleanSearch}%`);
}
```

---

## 6. Return Active Filters in Product Search Response

### Problem

When debugging frontend category/search pages, it is helpful to see what filters the backend applied.

### Fix

Add a `filters` object to the product search response.

```ts
return ok({
  products: mappedProducts,
  page,
  totalPages: Math.ceil(totalProducts / limit),
  totalProducts,
  filters: {
    brandSlug,
    categoryId: categoryId ?? null,
    search: cleanSearch || null,
    saleOnly,
    inStockOnly,
    sort,
  },
});
```

This makes frontend debugging much easier.

---

## 7. Avoid Exposing Full Product Rows Unless Needed

### Problem

The product detail endpoint currently uses:

```ts
.select("*")
```

This is acceptable for an MVP, but public endpoints should eventually return only the fields the frontend needs.

### Future Fix

Use explicit selects:

```ts
.select(`
  id,
  brand_id,
  name,
  slug,
  sku,
  description,
  summary,
  attributes,
  sale,
  min_price_cents,
  max_price_cents,
  sale_price_cents,
  stock,
  weight,
  weight_unit,
  length,
  width,
  height,
  dimension_unit
`)
```

This keeps public API responses stable even if internal columns are added later.

---

## 8. Recommended Public Endpoint Bodies

### Category Tree

```txt
POST /api/public/categories/tree
```

```json
{
  "brandSlug": "bikershades"
}
```

### Product Search

```txt
POST /api/public/products/search
```

```json
{
  "brandSlug": "bikershades",
  "categoryId": "category-uuid",
  "search": "wiley",
  "page": 1,
  "limit": 24,
  "saleOnly": false,
  "inStockOnly": false,
  "sort": "name_asc"
}
```

### Product Detail

```txt
POST /api/public/products/detail
```

```json
{
  "brandSlug": "bikershades",
  "productSlug": "wiley-x-gravity"
}
```

Product slugs are still acceptable for product detail if product slugs are unique per brand. If product slugs can collide, use `productId` instead.

---

## 9. Priority Order

Fix in this order:

1. Replace `categorySlug` with `categoryId` in product search.
2. Keep descendant category expansion.
3. Roll up category product counts in the category tree endpoint.
4. Add `variationImages` to product detail.
5. Return active `filters` in product search response.
6. Sanitize search input.
7. Replace `.select("*")` with explicit public fields later.

---

## Final Intended Behavior

### Navbar

- Calls `POST /api/public/categories/tree`
- Displays `category.name`
- Stores/sends `category.id` when filtering products
- Parent categories show aggregate product counts

### Product Listing Page

- Calls `POST /api/public/products/search`
- Can filter by parent or leaf category
- Can search by product name or SKU
- Can paginate and sort
- Returns thumbnails

### Product Detail Page

- Calls `POST /api/public/products/detail`
- Gets product fields
- Gets variations
- Gets product images
- Gets variation images
- Gets description images
- Falls back from variation images to product images when needed
