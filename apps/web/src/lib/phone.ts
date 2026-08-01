export function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.length === 10 && digits.startsWith("0")) {
    digits = `38${digits}`;
  } else if (digits.length === 11 && digits.startsWith("80")) {
    digits = `3${digits}`;
  }

  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}
