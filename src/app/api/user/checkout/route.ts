import { NextRequest } from "next/server";
import crypto from "crypto";
import { createUserClient } from "@/lib/supabase/user";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { ok, err } from "@/lib/api";

type CartItem = {
  productSlug: string;
  sku: string;
  imageSrc: string;
  quantity: number;
  attribute: { name: string; option: string }[];
};

type PriceEntry = { price: number; name: string };

function hashCart(items: CartItem[], priceMap: Map<string, PriceEntry>) {
  const sorted = [...items]
    .sort((a, b) => a.sku.localeCompare(b.sku))
    .map((i) => {
      const entry = priceMap.get(`${i.productSlug}:${i.sku}`)!;
      return { ...i, name: entry.name, priceCents: entry.price };
    });
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
    .select("slug, name, sku, sale, min_price_cents, sale_price_cents, variations(sku, sale, regular_price_cents, sale_price_cents)")
    .eq("brand_slug", brandSlug)
    .in("slug", slugs);

  const priceMap = new Map<string, PriceEntry>();
  for (const p of productRows ?? []) {
    if (p.sku) priceMap.set(`${p.slug}:${p.sku}`, { price: p.sale ? p.sale_price_cents : p.min_price_cents, name: p.name });
    for (const v of p.variations ?? []) priceMap.set(`${p.slug}:${v.sku}`, { price: v.sale ? v.sale_price_cents : v.regular_price_cents, name: p.name });
  }

  const validation = (items as CartItem[]).map((item) => ({
    productSlug: item.productSlug,
    sku: item.sku,
    exists: priceMap.has(`${item.productSlug}:${item.sku}`),
    priceCents: priceMap.get(`${item.productSlug}:${item.sku}`)?.price ?? null,
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
      line_items: (items as CartItem[]).map((item) => {
        const entry = priceMap.get(`${item.productSlug}:${item.sku}`)!;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${entry.name} — ${item.attribute.map((a) => a.option).join(" / ")}`,
              description: item.sku,
              images: [item.imageSrc],
            },
            unit_amount: entry.price,
          },
          quantity: item.quantity,
        };
      }),
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: successUrl,
      cancel_url: cancelUrl,
    },
    { idempotencyKey }
  );

  return ok(session.url, 200);
}
