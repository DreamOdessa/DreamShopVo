"use client";

import { LoaderCircle, Save, Trash2 } from "lucide-react";
import { useActionState } from "react";

import {
  initialAdminActionState,
  type AdminActionState,
} from "./action-state";
import { deleteCategory, updateCategory } from "./actions";

type CategoryEditFormProps = {
  category: {
    description: string;
    id: string;
    isActive: boolean;
    name: string;
    showInShowcase: boolean;
    slug: string;
    sortOrder: number;
  };
};

export function CategoryEditForm({ category }: CategoryEditFormProps) {
  const [updateState, updateAction, updatePending] = useActionState<
    AdminActionState,
    FormData
  >(updateCategory, initialAdminActionState);
  const [deleteState, deleteAction, deletePending] = useActionState<
    AdminActionState,
    FormData
  >(deleteCategory, initialAdminActionState);

  return (
    <div className="admin-edit-stack">
      <form action={updateAction} className="admin-form">
        <input name="categoryId" type="hidden" value={category.id} />

        <div className="admin-form-grid">
          <label className="auth-field">
            <span>Назва</span>
            <span className="auth-input-wrap">
              <input
                defaultValue={category.name}
                maxLength={100}
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
                defaultValue={category.slug}
                maxLength={120}
                name="slug"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                required
                type="text"
              />
            </span>
          </label>

          <label className="auth-field admin-field-wide">
            <span>Опис</span>
            <textarea
              defaultValue={category.description}
              maxLength={2000}
              name="description"
              rows={4}
            />
          </label>

          <label className="auth-field">
            <span>Порядок</span>
            <span className="auth-input-wrap">
              <input
                defaultValue={category.sortOrder}
                max={10000}
                min={0}
                name="sortOrder"
                required
                type="number"
              />
            </span>
          </label>
        </div>

        <div className="admin-checks">
          <label>
            <input
              defaultChecked={category.isActive}
              name="isActive"
              type="checkbox"
            />
            Активна
          </label>
          <label>
            <input
              defaultChecked={category.showInShowcase}
              name="showInShowcase"
              type="checkbox"
            />
            На головній
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
          <strong>Видалити категорію</strong>
          <p>Категорію з прив&apos;язаними товарами видалити неможливо.</p>
        </div>
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm(`Видалити категорію «${category.name}»?`)) {
              event.preventDefault();
            }
          }}
        >
          <input name="categoryId" type="hidden" value={category.id} />
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
