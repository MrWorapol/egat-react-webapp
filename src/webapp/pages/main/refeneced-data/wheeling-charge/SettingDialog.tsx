import { DatePicker } from '@mui/lab';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useWheelingCharge } from '../../../../hooks/reference-data/useWheelingCharge';
import { IWheelingCharge } from '../../../../state/reference-data/wheeling-chart/wheeling-charge-state';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

interface ISettingProps {
    no: number,
    wheelingCharge: IWheelingCharge,
}


export default function SettingDialog(props: ISettingProps) {
    const { closeDialog } = useDialog();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<IWheelingCharge>();
    const { updatedWheelingCharge } = useWheelingCharge();

    const onSubmitForm = (data: IWheelingCharge) => {
        let effectiveTime = '';
        if (data.effectiveTime) {
            effectiveTime = dayjs(data.effectiveDate).startOf('hour').set('hour', +data.effectiveTime).toISOString();
        }
        let request: IWheelingCharge = {
            id: props.wheelingCharge.id,
            title: props.wheelingCharge.title,
            wheelingType: props.wheelingCharge.wheelingType,
            effectiveDate: dayjs(data.effectiveDate).startOf('hour').toISOString(),
            effectiveTime: effectiveTime,
            note: props.wheelingCharge.note,
            bahtPerKWh: +data.bahtPerKWh || 0,
            mea: +data.mea || 0,
            pea: +data.pea || 0,
            meaEgat: +data.meaEgat || 0,
            peaEgat: +data.peaEgat || 0,
            meaPeaEgat: +data.meaPeaEgat || 0,
        }
        console.info(request);
        updatedWheelingCharge(request);
    }
    return (
        <>
            <DialogTitle>
                <Typography color="secondary.main" variant="h6" sx={{ fontWeight: "bold" }}>
                    {`No.${props.no + 1} ${props.wheelingCharge.title}`}
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
                                        sx={{ ml: 2, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                        sx={{ ml: 2, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                        sx={{ ml: 2, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                        sx={{ ml: 2, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                        sx={{ ml: 2, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                        sx={{ ml: 2, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', mt: 1, }}>
                            <Typography>
                                Effective Date
                            </Typography>
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
                                            <TextField size='small' {...params} sx={{ ml: 10, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }} />
                                        )}
                                    />
                                }
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', mt: 1 }}>
                            <Typography>
                                Effective Time
                            </Typography>

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
                                        sx={{ ml: 1, maxWidth: '8em', justifyContent: 'flex-end', textAlignLast: 'end', }}
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
                                            return (
                                                <MenuItem key="i" value={`${i}`}> {(`00` + i).slice(-2) + `:00`}</MenuItem>

                                            )
                                        })}
                                    </Select>
                                )}
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


