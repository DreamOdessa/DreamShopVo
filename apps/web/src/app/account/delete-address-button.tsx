"use client";

import { Trash2 } from "lucide-react";

import { deleteSavedAddress } from "./actions";

export function DeleteAddressButton({ addressId }: { addressId: string }) {
  return (
    <form
      action={deleteSavedAddress}
      onSubmit={(event) => {
        if (!window.confirm("Видалити збережені дані доставки?")) {
          event.preventDefault();
        }
      }}
    >
      <input name="addressId" type="hidden" value={addressId} />
      <button
        aria-label="Видалити збережену доставку"
        className="admin-row-button account-address-delete"
        title="Видалити збережену доставку"
        type="submit"
      >
        <Trash2 aria-hidden size={17} strokeWidth={1.8} />
      </button>
    </form>
  );
}
