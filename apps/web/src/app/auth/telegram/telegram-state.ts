export type TelegramAuthState = {
  message: string;
  status: "error" | "idle";
};

export const initialTelegramAuthState: TelegramAuthState = {
  message: "",
  status: "idle",
};
