import { Button, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useOtherSetting } from '../../../../hooks/reference-data/useOtherSetting';
import { IOtherSetting } from '../../../../state/reference-data/other-setting/othersetting-state';

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
        data.other.vat = convertToNumber(data.other.vat + '');
        data.gridUsed.ft = convertToNumber(data.gridUsed.ft + '');
        data.gridUsed.discountGridUsed = convertToNumber(data.gridUsed.discountGridUsed + '');
        data.energyTradingPayment.dicountAppFees = convertToNumber(data.energyTradingPayment.dicountAppFees + '');
        data.energyTradingPayment.transactionFees = convertToNumber(data.energyTradingPayment.transactionFees + '');
        if (otherSetting) {
            data.id = otherSetting.id;
        }
        console.info(data);
        if (await putOtherSetting(data)) {

            refreshOtherSetting();
            closeDialog();
        };
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
                                                    sx={{ maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                                    sx={{ maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                                    sx={{ maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                                    sx={{ maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                                    sx={{ maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

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
                                    <Grid item container justifyContent="flex-end" xs={'auto'}>
                                        <Controller
                                            render={({ field }) => (
                                                <TextField variant="outlined"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{ maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                                    {...field}
                                                />)}
                                            name="effectiveDate"
                                            control={control}
                                            defaultValue={otherSetting.effectiveDate}
                                            rules={{
                                                required: true,
                                            }}

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
                                            render={({ field }) => (
                                                <TextField variant="outlined"
                                                    margin="dense"

                                                    size='small'
                                                    sx={{ maxWidth: '7em', justifyContent: 'flex-end', textAlignLast: 'end', }}

                                                    {...field}
                                                />)}
                                            name="effectiveTime"
                                            control={control}
                                            defaultValue={otherSetting.effectiveTime}
                                            rules={{
                                                required: true,
                                            }}

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
