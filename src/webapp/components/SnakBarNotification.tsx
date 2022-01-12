import { Alert, Snackbar, SnackbarOrigin } from '@mui/material'
import React from 'react'
import { useSnackbar } from '../hooks/useSnackbar';

export interface State extends SnackbarOrigin {
    open: boolean;
}


export default function SnakBarNotification() {
    const {snackbarContent,closeSnackbar} = useSnackbar();

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }  
        closeSnackbar();
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbarContent !==null}
            onClose={handleClose}
            key={"snackbar-key"}
            autoHideDuration={3000}
        >
            <Alert 
            onClose={handleClose} 
            severity={ snackbarContent?.servirity} 
            sx={{ width: '100%' }}>
                {snackbarContent?.message}
            </Alert>

        </Snackbar>
    )
}
