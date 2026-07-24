export type AdminActionState = {
  message: string;
  status: "error" | "idle" | "success";
};

export const initialAdminActionState: AdminActionState = {
  message: "",
  status: "idle",
};
