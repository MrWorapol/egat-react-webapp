import { Button, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useWheelingCharge } from '../../../../hooks/useWheelingCharge';
import { IWheelingCharge } from '../../../../state/reference-data/wheeling-chart/wheeling-charge-state';

interface ISettingProps {
    no: number,
    wheelingCharge: IWheelingCharge,
}


export default function SettingDialog(props: ISettingProps) {
    const { closeDialog } = useDialog();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<IWheelingCharge>();
    const { updatedWheelingCharge } = useWheelingCharge();
    const onSubmitForm = (data: IWheelingCharge) => {
        let request: IWheelingCharge = {
            ...data,
            id: props.wheelingCharge.id,
            wheelingType: props.wheelingCharge.wheelingType,
        }
        console.info(request);
        updatedWheelingCharge(request);
    }
    return (
        <>
            <DialogTitle>
                <Typography color="secondary.main" variant="h6" sx={{ fontWeight: "bold" }}>
                    {`No.${props.no+1} ${props.wheelingCharge.title}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <DialogContent sx={{}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                Baht/kWh
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"
                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="bahtPerKWh"
                                control={control}
                                defaultValue={props.wheelingCharge.bahtPerKWh}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                MEA
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"

                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="mea"
                                control={control}
                                defaultValue={props.wheelingCharge.mea}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box><Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                PEA
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"

                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="pea"
                                control={control}
                                defaultValue={props.wheelingCharge.pea}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                MEAEGAT
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"

                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="meaEgat"
                                control={control}
                                defaultValue={props.wheelingCharge.meaEgat}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                PEAEGAT
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"

                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="peaEgat"
                                control={control}
                                defaultValue={props.wheelingCharge.peaEgat}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                MEAPEAEGAT
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"

                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="meaPeaEgat"
                                control={control}
                                defaultValue={props.wheelingCharge.meaPeaEgat}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                Effective Date
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"

                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="effectiveDate"
                                control={control}
                                defaultValue={dayjs(props.wheelingCharge.effectiveDate).format('DD/MM/YYYY')}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography>
                                Effective Time
                            </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="outlined"
                                        margin="dense"

                                        size='small'
                                        sx={{ ml: 2, maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                        {...field}
                                    />)}
                                name="effectiveTime"
                                control={control}
                                defaultValue={dayjs(props.wheelingCharge.effectiveTime).format('HH:mm')}
                                rules={{
                                    required: true,
                                }}

                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={closeDialog}>
                            Close
                        </Button>
                        <Button variant='contained' type="submit">
                            Edit
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </>
    )
}
