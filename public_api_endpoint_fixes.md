# Public API Endpoint Fixes — Sunglass Monster

This document addresses the main issues found in the current public read-only API endpoints for the Sunglass Monster / BikerShades backend.

The current backend direction is correct:

```txt
Frontend → Next.js API routes → Supabase using service_role
```

The public-facing endpoints are read-only and do not require auth. They can safely use the service role because they only return public catalog data.

---

## 1. Product Search: Parent Categories Return No Products

### Location

```txt
app/api/public/products/search/route.ts
```

Look for the category filter logic:

```ts
const { data: productCats } = await supabase
  .from("product_categories")
  .select("product_id")
  .eq("category_id", category.id);
```

### Problem

The schema rule is:

```txt
Only leaf categories have products.
```

That means if the frontend searches using a parent category such as:

```txt
Brands
Lens Type
Frame Type
```

there may be no direct `product_categories` rows for that parent category.

So this query only works when `categorySlug` is already a leaf category.

### Fix

When a category is selected, collect:

```txt
selected category id + all descendant category ids
```

Then query `product_categories` with:

```ts
.in("category_id", categoryIds)
```

Instead of:

```ts
.eq("category_id", category.id)
```

### Suggested helper

```ts
type CategoryRow = {
  id: string;
  parent_id: string | null;
};

function getDescendantCategoryIds(
  rootId: string,
  categories: CategoryRow[]
): string[] {
  const result = new Set<string>([rootId]);

  let changed = true;

  while (changed) {
    changed = false;

    for (const category of categories) {
      if (category.parent_id && result.has(category.parent_id) && !result.has(category.id)) {
        result.add(category.id);
        changed = true;
      }
    }
  }

  return Array.from(result);
}
```

### Updated flow

```ts
const { data: allCategories } = await supabase
  .from("categories")
  .select("id, parent_id")
  .eq("brand_id", brand.id);

const categoryIds = getDescendantCategoryIds(category.id, allCategories ?? []);

const { data: productCats } = await supabase
  .from("product_categories")
  .select("product_id")
  .in("category_id", categoryIds);
```

---

## 2. Category Tree: Parent Product Counts Are Always 0

### Location

```txt
app/api/public/categories/tree/route.ts
```

Look for:

```ts
countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1;
```

and:

```ts
productCount: countMap[cat.id] ?? 0
```

### Problem

This only counts products directly assigned to each category.

Because products are only attached to leaf nodes, parent nodes will usually show:

```txt
productCount: 0
```

even if their children contain many products.

For navbar/dropdown use, parent nodes should probably show the total number of products under their whole subtree.

### Fix

After building the tree, recursively roll child counts up into the parent.

### Suggested helper

```ts
type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  children?: CategoryNode[];
};

function rollupProductCounts(node: CategoryNode): number {
  const childTotal =
    node.children?.reduce((sum, child) => sum + rollupProductCounts(child), 0) ?? 0;

  node.productCount += childTotal;

  return node.productCount;
}
```

Then after building `roots`:

```ts
for (const root of roots) {
  rollupProductCounts(root);
}
```

Now a parent category like `Brands` can show the total product count of all brands beneath it.

---

## 3. Product Detail: Missing Variation Images

### Location

```txt
app/api/public/products/detail/route.ts
```

Current `Promise.all` fetches:

```ts
variations
product_categories
product_images
description_images
```

### Problem

The schema includes:

```txt
variation_images
```

but the endpoint does not fetch them.

This means the product detail page cannot show variation-specific images.

### Fix

Fetch variation images after fetching variations, or include a second query using the variation IDs.

### Suggested implementation

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

Return:

```ts
return ok({
  product,
  variations: variations ?? [],
  variationImages: variationImages ?? [],
  categories,
  productImages: productImages ?? [],
  descriptionImages: descriptionImages ?? [],
});
```

### Optional nicer shape

Instead of returning `variationImages` separately, attach images to each variation:

```ts
const variationImageMap: Record<string, any[]> = {};

for (const image of variationImages ?? []) {
  variationImageMap[image.variation_id] = variationImageMap[image.variation_id] ?? [];
  variationImageMap[image.variation_id].push(image);
}

const variationsWithImages = (variations ?? []).map((variation) => ({
  ...variation,
  images: variationImageMap[variation.id] ?? [],
}));
```

Then return:

```ts
variations: variationsWithImages
```

This is easier for the frontend product page.

---

## 4. Product Search: `featured` Sort Does Not Exist

### Location

```txt
app/api/public/products/search/route.ts
```

Look for:

```ts
sort = "featured"
```

