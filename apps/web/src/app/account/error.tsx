"use client";

import { SessionError } from "../../components/auth/session-error";

export default function AccountError({ reset }: { reset: () => void }) {
  return <SessionError area="account" reset={reset} />;
}
