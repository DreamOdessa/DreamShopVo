export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}
