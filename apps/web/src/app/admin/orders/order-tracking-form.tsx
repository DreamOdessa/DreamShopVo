"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import { initialAdminActionState } from "../action-state";
import { updateOrderTracking } from "./actions";

type OrderTrackingFormProps = {
  orderId: string;
  trackingNumber: string | null;
};

export function OrderTrackingForm({
  orderId,
  trackingNumber,
}: OrderTrackingFormProps) {
  const [state, formAction, pending] = useActionState(
    updateOrderTracking,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="admin-order-status-form">
      <input name="orderId" type="hidden" value={orderId} />
      <label>
        <span>ТТН Нової пошти</span>
        <input
          autoComplete="off"
          defaultValue={trackingNumber ?? ""}
          inputMode="numeric"
          maxLength={14}
          minLength={14}
          name="trackingNumber"
          pattern="[0-9]{14}"
          placeholder="14 цифр"
          required
          type="text"
        />
      </label>
      <button className="admin-submit-button" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={17} />
        ) : null}
        Зберегти ТТН
      </button>
      <p
        aria-live="polite"
        className={`admin-message admin-message-${state.status}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </p>
    </form>
  );
}
