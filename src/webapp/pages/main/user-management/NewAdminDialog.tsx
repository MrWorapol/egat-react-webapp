import { Button, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import React from 'react'
import { useDialog } from '../../../hooks/useDialog';
import { useForm } from 'react-hook-form';
import { useCreateAdmin } from '../../../hooks/useCreateAdmin';
import { IAdminRegistratoinState } from '../../../state/user-management/admin-registration-state';



export default function NewAdminDialog() {
    const { closeDialog } = useDialog();

    const { register, handleSubmit, watch, formState: { errors } } = useForm<IAdminRegistratoinState>();
    const { createAdmin } = useCreateAdmin();


    const onSubmitForm = async (data: IAdminRegistratoinState) => {
        if (data) {
            //wait for vaildate before call api
            if (await createAdmin(data)) {
                closeDialog();
            }
        }
        console.log(data)
    };

    return (
        <>
            <DialogTitle>
                <Typography color='secondary.main' variant='h6' sx={{ fontWeight: 'bold' }}>
                    Create New Admin
                </Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <DialogContent sx={{ mx: 2 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        {...register("email")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="fullName"
                        label="Name"
                        type="name"
                        fullWidth
                        variant="standard"
                        {...register("fullName")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phone"
                        label="Phone Number"
                        type="phone"
                        fullWidth
                        variant="standard"
                        {...register("phoneNumber")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        {...register("password")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={closeDialog}>
                        Close
                    </Button>
                    <Button variant='contained' type="submit">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </>
    )

}
