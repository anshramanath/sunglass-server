"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import type { AdminProduct, CategoryOption } from "@/lib/types";

const PAGE_SIZE = 10;

export async function getProducts(
  brandSlug: string,
  { search, categoryId, offset = 0 }: { search?: string; categoryId?: string; offset?: number }
): Promise<{ products: AdminProduct[]; hasMore: boolean }> {
  await requireAdmin();
  const supabase = createAdminClient();

  let filterIds: string[] | null = null;

  if (categoryId) {
    const { data, error } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", categoryId);
    if (error) throw new Error("Failed to fetch products");
    filterIds = data.map((r) => r.product_id);
    if (filterIds.length === 0) return { products: [], hasMore: false };
  }

  if (search) {
    const [productsRes, variationsRes] = await Promise.all([
      supabase.from("products").select("id").eq("brand_slug", brandSlug).or(`name.ilike.%${search}%,sku.ilike.%${search}%`),
      supabase.from("variations").select("product_id").ilike("sku", `%${search}%`),
    ]);
    if (productsRes.error || variationsRes.error) throw new Error("Failed to fetch products");

    const searchIds = new Set([
      ...productsRes.data.map((p) => p.id),
      ...variationsRes.data.map((v) => v.product_id),
    ]);

    filterIds = filterIds
      ? filterIds.filter((id) => searchIds.has(id))
      : [...searchIds];

    if (filterIds.length === 0) return { products: [], hasMore: false };
  }

  let query = supabase
    .from("products")
    .select(`
      id, name, slug, sku, sale, featured, min_price_cents, max_price_cents, sale_price_cents,
      product_categories(categories!inner(name)),
      product_images(src, sort_order)
    `)
    .eq("brand_slug", brandSlug)
    .order("name")
    .range(offset, offset + PAGE_SIZE);

  if (filterIds) query = query.in("id", filterIds);

  const { data, error } = await query;
  if (error) throw new Error("Failed to fetch products");

  const hasMore = data.length > PAGE_SIZE;

  const products = data.slice(0, PAGE_SIZE).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sale: p.sale,
    featured: p.featured,
    variable: !p.sku,
    minPriceCents: p.min_price_cents,
    maxPriceCents: p.max_price_cents,
    salePriceCents: p.sale_price_cents,
    categories: (p.product_categories as unknown as { categories: { name: string } }[])
      .map((pc) => pc.categories.name),
    image: (p.product_images as { src: string; sort_order: number }[])
      .sort((a, b) => a.sort_order - b.sort_order)[0].src,
  }));

  return { products, hasMore };
}

export async function getCategoryOptions(brandSlug: string): Promise<CategoryOption[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("brand_slug", brandSlug)
    .order("name");
  if (error) throw new Error("Failed to fetch category options");
  return data ?? [];
}
