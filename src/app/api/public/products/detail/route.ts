import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.brandSlug || !body?.productSlug)
    return err("brandSlug and productSlug are required");

  const supabase = createAdminClient();

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", body.brandSlug)
    .single();

  if (brandError || !brand) return err("Brand not found", 404);

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", body.productSlug)
    .eq("brand_id", brand.id)
    .single();

  if (productError || !product) return err("Product not found", 404);

  const [
    { data: variations },
    { data: productCats },
    { data: productImages },
    { data: descriptionImages },
  ] = await Promise.all([
    supabase.from("variations").select("*").eq("product_id", product.id),
    supabase
      .from("product_categories")
      .select("categories(id, name, slug, parent_id)")
      .eq("product_id", product.id),
    supabase
      .from("product_images")
      .select("id, src, name, sort_order")
      .eq("product_id", product.id)
      .order("sort_order"),
    supabase
      .from("description_images")
      .select("id, src, name, sort_order")
      .eq("product_id", product.id)
      .order("sort_order"),
  ]);

  // Fetch variation images and attach to each variation
  const variationIds = variations?.map((v) => v.id) ?? [];
  const { data: variationImages } =
    variationIds.length > 0
      ? await supabase
          .from("variation_images")
          .select("id, variation_id, src, name, sort_order")
          .in("variation_id", variationIds)
          .order("sort_order", { ascending: true })
      : { data: [] };

  type VariationImage = { id: string; variation_id: string; src: string; name: string; sort_order: number };
  const variationImageMap: Record<string, VariationImage[]> = {};
  for (const img of variationImages ?? []) {
    variationImageMap[img.variation_id] = variationImageMap[img.variation_id] ?? [];
    variationImageMap[img.variation_id]!.push(img);
  }

  const variationsWithImages = (variations ?? []).map((v) => ({
    ...v,
    images: variationImageMap[v.id] ?? [],
  }));

  const categories = productCats?.map((r) => r.categories).filter(Boolean) ?? [];

  return ok({
    product,
    variations: variationsWithImages,
    categories,
    productImages: productImages ?? [],
    descriptionImages: descriptionImages ?? [],
  });
}
