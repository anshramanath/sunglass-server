import { NextRequest } from "next/server";
import crypto from "crypto";
import { createUserClient } from "@/lib/supabase/user";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { ok, err } from "@/lib/api";

type CartItem = {
  productSlug: string;
  sku: string;
  name: string;
  imageSrc: string;
  priceCents: number;
  quantity: number;
  attribute: { name: string; option: string }[];
};

function hashCart(items: CartItem[]) {
  const sorted = [...items].sort((a, b) => a.sku.localeCompare(b.sku));
  return crypto.createHash("sha256").update(JSON.stringify(sorted)).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { brandSlug, items, successUrl, cancelUrl } = body;

  if (!brandSlug) return err("brandSlug is required", 400);
  if (!Array.isArray(items) || items.length === 0) return err("items must be a non-empty array", 400);
  if (!successUrl || !cancelUrl) return err("successUrl and cancelUrl are required", 400);

  const client = await createUserClient(req);
  if (!client) return err("Unauthorized", 401);
  const { user } = client;
  const userId = user.id;
  const email = user.email;

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const orderCount = count ?? 0;
  const idempotencyKey = `${userId}:${hashCart(items)}:${orderCount}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: userId,
      customer_email: email,
      metadata: { brandSlug },
      line_items: (items as CartItem[]).map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} (${item.sku})`,
            images: item.imageSrc ? [item.imageSrc] : [],
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: successUrl,
      cancel_url: cancelUrl,
    },
    { idempotencyKey }
  );

  return ok({ url: session.url }, 200);
}
