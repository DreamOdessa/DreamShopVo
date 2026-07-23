type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

export function sessionTokens(value: unknown): SessionTokens | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const accessToken = Reflect.get(value, "access_token");
  const refreshToken = Reflect.get(value, "refresh_token");

  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}
