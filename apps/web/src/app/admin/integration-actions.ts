"use server";

import { revalidatePath } from "next/cache";

import { getAdminContext } from "../../lib/auth/admin";

import type { AdminActionState } from "./action-state";

function errorState(message: string): AdminActionState {
  return { message, status: "error" };
}

export async function retryIntegrationEvent(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const rawEventId = formData.get("eventId");
  const eventId = typeof rawEventId === "string" ? Number(rawEventId) : NaN;

  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    return errorState("Подію не знайдено.");
  }

  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId || !isAdmin) {
    return errorState("Сесія завершилася. Увійдіть повторно.");
  }

  const { data, error } = await supabase.rpc(
    "retry_admin_integration_event",
    { p_event_id: eventId },
  );

  if (error) {
    return errorState("Не вдалося поставити повідомлення в чергу.");
  }

  if (!data) {
    return errorState("Подію вже оброблено або повтор уже запущено.");
  }

  revalidatePath("/admin/dashboard");

  return {
    message: "Повідомлення знову поставлено в чергу.",
    status: "success",
  };
}
