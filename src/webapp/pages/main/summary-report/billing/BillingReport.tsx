import { Divider, Grid } from '@mui/material';
import { Box } from '@mui/system'
import React from 'react'
import { useNavigationSet } from '../../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import PeriodComponent from '../PeriodComponent';

export default function BillingReport() {
    useNavigationSet(NavigationCurrentType.BILLING_REPORT);

    return (
        <Box sx={{ width: `100%`, px: 2, py: 2, maxWidth: '100%', flexGrow: 1 }}>
            <Grid container direction='column' >
                <Grid item container justifyContent='flex-end' id='period-zone'>
                    <PeriodComponent />
                </Grid>
                <Grid item container >
                    {buildReport()}
                </Grid>
            </Grid>
        </Box>
    )
}


function buildReport() {
    return (
        <Box sx={{ flexGrow: 1, width: `100%`, minHeight: '20vh', backgroundColor: '#fff' }}>
            <Grid container direction='row' columns={12}>
                <Grid container item xs={6} height='20vh'>
                </Grid>

                <Divider orientation="vertical" />

                <Grid container item xs={6} height='20vh'>
                </Grid>
            </Grid>
        </Box>
    )
}