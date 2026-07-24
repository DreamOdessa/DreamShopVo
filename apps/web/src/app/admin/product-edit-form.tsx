"use client";

import { LoaderCircle, Save, Trash2 } from "lucide-react";
import { useActionState } from "react";

import {
  initialAdminActionState,
  type AdminActionState,
} from "./action-state";
import { deleteProduct, updateProduct } from "./actions";

type ProductEditFormProps = {
  categories: Array<{
    id: string;
    name: string;
  }>;
  product: {
    categoryId: string;
    description: string;
    id: string;
    inStock: boolean;
    isActive: boolean;
    isPopular: boolean;
    name: string;
    organic: boolean;
    originalPrice: number | null;
    price: number;
    slug: string;
    sortOrder: number;
    weight: string | null;
  };
};

export function ProductEditForm({
  categories,
  product,
}: ProductEditFormProps) {
  const [updateState, updateAction, updatePending] = useActionState<
    AdminActionState,
    FormData
  >(updateProduct, initialAdminActionState);
  const [deleteState, deleteAction, deletePending] = useActionState<
    AdminActionState,
    FormData
  >(deleteProduct, initialAdminActionState);

  return (
    <div className="admin-edit-stack">
      <form action={updateAction} className="admin-form">
        <input name="productId" type="hidden" value={product.id} />

        <div className="admin-form-grid">
          <label className="auth-field">
            <span>Назва</span>
            <span className="auth-input-wrap">
              <input
                defaultValue={product.name}
                maxLength={160}
                minLength={2}
                name="name"
                required
                type="text"
              />
            </span>
          </label>

          <label className="auth-field">
            <span>Slug</span>
            <span className="auth-input-wrap">
              <input
                autoCapitalize="none"
                defaultValue={product.slug}
                maxLength={180}
                name="slug"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                required
                type="text"
              />
            </span>
          </label>

          <label className="auth-field admin-field-wide">
            <span>Категорія</span>
            <select
              defaultValue={product.categoryId}
              name="categoryId"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="auth-field">
            <span>Ціна, ₴</span>
            <span className="auth-input-wrap">
              <input
                defaultValue={product.price}
                inputMode="decimal"
                min={0}
                name="price"
                required
                step="0.01"
                type="number"
              />
            </span>
          </label>

          <label className="auth-field">
            <span>Стара ціна, ₴</span>
            <span className="auth-input-wrap">
              <input
                defaultValue={product.originalPrice ?? ""}
                inputMode="decimal"
                min={0}
                name="originalPrice"
                step="0.01"
                type="number"
              />
            </span>
          </label>

          <label className="auth-field">
            <span>Вага</span>
            <span className="auth-input-wrap">
              <input
                defaultValue={product.weight ?? ""}
                maxLength={100}
                name="weight"
                type="text"
              />
            </span>
          </label>

          <label className="auth-field">
            <span>Порядок</span>
            <span className="auth-input-wrap">
              <input
                defaultValue={product.sortOrder}
                max={10000}
                min={0}
                name="sortOrder"
                required
                type="number"
              />
            </span>
          </label>

          <label className="auth-field admin-field-wide">
            <span>Опис</span>
            <textarea
              defaultValue={product.description}
              maxLength={10000}
              name="description"
              rows={5}
            />
          </label>
        </div>

        <div className="admin-checks">
          <label>
            <input
              defaultChecked={product.isActive}
              name="isActive"
              type="checkbox"
            />
            Активний
          </label>
          <label>
            <input
              defaultChecked={product.inStock}
              name="inStock"
              type="checkbox"
            />
            В наявності
          </label>
          <label>
            <input
              defaultChecked={product.organic}
              name="organic"
              type="checkbox"
            />
            Organic
          </label>
          <label>
            <input
              defaultChecked={product.isPopular}
              name="isPopular"
              type="checkbox"
            />
            Популярний
          </label>
        </div>

        <div
          aria-live="polite"
          className={`auth-message auth-message-${updateState.status}`}
          role={updateState.status === "error" ? "alert" : "status"}
        >
          {updateState.message}
        </div>

        <button
          className="admin-submit-button"
          disabled={updatePending || deletePending}
          type="submit"
        >
          {updatePending ? (
            <LoaderCircle aria-hidden className="auth-spinner" size={18} />
          ) : (
            <Save aria-hidden size={18} strokeWidth={1.8} />
          )}
          Зберегти
        </button>
      </form>

      <div className="admin-danger-zone">
        <div>
          <strong>Видалити товар</strong>
          <p>Товар і прив&apos;язані до нього фотографії буде видалено.</p>
        </div>
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm(`Видалити товар «${product.name}»?`)) {
              event.preventDefault();
            }
          }}
        >
          <input name="productId" type="hidden" value={product.id} />
          <button
            className="admin-danger-button"
            disabled={deletePending || updatePending}
            type="submit"
          >
            {deletePending ? (
              <LoaderCircle aria-hidden className="auth-spinner" size={18} />
            ) : (
              <Trash2 aria-hidden size={18} strokeWidth={1.8} />
            )}
            Видалити
          </button>
        </form>
      </div>

      <div
        aria-live="polite"
        className={`auth-message auth-message-${deleteState.status}`}
        role={deleteState.status === "error" ? "alert" : "status"}
      >
        {deleteState.message}
      </div>
    </div>
  );
}
