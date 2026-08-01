export type CheckoutField =
  | "city"
  | "deliveryDetails"
  | "firstName"
  | "lastName"
  | "phone";

export type CheckoutState = {
  fieldErrors?: Partial<Record<CheckoutField, string>>;
  message: string;
  orderId?: string;
  orderNumber?: number;
  status: "idle" | "error" | "success";
};

export const initialCheckoutState: CheckoutState = {
  message: "",
  status: "idle",
};
