"use client";

import { MediaSlotEditor } from "./media-slot-editor";
import {
  removeCategoryCover,
  saveCategoryCover,
} from "./media-actions";

type CategoryImageManagerProps = {
  apiUrl: string;
  categoryId: string;
  categoryName: string;
  currentImage: {
    altText: string;
    url: string;
  } | null;
};

export function CategoryImageManager({
  apiUrl,
  categoryId,
  categoryName,
  currentImage,
}: CategoryImageManagerProps) {
  return (
    <div className="admin-media-slots admin-media-slots-single">
      <MediaSlotEditor
        apiUrl={apiUrl}
        currentImage={currentImage}
        entityName={categoryName}
        label="Обкладинка категорії"
        onRegister={(image) =>
          saveCategoryCover({
            ...image,
            categoryId,
          })
        }
        onRemove={() => removeCategoryCover(categoryId)}
        scope="categories"
      />
    </div>
  );
}
