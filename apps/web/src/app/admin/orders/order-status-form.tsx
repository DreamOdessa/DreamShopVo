"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import {
  orderStatusLabels,
  orderStatusTransitions,
  type OrderStatus,
} from "../../../lib/orders";

import { initialAdminActionState } from "../action-state";
import { updateOrderStatus } from "./actions";

type OrderStatusFormProps = {
  orderId: string;
  status: OrderStatus;
};

export function OrderStatusForm({ orderId, status }: OrderStatusFormProps) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatus,
    initialAdminActionState,
  );
  const availableStatuses = orderStatusTransitions[status];

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
      <label>
        <span>Новий статус</span>
        <select defaultValue={availableStatuses[0]} name="status">
          {availableStatuses.map((nextStatus) => (
            <option key={nextStatus} value={nextStatus}>
              {orderStatusLabels[nextStatus]}
            </option>
          ))}
        </select>
      </label>
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
