import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.brandSlug) return err("brandSlug is required");

  const {
    brandSlug,
    categorySlug,
    search = "",
    saleOnly = false,
    inStockOnly = false,
    sort = "featured",
  } = body;

  const page = Math.max(1, Number(body.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(body.limit) || 24));

  const supabase = createAdminClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", brandSlug)
    .single();

  if (!brand) return err("Brand not found", 404);

  // Resolve category filter to a list of product IDs
  let productIdFilter: string[] | null = null;
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .eq("brand_id", brand.id)
      .single();

    if (!category) return err("Category not found", 404);

    const { data: productCats } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", category.id);

    productIdFilter = productCats?.map((r) => r.product_id) ?? [];

    if (productIdFilter.length === 0) {
      return ok({ products: [], page, totalPages: 0, totalProducts: 0 });
    }
  }

  let query = supabase
    .from("products")
    .select("id, name, slug, min_price_cents, max_price_cents, sale, stock", {
      count: "exact",
    })
    .eq("brand_id", brand.id);

  if (productIdFilter !== null) query = query.in("id", productIdFilter);
  if (search) query = query.ilike("name", `%${search}%`);
  if (saleOnly) query = query.eq("sale", true);
  if (inStockOnly) query = query.gt("stock", 0);

  if (sort === "price_asc")
    query = query.order("min_price_cents", { ascending: true });
  else if (sort === "price_desc")
    query = query.order("min_price_cents", { ascending: false });
  else query = query.order("name", { ascending: true });

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data: products, count, error } = await query;
  if (error) return err("Failed to fetch products");

  // Batch-fetch one thumbnail per product
  const ids = products?.map((p) => p.id) ?? [];
  const { data: images } =
    ids.length > 0
      ? await supabase
          .from("product_images")
          .select("product_id, src")
          .in("product_id", ids)
          .order("sort_order", { ascending: true })
      : { data: [] };

  const thumbnailMap: Record<string, string> = {};
  for (const img of images ?? []) {
    if (!thumbnailMap[img.product_id]) thumbnailMap[img.product_id] = img.src;
  }

  const totalProducts = count ?? 0;

  return ok({
    products: (products ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      priceMin: p.min_price_cents,
      priceMax: p.max_price_cents,
      sale: p.sale,
      stock: p.stock,
      thumbnail: thumbnailMap[p.id] ?? null,
    })),
    page,
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts,
  });
}
