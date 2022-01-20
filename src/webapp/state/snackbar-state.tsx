import { atom } from "recoil";

export interface ISnackBarNotification {
  serverity: "success" | "error" | "warning" | "info",
  message: string,
}
export const snackBarState = atom<ISnackBarNotification | null>({
  key: "snackBarState",
  default: null,
});
