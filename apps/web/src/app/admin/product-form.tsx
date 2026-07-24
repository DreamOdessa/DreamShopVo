"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useActionState } from "react";

import {
  initialAdminActionState,
  type AdminActionState,
} from "./action-state";
import { createProduct } from "./actions";

type ProductCategory = {
  id: string;
  name: string;
};

type ProductFormProps = {
  categories: ProductCategory[];
};

export function ProductForm({ categories }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<
    AdminActionState,
    FormData
  >(createProduct, initialAdminActionState);
  const hasCategories = categories.length > 0;

  return (
    <form action={formAction} className="admin-form">
      <div className="admin-form-grid">
        <label className="auth-field">
          <span>Назва</span>
          <span className="auth-input-wrap">
            <input
              maxLength={160}
              minLength={2}
              name="name"
              placeholder="Апельсинові чипси"
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
              maxLength={180}
              name="slug"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="orange-chips"
              required
              type="text"
            />
          </span>
        </label>

        <label className="auth-field admin-field-wide">
          <span>Категорія</span>
          <select disabled={!hasCategories} name="categoryId" required>
            <option value="">
              {hasCategories ? "Оберіть категорію" : "Спочатку створіть категорію"}
            </option>
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
              inputMode="decimal"
              min={0}
              name="price"
              placeholder="250"
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
              inputMode="decimal"
              min={0}
              name="originalPrice"
              placeholder="300"
              step="0.01"
              type="number"
            />
          </span>
        </label>

        <label className="auth-field">
          <span>Вага</span>
          <span className="auth-input-wrap">
            <input
              maxLength={100}
              name="weight"
              placeholder="50 г"
              type="text"
            />
          </span>
        </label>

        <label className="auth-field">
          <span>Порядок</span>
          <span className="auth-input-wrap">
            <input
              defaultValue="0"
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
            maxLength={10000}
            name="description"
            placeholder="Опис товару"
            rows={4}
          />
        </label>
      </div>

      <div className="admin-checks">
        <label>
          <input defaultChecked name="isActive" type="checkbox" />
          Активний
        </label>
        <label>
          <input defaultChecked name="inStock" type="checkbox" />
          В наявності
        </label>
        <label>
          <input name="organic" type="checkbox" />
          Organic
        </label>
        <label>
          <input name="isPopular" type="checkbox" />
          Популярний
        </label>
      </div>

      <div
        aria-live="polite"
        className={`auth-message auth-message-${state.status}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </div>

      <button
        className="admin-submit-button"
        disabled={pending || !hasCategories}
        type="submit"
      >
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={18} />
        ) : (
          <Plus aria-hidden size={18} strokeWidth={1.8} />
        )}
        Додати товар
      </button>
    </form>
  );
}