and:

```ts
else query = query.order("name", { ascending: true });
```

### Problem

The schema does not currently have a `featured` column.

So `sort = "featured"` does not actually sort by featured products. It just falls back to alphabetical sorting by name.

### Fix Options

#### Option A: Rename default sort to `name_asc`

Best for now.

```ts
sort = "name_asc"
```

Then:

```ts
if (sort === "price_asc") {
  query = query.order("min_price_cents", { ascending: true });
} else if (sort === "price_desc") {
  query = query.order("min_price_cents", { ascending: false });
} else if (sort === "name_desc") {
  query = query.order("name", { ascending: false });
} else {
  query = query.order("name", { ascending: true });
}
```

#### Option B: Add a `featured` column later

If the owner wants manual featured products:

```sql
alter table products
add column featured boolean not null default false;
```

Then sort featured first:

```ts
query = query
  .order("featured", { ascending: false })
  .order("name", { ascending: true });
```

For now, Option A is cleaner.

---

## 5. Product Search: Search Only Checks Product Name

### Location

```txt
app/api/public/products/search/route.ts
```

Look for:

```ts
if (search) query = query.ilike("name", `%${search}%`);
```

### Problem

This only searches the product name.

A user may search by:

```txt
SKU
brand/model name
keywords in description
```

### MVP Fix

Search by product name and SKU:

```ts
if (search) {
  query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
}
```

### Later Improvement

For better search, add a Postgres full-text search column or use a dedicated search service.

For MVP, `name + sku` is enough.

---

## 6. Product Search: Thumbnail Query Fetches All Images for Products

### Location

```txt
app/api/public/products/search/route.ts
```

Look for:

```ts
const { data: images } =
  ids.length > 0
    ? await supabase
        .from("product_images")
        .select("product_id, src")
        .in("product_id", ids)
        .order("sort_order", { ascending: true })
    : { data: [] };
```

### Problem

This fetches all images for all products on the page, then picks the first one in JavaScript.

For 24 products, this is fine. If each product has many images, it can become wasteful.

### MVP Status

This is okay for now.

### Future Optimization

Options:

1. Add a `thumbnail_url` column to `products`
2. Create a database view for first product image
3. Query only first image per product with SQL/RPC

Do not optimize this yet unless it becomes slow.

---

## 7. Error Handling: Some Supabase Errors Are Treated As Not Found

### Locations

Multiple routes:

```txt
products/search
products/detail
categories/tree
categories/detail
brands
```

### Problem

Some queries ignore the `error` value.

Example:

```ts
const { data: brand } = await supabase
  .from("brands")
  .select("id")
  .eq("slug", brandSlug)
  .single();

if (!brand) return err("Brand not found", 404);
```

If Supabase errors for another reason, this still returns `Brand not found`.

### Fix

Use:

```ts
const { data: brand, error: brandError } = await supabase
  .from("brands")
  .select("id")
  .eq("slug", brandSlug)
  .single();

if (brandError || !brand) return err("Brand not found", 404);
```

For public endpoints, it is okay to hide internal error details.

---

## Recommended Fix Priority

### Must Fix Before Building BikerShades Frontend

1. Parent category filtering in product search
2. Variation images in product detail
3. Remove or rename `featured` sort

### Nice To Have

4. Roll up category counts in category tree
5. Search by SKU
6. Better error handling

### Future Optimization

7. Thumbnail query optimization

---

## Recommended Endpoint Behavior After Fixes

### `POST /api/public/categories/tree`

Should return a full nested category tree:

```ts
[
  {
    id: string;
    name: string;
    slug: string;
    productCount: number; // includes child products
    children: CategoryNode[];
  }
]
```

### `POST /api/public/products/search`

Should support:

```ts
{
  brandSlug: string;
  categorySlug?: string; // parent or leaf category
  search?: string;
  page?: number;
  limit?: number;
  saleOnly?: boolean;
  inStockOnly?: boolean;
  sort?: "name_asc" | "name_desc" | "price_asc" | "price_desc";
}
```

### `POST /api/public/products/detail`

Should return:

```ts
{
  product: Product;
  variations: VariationWithImages[];
  categories: Category[];
  productImages: ProductImage[];
  descriptionImages: DescriptionImage[];
}
```

Where each variation optionally has:

```ts
images: VariationImage[];
```

---

## Final Architecture Reminder

Public endpoints:

```txt
No auth required
Use service_role
Only read data
```

Admin endpoints:

```txt
Auth required
Check admins table
Use service_role
Can write data
```

Never create a public endpoint that writes using the service role key.
