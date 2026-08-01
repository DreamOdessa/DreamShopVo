"use client";

import { SessionError } from "../../components/auth/session-error";

export default function AdminError({ reset }: { reset: () => void }) {
  return <SessionError area="admin" reset={reset} />;
}
