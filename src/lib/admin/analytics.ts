import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import type { RankedRow } from "@/lib/types";


export async function getAnalyticsSummary(brandSlug: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const [productsRes, categoriesRes, simpleRes, variableRes] = await Promise.all([
    supabase.from("products").select("view_count").eq("brand_slug", brandSlug).gt("view_count", 0),
    supabase.from("categories").select("view_count").eq("brand_slug", brandSlug).gt("view_count", 0),
    supabase.from("products").select("total_sales").eq("brand_slug", brandSlug).not("sku", "is", null).gt("total_sales", 0),
    supabase.from("products").select("variations!inner(total_sales)").eq("brand_slug", brandSlug).is("sku", null).gt("variations.total_sales", 0),
  ]);

  if (productsRes.error || categoriesRes.error || simpleRes.error || variableRes.error)
    throw new Error("Failed to fetch analytics summary");

  const totalViews =
    productsRes.data.reduce((sum, p) => sum + p.view_count, 0) +
    categoriesRes.data.reduce((sum, c) => sum + c.view_count, 0);

  const unitsSold =
    simpleRes.data.reduce((sum, p) => sum + p.total_sales, 0) +
    variableRes.data.flatMap((p) => p.variations as { total_sales: number }[]).reduce((sum, v) => sum + v.total_sales, 0);

  return { totalViews, unitsSold };
}

export async function getTopProductViews(brandSlug: string, totalViews: number): Promise<RankedRow[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("name, view_count")
    .eq("brand_slug", brandSlug)
    .gt("view_count", 0)
    .order("view_count", { ascending: false })
    .limit(5);

  if (error) throw new Error("Failed to fetch analytics");

  return data.map((p) => ({
    name: p.name,
    value: p.view_count.toLocaleString(),
    barPct: Math.round((p.view_count / totalViews) * 100),
  }));
}

export async function getTopCategoryViews(brandSlug: string, totalViews: number): Promise<RankedRow[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .select("name, view_count")
    .eq("brand_slug", brandSlug)
    .gt("view_count", 0)
    .order("view_count", { ascending: false })
    .limit(5);

  if (error) throw new Error("Failed to fetch analytics");

  return data.map((c) => ({
    name: c.name,
    value: c.view_count.toLocaleString(),
    barPct: Math.round((c.view_count / totalViews) * 100),
  }));
}

export async function getTopProductSales(brandSlug: string, unitsSold: number): Promise<RankedRow[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const [simpleRes, variableRes] = await Promise.all([
    supabase.from("products")
      .select("name, sku, total_sales")
      .eq("brand_slug", brandSlug)
      .not("sku", "is", null)
      .gt("total_sales", 0),
    supabase.from("products")
      .select("name, variations!inner(sku, total_sales)")
      .eq("brand_slug", brandSlug)
      .is("sku", null)
      .gt("variations.total_sales", 0),
  ]);

  if (simpleRes.error || variableRes.error) throw new Error("Failed to fetch analytics");

  const simple = (simpleRes.data as { name: string; sku: string; total_sales: number }[]).map((p) => ({
    name: p.name,
    sku: p.sku,
    units: p.total_sales,
  }));

  const variable = (variableRes.data as { name: string; variations: { sku: string; total_sales: number }[] }[])
    .flatMap((p) => p.variations.map((v) => ({ name: p.name, sku: v.sku, units: v.total_sales })));

  return [...simple, ...variable]
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      subtitle: p.sku,
      value: p.units.toLocaleString(),
      barPct: Math.round((p.units / unitsSold) * 100),
    }));
}
