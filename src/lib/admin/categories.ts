import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import type { FlatCategory } from "@/lib/types";

export async function getCategories(brandSlug: string): Promise<FlatCategory[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id, name, slug, sort_order, parent_id, view_count,
      product_categories(product_id)
    `)
    .eq("brand_slug", brandSlug)
    .order("sort_order");

  if (error) throw new Error("Failed to fetch categories");

  const nodeMap: Record<string, string[]> = {};
  for (const c of data) nodeMap[c.id] = [];
  for (const c of data) {
    if (c.parent_id) nodeMap[c.parent_id].push(c.id);
  }

  const rowMap: Record<string, typeof data[0]> = {};
  for (const c of data) rowMap[c.id] = c;

  const flat: FlatCategory[] = [];

  function visit(id: string, depth: number, ancestorIds: string[]) {
    const c = rowMap[id];
    const childIds = nodeMap[id];
    flat.push({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sortOrder: c.sort_order,
      viewCount: c.view_count,
      productCount: (c.product_categories as { product_id: string }[]).length,
      depth,
      hasChildren: childIds.length > 0,
      isLeaf: childIds.length === 0,
      ancestorIds,
    });
    for (const childId of childIds) {
      visit(childId, depth + 1, [...ancestorIds, id]);
    }
  }

  const roots = data.filter((c) => !c.parent_id);
  for (const root of roots) {
    visit(root.id, 0, []);
  }

  return flat;
}
