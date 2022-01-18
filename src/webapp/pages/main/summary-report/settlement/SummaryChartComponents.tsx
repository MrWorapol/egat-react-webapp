import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import DoughnutChart from '../../../../components/DoughnutChart'
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { ISettlementChart } from '../../../../state/summary-report/settlement-report/settlement-chart-state';

interface IProps {
    data: ISettlementChart,
}
export default function SummaryCharts(props: IProps) {
    const { buyerType, role, status, trade } = props.data;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container item direction='column'>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid container xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Role </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Aggregator ${role.aggregator} (${(role.aggregator * 100 / (role.aggregator + role.prosumer + role.consumer)) || 0})%`,
                        `Prosumer ${role.prosumer} (${(role.prosumer * 100 / (role.aggregator + role.prosumer + role.consumer)) || 0}) %`,
                        `Consumer ${role.consumer} (${(role.consumer * 100 / (role.aggregator + role.prosumer + role.consumer)) || 0}) %`]}
                        datasets={[
                            {
                                data: [role.aggregator, role.prosumer, role.consumer],
                                backgroundColor: [
                                    '#4A90E2',
                                    '#46B61E',
                                    '#E66B4D',
                                ],
                                // hoverOffset: 4,
                            },
                        ]}
                        width={500}

                    />
                </Grid>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Buyer/Seller </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Seller ${buyerType.seller * 100 / (buyerType.seller + buyerType.buyer) || 0} %`,
                        `Buyer ${buyerType.buyer * 100 / (buyerType.seller + buyerType.buyer) || 0} %`]}
                        datasets={[
                            {
                                data: [buyerType.seller, buyerType.buyer],
                                backgroundColor: [
                                    '#61399F',
                                    '#004AAD',
                                ],
                                // hoverOffset: 4,
                            },
                        ]}
                        width={500}
                    />
                </Grid>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Trade Market </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[
                            `Bilateral Trade ${(Math.round(trade.bilateral * 100 / (trade.bilateral + trade.pool)) || 0).toFixed(2)} %`,
                            `Pool Market Trade ${(Math.floor(trade.pool * 100 / (trade.bilateral + trade.pool)) || 0).toFixed(2)} %`]}
                        datasets={[
                            {
                                data: [trade.bilateral, trade.pool],
                                backgroundColor: [
                                    '#61399F',
                                    '#004AAD',
                                ],
                                // hoverOffset: 4,
                            },
                        ]}
                        width={500}
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
                                labels={[`Energy Excess ${(Math.floor(status.energyExcess * 100 / (status.energyExcess + status.energyShortfall))|| 0).toFixed(2)} %`,
                                `Energy Shortfall ${(status.energyShortfall * 100 / (status.energyExcess + status.energyShortfall)|| 0).toFixed(2) } %`,]}
                                datasets={[
                                    {
                                        data: [status.energyExcess, status.energyShortfall],
                                        backgroundColor: [
                                            '#FFBD59',
                                            '#B7A239',
                                        ],
                                        // hoverOffset: 4,
                                    },
                                ]}
                                width={500}
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