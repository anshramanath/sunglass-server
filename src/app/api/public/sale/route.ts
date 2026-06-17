import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

const FILTER_MAP: Record<string, { minPrice?: number; maxPrice?: number }> = {
  "under-15": { maxPrice: 1500 },
  "15-25":    { minPrice: 1500, maxPrice: 2500 },
  "25-plus":  { minPrice: 2500 },
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const brandSlug = params.get("brandSlug");
  const filterSlug = params.get("filter") ?? undefined;
  const activeFilter = filterSlug ? FILTER_MAP[filterSlug] : undefined;

  if (!brandSlug) return err("brandSlug is required", 400);

  const page = Math.max(1, Number(params.get("page")) || 1);
  const size = Math.min(100, Math.max(1, Number(params.get("size")) || 20));

  const supabase = createAdminClient();

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", brandSlug)
    .single();

  if (brandError || !brand) return err("Brand not found", 404);

  const from = (page - 1) * size;
  const to = from + size - 1;

  let q = supabase
    .from("products")
    .select("id, name, slug, attributes, featured, sale, min_price_cents, max_price_cents, sale_price_cents, product_images!inner(src, name)", { count: "exact" })
    .eq("brand_id", brand.id)
    .eq("sale", true)
    .eq("in_stock", true);

  if (activeFilter?.minPrice !== undefined) q = q.gte("min_price_cents", activeFilter.minPrice);
  if (activeFilter?.maxPrice !== undefined) q = q.lte("min_price_cents", activeFilter.maxPrice);

  const { data, count, error } = await q.order("name", { ascending: true }).range(from, to);

  if (error) return err("Failed to fetch sale products", 500);

  const totalProducts = count ?? 0;
  const totalPages = Math.ceil(totalProducts / size);

  const products = (data ?? []).map((p) => ({
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

  return ok({ products, page, size, totalPages, totalProducts, hasNextPage: page < totalPages, hasPreviousPage: page > 1 }, 200);
}
