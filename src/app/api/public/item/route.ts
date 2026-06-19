import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const brandSlug = req.nextUrl.searchParams.get("brandSlug");
  if (!slug) return err("Product slug is required!", 400);
  if (!brandSlug) return err("Brand slug is required!", 400);

  const supabase = createAdminClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id, name, sku, description, summary, attributes, featured,
      sale, min_price_cents, max_price_cents, sale_price_cents,
      variations(id, sku, attribute, sale, regular_price_cents, sale_price_cents,
        variation_images(src, name, sort_order)
      ),
      product_images(src, name, sort_order),
      product_description_images(
        description_images(src, name)
      )
    `)
    .eq("slug", slug)
    .eq("brand_slug", brandSlug)
    .single();

  if (error || !product) return err("Product not found!", 404);

  type RawAttr = { name: string; option: string; slug: string; value?: string };

  const variations = (product.variations ?? []).map((v) => ({
    id: v.id,
    sku: v.sku,
    attribute: (v.attribute as RawAttr[]).map((a) => ({
      name: a.name,
      option: a.option,
      slug: a.slug,
      ...(a.value !== undefined ? { value: a.value } : {}),
    })),
    sale: v.sale,
    regularPriceCents: v.regular_price_cents,
    salePriceCents: v.sale_price_cents,
    images: (v.variation_images ?? []).map((img) => ({ src: img.src, name: img.name, sortOrder: img.sort_order })),
  }));

  const productImages = (product.product_images ?? []).map((img) => ({ src: img.src, name: img.name, sortOrder: img.sort_order }));

  const descriptionImages = (product.product_description_images ?? [])
    .flatMap((r) => r.description_images);

  return ok({
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    summary: product.summary,
    attributes: (product.attributes as { name: string; options: { option: string; slug: string; value?: string }[] }[]).map((attr) => ({
      name: attr.name,
      options: attr.options.map((opt) => ({
        option: opt.option,
        slug: opt.slug,
        ...(opt.value !== undefined ? { value: opt.value } : {}),
      })),
    })),
    featured: product.featured,
    sale: product.sale,
    minPriceCents: product.min_price_cents,
    maxPriceCents: product.max_price_cents,
    salePriceCents: product.sale_price_cents,
    variations,
    productImages,
    descriptionImages,
  }, 200);
}
