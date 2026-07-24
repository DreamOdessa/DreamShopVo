import { getApiUrl } from "./env";

export function publicMediaUrl(objectKey: string) {
  const encodedKey = objectKey.split("/").map(encodeURIComponent).join("/");

  return `${getApiUrl()}/media/${encodedKey}`;
}
