export type AuthActionState = {
  message: string;
  status: "error" | "idle" | "success";
};

export const initialAuthState: AuthActionState = {
  message: "",
  status: "idle",
};
