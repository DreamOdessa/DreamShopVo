"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import {
  initialAdminActionState,
  type AdminActionState,
} from "./action-state";
import { updateProductStock } from "./actions";

type QuickStockFormProps = {
  expectedStock: number | null;
  productId: string;
  productName: string;
};

export function QuickStockForm({
  expectedStock,
  productId,
  productName,
}: QuickStockFormProps) {
  const [state, formAction, pending] = useActionState<
    AdminActionState,
    FormData
  >(updateProductStock, initialAdminActionState);

  return (
    <form action={formAction} className="admin-stock-form">
      <input name="productId" type="hidden" value={productId} />
      <input
        name="expectedStock"
        type="hidden"
        value={expectedStock ?? ""}
      />
      <label>
        <span className="sr-only">Залишок товару {productName}</span>
        <input
          aria-label={`Залишок товару ${productName}`}
          defaultValue={expectedStock ?? ""}
          inputMode="numeric"
          max={1000000}
          min={0}
          name="stockQuantity"
          placeholder="—"
          type="number"
        />
      </label>
      <button
        disabled={pending}
        title={`Зберегти залишок товару ${productName}`}
        type="submit"
      >
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={15} />
        ) : (
          <Check aria-hidden size={15} strokeWidth={2} />
        )}
        <span className="sr-only">Зберегти залишок товару {productName}</span>
      </button>
      <span
        aria-live="polite"
        className={`admin-stock-message is-${state.status}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </span>
    </form>
  );
}
