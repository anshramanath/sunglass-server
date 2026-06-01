import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  children?: CategoryNode[];
};

function rollupProductCounts(node: CategoryNode): number {
  const childTotal =
    node.children?.reduce((sum, child) => sum + rollupProductCounts(child), 0) ?? 0;
  node.productCount += childTotal;
  return node.productCount;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.brandSlug) return err("brandSlug is required");

  const supabase = createAdminClient();

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", body.brandSlug)
    .single();

  if (brandError || !brand) return err("Brand not found", 404);

  const [{ data: categories }, { data: brandProducts }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, parent_id, name, slug")
      .eq("brand_id", brand.id),
    supabase.from("products").select("id").eq("brand_id", brand.id),
  ]);

  const productIds = brandProducts?.map((p) => p.id) ?? [];

  const { data: productCats } =
    productIds.length > 0
      ? await supabase
          .from("product_categories")
          .select("category_id")
          .in("product_id", productIds)
      : { data: [] };

  const countMap: Record<string, number> = {};
  for (const row of productCats ?? []) {
    countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1;
  }

  const nodeMap: Record<string, CategoryNode> = {};
  for (const cat of categories ?? []) {
    nodeMap[cat.id] = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productCount: countMap[cat.id] ?? 0,
    };
  }

  const roots: CategoryNode[] = [];
  for (const cat of categories ?? []) {
    const node = nodeMap[cat.id];
    if (cat.parent_id && nodeMap[cat.parent_id]) {
      const parent = nodeMap[cat.parent_id];
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  for (const root of roots) {
    rollupProductCounts(root);
  }

  return ok(roots);
}
