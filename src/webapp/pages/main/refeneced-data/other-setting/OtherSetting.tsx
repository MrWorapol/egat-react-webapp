import { Button, Container, Divider, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react'
import { useResetRecoilState } from 'recoil';
import { useDialog } from '../../../../hooks/useDialog';
import { useNavigationSet } from '../../../../hooks/useNavigationSet';
import { useOtherSetting } from '../../../../hooks/reference-data/useOtherSetting';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import { otherSettingLogState } from '../../../../state/reference-data/other-setting/othersetting-log';
import OtherSettingEditDialog from './OtherSettingEditDialog';
import OtherSettingLogsDialog from './OtherSettingLogsDialog';

export default function OtherSetting() {
    useNavigationSet(NavigationCurrentType.OTHER_SETTING);
    const { otherSetting } = useOtherSetting();
    const { showDialog } = useDialog();
    const resetLogs = useResetRecoilState(otherSettingLogState);
    if (!otherSetting) {
        return <></>;
    }

    function openViewDialog() {
        resetLogs();
        showDialog(
            {
                content: <OtherSettingLogsDialog />,
                onClose: () => false,
                width: 'md',
                fullWidth: true,


            }
        )
        // throw new Error('Function not implemented.');
    }

    function openEditDialog() {
        showDialog(
            {
                content: <OtherSettingEditDialog />,
                onClose: () => false,
                width: 'md',
                fullWidth: true,


            }
        )
        // throw new Error('Function not implemented.');
    }
    return (
        <Container sx={{ backgroundColor: '#fff', width: '691px', px: 2, py: 2 }}>

            <Grid item container direction="row" alignItems="center" spacing={2}>
                <Grid item id="title" alignItems="center">
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        Other Setting
                    </Typography>
                </Grid>
                <Grid item alignItems="end">
                    <Typography sx={{ fontSize: '1em', }}>
                        {`Effective Date From: ${dayjs(otherSetting.effectiveDateTime).format('DD/MM/YYYY HH:mm')}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container direction="column" pt={3} px={10} spacing={1}>
                <Grid container item alignItems="center" id='energy-trading-payment'>
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        Energy Trading Payment
                    </Typography>
                    <Grid container direction='row' justifyContent="space-between">
                        <Typography sx={{}}>
                            (App) Transaction Fees
                        </Typography>
                        <Typography>
                            {`${otherSetting.energyTradingPayment.transactionFees} Baht/kWh`}
                        </Typography>
                    </Grid>
                    <Grid container direction='row' justifyContent="space-between">
                        <Typography sx={{}}>
                            Discount App Fees
                        </Typography>
                        <Typography>
                            {`${otherSetting.energyTradingPayment.dicountAppFees} %`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid py={2} id='divider-1'>
                    <Divider />
                </Grid>
                <Grid container item id='grid-used'>
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        Grid Used
                    </Typography>
                    <Grid container direction='row' justifyContent="space-between">
                        <Typography sx={{}}>
                            Ft
                        </Typography>
                        <Typography>
                            {`${otherSetting.gridUsed.ft} Baht/kWh`}
                        </Typography>
                    </Grid>
                    <Grid container direction='row' justifyContent="space-between">
                        <Typography sx={{}}>
                            Discount Grid Used
                        </Typography>
                        <Typography>
                            {`${otherSetting.gridUsed.discountGridUsed} %`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid py={2} id='divider-2'>
                    <Divider />
                </Grid>
                <Grid container item id="other">
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        Other
                    </Typography>
                    <Grid container direction='row' justifyContent="space-between">
                        <Typography sx={{}}>
                            Vat
                        </Typography>
                        <Typography>
                            {`${otherSetting.other.vat} %`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justifyContent='flex-end' direction='row' pt={2}>
                    <Grid px={2}>
                        <Button variant='outlined' onClick={() => openViewDialog()}>
                            View
                        </Button>
                    </Grid>
                    <Grid >

                        <Button variant='contained' type="submit" onClick={() => openEditDialog()}>
                            Edit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}


