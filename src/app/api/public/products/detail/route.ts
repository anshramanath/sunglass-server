import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.brandSlug || !body?.productSlug)
    return err("brandSlug and productSlug are required");

  const supabase = createAdminClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", body.brandSlug)
    .single();

  if (!brand) return err("Brand not found", 404);

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", body.productSlug)
    .eq("brand_id", brand.id)
    .single();

  if (error || !product) return err("Product not found", 404);

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

  const categories = productCats?.map((r) => r.categories).filter(Boolean) ?? [];

  return ok({
    product,
    variations: variations ?? [],
    categories,
    productImages: productImages ?? [],
    descriptionImages: descriptionImages ?? [],
  });
}
