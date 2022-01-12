import { AlertColor } from "@mui/material";
import { atom } from "recoil";

export interface SnackbarContent {
  message: string,
  servirity: AlertColor,

  onClose?: () => boolean,
  width: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  fullWidth ?: boolean,
  anchorOrigin : {
    vertical: 'left'|'center'|'right',
    horizontal : 'top'|'center'|'buttom'
  },
  autoHideDuration ?: number //default 4000
}

export const snackbarContentState = atom<SnackbarContent | null>({
  key: "snackbarContent",
  default: null,
});