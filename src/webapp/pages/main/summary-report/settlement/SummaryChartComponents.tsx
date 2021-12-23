import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import DoughnutChart from '../../../../components/DoughnutChart'
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';

export default function SummaryCharts() {

    const { } = useSettlementReport();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container item direction='column'>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Role </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Aggregator`, 'Prosumer', 'Consumer']}
                        datasets={[
                            {
                                data: [6, 12, 2],
                                backgroundColor: [
                                    '#4A90E2',
                                    '#46B61E',
                                    '#E66B4D',
                                ],
                                // hoverOffset: 4,
                            },
                        ]}
                        width={600}

                    />
                </Grid>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Buyer/Seller </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Seller`, 'Buyer']}
                        datasets={[
                            {
                                data: [12, 36],
                                backgroundColor: [
                                    '#61399F',
                                    '#004AAD',
                                ],
                                // hoverOffset: 4,
                            },
                        ]}
                        width={600}
                    />
                </Grid>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Trade Market </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Bilateral Trade `, 'Pool Market Trade']}
                        datasets={[
                            {
                                data: [4, 12],
                                backgroundColor: [
                                    '#61399F',
                                    '#004AAD',
                                ],
                                // hoverOffset: 4,
                            },
                        ]}
                        width={1}
                    />
                </Grid>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Summary by Order Status</Typography>
                    </Grid>
                    <Grid container item direction='row' justifyContent='space-between' alignItems='center'>
                        <Grid item alignItems='center'>
                            <Button sx={{ color: '#000', fontSize: '2em', fontWeight: 'bold' }}>
                                {'<'}
                            </Button>
                        </Grid>
                        <Grid>
                            <DoughnutChart
                                labels={[`Matched`, 'Open',]}
                                datasets={[
                                    {
                                        data: [16, 4],
                                        backgroundColor: [
                                            '#61399F',
                                            '#004AAD',
                                        ],
                                        // hoverOffset: 4,
                                    },
                                ]}
                                width={400}
                            />
                        </Grid>
                        <Grid>
                            <Button sx={{ color: '#000', fontSize: '2em', fontWeight: 'bold' }}>
                                {'>'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    )
}


function buildImbalanceChart() {
    return (
        <>
        </>
    )
}