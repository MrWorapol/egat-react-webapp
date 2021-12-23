import React, { useCallback, useState } from 'react'
import { useNavigationSet } from '../../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import { Container, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { Box } from '@mui/system'
import SettlementDetail from './SettlementDetail';
import SummaryCharts from './SummaryChartComponents';
import AllSettlementComponent from './AllSettlementComponent';
import PeriodComponent from '../PeriodComponent';
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
export default function SettlementReport() {
    useNavigationSet(NavigationCurrentType.SETTLEMENT_REPORT);

    const { refreshSettlementReport } = useSettlementReport();

    const refreshPage = useCallback(async () => {
        refreshSettlementReport('all', 'all', 'all', 'all', 'all');
    }, []);

    return (
        <Box sx={{ width: `100%`, px: 2, pb: 2, maxWidth: '100%' }}>
            <Grid container item direction="row" justifyContent='flex-end' id='period-zone' mb={1}>
                <Grid item >
                    <PeriodComponent key='settlement-period' refreshPage={refreshPage} />

                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container item direction='row' xs={12} >
                    <Grid container item direction='column' id='left-side' xs={6} pr={3}>
                        <Grid container item xs={'auto'} sx={{ backgroundColor: '#fff' }} id='div-area'>
                            <AllSettlementComponent />
                        </Grid>
                        <Grid container item direction='row' xs={'auto'} sx={{ backgroundColor: '#fff' }} mt={2} pt={2} pl={2} id='div-chart'>
                            <SettlementDetail />
                        </Grid>
                    </Grid>
                    <Grid container item id='right-side' xs={6} >
                        <SummaryCharts />
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}
