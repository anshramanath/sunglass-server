import { NextRequest } from "next/server";
import { createUserClient } from "@/lib/supabase/user";
import { ok, err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  const brandSlug = body.brandSlug;
  if (!brandSlug) return err("brandSlug is required", 400);

  const client = await createUserClient(req);
  if (!client) return err("Unauthorized", 401);
  const { supabase } = client;

  const { data, error } = await supabase
    .from("bookmarks")
    .select("product_id, product_slug, name, image_src")
    .eq("brand_slug", brandSlug);

  if (error) return err("Failed to fetch bookmarks", 500);

  const items = (data ?? []).map((row) => ({
    productId: row.product_id,
    productSlug: row.product_slug,
    name: row.name,
    imageSrc: row.image_src,
  }));

  return ok(items);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const brandSlug = body.brandSlug;
  if (!brandSlug) return err("brandSlug is required", 400);

  const items = body.items;
  if (!Array.isArray(items)) return err("items must be an array", 400);

  const client = await createUserClient(req);
  if (!client) return err("Unauthorized", 401);
  const { supabase, user } = client;

  const { error: deleteError } = await supabase
    .from("bookmarks")
    .delete()
    .eq("brand_slug", brandSlug);

  if (deleteError) return err("Failed to sync bookmarks", 500);

  if (items.length > 0) {
    const rows = items.map((item: {
      productId: string;
      productSlug: string;
      name: string;
      imageSrc: string;
    }) => ({
      user_id: user.id,
      brand_slug: brandSlug,
      product_id: item.productId,
      product_slug: item.productSlug,
      name: item.name,
      image_src: item.imageSrc,
    }));

    const { error: insertError } = await supabase.from("bookmarks").insert(rows);
    if (insertError) return err("Failed to sync bookmarks", 500);
  }

  const result = { synced: items.length };
  return ok(result);
}
