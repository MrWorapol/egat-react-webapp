import { Button, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/lab';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useImbalance } from '../../../../hooks/reference-data/useImbalance';
import { Iimbalance } from '../../../../state/reference-data/imbalance/imbalance-state';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);


interface ISettingProps {
    no: number,
    imbalance: Iimbalance,
}

const scenario = [
    { value: `Grid (DSO/EGAT) รับซื้อด้วยอัตรา` },
    { value: `ได้รับเงินจากผู้ซื้อเต็มจำนวนตามปริมาณที่ได้ตกลงซื้อขายไว้ แต่ต้องซื้อไฟจาก Grid เข้าไปชดเชยส่วนที่ขาดส่ง (อัตรา TOU)` },
    { value: `ซื้อไฟฟ้าส่วนที่ใช้เกินจาก Grid (อัตรา TOU)` },
    { value: `จ่ายเงินให้ผู้ขายตามจำนวนที่ใช้จริง + บทลงโทษเท่ากับค่าไฟส่วนต่างระหว่างค่าไฟที่ตกลงซื้อขายกัน - ค่าไฟที่ Grid (DSO/EGAT) ต้องรับซื้อไฟส่วนเกินที่ใช้ไม่ครบนั้น` },
]

const clearing = [
    { value: 'Solar ภาคประชาชน' },
    { value: 'Peak' },
    { value: 'Off Peak' },
    { value: 'Commited price - ราคาที่่ Grid รับซื้อ' },
]

export default function ImbalanceSettingDialog(props: ISettingProps) {
    const { closeDialog } = useDialog();
    const { handleSubmit, watch, formState: { errors }, control } = useForm<Iimbalance>();
    const watchClearing = watch("imbalanceClearing");
    const [customGridChecked, setCustomGridChecked] = useState(false);
    const { updateImbalance } = useImbalance();
    const handleCheckSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomGridChecked(event.target.checked);
    };
    const onSubmitForm = (data: Iimbalance) => {
        // console.log(`onSubmit edit imbalcne ${data.effectiveTime}`);
        data.effectiveDate = dayjs(data.effectiveDate).startOf('day').toISOString();
        data.effectiveTime = dayjs(data.effectiveDate).startOf('hour').set('hour', +data.effectiveTime).toISOString();
        const requestData: Iimbalance = {
            // ...data,
            id: props.imbalance.id,
            type: props.imbalance.type,
            imbalance: props.imbalance.imbalance,
            scenario: props.imbalance.scenario,
            imbalanceClearing: props.imbalance.imbalanceClearing,
            effectiveDate: data.effectiveDate,
            effectiveTime: data.effectiveTime,
            bahtPerKWh: data.bahtPerKWh,
        };
        console.info(requestData);
        updateImbalance(requestData);
    }
    return (
        <>
            <DialogTitle>
                <Typography color="secondary.main" variant="h6" sx={{ fontWeight: "bold" }}>
                    Edit Imbalance
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <DialogContent sx={{}}>
                        <Box> {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}> */}
                            <Grid container item direction="column" spacing={2}>
                                <Grid item >
                                    <Typography sx={{ fontSize: '1.2em', color: '#707070' }}>
                                        Imbalance
                                    </Typography>
                                    <Typography pt={1}>
                                        {props.imbalance.imbalance}
                                    </Typography>

                                </Grid>
                                <Grid item container>
                                    <Grid item xs={12}>
                                        <Typography sx={{ fontSize: '1.2em', color: '#707070' }}>
                                            Scenario
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography pt={1}>
                                            {props.imbalance.scenario}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container>
                                    <Grid item xs={12} >
                                        <Typography sx={{ fontSize: '1.2em', color: '#707070' }}>
                                            Imbalance Clearing
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography pt={1}>
                                            {props.imbalance.imbalanceClearing}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container>
                                    <Grid item xs={12}>
                                        <Typography sx={{ fontSize: '1.2em', color: '#707070' }}>
                                            Baht/kWh
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller

                                            render={({ field }) => (
                                                <TextField variant="standard"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{}}
                                                    fullWidth={true}
                                                    {...field}
                                                />)}
                                            name="bahtPerKWh"
                                            control={control}
                                            defaultValue={props.imbalance.bahtPerKWh}
                                            rules={{
                                                required: true,
                                            }}

                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Grid container xs={7} direction="row" alignItems="center">
                                        <Grid>
                                            <Typography >
                                                Effective Date
                                            </Typography>
                                        </Grid>
                                        <Grid>

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
                                                            <TextField size='small' {...params} sx={{ ml: 1, maxWidth: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }} />
                                                        )}
                                                    />
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container xs={5} direction="row" alignItems="center" justifyContent="flex-end">
                                        <Typography >
                                            Effective Time
                                        </Typography>
                                        <Controller
                                            control={control}
                                            name="effectiveTime"
                                            rules={{
                                                required: true,
                                            }}
                                            defaultValue={`0`}

                                            render={({ field }) => (
                                                <Select variant="outlined"
                                                    {...field}
                                                    margin="dense"
                                                    size='small'
                                                    sx={{ ml: 1, maxWidth: '5em', justifyContent: 'flex-end', textAlignLast: 'end', }}
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
                                                            <MenuItem key={`${i}-${props.no}`} value={`${i}`}> {(`00` + i).slice(-2) + `:00`}</MenuItem>

                                                        )
                                                    })}
                                                </Select>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" xs={12} justifyContent="flex-end" pt={2} >
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
                            </Grid>

                        </Box>
                    </DialogContent>

                </form>
            </DialogContent>
        </>
    )
}
