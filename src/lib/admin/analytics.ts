import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import type { RankedRow, AnalyticsItemRow } from "@/lib/types";


export async function getAnalyticsSummary(brandSlug: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const [productsRes, categoriesRes, ordersRes] = await Promise.all([
    supabase.from("products").select("view_count").eq("brand_slug", brandSlug),
    supabase.from("categories").select("view_count").eq("brand_slug", brandSlug),
    supabase.from("orders").select("order_items(quantity)").eq("brand_slug", brandSlug).in("status", ["processing", "shipped", "delivered"]),
  ]);

  if (productsRes.error) throw new Error(productsRes.error.message);
  if (categoriesRes.error) throw new Error(categoriesRes.error.message);
  if (ordersRes.error) throw new Error(ordersRes.error.message);

  const productViews = (productsRes.data ?? []).reduce((sum, p) => sum + (p.view_count ?? 0), 0);
  const categoryViews = (categoriesRes.data ?? []).reduce((sum, c) => sum + (c.view_count ?? 0), 0);
  const totalViews = productViews + categoryViews;
  const unitsSold = (ordersRes.data ?? []).flatMap((o) => o.order_items as { quantity: number }[]).reduce((sum, i) => sum + i.quantity, 0);

  return { totalViews, unitsSold };
}

export async function getTopProductViews(brandSlug: string, totalViews: number): Promise<RankedRow[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("name, view_count")
    .eq("brand_slug", brandSlug);

  if (error) throw new Error(error.message);

  return [...(data ?? [])]
    .filter((p) => (p.view_count) > 0)
    .sort((a, b) => (b.view_count) - (a.view_count))
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      value: (p.view_count).toLocaleString(),
      barPct: Math.round(((p.view_count) / totalViews) * 100),
    }));
}

export async function getTopCategoryViews(brandSlug: string, totalViews: number): Promise<RankedRow[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .select("name, view_count")
    .eq("brand_slug", brandSlug);

  if (error) throw new Error(error.message);

  return [...(data ?? [])]
    .filter((c) => (c.view_count ?? 0) > 0)
    .sort((a, b) => (b.view_count) - (a.view_count))
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      value: (c.view_count).toLocaleString(),
      barPct: Math.round(((c.view_count) / totalViews) * 100),
    }));
}

export async function getTopProductSales(brandSlug: string, unitsSold: number): Promise<RankedRow[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select("order_items(product_slug, name, sku, quantity)")
    .eq("brand_slug", brandSlug)
    .in("status", ["processing", "shipped", "delivered"]);

  if (error) throw new Error(error.message);

  const salesByKey: Record<string, { name: string; sku: string; units: number }> = {};
  for (const order of data ?? []) {
    for (const item of order.order_items as AnalyticsItemRow[]) {
      const key = `${item.product_slug}:${item.sku}`;
      salesByKey[key] = {
        name: item.name,
        sku: item.sku,
        units: (salesByKey[key]?.units ?? 0) + item.quantity,
      };
    }
  }

  return Object.values(salesByKey)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      subtitle: p.sku,
      value: p.units.toLocaleString(),
      barPct: Math.round((p.units / unitsSold) * 100),
    }));
}
