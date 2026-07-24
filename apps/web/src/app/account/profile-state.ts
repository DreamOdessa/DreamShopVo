export type ProfileActionState = {
  message: string;
  status: "error" | "idle" | "success";
};

export const initialProfileState: ProfileActionState = {
  message: "",
  status: "idle",
};
