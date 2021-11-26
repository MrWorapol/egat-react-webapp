// import { Divider,  } from '@mui/material';
import { Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useNavigationSet } from '../../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import PeriodComponent from '../PeriodComponent';
import DoughnutChart from '../users/DoughnutChart';
import BillingTableComponent from './BillingTableComponent';

export default function BillingReport() {
    useNavigationSet(NavigationCurrentType.BILLING_REPORT);

    return (
        <Box sx={{ width: `100%`, px: 2, pb: 2, maxWidth: '100%', flexGrow: 1 }}>
            <Grid container direction='column' >
                <Grid item container justifyContent='flex-end' id='period-zone' py={2}>
                    <PeriodComponent />
                </Grid>
                <Grid item container >
                    {buildReport('Net Payment','Net Payment Summary')}
                </Grid>
            </Grid>
        </Box>
    )
}


function buildReport(title: string,titleChart: string) {
    return (
        <Box sx={{ flexGrow: 1, width: `100%`, minHeight: '20vh' }}>
            <Grid container direction='row' columns={12} sx={{ backgroundColor: '#fff' }} px={2}>
                <Grid container item xs={6} pr={3} id='left-table' sx={{ borderRight: '1px solid grey', minHeight: '20vh' }}>
                    <Grid item py={1}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>{title}</Typography>
                    </Grid>
                    <Grid container item xs={12}>
                        <BillingTableComponent />
                    </Grid>
                </Grid>
                {/* <Divider orientation="vertical" /> */}
                <Grid container item xs={6} direction='column' sx={{ backgroundColor: '#fff' }} >
                    <Grid item py={1} px={3}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>{titleChart}</Typography>
                    </Grid>
                    <Grid item container justifyContent='center' alignItems='center'>
                        <DoughnutChart
                            labels={['Net Energy Trading Payment : xx.xx Baht (62.0%)', 'Grid Used : xx.xx Baht (21.0%)', 'Wheeling Charge : xx.xx Baht (17.0%)']}
                            datasets={
                                [{
                                    data: [62, 21, 17],
                                    backgroundColor: ['#FFDE00', '#A9C521', '#62A53A'],
                                },
                                ]
                            }
                            width={500}

                        />
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    )
}
