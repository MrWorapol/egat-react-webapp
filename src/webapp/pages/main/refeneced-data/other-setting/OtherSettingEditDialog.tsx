import { Button, DialogContent, DialogTitle, Divider, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useOtherSetting } from '../../../../hooks/reference-data/useOtherSetting';
import { IOtherSetting } from '../../../../state/reference-data/other-setting/othersetting-state';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);


export default function OtherSettingEditDialog() {
    const { closeDialog } = useDialog();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<IOtherSetting>();
    const { otherSetting, putOtherSetting, refreshOtherSetting } = useOtherSetting();


    function convertToNumber(value: string) {
        if (Number.isNaN(Number.parseFloat(value))) {
            return -999;
        } else {
            return Number.parseFloat(value);
        }
    }

    const onSubmitForm = async (data: IOtherSetting) => {
        // let request: IOtherSetting = {
        //     ...data,
        //     id: props.wheelingCharge.id,
        //     wheelingType: props.wheelingCharge.wheelingType,
        // }
        if (otherSetting) {
            let request: IOtherSetting = {
                id: otherSetting.id,
                effectiveDate: dayjs(data.effectiveDate).startOf('hour').toISOString(),
                effectiveTime: dayjs(data.effectiveDate).startOf('hour').set('hour', +data.effectiveTime).toISOString(),
                energyTradingPayment: {
                    dicountAppFees: +data.energyTradingPayment.dicountAppFees,
                    transactionFees: +data.energyTradingPayment.transactionFees
                },
                other: {
                    vat: +data.other.vat,
                },
                gridUsed: {
                    discountGridUsed: +data.gridUsed.discountGridUsed,
                    ft: +data.gridUsed.ft
                }
            }
            // data.other.vat = +data.other.vat;
            // data.gridUsed.ft = +data.gridUsed.ft;
            // data.gridUsed.discountGridUsed = +data.gridUsed.discountGridUsed;
            // data.energyTradingPayment.dicountAppFees = +data.energyTradingPayment.dicountAppFees;
            // data.energyTradingPayment.transactionFees = +data.energyTradingPayment.transactionFees;
            // data.effectiveTime = dayjs(data.effectiveDate).startOf('hour').set('hour', +data.effectiveTime).toISOString();
            // data.effectiveDate = dayjs(data.effectiveDate).startOf('hour').toISOString();

            console.info(data);
            if (await putOtherSetting(request)) {

                refreshOtherSetting();
                closeDialog();
            };
        }
    }

    if (!otherSetting) {//guard 
        closeDialog(); return <></>;
    }

    return (
        <>
            <DialogTitle>
                <Typography color="secondary.main" variant="h6" sx={{ fontWeight: "bold" }}>
                    Edit Other Setting
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container direction="column" pt={3} px={1} spacing={1}>
                        <Grid container item alignItems="center" id='energy-trading-payment' >
                            <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                                Energy Trading Payment
                            </Typography>
                            <Grid container direction='row' justifyContent="space-between" alignItems="center" id='transactions-fee'>
                                <Grid item xs={8}>
                                    <Typography sx={{}}>
                                        (App) Transaction Fees
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4} direction="row" justifyContent="flex-end" alignItems="center">
                                    <Grid item container justifyContent="flex-end" xs={'auto'}>
                                        <Controller
                                            render={({ field }) => (
                                                <TextField variant="outlined"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{ width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                                    {...field}
                                                />)}
                                            name="energyTradingPayment.transactionFees"
                                            control={control}
                                            defaultValue={otherSetting.energyTradingPayment.transactionFees}
                                            rules={{
                                                required: true,
                                            }}

                                        />
                                    </Grid>
                                    <Grid container xs={5} pl={1}  >
                                        <Typography>
                                            {`Baht/kWh`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction='row' justifyContent="space-between" alignItems="center" id='discount-app-fee'>
                                <Grid item xs={8}>
                                    <Typography sx={{}}>
                                        Discount App Fees
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4} direction="row" justifyContent="flex-end" alignItems="center">
                                    <Grid item container justifyContent="flex-end" xs={'auto'}>
                                        <Controller
                                            render={({ field }) => (
                                                <TextField variant="outlined"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{ width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                                    {...field}
                                                />)}
                                            name="energyTradingPayment.dicountAppFees"
                                            control={control}
                                            defaultValue={otherSetting.energyTradingPayment.dicountAppFees}
                                            rules={{
                                                required: true,
                                            }}

                                        />
                                    </Grid>
                                    <Grid container xs={5} pl={1}  >
                                        <Typography>
                                            {`%`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid py={2} id='divider-1'>
                            <Divider />
                        </Grid>
                        <Grid container item id='grid-used'>
                            <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                                Grid Used
                            </Typography>
                            <Grid container direction='row' justifyContent="space-between" alignItems="center" id='transactions-fee'>
                                <Grid item xs={8}>
                                    <Typography sx={{}}>
                                        Ft
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4} direction="row" justifyContent="flex-end" alignItems="center">
                                    <Grid item container justifyContent="flex-end" xs={'auto'}>
                                        <Controller
                                            render={({ field }) => (
                                                <TextField variant="outlined"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{ width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                                    {...field}
                                                />)}
                                            name="gridUsed.ft"
                                            control={control}
                                            defaultValue={otherSetting.gridUsed.ft}
                                            rules={{
                                                required: true,
                                            }}

                                        />
                                    </Grid>
                                    <Grid container xs={5} pl={1}  >
                                        <Typography>
                                            {`Baht/kWh`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction='row' justifyContent="space-between" alignItems="center" id='discount-app-fee'>
                                <Grid item xs={8}>
                                    <Typography sx={{}}>
                                        Discount Grid Used
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4} direction="row" justifyContent="flex-end" alignItems="center">
                                    <Grid item container justifyContent="flex-end" xs={'auto'}>
                                        <Controller
                                            render={({ field }) => (
                                                <TextField variant="outlined"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{ width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                                    {...field}
                                                />)}
                                            name="gridUsed.discountGridUsed"
                                            control={control}
                                            defaultValue={otherSetting.gridUsed.discountGridUsed}
                                            rules={{
                                                required: true,
                                            }}

                                        />
                                    </Grid>
                                    <Grid container xs={5} pl={1}  >
                                        <Typography>
                                            {`%`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid py={2} id='divider-2'>
                            <Divider />
                        </Grid>
                        <Grid container item id="other">
                            <Grid container direction='row' justifyContent="space-between" alignItems="center" id='vat'>
                                <Grid item xs={8}>
                                    <Typography sx={{}}>
                                        Vat
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4} direction="row" justifyContent="flex-end" alignItems="center">
                                    <Grid item container justifyContent="flex-end" xs={'auto'}>
                                        <Controller
                                            render={({ field }) => (
                                                <TextField variant="outlined"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{ width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                                    {...field}
                                                />)}
                                            name="other.vat"
                                            control={control}
                                            defaultValue={otherSetting.other.vat}
                                            rules={{
                                                required: true,
                                            }}

                                        />
                                    </Grid>
                                    <Grid container xs={5} pl={1}  >
                                        <Typography>
                                            {`%`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction='row' justifyContent="space-between" alignItems="center" id='effective-date'>
                                <Grid item xs={8}>
                                    <Typography sx={{}}>
                                        Effective Date
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4} direction="row" justifyContent="flex-end" alignItems="center">
                                    <Grid item container justifyContent="flex-end" xs={'auto'} my={1}>
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
                                                        <TextField size='small' {...params} sx={{ width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }} />
                                                    )}
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid container xs={5} pl={1}  >

                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction='row' justifyContent="space-between" alignItems="center" id='effective-time'>
                                <Grid item xs={8}>
                                    <Typography sx={{}}>
                                        Effective Time
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4} direction="row" justifyContent="flex-end" alignItems="center">
                                    <Grid item container justifyContent="flex-end" xs={'auto'}>
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

                                                    sx={{ width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }}
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
                                    <Grid container xs={5} pl={1}  >

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid py={2} id='divider-3'>
                            <Divider />
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
                </form>
            </DialogContent>
        </>
    )
}
