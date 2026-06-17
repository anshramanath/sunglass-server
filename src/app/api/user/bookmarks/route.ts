import { NextRequest } from "next/server";
import { createUserClient } from "@/lib/supabase/user";
import { ok, err } from "@/lib/api";

export async function GET(req: NextRequest) {
  const brandSlug = req.nextUrl.searchParams.get("brandSlug");
  if (!brandSlug) return err("brandSlug is required", 400);

  const supabase = createUserClient(req);
  if (!supabase) return err("Unauthorized", 401);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const { data, error } = await supabase
    .from("bookmarks")
    .select("product_slug, attribute, name, image_src")
    .eq("brand_slug", brandSlug);

  if (error) return err("Failed to fetch bookmarks", 500);

  const items = (data ?? []).map((row: { product_slug: string; attribute: { name: string; option: string }[]; name: string; image_src: string }) => ({
    productSlug: row.product_slug,
    attribute: row.attribute ?? [],
    name: row.name,
    imageSrc: row.image_src,
  }));

  return ok({ items }, 200);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { brandSlug, items } = body;
  if (!brandSlug) return err("brandSlug is required", 400);
  if (!Array.isArray(items)) return err("items must be an array", 400);

  const supabase = createUserClient(req);
  if (!supabase) return err("Unauthorized", 401);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const { error: deleteError } = await supabase
    .from("bookmarks")
    .delete()
    .eq("brand_slug", brandSlug);

  if (deleteError) return err("Failed to sync bookmarks", 500);

  if (items.length > 0) {
    const rows = items.map((item: {
      productSlug: string;
      attribute: { name: string; option: string }[];
      name: string;
      imageSrc: string;
    }) => ({
      user_id: user.id,
      brand_slug: brandSlug,
      product_slug: item.productSlug,
      attribute: item.attribute,
      name: item.name,
      image_src: item.imageSrc,
    }));

    const { error: insertError } = await supabase.from("bookmarks").insert(rows);
    if (insertError) return err("Failed to sync bookmarks", 500);
  }

  return ok({ synced: items.length }, 200);
}
