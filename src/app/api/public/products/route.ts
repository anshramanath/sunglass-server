import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

const FILTER_MAP: Record<string, { sale?: boolean; minPrice?: number; maxPrice?: number }> = {
  "under-15": { maxPrice: 1500 },
  "15-25":    { minPrice: 1500, maxPrice: 2500 },
  "25-plus":  { minPrice: 2500 },
  "sale":     { sale: true },
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const brandSlug = params.get("brandSlug");
  const categoryId = params.get("categoryId");
  const filterSlug = params.get("filter") ?? undefined;
  const activeFilter = filterSlug ? FILTER_MAP[filterSlug] : undefined;

  if (!brandSlug) return err("brandSlug is required", 400);
  if (!categoryId) return err("categoryId is required", 400);

  const page = Math.max(1, Number(params.get("page")) || 1);
  const size = Math.min(100, Math.max(1, Number(params.get("size")) || 20));

  const supabase = createAdminClient();

  const from = (page - 1) * size;
  const to = from + size - 1;

  let q = supabase
    .from("products")
    .select("id, name, slug, featured, sale, min_price_cents, max_price_cents, sale_price_cents, product_categories!inner(category_id), product_images!inner(src, name), variations(id, sale, regular_price_cents, sale_price_cents, attribute, variation_images(src, name, sort_order))", { count: "exact" })
    .eq("brand_slug", brandSlug)
    .eq("product_categories.category_id", categoryId);

  if (activeFilter?.sale) q = q.eq("sale", true);
  if (activeFilter?.minPrice !== undefined) q = q.gte("min_price_cents", activeFilter.minPrice);
  if (activeFilter?.maxPrice !== undefined) q = q.lte("min_price_cents", activeFilter.maxPrice);

  const { data, count, error } = await q.order("name", { ascending: true }).range(from, to);

  if (error) return err("Failed to fetch products", 500);

  const totalProducts = count ?? 0;
  const totalPages = Math.ceil(totalProducts / size);

  type RawAttr = { name: string; option: string; slug: string; value?: string };

  const products = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    minPriceCents: p.min_price_cents,
    maxPriceCents: p.max_price_cents,
    salePriceCents: p.sale_price_cents,
    featured: p.featured,
    sale: p.sale,
    images: p.product_images.map((img: { src: string; name: string }) => ({ src: img.src, name: img.name })),
    variations: (() => {
      const seen = new Set<string>();
      return (p.variations ?? []).reduce((acc: { id: string; attribute: { name: string; option: string; slug: string; value?: string }[]; imageSrc: string | null }[], v: { id: string; attribute: RawAttr[]; variation_images: { src: string; name: string; sort_order: number }[] }) => {
        const color = v.attribute.find((a) => a.name === "color");
        if (!color || seen.has(color.slug)) return acc;
        seen.add(color.slug);
        acc.push({
          id: v.id,
          attribute: [{ name: color.name, option: color.option, slug: color.slug, ...(color.value !== undefined ? { value: color.value } : {}) }],
          imageSrc: v.variation_images[0]?.src ?? null,
        });
        return acc;
      }, []);
    })(),
  }));

  return ok({ products, page, size, totalPages, totalProducts, hasNextPage: page < totalPages, hasPreviousPage: page > 1 }, 200);
}
