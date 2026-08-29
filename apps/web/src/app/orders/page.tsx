import { permanentRedirect } from "next/navigation";

export default function LegacyOrdersPage() {
  permanentRedirect("/account#orders");
}
