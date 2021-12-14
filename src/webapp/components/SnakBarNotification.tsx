import { Alert, Snackbar, SnackbarOrigin } from '@mui/material'
import React from 'react'
import { useSnackBarNotification } from '../hooks/useSnackBarNotification';

export interface State extends SnackbarOrigin {
    open: boolean;
}

export interface ISnackBarNotification {
    serverity: "success" | "error" | "warning" | "info",
    message: string,
}

export default function SnackBarNotification() {
    const { snackBarValue, closeSnackBar } = useSnackBarNotification();


    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackBarValue !== null}
            onClose={closeSnackBar}
            message={snackBarValue !== null && snackBarValue.message}
            autoHideDuration={3000}
            key={'buttom-center-snackbar' + snackBarValue?.message}
        >
            <Alert onClose={closeSnackBar} severity={snackBarValue?.serverity || "info"} sx={{ width: '100%' }}>
                {snackBarValue !== null && snackBarValue.message}
            </Alert>
        </Snackbar>
    )
}
