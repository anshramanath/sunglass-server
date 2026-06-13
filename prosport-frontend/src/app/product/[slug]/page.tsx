import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BRAND_SLUG, getItem } from "@/lib/api";
import ProductDetail from "@/components/product/ProductDetail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getItem(slug, BRAND_SLUG).catch(() => null);
  return { title: product ? `${product.name} | proSPORT` : "Product | proSPORT" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getItem(slug, BRAND_SLUG).catch(() => null);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
