import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import DoughnutChart from '../../../../components/DoughnutChart'
import { IOrderChart } from '../../../../state/summary-report/order-report/order-chart-state'

interface IProps {
    data: IOrderChart,
}

export default function SummaryComponents(props: IProps) {
    const { trade, status, role, buyerType } = props.data;
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container item direction='column'>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} py={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Role </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Aggregator ${role.aggregator} (${role.aggregator * 100 / (role.aggregator + role.prosumer + role.consumer)})%`, `Prosumer ${role.prosumer * 100 / (role.aggregator + role.prosumer + role.consumer)} %`, `Consumer ${role.consumer * 100 / (role.aggregator + role.prosumer + role.consumer)} %`]}
                        datasets={[
                            {
                                data: [Number((Math.round(role.aggregator * 100) / 100).toFixed(2)), role.prosumer, role.consumer],
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
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} py={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Buyer/Seller </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Seller ${(Math.round(buyerType.seller * 100 / (buyerType.seller + buyerType.buyer) * 100) / 100).toFixed(2)} %`,
                        `Buyer ${(Math.round(buyerType.buyer * 100 / (buyerType.seller + buyerType.buyer) * 100) / 100).toFixed(2)} %`]}
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
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} py={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Trade Market </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Bilateral Trade ${(Math.round((trade.bilateral * 100 / (trade.bilateral + trade.pool)) * 100) / 100).toFixed(2)} %`,
                        `Pool Market Trade ${(Math.round(trade.pool * 100 / (trade.bilateral + trade.pool) * 100 / 100).toFixed(2))} %`]}
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
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} py={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Summary by Order Status</Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Matched ${Math.round(status.matched * 100 / (status.matched + status.open) * 100 / 100).toFixed(2)} %`, 
                                `Open ${Math.round(status.open * 100 / (status.matched + status.open)*100/100).toFixed(2)} %`,]}
                        datasets={[
                            {
                                data: [status.matched, status.open],
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
            </Grid>
        </Box>
    )
}
