"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useActionState } from "react";

import {
  initialAdminActionState,
  type AdminActionState,
} from "./action-state";
import { deleteProduct } from "./actions";

type ProductDeleteButtonProps = {
  productId: string;
  productName: string;
};

export function ProductDeleteButton({
  productId,
  productName,
}: ProductDeleteButtonProps) {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(
    deleteProduct,
    initialAdminActionState,
  );

  return (
    <form
      action={action}
      className="admin-row-delete-form"
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Видалити товар «${productName}» разом із його фотографіями?`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="productId" type="hidden" value={productId} />
      <button
        aria-label={`Видалити ${productName}`}
        className="admin-row-button admin-row-delete-button"
        disabled={pending}
        title={state.status === "error" ? state.message : `Видалити ${productName}`}
        type="submit"
      >
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={16} />
        ) : (
          <Trash2 aria-hidden size={16} strokeWidth={1.8} />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {state.message}
      </span>
    </form>
  );
}
