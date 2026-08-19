"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useActionState } from "react";

import type { HomeHeroSettings } from "../../lib/site-settings";

import {
  initialAdminActionState,
  type AdminActionState,
} from "./action-state";
import { updateHomeHeroSettings } from "./actions";

export function HomeHeroSettingsForm({
  settings,
}: {
  settings: HomeHeroSettings;
}) {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(
    updateHomeHeroSettings,
    initialAdminActionState,
  );

  return (
    <form action={action} className="admin-form">
      <div className="admin-form-grid">
        <label className="admin-field-wide">
          <span>Заголовок</span>
          <input
            defaultValue={settings.title}
            maxLength={100}
            name="title"
            required
          />
        </label>
        <label className="admin-field-wide">
          <span>Підзаголовок</span>
          <textarea
            defaultValue={settings.subtitle}
            maxLength={320}
            name="subtitle"
            required
            rows={3}
          />
        </label>
        <label>
          <span>Текст кнопки</span>
          <input
            defaultValue={settings.ctaLabel}
            maxLength={60}
            name="ctaLabel"
            required
          />
        </label>
        <label>
          <span>Посилання кнопки</span>
          <input
            defaultValue={settings.ctaHref}
            maxLength={160}
            name="ctaHref"
            pattern="/.*"
            required
          />
        </label>
      </div>
      <button className="admin-submit" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={17} />
        ) : (
          <Save aria-hidden size={17} />
        )}
        Зберегти головний екран
      </button>
      <p aria-live="polite" className={`admin-form-message is-${state.status}`}>
        {state.message}
      </p>
    </form>
  );
}
