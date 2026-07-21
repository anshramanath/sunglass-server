import { getProducts, getCategoryOptions } from "@/lib/admin/products";
import { getBrandBySlug } from "@/lib/brand";
import ProductsList from "./products-list";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ brandSlug: string }>;
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { brandSlug } = await params;
  const { search = "", category = "" } = await searchParams;

  const brand = getBrandBySlug(brandSlug);
  const brandName = brand?.name ?? brandSlug;
  const accent = brand?.accent ?? "#000000";

  const [{ products, hasMore }, categories] = await Promise.all([
    getProducts(brandSlug, { search: search || undefined, categoryId: category || undefined }),
    getCategoryOptions(brandSlug),
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#737373", marginBottom: 6 }}>
          {brandName}
        </div>
        <div style={{ fontSize: 34, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          Products
        </div>
      </div>

      <ProductsList
        key={`${brandSlug}-${search}-${category}`}
        accent={accent}
        initialProducts={products}
        initialHasMore={hasMore}
        categories={categories}
        initialSearch={search}
        categoryId={category}
      />
    </div>
  );
}
