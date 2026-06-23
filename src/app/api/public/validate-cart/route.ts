import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

type CartItem = { sku: string; productSlug: string };

export async function POST(req: NextRequest) {
  const body = await req.json();

  const brandSlug = body.brandSlug;
  if (!brandSlug) return err("brandSlug is required", 400);

  const items = body.items;
  if (!Array.isArray(items)) return err("items must be an array", 400);
  if (items.length === 0) return ok([], 200);

  const slugs = (items as CartItem[]).map((i) => i.productSlug);

  const supabase = createAdminClient();

  const { data: productRows } = await supabase
    .from("products")
    .select("slug, sku, variations(sku)")
    .eq("brand_slug", brandSlug)
    .in("slug", slugs);

  const productSkuMap = new Map<string, Set<string>>();
  for (const p of productRows ?? []) {
    const validSkus = new Set<string>();
    if (p.sku) validSkus.add(p.sku);
    for (const v of p.variations ?? []) validSkus.add(v.sku);
    productSkuMap.set(p.slug, validSkus);
  }

  const result = (items as CartItem[]).map((item) => ({
    productSlug: item.productSlug,
    sku: item.sku,
    exists: productSkuMap.get(item.productSlug)?.has(item.sku) ?? false,
  }));

  return ok(result, 200);
}
