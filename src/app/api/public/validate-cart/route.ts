import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

type CartItem = { sku: string; productSlug: string; priceCents: number };

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
    .select("slug, sku, sale, min_price_cents, sale_price_cents, variations(sku, sale, regular_price_cents, sale_price_cents)")
    .eq("brand_slug", brandSlug)
    .in("slug", slugs);

  const priceMap = new Map<string, number>();
  for (const p of productRows ?? []) {
    if (p.sku) priceMap.set(`${p.slug}:${p.sku}`, p.sale ? p.sale_price_cents : p.min_price_cents);
    for (const v of p.variations ?? []) priceMap.set(`${p.slug}:${v.sku}`, v.sale ? v.sale_price_cents : v.regular_price_cents);
  }

  const result = (items as CartItem[]).map((item) => {
    const dbPrice = priceMap.get(`${item.productSlug}:${item.sku}`) ?? null;
    return {
      productSlug: item.productSlug,
      sku: item.sku,
      exists: dbPrice !== null,
      priceCents: dbPrice,
      priceChanged: dbPrice !== null && dbPrice !== item.priceCents,
    };
  });

  const hasInvalid = result.some((r) => !r.exists);
  const hasChangedPrice = result.some((r) => r.priceChanged);

  const status = hasInvalid && hasChangedPrice ? 422
    : hasInvalid ? 404
    : hasChangedPrice ? 409
    : 200;

  return ok(result, status);
}
