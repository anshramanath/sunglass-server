import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

type CartItem = { sku: string; productSlug: string };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { brandSlug, items } = body;
  if (!brandSlug) return err("brandSlug is required", 400);
  if (!Array.isArray(items)) return err("items must be an array", 400);
  if (items.length === 0) return ok({ items: [] }, 200);

  const supabase = createAdminClient();
  const skus = (items as CartItem[]).map((i) => i.sku);
  const productSlugs = (items as CartItem[]).map((i) => i.productSlug);

  const [{ data: variationRows }, { data: productRows }] = await Promise.all([
    supabase
      .from("variations")
      .select("sku, products!inner(slug)")
      .eq("products.brand_slug", brandSlug)
      .in("sku", skus)
      .in("products.slug", productSlugs),
    supabase
      .from("products")
      .select("sku, slug")
      .eq("brand_slug", brandSlug)
      .not("sku", "is", null)
      .in("sku", skus)
      .in("slug", productSlugs),
  ]);

  const foundPairs = new Set<string>();

  for (const row of variationRows ?? []) {
    const product = row.products as unknown as { slug: string };
    foundPairs.add(`${product.slug}:${row.sku}`);
  }

  for (const row of productRows ?? []) {
    foundPairs.add(`${row.slug}:${row.sku}`);
  }

  const result = (items as CartItem[]).map((item) => ({
    sku: item.sku,
    productSlug: item.productSlug,
    exists: foundPairs.has(`${item.productSlug}:${item.sku}`),
  }));

  return ok({ items: result }, 200);
}
