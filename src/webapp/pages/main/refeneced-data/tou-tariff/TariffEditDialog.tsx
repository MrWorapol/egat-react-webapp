import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useOtherSetting } from '../../../../hooks/useOtherSetting';
import { useTOUTariff } from '../../../../hooks/useTOUTariff';
import { IOtherSetting } from '../../../../state/reference-data/other-setting/othersetting-state';
import { ITouTariff } from '../../../../state/reference-data/tou-traff/tou-tariff-state';
import { touTypeLabel } from './TOUTariff';

interface ITariffEditProps {
    tariff: ITouTariff
}

const time = ['00', '']


export default function TariffEditDialog(props: ITariffEditProps) {
    const { closeDialog } = useDialog();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<ITouTariff>();
    const { editTOUTariff } = useTOUTariff();

    const onSubmitForm = async (data: ITouTariff) => {
        data.bahtPerKWh = Number.parseFloat(data.bahtPerKWh + '');
        let request: ITouTariff = {
            ...data,
            id: props.tariff.id,
            touType: props.tariff.touType, title: props.tariff.title,
        }

        if (await editTOUTariff(request)) {
            closeDialog();
        }

    }

    return (
        <>
            <DialogTitle>
                <Typography sx={{ fontSize: '1.3em' }}>
                    {`Log : ${touTypeLabel[props.tariff.touType]}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Box alignItems='center' justifyContent='center' display='flex'>
                        <Grid container direction="column" spacing={1} alignItems='center' sx={{ minWidth: '300px', width: '60%' }}>
                            <Grid item container justifyContent="flex-start">
                                <Typography sx={{ fontSize: '1.2em' }}>
                                    {props.tariff.title}
                                </Typography>
                            </Grid>
                            <Grid item container direction='row' justifyContent="space-between" alignItems="center" id='Start-time'>
                                <Grid item xs={'auto'}>
                                    <Typography sx={{}}>
                                        Start Time
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Controller
                                        render={({ field }) => (
                                            <TextField variant="outlined"
                                                margin="dense"

                                                size='small'
                                                sx={{ textAlignLast: 'end' }}
                                                fullWidth={true}
                                                {...field}
                                            />)}
                                        name="startTime"
                                        control={control}
                                        defaultValue={props.tariff.startTime}
                                        rules={{
                                            required: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' justifyContent="space-between" alignItems="center" id='end-time'>
                                <Grid item xs={'auto'}>
                                    <Typography sx={{}}>
                                        End Time
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Controller
                                        render={({ field }) => (
                                            <TextField variant="outlined"
                                                margin="dense"

                                                size='small'
                                                sx={{ textAlignLast: 'end' }}
                                                fullWidth={true}
                                                {...field}
                                            />)}
                                        name="endTime"
                                        control={control}
                                        defaultValue={props.tariff.endTime}
                                        rules={{
                                            required: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' justifyContent="space-between" alignItems="center" id='tariff'>
                                <Grid item xs={'auto'}>
                                    <Typography sx={{}}>
                                        Tariff
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Controller
                                        render={({ field }) => (
                                            <TextField variant="outlined"
                                                margin="dense"

                                                size='small'
                                                sx={{ textAlignLast: 'end' }}
                                                fullWidth={true}
                                                {...field}
                                            />)}
                                        name="bahtPerKWh"
                                        control={control}
                                        defaultValue={props.tariff.bahtPerKWh}
                                        rules={{
                                            required: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' justifyContent="space-between" alignItems="center" id='effective-date'>
                                <Grid item xs={'auto'}>
                                    <Typography sx={{}}>
                                        Effective Date
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Controller
                                        render={({ field }) => (
                                            <TextField variant="outlined"
                                                margin="dense"

                                                size='small'
                                                sx={{ textAlignLast: 'end' }}
                                                fullWidth={true}
                                                {...field}
                                            />)}
                                        name="effectiveDate"
                                        control={control}
                                        defaultValue={props.tariff.effectiveDate}
                                        rules={{
                                            required: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' justifyContent="space-between" alignItems="center" id='effective-time'>
                                <Grid item xs={'auto'}>
                                    <Typography sx={{}}>
                                        Effective Time
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Controller
                                        render={({ field }) => (
                                            <TextField variant="outlined"
                                                margin="dense"

                                                size='small'
                                                sx={{ textAlignLast: 'end' }}
                                                fullWidth={true}
                                                {...field}
                                            />)}
                                        name="effectiveTime"
                                        control={control}
                                        defaultValue={props.tariff.effectiveTime}
                                        rules={{
                                            required: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Grid container direction="row" xs={12} justifyContent="flex-end" py={2} pr={3} >
                        <Grid px={2}>
                            <Button variant='outlined' onClick={closeDialog} >
                                Close
                            </Button>
                        </Grid>
                        <Grid>
                            <Button variant='contained' type="submit">
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </form>

            </DialogContent>

        </>
    )
}
