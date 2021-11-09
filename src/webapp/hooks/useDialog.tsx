import { width } from "@mui/system";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { dialogContent } from "../state/dialog-content";

export function useDialog() {
  const [dialogContentValue, setDialogContent] = useRecoilState(dialogContent);

  const showDialog = useCallback(
    ({
      content,
      backdrop,
      onClose,
      width
    }: {
      content: JSX.Element;
      backdrop?: boolean;
      onClose?: () => boolean;
      width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' ;
    }) => {
      setDialogContent({
        content,
        backdrop: !!backdrop,
        onClose: onClose ?? (() => true),
        width: width,
      });
    },
    [setDialogContent]
  );

  const closeDialog = useCallback(() => {
    setDialogContent(null);
  }, [setDialogContent]);

  return {
    dialogContent: dialogContentValue,
    showDialog,
    closeDialog,
  };
}
