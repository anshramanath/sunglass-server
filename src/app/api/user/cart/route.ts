import { NextRequest } from "next/server";
import { createUserClient } from "@/lib/supabase/user";
import { ok, err } from "@/lib/api";

export async function GET(req: NextRequest) {
  const brandSlug = req.nextUrl.searchParams.get("brandSlug");
  if (!brandSlug) return err("brandSlug is required", 400);

  const client = await createUserClient(req);
  if (!client) return err("Unauthorized", 401);
  const { supabase } = client;

  const { data, error } = await supabase
    .from("cart_items")
    .select("product_slug, attribute, name, image_src, price_cents, quantity")
    .eq("brand_slug", brandSlug);

  if (error) return err("Failed to fetch cart", 500);

  const items = (data ?? []).map((row: { product_slug: string; attribute: { name: string; option: string }[]; name: string; image_src: string; price_cents: number; quantity: number }) => ({
    productSlug: row.product_slug,
    attribute: row.attribute ?? [],
    name: row.name,
    imageSrc: row.image_src,
    priceCents: row.price_cents,
    quantity: row.quantity,
  }));

  return ok({ items }, 200);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { brandSlug, items } = body;
  if (!brandSlug) return err("brandSlug is required", 400);
  if (!Array.isArray(items)) return err("items must be an array", 400);

  const client = await createUserClient(req);
  if (!client) return err("Unauthorized", 401);
  const { supabase, userId } = client;

  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("brand_slug", brandSlug);

  if (deleteError) return err("Failed to sync cart", 500);

  if (items.length > 0) {
    const rows = items.map((item: {
      productSlug: string;
      attribute: { name: string; option: string }[];
      name: string;
      imageSrc: string;
      priceCents: number;
      quantity: number;
    }) => ({
      user_id: userId,
      brand_slug: brandSlug,
      product_slug: item.productSlug,
      attribute: item.attribute,
      name: item.name,
      image_src: item.imageSrc,
      price_cents: item.priceCents,
      quantity: item.quantity,
      updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase.from("cart_items").insert(rows);
    if (insertError) return err("Failed to sync cart", 500);
  }

  return ok({ synced: items.length }, 200);
}
