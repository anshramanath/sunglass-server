"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImage = { src: string; name: string };

export default function ImageGallery({ images }: { images: ProductImage[] }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
        <Image
          src={images[selected].src}
          alt={images[selected].name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`aspect-square relative bg-muted rounded overflow-hidden border-2 transition-colors ${
              i === selected ? "border-foreground" : "border-transparent"
            }`}
          >
            <Image src={img.src} alt={img.name} fill className="object-cover" sizes="100px" />
          </button>
        ))}
      </div>
    </div>
  );
}
