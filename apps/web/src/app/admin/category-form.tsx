"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useActionState } from "react";

import {
  initialAdminActionState,
  type AdminActionState,
} from "./action-state";
import { createCategory } from "./actions";

export function CategoryForm() {
  const [state, formAction, pending] = useActionState<
    AdminActionState,
    FormData
  >(createCategory, initialAdminActionState);

  return (
    <form action={formAction} className="admin-form">
      <div className="admin-form-grid">
        <label className="auth-field">
          <span>Назва</span>
          <span className="auth-input-wrap">
            <input
              maxLength={100}
              minLength={2}
              name="name"
              placeholder="Фруктові чипси"
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
              maxLength={120}
              name="slug"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="fruit-chips"
              required
              type="text"
            />
          </span>
        </label>

        <label className="auth-field admin-field-wide">
          <span>Опис</span>
          <textarea
            maxLength={2000}
            name="description"
            placeholder="Короткий опис категорії"
            rows={3}
          />
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
      </div>

      <div className="admin-checks">
        <label>
          <input defaultChecked name="isActive" type="checkbox" />
          Активна
        </label>
        <label>
          <input name="showInShowcase" type="checkbox" />
          На головній
        </label>
      </div>

      <div
        aria-live="polite"
        className={`auth-message auth-message-${state.status}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </div>

      <button className="admin-submit-button" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={18} />
        ) : (
          <Plus aria-hidden size={18} strokeWidth={1.8} />
        )}
        Додати категорію
      </button>
    </form>
  );
}
