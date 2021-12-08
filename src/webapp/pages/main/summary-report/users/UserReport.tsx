import { Container, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import usePeriodTime from '../../../../hooks/summary-report/usePeriodTime'
import useUserReport from '../../../../hooks/summary-report/user/useUserReport'
import { useNavigationSet } from '../../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../../state/navigation-current-state'
import PeriodComponent from '../PeriodComponent'
import AllArea from './AllArea'
import DoughnutChart from '../../../../components/DoughnutChart'
import LocationSite from './LocationSite'
import SummaryChart from './SummaryChart'

export default function UserReport() {
    useNavigationSet(NavigationCurrentType.USER_REPORT);
    const { chartData, refreshUserData,refreshUserTable} = useUserReport();

    const refreshData = async () => {
        refreshUserData();
        refreshUserTable([],'all');
    }
   
    return (
        <Box sx={{ width: `100%`, px: 2, pb: 2, maxWidth: '100%' }}>
            <Grid container item direction="row" justifyContent='flex-end' id='period-zone' py={1}>
                <Grid item >
                    <PeriodComponent key='user-period' refreshPage={refreshData} />
                </Grid>
            </Grid>
            <Box>
                <Grid container item direction='row' xs={12} >
                    <Grid container item direction='column' id='left-side' xs={6} pr={3}>
                        <Grid container item xs={'auto'} sx={{ backgroundColor: '#fff' }} id='div-area'>
                            <AllArea />
                        </Grid>
                        <Grid container item direction='row' xs={6} sx={{ backgroundColor: '#fff', minHeight: '45vh' }} mt={2} pt={2} pl={2} id='div-chart'>
                            {chartData && <SummaryChart data={chartData} />}
                        </Grid>
                    </Grid>
                    <Grid container item id='right-side' xs={6} px={2} py={2} sx={{ backgroundColor: '#fff' }}>
                        <LocationSite />
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}
