import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { snackbarContent } from "../state/snackbar-content";

export function useSnackbar() {
  const [snackbarContentValue, setSnackbarContent] = useRecoilState(snackbarContent);

  const showSnackbar = useCallback(
    ({
      content,
      onClose,
      width,
      fullWidth,
      anchorOrigin,
      autoHideDuration,
    }: {
      content: JSX.Element,
      onClose?: () => boolean,
      width: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
      fullWidth?: boolean,
      anchorOrigin:{
        vertical: 'left'|'center'|'right',
        horizontal : 'top'|'center'|'buttom'
      },
      autoHideDuration : number
    }) => {
      setSnackbarContent({
        content,
        onClose: onClose ?? (() => true),
        width: width,
        fullWidth: fullWidth,
        anchorOrigin : anchorOrigin,
        autoHideDuration : autoHideDuration
      });
    },
    [setSnackbarContent]
  );

  const closeSnackbar = useCallback(() => {
    setSnackbarContent(null);
  }, [setSnackbarContent]);

  console.log('set');
  return {
    snackbarContent: snackbarContentValue,
    showSnackbar,
    closeSnackbar,
    
  };
}
