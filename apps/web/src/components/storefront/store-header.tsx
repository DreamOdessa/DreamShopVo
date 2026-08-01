import { getWishlistState } from "../../lib/wishlist";
import { StoreHeaderShell } from "./store-header-shell";

export async function StoreHeader() {
  const wishlist = await getWishlistState();

  return <StoreHeaderShell wishlistCount={wishlist.productIds.length} />;
}
