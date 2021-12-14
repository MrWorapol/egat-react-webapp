import React, { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { snackBarState } from '../state/snackbar-state'

export function useSnackBarNotification() {
    const [snackBarValue, setSnackBar] = useRecoilState(snackBarState)


    const showSnackBar = useCallback(
        ({
            serverity,
            message,
        }: {
            serverity: "success" | "error" | "warning" | "info",
            message: string,
        }) => {
            setSnackBar({
                serverity,
                message,
            })
        },
        [],
    )

    const closeSnackBar = useCallback(() => {
        setSnackBar(null);
    }, []);

    return ({
        snackBarValue,
        showSnackBar,
        closeSnackBar
    })
}
