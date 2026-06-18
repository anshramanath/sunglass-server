import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const brandSlug = params.get("brandSlug");
  const q = params.get("q")?.trim();
  if (!brandSlug) return err("brandSlug is required", 400);
  if (!q) return err("q is required", 400);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, min_price_cents, max_price_cents, sale_price_cents, attributes, featured, sale, product_images!inner(src, name)")
    .eq("brand_slug", brandSlug)
    .ilike("name", `%${q}%`)
    .limit(6);

  if (error) return err("Failed to search products", 500);

  const items = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    minPriceCents: p.min_price_cents,
    maxPriceCents: p.max_price_cents,
    salePriceCents: p.sale_price_cents,
    attributes: p.attributes,
    featured: p.featured,
    sale: p.sale,
    images: p.product_images.map((img: { src: string; name: string }) => ({ src: img.src, name: img.name })),
  }));

  return ok({ items }, 200);
}
