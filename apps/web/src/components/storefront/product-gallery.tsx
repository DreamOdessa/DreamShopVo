"use client";

import { PackageOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  altText: string;
  url: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        {selectedImage ? (
          <Image
            alt={selectedImage.altText || productName}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 52vw"
            src={selectedImage.url}
          />
        ) : (
          <div className="catalog-image-fallback">
            <PackageOpen aria-hidden size={42} strokeWidth={1.3} />
            <span>Фото готується</span>
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="product-gallery-thumbnails" aria-label="Фотографії товару">
          {images.map((image, index) => (
            <button
              aria-label={`Показати фото ${index + 1}`}
              aria-pressed={selectedIndex === index}
              key={image.url}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <Image
                alt=""
                fill
                sizes="72px"
                src={image.url}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
