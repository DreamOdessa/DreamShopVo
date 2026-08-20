"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  orderStatusLabels,
  orderStatusTransitions,
  type OrderStatus,
} from "../../../lib/orders";

import { initialAdminActionState } from "../action-state";
import { updateOrderStatus } from "./actions";

type OrderStatusFormProps = {
  deliveryMethod: string;
  orderId: string;
  status: OrderStatus;
};

export function OrderStatusForm({
  deliveryMethod,
  orderId,
  status,
}: OrderStatusFormProps) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatus,
    initialAdminActionState,
  );
  const router = useRouter();
  const availableStatuses = orderStatusTransitions[status];
  const [nextStatus, setNextStatus] = useState<OrderStatus>(
    availableStatuses[0] ?? status,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    const refreshTimer = window.setTimeout(() => router.refresh(), 1500);
    return () => window.clearTimeout(refreshTimer);
  }, [router, state.status]);

  if (!availableStatuses.length) {
    return (
      <p className="admin-order-terminal">
        Фінальний статус: {orderStatusLabels[status]}
      </p>
    );
  }

  return (
    <form action={formAction} className="admin-order-status-form">
      <input name="orderId" type="hidden" value={orderId} />
      <input name="currentStatus" type="hidden" value={status} />
      <label>
        <span>Новий статус</span>
        <select
          name="status"
          onChange={(event) =>
            setNextStatus(event.target.value as OrderStatus)
          }
          value={nextStatus}
        >
          {availableStatuses.map((nextStatus) => (
            <option key={nextStatus} value={nextStatus}>
              {orderStatusLabels[nextStatus]}
            </option>
          ))}
        </select>
      </label>
      {nextStatus === "shipped" && deliveryMethod === "post_office" ? (
        <label>
          <span>ТТН Нової пошти</span>
          <input
            autoComplete="off"
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
      ) : null}
      <button className="admin-submit-button" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={17} />
        ) : null}
        Оновити статус
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
