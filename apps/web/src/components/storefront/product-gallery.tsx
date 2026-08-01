"use client";

import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";
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
  const hasMultipleImages = images.length > 1;

  const selectPrevious = () => {
    setSelectedIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const selectNext = () => {
    setSelectedIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="product-gallery">
      <div
        className="product-gallery-main"
        onKeyDown={(event) => {
          if (!hasMultipleImages) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            selectPrevious();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            selectNext();
          }
        }}
        tabIndex={hasMultipleImages ? 0 : undefined}
      >
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
        {hasMultipleImages ? (
          <>
            <button
              aria-label="Попереднє фото"
              className="product-gallery-arrow product-gallery-arrow-previous"
              onClick={selectPrevious}
              type="button"
            >
              <ChevronLeft aria-hidden size={21} />
            </button>
            <button
              aria-label="Наступне фото"
              className="product-gallery-arrow product-gallery-arrow-next"
              onClick={selectNext}
              type="button"
            >
              <ChevronRight aria-hidden size={21} />
            </button>
            <span className="product-gallery-count" aria-live="polite">
              {selectedIndex + 1} / {images.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
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
