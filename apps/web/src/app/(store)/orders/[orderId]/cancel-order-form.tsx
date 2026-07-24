"use client";

import { CircleX, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import {
  cancelOrder,
  type CancelOrderState,
} from "./actions";

const initialState: CancelOrderState = {
  message: "",
  status: "idle",
};

type CancelOrderFormProps = {
  orderId: string;
  orderNumber: number;
};

export function CancelOrderForm({
  orderId,
  orderNumber,
}: CancelOrderFormProps) {
  const [state, formAction, pending] = useActionState(
    cancelOrder,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form
      action={formAction}
      className="order-cancel-form"
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Скасувати замовлення №${orderNumber}? Цю дію не можна скасувати.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="orderId" type="hidden" value={orderId} />
      <button className="order-cancel-button" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={17} />
        ) : (
          <CircleX aria-hidden size={17} strokeWidth={1.8} />
        )}
        Скасувати замовлення
      </button>
      <p
        aria-live="polite"
        className={`checkout-message checkout-message-${state.status}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </p>
    </form>
  );
}
