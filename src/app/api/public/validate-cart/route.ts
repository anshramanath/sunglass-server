import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

type CartItem = { sku: string };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { brandSlug, items } = body;
  if (!brandSlug) return err("brandSlug is required", 400);
  if (!Array.isArray(items)) return err("items must be an array", 400);
  if (items.length === 0) return ok({ items: [] }, 200);

  const supabase = createAdminClient();
  const skus = (items as CartItem[]).map((i) => i.sku);

  const [{ data: variationRows }, { data: productRows }] = await Promise.all([
    supabase
      .from("variations")
      .select("sku, products!inner(brand_slug)")
      .eq("products.brand_slug", brandSlug)
      .in("sku", skus),
    supabase
      .from("products")
      .select("sku")
      .eq("brand_slug", brandSlug)
      .not("sku", "is", null)
      .in("sku", skus),
  ]);

  const foundSkus = new Set([
    ...(variationRows ?? []).map((r) => r.sku),
    ...(productRows ?? []).map((r) => r.sku),
  ]);

  const result = (items as CartItem[]).map((item) => ({
    sku: item.sku,
    exists: foundSkus.has(item.sku),
  }));

  return ok({ items: result }, 200);
}
