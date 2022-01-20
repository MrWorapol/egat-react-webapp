
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useDebouncedCallback } from 'use-debounce/lib';

export default function BillingReport() {
    useNavigationSet(NavigationCurrentType.BILLING_REPORT);
    const { currentState } = useNavigationGet();
    const session = useRecoilValue(userSessionState);
    const [area, setArea] = useState('total');
    const [role, setRole] = useState('all');

    const {
        refreshInvoice,
        netPaymentReport,
        energyPaymentReport,
        gridUsedReport,
        wheelingChargeReport
    } = useBillingReport();



    const refreshPage = useDebouncedCallback(async () => {
        if (session) {
            refreshInvoice(session, role,area);
        }
    }, 0);

    const buildNetPayment = useMemo(() => {
        if (netPaymentReport) {
            return <NetPayment netPayment={netPaymentReport} />
        }
    }, [netPaymentReport])


    const onSelectedDropdown = (event: SelectChangeEvent) => {
        switch (event.target.name) {
            case ('area'): {
                setArea(event.target.value);
                break;
            }
            case ('role'): {
                setRole(event.target.value);
                break;
            }
        }

        refreshPage();
    }

    const buildUserFilterSelect = () => {
        return (
            <>
                <Grid container item xs={3} sx={{ backgroundColor: '#fff' }}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '2em' }}
                            name='role'
                            value={role}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'aggregator'}>Aggregator</MenuItem>
                            <MenuItem value={'prosumer'}>Prosumer</MenuItem>
                            <MenuItem value={'consumer'}>Consumer</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item container xs={'auto'} sx={{ backgroundColor: '#fff' }} ml={4}>
                    <FormControl variant='outlined' >
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={area}
                            name='area'
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                            sx={{ height: '2em' }}
                        >
                            <MenuItem value={'total'}> {'Total'}</MenuItem>
                            <MenuItem value={'3villages'}> {'3 Villages'}</MenuItem>
                            <MenuItem value={'tu'}>{'Thammasat University'}</MenuItem>
                            <MenuItem value={'venueFlow'}>{'VENUE FLOW'}</MenuItem>
                            <MenuItem value={'perfectPark'}>{'Perfect Park'}</MenuItem>
                            <MenuItem value={'casaPermium'}>{'CASA Premium'}</MenuItem>
                            <MenuItem value={'Srisangthum'}>{'Srisangthum'}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </>
        )
    }

    if (session && currentState === NavigationCurrentType.BILLING_REPORT) {
        return (
            <Box sx={{ width: `100%`, px: 2, pb: 2, maxWidth: '100%', flexGrow: 1 }}>
                <Grid container direction='column' spacing={3}>
                    <Grid item container justifyContent='flex-end' id='period-zone' pt={2}>
                        <PeriodComponent key='billing-period' refreshPage={() => { refreshPage() }} />
                    </Grid>
                    <Grid item container justifyContent='flex-end' id='period-zone'  >
                        {buildUserFilterSelect()}
                    </Grid>
                    <Grid item container >
                        {buildNetPayment}
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


