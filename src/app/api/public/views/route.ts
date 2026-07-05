import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const brandSlug = body.brandSlug;
  if (!brandSlug) return err("brandSlug is required", 400);

  const target: Record<string, string> = {};
  if (body.categoryId) target.categoryId = body.categoryId;
  if (body.productSlug) target.productSlug = body.productSlug;

  const key = Object.keys(target);
  if (key.length === 0) return err("categoryId or productSlug is required", 400);
  if (key.length > 1) return err("only one of categoryId or productSlug may be provided", 400);

  const supabase = createAdminClient();

  switch (key[0]) {
    case "categoryId": {
      const { error } = await supabase.rpc("increment_category_view", {
        p_id: target.categoryId,
        p_brand_slug: brandSlug,
      });

      if (error) return err("Failed to track view", 500);

      return ok(target);
    }

    case "productSlug": {
      const { error } = await supabase.rpc("increment_product_view", {
        p_slug: target.productSlug,
        p_brand_slug: brandSlug,
      });

      if (error) return err("Failed to track view", 500);
      
      return ok(target);
    }
  }
}
