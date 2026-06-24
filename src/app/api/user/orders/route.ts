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
    .from("orders")
    .select("id, status, total_cents, shipping_address, created_at, order_items(id, product_slug, name, image_src, price_cents, quantity, attribute)")
    .eq("brand_slug", brandSlug)
    .order("created_at", { ascending: false });

  if (error) return err("Failed to fetch orders", 500);

  const orders = (data ?? []).map((order) => ({
    id: order.id,
    status: order.status,
    totalCents: order.total_cents,
    shippingAddress: order.shipping_address,
    createdAt: order.created_at,
    items: (order.order_items ?? []).map((item) => ({
      id: item.id,
      productSlug: item.product_slug,
      name: item.name,
      imageSrc: item.image_src,
      priceCents: item.price_cents,
      quantity: item.quantity,
      attribute: item.attribute,
    })),
  }));

  return ok(orders, 200);
}
