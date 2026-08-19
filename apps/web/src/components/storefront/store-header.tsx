import { getWishlistState } from "../../lib/wishlist";
import { StoreHeaderShell } from "./store-header-shell";

export async function StoreHeader() {
  const wishlist = await getWishlistState();

  return (
    <StoreHeaderShell
      authenticated={wishlist.authenticated}
      wishlistCount={wishlist.productIds.length}
    />
  );
}
