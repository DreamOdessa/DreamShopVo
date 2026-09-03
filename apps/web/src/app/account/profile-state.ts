export type ProfileActionState = {
  message: string;
  pendingValue?: string;
  status: "error" | "idle" | "pending" | "success";
};

export const initialProfileState: ProfileActionState = {
  message: "",
  status: "idle",
};
