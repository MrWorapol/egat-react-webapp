import { atom } from "recoil";

interface DialogContent {
  content: JSX.Element,
  backdrop: boolean,
  onClose: () => boolean,
  width: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  fullWidth ?: boolean,
}

export const dialogContent = atom<DialogContent | null>({
  key: "dialogContent",
  default: null,
});
