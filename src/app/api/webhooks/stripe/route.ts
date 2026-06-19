import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

type SkuEntry =
  | { type: "variation"; variationId: string; productSlug: string; attribute: { name: string; option: string }[] }
  | { type: "simple"; productId: string; productSlug: string };

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
  const brandSlug = session.metadata?.brandSlug;
  if (!brandSlug) return new Response("Missing brandSlug in session metadata", { status: 400 });

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existing) return new Response("OK", { status: 200 });

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ["data.price.product"] });

  const skus = lineItems.data.map((item) => {
    const desc = item.description ?? "";
    const start = desc.lastIndexOf("(");
    return start !== -1 ? desc.slice(start + 1, -1) : null;
  }).filter(Boolean) as string[];

  const skuMap = new Map<string, SkuEntry>();

  if (skus.length > 0) {
    const [{ data: variationRows }, { data: simpleProductRows }] = await Promise.all([
      supabase
        .from("variations")
        .select("id, sku, attribute, products!inner(id, slug, name)")
        .eq("products.brand_slug", brandSlug)
        .in("sku", skus),
      supabase
        .from("products")
        .select("id, slug, sku, name")
        .eq("brand_slug", brandSlug)
        .not("sku", "is", null)
        .in("sku", skus),
    ]);

    for (const row of simpleProductRows ?? []) {
      skuMap.set(`${row.name}:${row.sku}`, {
        type: "simple",
        productId: row.id,
        productSlug: row.slug,
      });
    }

    for (const row of variationRows ?? []) {
      const product = row.products as unknown as { id: string; slug: string; name: string };
      skuMap.set(`${product.name}:${row.sku}`, {
        type: "variation",
        variationId: row.id,
        productSlug: product.slug,
        attribute: row.attribute,
      });
    }
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: session.client_reference_id,
      brand_slug: brandSlug,
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      status: "paid",
      total_cents: session.amount_total ?? 0,
      shipping_address: {
        name: session.collected_information?.shipping_details?.name ?? null,
        line1: session.collected_information?.shipping_details?.address?.line1 ?? null,
        line2: session.collected_information?.shipping_details?.address?.line2 ?? null,
        city: session.collected_information?.shipping_details?.address?.city ?? null,
        state: session.collected_information?.shipping_details?.address?.state ?? null,
        postalCode: session.collected_information?.shipping_details?.address?.postal_code ?? null,
        country: session.collected_information?.shipping_details?.address?.country ?? null,
      },
    })
    .select("id")
    .single();

  if (orderError || !order) return new Response("Failed to create order", { status: 500 });

  const orderItems: {
    order_id: string;
    product_slug: string;
    sku: string;
    name: string;
    image_src: string;
    price_cents: number;
    quantity: number;
    attribute: { name: string; option: string }[];
  }[] = [];

  for (const item of lineItems.data) {
    const desc = item.description ?? "";
    const start = desc.lastIndexOf("(");
    if (start === -1) continue;

    const sku = desc.slice(start + 1, -1);
    const name = desc.slice(0, start - 1);
    const entry = skuMap.get(`${name}:${sku}`);

    orderItems.push({
      order_id: order.id,
      product_slug: entry?.productSlug ?? "",
      sku,
      name,
      image_src: (item as any).price?.product?.images?.[0] ?? "",
      price_cents: item.price?.unit_amount ?? 0,
      quantity: item.quantity ?? 1,
      attribute: entry?.type === "variation" ? entry.attribute : [],
    });
  }

  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return new Response("Failed to create order items", { status: 500 });
    }
  }

  const productIncrements = new Map<string, number>();
  const variationIncrements = new Map<string, number>();

  for (const item of orderItems) {
    const entry = skuMap.get(`${item.name}:${item.sku}`);
    if (!entry) continue;

    if (entry.type === "variation") {
      variationIncrements.set(entry.variationId, (variationIncrements.get(entry.variationId) ?? 0) + item.quantity);
    } else {
      productIncrements.set(entry.productId, (productIncrements.get(entry.productId) ?? 0) + item.quantity);
    }
  }

  await Promise.all([
    ...[...productIncrements.entries()].map(([id, qty]) =>
      supabase.rpc("increment_product_total_sales", { p_product_id: id, p_qty: qty })
    ),
    ...[...variationIncrements.entries()].map(([id, qty]) =>
      supabase.rpc("increment_variation_total_sales", { p_variation_id: id, p_qty: qty })
    ),
  ]);

  return new Response("OK", { status: 200 });
}
