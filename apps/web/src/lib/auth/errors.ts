type SupabaseLikeError = {
  code?: string;
  message?: string;
  status?: number;
};

export function isInvalidSessionError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const candidate = error as SupabaseLikeError;
  const message = candidate.message?.toLocaleLowerCase("en-US") ?? "";

  return (
    candidate.code === "PGRST303" ||
    candidate.status === 401 ||
    message.includes("jwt issued at future") ||
    message.includes("jwt expired") ||
    message.includes("invalid jwt")
  );
}
