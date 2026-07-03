import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

type RawAttribute = { name: string; option: string; slug: string; value?: string };
type RawImage = { src: string; name: string; sort_order: number };
type RawVariation = { id: string; attribute: RawAttribute[]; variation_images: RawImage[] };

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const brandSlug = params.get("brandSlug");
  if (!brandSlug) return err("brandSlug is required", 400);

  const n = Math.min(100, Math.max(1, Number(params.get("n")) || 20));

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, featured, sale, min_price_cents, max_price_cents, sale_price_cents,
      product_images!inner(src, name, sort_order),
      variations(id, attribute,
        variation_images(src, name, sort_order)
      )
    `)
    .eq("brand_slug", brandSlug)
    .limit(n);

  if (error) return err("Failed to fetch products", 500);

  const products = (data ?? []).map((p) => {
    const firstImage = (p.product_images as RawImage[]).sort((a, b) => a.sort_order - b.sort_order)[0];

    const seen = new Set<string>();
    const variations = (p.variations ?? []).reduce((acc: { id: string; option: string; slug: string; value?: string; imageSrc: string | null; imageName: string | null }[], v: RawVariation) => {
      const color = v.attribute.find((a) => a.name === "color");
      if (!color || seen.has(color.slug)) return acc;
      seen.add(color.slug);
      const firstImage = v.variation_images.sort((a, b) => a.sort_order - b.sort_order)[0];
      acc.push({
        id: v.id,
        option: color.option,
        slug: color.slug,
        value: color.value,
        imageSrc: firstImage?.src ?? null,
        imageName: firstImage?.name ?? null,
      });
      return acc;
    }, []);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      minPriceCents: p.min_price_cents,
      maxPriceCents: p.max_price_cents,
      salePriceCents: p.sale_price_cents,
      featured: p.featured,
      sale: p.sale,
      imageSrc: firstImage!.src,
      imageName: firstImage!.name,
      variations,
    };
  });

  return ok(products);
}
