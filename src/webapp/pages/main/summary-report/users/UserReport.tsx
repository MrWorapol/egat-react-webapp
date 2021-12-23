import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import useUserReport from '../../../../hooks/summary-report/user/useUserReport'
import { useNavigationGet } from '../../../../hooks/useNavigationGet'
import { useNavigationSet } from '../../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../../state/navigation-current-state'
import PeriodComponent from '../PeriodComponent'
import AllArea from './AllArea'
import LocationSite from './LocationSite'
import SummaryChart from './SummaryChart'
var count = 1;
export default function UserReport() {
    useNavigationSet(NavigationCurrentType.USER_REPORT);
    const { currentState } = useNavigationGet();
    console.warn(count);
    count += 1;
    const { chartData, refreshUserData, refreshUserTable } = useUserReport();

    const refreshData = async () => {
        console.log(`call refreshData Page`);
        refreshUserData();
        refreshUserTable([], 'all');
    }
    if (currentState === NavigationCurrentType.USER_REPORT) {
        return (
            <Box sx={{ width: `100%`, px: 2, pb: 2, maxWidth: '100%' }}>
                <Grid container item direction="row" justifyContent='flex-end' id='period-zone' py={1}>
                    <Grid item >
                        <PeriodComponent key='user-period' refreshPage={refreshData} />
                    </Grid>
                </Grid>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container item direction='row' xs={12} >
                        <Grid container item direction='row' id='left-side' xs={6} pr={3}>
                            <Grid container item xs={12} sx={{ backgroundColor: '#fff' }} id='div-area'>
                                <AllArea />
                            </Grid>
                            <Grid container item direction='row' xs={12} sx={{ backgroundColor: '#fff' }} mt={2} pt={2} id='div-chart'>
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
    } else {
        return (
            <>
            ...Loading 
            </>
        )
    }
}
