import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.brandSlug || !body?.categorySlug)
    return err("brandSlug and categorySlug are required");

  const supabase = createAdminClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", body.brandSlug)
    .single();

  if (!brand) return err("Brand not found", 404);

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .eq("slug", body.categorySlug)
    .eq("brand_id", brand.id)
    .single();

  if (!category) return err("Category not found", 404);

  const [{ data: parent }, { data: children }, { data: productCats }] =
    await Promise.all([
      category.parent_id
        ? supabase
            .from("categories")
            .select("name, slug")
            .eq("id", category.parent_id)
            .single()
        : Promise.resolve({ data: null }),
      supabase
        .from("categories")
        .select("id, name, slug")
        .eq("parent_id", category.id),
      supabase
        .from("product_categories")
        .select("product_id")
        .eq("category_id", category.id),
    ]);

  return ok({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parent: parent ?? null,
    children: children ?? [],
    productCount: productCats?.length ?? 0,
  });
}
