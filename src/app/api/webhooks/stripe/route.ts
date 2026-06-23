import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: session.client_reference_id,
      brand_slug: brandSlug,
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      status: "paid",
      total_cents: session.amount_total!,
      shipping_address: {
        name: session.collected_information!.shipping_details!.name,
        line1: session.collected_information!.shipping_details!.address!.line1,
        line2: session.collected_information!.shipping_details!.address!.line2,
        city: session.collected_information!.shipping_details!.address!.city,
        state: session.collected_information!.shipping_details!.address!.state,
        postalCode: session.collected_information!.shipping_details!.address!.postal_code,
        country: session.collected_information!.shipping_details!.address!.country,
      },
    })
    .select("id")
    .single();

  if (orderError || !order) return new Response("Failed to create order", { status: 500 });

  const orderItems = lineItems.data.map((item) => {
    const product = (item as any).price.product;
    const [name, attribute] = product.name.split(" — ");
    return {
      order_id: order.id,
      product_slug: slugify(name),
      sku: product.description,
      name,
      image_src: product.images[0],
      price_cents: item.price!.unit_amount!,
      quantity: item.quantity!,
      attribute: attribute ?? [],
    };
  });

  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return new Response("Failed to create order items", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
