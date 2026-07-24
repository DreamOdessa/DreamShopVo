"use client";

import {
  removeProductImage,
  saveProductImage,
  type ProductImageSlot,
} from "./media-actions";
import { MediaSlotEditor } from "./media-slot-editor";

type ProductImage = {
  altText: string;
  slot: ProductImageSlot;
  url: string;
};

type ProductImageManagerProps = {
  apiUrl: string;
  images: ProductImage[];
  productId: string;
  productName: string;
};

const PRODUCT_SLOTS: Array<{
  label: string;
  slot: ProductImageSlot;
}> = [
  { label: "Головне фото", slot: 0 },
  { label: "Додаткове фото 1", slot: 1 },
  { label: "Додаткове фото 2", slot: 2 },
];

export function ProductImageManager({
  apiUrl,
  images,
  productId,
  productName,
}: ProductImageManagerProps) {
  return (
    <div className="admin-media-slots">
      {PRODUCT_SLOTS.map(({ label, slot }) => {
        const currentImage = images.find((image) => image.slot === slot) ?? null;

        return (
          <MediaSlotEditor
            apiUrl={apiUrl}
            currentImage={currentImage}
            entityName={productName}
            key={slot}
            label={label}
            onRegister={(image) =>
              saveProductImage({
                ...image,
                productId,
                slot,
              })
            }
            onRemove={() => removeProductImage(productId, slot)}
            scope="products"
          />
        );
      })}
    </div>
  );
}
