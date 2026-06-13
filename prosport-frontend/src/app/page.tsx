import { Suspense } from "react";
import { BRAND_SLUG, getCategories, getProducts } from "@/lib/api";
import { CategoryNode } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

function firstLeaf(nodes: CategoryNode[]): CategoryNode | null {
  for (const node of nodes) {
    if (!node.children?.length) return node;
    const leaf = firstLeaf(node.children);
    if (leaf) return leaf;
  }
  return null;
}

async function ProductSection() {
  const tree = await getCategories(BRAND_SLUG);
  const leaf = firstLeaf(tree);
  if (!leaf) return null;
  const data = await getProducts({ brandSlug: BRAND_SLUG, categoryId: leaf.id });
  return <ProductGrid products={data.products} />;
}

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">proSPORT Sunglasses</h1>
      <p className="text-muted-foreground mb-8">Shop all products</p>
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductSection />
      </Suspense>
    </div>
  );
}
