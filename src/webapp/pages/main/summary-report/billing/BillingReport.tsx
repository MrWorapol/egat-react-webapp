
import {  Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigationSet } from '../../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import PeriodComponent from '../PeriodComponent';

import useBillingReport from '../../../../hooks/summary-report/billing/useBillingReport';
import GridUsed from './GridUsed/GridUsed';
import NetEnergyTrading from './NetEnergyTrading/NetEnergyTrading';
import WheelingChargeReport from './WheelingCharge/WheelingChargeReport';
import NetPayment from './NetPayment/NetPayment';
import { useNavigationGet } from '../../../../hooks/useNavigationGet';
import { useRecoilValue } from 'recoil';
import { userSessionState } from '../../../../state/user-sessions';

export default function BillingReport()  {
    useNavigationSet(NavigationCurrentType.BILLING_REPORT);
    const session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();

    const {
        refreshInvoice,
        netPaymentReport,
        energyPaymentReport,
        gridUsedReport,
        wheelingChargeReport
    } = useBillingReport();



    const refreshPage = useCallback(async () => {
        refreshInvoice();
    }, []);

    useEffect(() => {

        return () => {

        }
    }, [netPaymentReport, energyPaymentReport, gridUsedReport, wheelingChargeReport])
    if (session && currentState === NavigationCurrentType.BILLING_REPORT) {
        return (
            <Box sx={{ width: `100%`, px: 2, pb: 2, maxWidth: '100%', flexGrow: 1 }}>
                <Grid container direction='column' spacing={3}>
                    <Grid item container justifyContent='flex-end' id='period-zone' py={2}>
                        <PeriodComponent key='billing-period' refreshPage={refreshPage} />
                    </Grid>
                    <Grid item container >
                        {netPaymentReport && <NetPayment netPayment={netPaymentReport} />}
                    </Grid>
                    <Grid item container >
                        {energyPaymentReport && <NetEnergyTrading netEnergyTrading={energyPaymentReport} />}
                    </Grid>
                    <Grid item container >
                        {gridUsedReport && <GridUsed gridUsedData={gridUsedReport} />}
                    </Grid>
                    <Grid item container >
                        {wheelingChargeReport && <WheelingChargeReport wheelingChargeReport={wheelingChargeReport} />}
                    </Grid>
                </Grid>
            </Box>
        )
    } else {
        console.log(`cannot load page`);
        return <>Loading...</>;
    }
}


