import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { collectLeaves } from "@/lib/utils";
import type { CategoryNode } from "@/lib/types";

export async function getCatalogueStats(brandSlug: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const [{ data: products, error: productsError }, { data: rawCategories, error: categoriesError }] =
    await Promise.all([
      supabase.from("products").select("sale, featured").eq("brand_slug", brandSlug),
      supabase.from("categories").select("id, name, slug, parent_id").eq("brand_slug", brandSlug),
    ]);

  if (productsError || categoriesError || !products || !rawCategories) throw new Error("Failed to fetch catalogue stats");

  const nodeMap: Record<string, CategoryNode> = {};
  for (const cat of rawCategories) {
    nodeMap[cat.id] = { id: cat.id, name: cat.name, slug: cat.slug };
  }
  const roots: CategoryNode[] = [];
  for (const cat of rawCategories) {
    if (cat.parent_id) {
      const parent = nodeMap[cat.parent_id];
      parent.children = parent.children ?? [];
      parent.children.push(nodeMap[cat.id]);
    } else {
      roots.push(nodeMap[cat.id]);
    }
  }

  return {
    products: products.length,
    onSale: products.filter((p) => p.sale).length,
    featured: products.filter((p) => p.featured).length,
    categories: Object.keys(collectLeaves(roots)).length,
  };
}

export async function getOrderStats(brandSlug: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("status, total_cents")
    .eq("brand_slug", brandSlug);

  if (error || !orders) throw new Error("Failed to fetch order stats");

  return {
    active: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => ["shipped", "delivered"].includes(o.status)).length,
    revenue: orders.filter((o) => ["shipped", "delivered"].includes(o.status)).reduce((sum, o) => sum + o.total_cents, 0),
    refunded: orders.filter((o) => ["refunded", "partially_refunded"].includes(o.status)).length,
  };
}

export async function getRecentProducts(brandSlug: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, sku, sale, min_price_cents, max_price_cents, sale_price_cents, featured,
      product_categories!inner(categories!inner(name)),
      product_images(src, sort_order)
    `)
    .eq("brand_slug", brandSlug)
    .limit(5);

  if (error || !data) throw new Error("Failed to fetch recent products");

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    sale: p.sale,
    minPriceCents: p.min_price_cents,
    maxPriceCents: p.max_price_cents,
    salePriceCents: p.sale_price_cents,
    featured: p.featured,
    categories: p.product_categories.map((pc: any) => pc.categories.name),
    image: p.product_images
      .sort((a, b) => a.sort_order - b.sort_order)[0]?.src ?? null,
  }));
}
