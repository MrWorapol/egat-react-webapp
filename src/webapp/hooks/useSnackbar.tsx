import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { SnackbarContent,snackbarContentState } from "../state/snackbar-content";

export function useSnackbar() {
  const [snackbarContentValue, setSnackbarContent] = useRecoilState(snackbarContentState);


  const showSnackbar = useCallback(
    (snackBarProps: SnackbarContent) => {
      console.log(snackBarProps);
      setSnackbarContent({
        ...snackBarProps
      });
    },
    []
  );

  const closeSnackbar = useCallback(() => {
    console.log(`call Close Snackbar`)
    setSnackbarContent(null);
  }, []);

  // console.log('set');
  return {
    snackbarContent: snackbarContentValue,
    showSnackbar,
    closeSnackbar,
    
  };
}
