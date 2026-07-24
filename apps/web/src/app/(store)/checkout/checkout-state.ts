export type CheckoutState = {
  message: string;
  orderId?: string;
  orderNumber?: number;
  status: "idle" | "error" | "success";
};

export const initialCheckoutState: CheckoutState = {
  message: "",
  status: "idle",
};
