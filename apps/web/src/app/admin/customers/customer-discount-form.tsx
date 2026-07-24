"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useActionState } from "react";

import {
  initialAdminActionState,
  type AdminActionState,
} from "../action-state";
import { updateCustomerDiscount } from "./actions";

type CustomerDiscountFormProps = {
  customerId: string;
  discountPercent: number;
};

export function CustomerDiscountForm({
  customerId,
  discountPercent,
}: CustomerDiscountFormProps) {
  const [state, formAction, pending] = useActionState<
    AdminActionState,
    FormData
  >(updateCustomerDiscount, initialAdminActionState);

  return (
    <form action={formAction} className="admin-customer-discount-form">
      <input name="customerId" type="hidden" value={customerId} />
      <label>
        <span className="sr-only">Персональна знижка у відсотках</span>
        <input
          aria-label="Персональна знижка у відсотках"
          defaultValue={discountPercent}
          inputMode="decimal"
          max="100"
          min="0"
          name="discount"
          required
          step="0.01"
          type="number"
        />
        <span aria-hidden>%</span>
      </label>
      <button disabled={pending} title="Зберегти знижку" type="submit">
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={16} />
        ) : (
          <Save aria-hidden size={16} strokeWidth={1.8} />
        )}
        <span className="sr-only">Зберегти знижку</span>
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
