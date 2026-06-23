import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

type RawAttr = { name: string; option: string; slug: string; value?: string };
type RawAttrOption = { option: string; slug: string; value?: string };
type RawImage = { src: string; name: string; sort_order: number };

export async function GET(req: NextRequest) {
  const brandSlug = req.nextUrl.searchParams.get("brandSlug");
  if (!brandSlug) return err("Brand slug is required!", 400);

  const slug = req.nextUrl.searchParams.get("productSlug");
  if (!slug) return err("productSlug is required!", 400);

  const supabase = createAdminClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      name, slug, sku, description, summary, attributes, featured,
      sale, min_price_cents, max_price_cents, sale_price_cents,
      variations(sku, attribute, sale, regular_price_cents, sale_price_cents,
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

  const variations = (product.variations ?? []).map((v) => ({
    sku: v.sku,
    attribute: (v.attribute as RawAttr[]).map((a) => ({ name: a.name, slug: a.slug })),
    sale: v.sale,
    regularPriceCents: v.regular_price_cents,
    salePriceCents: v.sale_price_cents,
    images: (v.variation_images as RawImage[]).sort((a, b) => a.sort_order - b.sort_order).map((img) => ({ src: img.src, name: img.name, sortOrder: img.sort_order })),
  }));

  const productImages = (product.product_images as RawImage[]).sort((a, b) => a.sort_order - b.sort_order).map((img) => ({ src: img.src, name: img.name, sortOrder: img.sort_order }));

  const descriptionImages = (product.product_description_images ?? [])
    .flatMap((r) => r.description_images);

  const attributes = (product.attributes as { name: string; options: RawAttrOption[] }[]).map((attr) => ({
    name: attr.name,
    options: attr.options.map((opt) => ({
      option: opt.option,
      slug: opt.slug,
      ...(opt.value !== undefined ? { value: opt.value } : {}),
    })),
  }));

  const item = {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    summary: product.summary,
    attributes,
    featured: product.featured,
    sale: product.sale,
    minPriceCents: product.min_price_cents,
    maxPriceCents: product.max_price_cents,
    salePriceCents: product.sale_price_cents,
    variations,
    productImages,
    descriptionImages,
  };

  return ok(item, 200);
}
