import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return new Response("Missing signature", { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("OK", { status: 200 });
  }

  const session = event.data.object;
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existing) return new Response("OK", { status: 200 });

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

  const skus = lineItems.data.map((item) => {
    const desc = item.description ?? "";
    const start = desc.lastIndexOf("(");
    return start !== -1 ? desc.slice(start + 1, -1) : null;
  }).filter(Boolean) as string[];

  const { data: variations } = await supabase
    .from("variations")
    .select("sku, attribute, products!inner(slug, product_images(src, sort_order))")
    .in("sku", skus);

  const variationMap = new Map((variations ?? []).map((v) => [v.sku, v]));

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: session.client_reference_id,
      brand_slug: session.metadata?.brandSlug,
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      status: "paid",
      total_cents: session.amount_total,
    })
    .select("id")
    .single();

  if (orderError || !order) return new Response("Failed to create order", { status: 500 });

  const orderItems = lineItems.data.map((item) => {
    const match = item.description?.match(/\(([^)]+)\)$/);
    const sku = match ? match[1] : "";
    const variation = variationMap.get(sku);
    const product = variation?.products as any;
    const image = (product?.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0];

    return {
      order_id: order.id,
      product_slug: product?.slug ?? "",
      sku,
      name: item.description?.slice(0, item.description.lastIndexOf(" (")) ?? "",
      image_src: image?.src ?? "",
      price_cents: item.price?.unit_amount ?? 0,
      quantity: item.quantity ?? 1,
      attribute: variation?.attribute ?? [],
    };
  });

  await supabase.from("order_items").insert(orderItems);

  return new Response("OK", { status: 200 });
}
