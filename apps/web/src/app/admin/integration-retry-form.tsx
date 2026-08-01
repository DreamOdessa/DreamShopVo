"use client";

import { RefreshCw } from "lucide-react";
import { useActionState } from "react";

import { initialAdminActionState } from "./action-state";
import { retryIntegrationEvent } from "./integration-actions";

export function IntegrationRetryForm({ eventId }: { eventId: number }) {
  const [state, formAction, pending] = useActionState(
    retryIntegrationEvent,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="admin-integration-retry-form">
      <input name="eventId" type="hidden" value={eventId} />
      <button
        aria-label="Повторити надсилання"
        className="admin-row-button"
        disabled={pending}
        title="Повторити надсилання"
        type="submit"
      >
        <RefreshCw aria-hidden size={16} strokeWidth={1.8} />
      </button>
      {state.message ? (
        <span
          className={`admin-inline-message admin-inline-message-${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
