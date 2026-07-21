import type { CategoryNode, LeafEntry } from "@/lib/types";

function collectLeavesHelper(nodes: CategoryNode[], slugPath: string[], namePath: string[], result: Record<string, LeafEntry>): void {
  for (const node of nodes) {
    const currentSlugPath = [...slugPath, node.slug];
    const currentNamePath = [...namePath, node.name];
    if (!node.children?.length) {
      const path = currentSlugPath.join("/");
      result[path] = { id: node.id, name: node.name, path, breadcrumbs: currentNamePath };
    } else {
      collectLeavesHelper(node.children, currentSlugPath, currentNamePath, result);
    }
  }
}

export function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function collectLeaves(tree: CategoryNode[]): Record<string, LeafEntry> {
  const result: Record<string, LeafEntry> = {};
  collectLeavesHelper(tree, [], [], result);
  return result;
}
