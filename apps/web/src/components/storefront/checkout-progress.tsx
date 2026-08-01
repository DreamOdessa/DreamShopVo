import { Check } from "lucide-react";
import Link from "next/link";

type CheckoutStep = "cart" | "checkout" | "complete";

const steps: Array<{ id: CheckoutStep; label: string }> = [
  { id: "cart", label: "Кошик" },
  { id: "checkout", label: "Оформлення" },
  { id: "complete", label: "Готово" },
];

const stepIndex: Record<CheckoutStep, number> = {
  cart: 0,
  checkout: 1,
  complete: 2,
};

export function CheckoutProgress({ current }: { current: CheckoutStep }) {
  const currentIndex = stepIndex[current];

  return (
    <nav className="checkout-progress" aria-label="Етапи оформлення">
      <ol>
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = step.id === current;
          const content = (
            <>
              <span aria-hidden>{complete ? <Check size={15} /> : index + 1}</span>
              <strong>{step.label}</strong>
            </>
          );

          return (
            <li
              aria-current={active ? "step" : undefined}
              className={complete ? "is-complete" : active ? "is-active" : ""}
              key={step.id}
            >
              {step.id === "cart" && current !== "cart" ? (
                <Link href="/cart">{content}</Link>
              ) : (
                <span>{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
