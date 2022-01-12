import { atom } from "recoil";

interface SnackbarContent {
  content: JSX.Element,
  onClose: () => boolean,
  width: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  fullWidth ?: boolean,
  anchorOrigin : {
    vertical: 'left'|'center'|'right',
    horizontal : 'top'|'center'|'buttom'
  },
  autoHideDuration : number
}

export const snackbarContent = atom<SnackbarContent | null>({
  key: "snackbarContent",
  default: null,
});