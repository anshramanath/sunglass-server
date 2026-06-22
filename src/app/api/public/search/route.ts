import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const brandSlug = params.get("brandSlug");
  if (!brandSlug) return err("brandSlug is required", 400);

  const search = params.get("search")?.trim();
  if (!search) return err("search is required", 400);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, min_price_cents, max_price_cents, sale_price_cents, featured, sale, product_images!inner(src, name, sort_order)")
    .eq("brand_slug", brandSlug)
    .ilike("name", `%${search}%`)
    .limit(6);

  if (error) return err("Failed to search products", 500);

  const items = (data ?? []).map((p) => {
    const firstImage = (p.product_images as { src: string; name: string; sort_order: number }[]).sort((a, b) => a.sort_order - b.sort_order)[0];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      minPriceCents: p.min_price_cents,
      maxPriceCents: p.max_price_cents,
      salePriceCents: p.sale_price_cents,
      featured: p.featured,
      sale: p.sale,
      imageSrc: firstImage?.src ?? null,
      imageName: firstImage?.name ?? null,
    };
  });

  return ok(items, 200);
}
