import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/lab';
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



export default function TariffEditDialog(props: ITariffEditProps) {
    const { closeDialog } = useDialog();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<ITouTariff>();
    const { editTOUTariff } = useTOUTariff();

    const onSubmitForm = async (data: ITouTariff) => {
        if (data.effectiveTime) {
            data.effectiveTime = dayjs(data.effectiveDate).startOf('hour').set('hour', +data.effectiveTime).toISOString();
            data.startTime = (`00` + data.startTime).slice(-2)+`:00`;
            data.endTime = (`00` + data.endTime).slice(-2)+`:00`;
            data.bahtPerKWh = Number.parseFloat(data.bahtPerKWh + '');
            let request: ITouTariff = {
                ...data,
                id: props.tariff.id,
                touType: props.tariff.touType, title: props.tariff.title,
            }
            await editTOUTariff(request);
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
                                        control={control}
                                        name="startTime"
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
                                                fullWidth={true}
                                                sx={{ justifyContent: 'flex-end', textAlignLast: 'end', }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            backgroundColor: '#fff',
                                                        }
                                                    }
                                                }}
                                            >
                                                {

                                                }
                                                {Array.from(Array(24)).map((e, i) => {
                                                    return (
                                                        <MenuItem key={`starttime-${i}`} value={`${i}`}> {(`00` + i).slice(-2) + `:00`}</MenuItem>

                                                    )
                                                })}
                                            </Select>
                                        )}
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
                                        control={control}
                                        name="endTime"
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
                                                fullWidth={true}
                                                sx={{ justifyContent: 'flex-end', textAlignLast: 'end', }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            backgroundColor: '#fff',
                                                        }
                                                    }
                                                }}
                                            >
                                                {

                                                }
                                                {Array.from(Array(24)).map((e, i) => {
                                                    return (
                                                        <MenuItem key={`endtime-${i}`} value={`${i}`}> {(`00` + i).slice(-2) + `:00`}</MenuItem>

                                                    )
                                                })}
                                            </Select>
                                        )}
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
                                        control={control}
                                        name="effectiveDate"
                                        defaultValue={dayjs().toString()}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, onBlur, value, ref } }) =>
                                            <DatePicker
                                                views={['year', 'month', 'day']}
                                                minDate={dayjs()}
                                                maxDate={dayjs().add(5, 'year')}
                                                inputFormat='DD/MM/YYYY'
                                                value={value}
                                                onChange={onChange}
                                                renderInput={(params) => (
                                                    <TextField size='small' {...params} sx={{ justifyContent: 'flex-end', textAlignLast: 'end', }} />
                                                )}
                                            />
                                        }
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
                                        control={control}
                                        name="effectiveTime"
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
                                                fullWidth={true}
                                                sx={{ justifyContent: 'flex-end', textAlignLast: 'end', }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            backgroundColor: '#fff',
                                                        }
                                                    }
                                                }}
                                            >
                                                {

                                                }
                                                {Array.from(Array(24)).map((e, i) => {
                                                    return (
                                                        <MenuItem key="i" value={`${i}`}> {(`00` + i).slice(-2) + `:00`}</MenuItem>

                                                    )
                                                })}
                                            </Select>
                                        )}
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
