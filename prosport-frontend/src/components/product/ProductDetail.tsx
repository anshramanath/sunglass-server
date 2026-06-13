"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductDetail as ProductDetailType } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageGallery from "./ImageGallery";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductDetail({ product }: { product: ProductDetailType }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    product.variations.length > 0 ? 0 : null
  );

  const variation = selectedIndex !== null ? product.variations[selectedIndex] : null;

  const images =
    variation && variation.images.length > 0 ? variation.images : product.productImages;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <ImageGallery images={images} />

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {product.sku && <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>}
        </div>

        {/* Price */}
        <div className="text-xl font-medium">
          {variation ? (
            variation.sale && variation.salePriceCents ? (
              <span>
                <span className="text-red-500">{formatPrice(variation.salePriceCents)}</span>{" "}
                <span className="line-through text-muted-foreground text-base">
                  {formatPrice(variation.regularPriceCents)}
                </span>
              </span>
            ) : (
              formatPrice(variation.regularPriceCents)
            )
          ) : product.salePriceCents ? (
            <span>
              <span className="text-red-500">{formatPrice(product.salePriceCents)}</span>{" "}
              <span className="line-through text-muted-foreground text-base">
                {formatPrice(product.minPriceCents)}
              </span>
            </span>
          ) : product.minPriceCents === product.maxPriceCents ? (
            formatPrice(product.minPriceCents)
          ) : (
            `${formatPrice(product.minPriceCents)} – ${formatPrice(product.maxPriceCents)}`
          )}
        </div>

        <Separator />

        {/* Variations */}
        {product.variations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Options</p>
            <div className="flex flex-wrap gap-2">
              {product.variations.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedIndex(i)}
                  className={`border rounded px-3 py-1.5 text-sm transition-colors ${
                    i === selectedIndex
                      ? "border-foreground bg-foreground text-background"
                      : "hover:border-foreground"
                  }`}
                >
                  {v.attribute.map((a: { option: string }) => a.option).join(", ")}
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Summary */}
        {product.summary.length > 0 && (
          <ul className="space-y-1 text-sm">
            {product.summary.map((point, i) => (
              <li key={i} className="flex gap-2">
                <span>•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        <Tabs defaultValue="description" className="mt-2">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            {product.descriptionImages.length > 0 && (
              <TabsTrigger value="media">Media</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="description" className="text-sm text-muted-foreground leading-relaxed mt-3">
            {product.description}
          </TabsContent>
          {product.descriptionImages.length > 0 && (
            <TabsContent value="media" className="grid grid-cols-2 gap-3 mt-3">
              {product.descriptionImages.map((img, i) => (
                <div key={i} className="aspect-video relative bg-muted rounded overflow-hidden">
                  <Image src={img.src} alt={img.name} fill className="object-contain" sizes="300px" />
                </div>
              ))}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
