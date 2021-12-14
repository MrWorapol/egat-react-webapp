import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useOtherSetting } from '../../../../hooks/reference-data/useOtherSetting';
import { useTOUTariff } from '../../../../hooks/reference-data/useTOUTariff';
import { IOtherSetting } from '../../../../state/reference-data/other-setting/othersetting-state';
import { ITouTariff } from '../../../../state/reference-data/tou-traff/tou-tariff-state';
import { touTypeLabel } from './TOUTariff';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

interface ITariffEditProps {
    tariff: ITouTariff
}

const time = ['00', '']


export default function TariffEditDialog(props: ITariffEditProps) {
    const { closeDialog } = useDialog();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<ITouTariff>();
    const { editTOUTariff } = useTOUTariff();

    const onSubmitForm = async (data: ITouTariff) => {
        let effectiveTime = '';
        if (data.effectiveHour && data.effectiveMinute) {
            effectiveTime = dayjs(data.effectiveDate).hour(+data.effectiveHour).minute(+data.effectiveMinute).toISOString();
        }
        data.bahtPerKWh = Number.parseFloat(data.bahtPerKWh + '');
        let request: ITouTariff = {
            ...data,
            id: props.tariff.id,
            touType: props.tariff.touType, title: props.tariff.title,
            effectiveTime: effectiveTime,
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
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', alignItems: 'center', mt: 1 }}>
                                        <Controller
                                            control={control}
                                            name="effectiveHour"
                                            // defaultValue={dayjs(props.wheelingCharge.effectiveTime).format('HH')}
                                            rules={{
                                                required: true,
                                            }}
                                            defaultValue={`0`}

                                            render={({ field }) => (
                                                <Select variant="outlined"
                                                    {...field}
                                                    margin="dense"
                                                    size='small'
                                                    sx={{ ml: 2, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: '40vh',
                                                                backgroundColor: '#fff',
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {

                                                    }
                                                    {Array.from(Array(24)).map((e, i) => {
                                                        console.log(e);
                                                        return (
                                                            <MenuItem value={`${i}`}> {(`00` + i).slice(-2)}</MenuItem>

                                                        )
                                                    })}
                                                </Select>
                                            )}
                                        />
                                        <Typography mx={1}>:</Typography>
                                        <Controller
                                            control={control}
                                            name="effectiveMinute"
                                            // defaultValue={dayjs(props.wheelingCharge.effectiveTime).format('HH')}
                                            rules={{
                                                required: true,
                                            }}
                                            defaultValue={`0`}
                                            render={({ field }) => (

                                                <Select variant="outlined"
                                                    {...field}
                                                    margin="dense"
                                                    size='small'
                                                    sx={{ maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: '40vh',
                                                                backgroundColor: '#fff',
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {

                                                    }
                                                    {Array.from(Array(60)).map((e, i) => {
                                                        return (
                                                            <MenuItem value={`${i}`}> {(`00` + i).slice(-2)}</MenuItem>

                                                        )
                                                    })}
                                                </Select>
                                            )}
                                        />
                                    </Box>
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
