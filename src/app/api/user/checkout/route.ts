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
  quantity: number;
  attribute: { name: string; option: string }[];
};

function hashCart(items: CartItem[], priceMap: Map<string, number>) {
  const sorted = [...items]
    .sort((a, b) => a.sku.localeCompare(b.sku))
    .map((i) => ({ ...i, priceCents: priceMap.get(`${i.productSlug}:${i.sku}`) }));
  return crypto.createHash("sha256").update(JSON.stringify(sorted)).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const brandSlug = body.brandSlug;
  if (!brandSlug) return err("brandSlug is required", 400);

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) return err("items must be a non-empty array", 400);

  const { successUrl, cancelUrl } = body;
  if (!successUrl || !cancelUrl) return err("successUrl and cancelUrl are required", 400);

  const slugs = (items as CartItem[]).map((i) => i.productSlug);

  const adminSupabase = createAdminClient();

  const { data: productRows } = await adminSupabase
    .from("products")
    .select("slug, sku, sale, min_price_cents, sale_price_cents, variations(sku, sale, regular_price_cents, sale_price_cents)")
    .eq("brand_slug", brandSlug)
    .in("slug", slugs);

  const priceMap = new Map<string, number>();
  for (const p of productRows ?? []) {
    if (p.sku) priceMap.set(`${p.slug}:${p.sku}`, p.sale ? p.sale_price_cents : p.min_price_cents);
    for (const v of p.variations ?? []) priceMap.set(`${p.slug}:${v.sku}`, v.sale ? v.sale_price_cents : v.regular_price_cents);
  }

  const validation = (items as CartItem[]).map((item) => ({
    productSlug: item.productSlug,
    sku: item.sku,
    exists: priceMap.has(`${item.productSlug}:${item.sku}`),
    priceCents: priceMap.get(`${item.productSlug}:${item.sku}`) ?? null,
  }));

  if (validation.some((v) => !v.exists)) {
    return ok(validation, 409);
  }

  const client = await createUserClient(req);
  if (!client) return err("Unauthorized", 401);

  const { supabase: userSupabase, user } = client;

  const { count } = await userSupabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const orderCount = count ?? 0;
  const idempotencyKey = `${user.id}:${hashCart(items, priceMap)}:${orderCount}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: { brandSlug },
      line_items: (items as CartItem[]).map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} — ${item.attribute.map((a) => a.option).join(" / ")}`,
            description: item.sku,
            images: [item.imageSrc],
          },
          unit_amount: priceMap.get(`${item.productSlug}:${item.sku}`)!,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: successUrl,
      cancel_url: cancelUrl,
    },
    { idempotencyKey }
  );

  return ok(session.url, 200);
}
