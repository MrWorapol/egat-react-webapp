import { Button, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/lab';

import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { IServiceCharge } from '../../../../state/reference-data/tou-traff/tou-service-charge-state';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTOUTariff } from '../../../../hooks/reference-data/useTOUTariff';
dayjs.extend(utc);
dayjs.extend(timezone);


interface IServiceChargeEditProps {
    serviceCharge: IServiceCharge
}

interface IMap {
    [key: string]: string,
}

const typeLabel: IMap = {
    'tou-1': '2.1 PEA แรงดัน 22-33 kV, MEA แรงดัน 12-24 kV',
    'tou-2': '2.2 PEA แรงดัน <22 kV, MEA แรงดัน <12 kW',
}

export default function ServiceChargeDialog(props: IServiceChargeEditProps) {
    const { closeDialog } = useDialog();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<IServiceCharge>();
    const { editServiceCharge } = useTOUTariff();

    const onSubmitForm = async (data: IServiceCharge) => {
        data.bahtPerMonth = Number.parseFloat(data.bahtPerMonth + '');
        let effectiveTime = '';
        if (data.effectiveHour && data.effectiveMinute) {
            effectiveTime = dayjs(data.effectiveDate).hour(+data.effectiveHour).minute(+data.effectiveMinute).toISOString();
        }
        let request: IServiceCharge = {
            ...data,
            touType: props.serviceCharge.touType,
            effectiveTime: effectiveTime,

        }
        if (await editServiceCharge(request)) {
            closeDialog();
        }
    }

    return (
        <>
            <DialogTitle>
                <Typography sx={{ fontSize: '1.3em' }}>
                    {` ${typeLabel[props.serviceCharge.touType]}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Box alignItems='center' justifyContent='center' display='flex'>
                        <Grid container direction="column" spacing={1} alignItems='center' sx={{ minWidth: '300px', width: '60%' }}>

                            <Grid item container direction='row' justifyContent="space-between" alignItems="center" id='Start-time'>
                                <Grid item xs={'auto'}>
                                    <Typography sx={{}}>
                                        ค่าบริการ (Baht/Month)
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
                                        name="bahtPerMonth"
                                        control={control}
                                        defaultValue={props.serviceCharge.bahtPerMonth}
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

            </DialogContent >

        </>
    )
}
