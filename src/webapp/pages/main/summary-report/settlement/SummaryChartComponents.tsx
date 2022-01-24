import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import DoughnutChart from '../../../../components/DoughnutChart'
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { ISettlementChart } from '../../../../state/summary-report/settlement-report/settlement-chart-state';

interface IProps {
    data: ISettlementChart,
}

interface INetImbalanceAmountByStatus {
    sellerUnderCommit: number,
    sellerOverCommit: number,
    buyerUnderCommit: number,
    buyerOverCommit: number
}

interface INetImbalanceAmount {
    netSale: number,
    netBuy: number,
    netAll: number
}

interface IStatus {
    energyExcess: number,
    energyShortfall: number,

}

export default function SummaryCharts(props: IProps) {
    const { buyerType, role, trade, status, netImbalanceAmountByStatus, netImbalanceAmount } = props.data;
    const [imbalanceChartState, setimbalanceChartState] = useState(1);

    const handlePreviousChart = () => {
        // console.log(Math.abs((imbalanceChartState - 1) % 4));
        setimbalanceChartState((imbalanceChartState - 1) % 4);
    }
    const handleNextChart = () => {
        // console.log(Number(Math.max(1, (imbalanceChartState + 1 % 3))))
        setimbalanceChartState((imbalanceChartState + 1) % 4);
    }

    useEffect(() => {
    }, [imbalanceChartState])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container item direction='column'>
                <Grid container item xs={'auto'} direction='row' justifyContent="center" alignItems="center" px={2} pt={2} my={1} sx={{ backgroundColor: '#fff' }}>
                    <Grid container xs={12}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}> Summary by Role </Typography>
                    </Grid>
                    <DoughnutChart
                        labels={[`Aggregator ${role.aggregator} (${(role.aggregator * 100 / (role.aggregator + role.prosumer + role.consumer)).toFixed(2) || 0}%)`,
                        `Prosumer ${role.prosumer} (${(role.prosumer * 100 / (role.aggregator + role.prosumer + role.consumer)).toFixed(2) || 0}%)`,
                        `Consumer ${role.consumer} (${(role.consumer * 100 / (role.aggregator + role.prosumer + role.consumer)).toFixed(2) || 0}%)`]}
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
                        labels={[`Seller ${buyerType.seller} (${(buyerType.seller * 100 / (buyerType.seller + buyerType.buyer)).toFixed(2) || 0}%)`,
                        `Buyer ${buyerType.buyer} (${(buyerType.buyer * 100 / (buyerType.seller + buyerType.buyer)).toFixed(2) || 0}%)`]}
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
                            `Bilateral Trade ${trade.bilateral} (${(Math.round(trade.bilateral * 100 / (trade.bilateral + trade.pool)) || 0).toFixed(2)}%)`,
                            `Pool Market Trade ${trade.pool} (${(Math.floor(trade.pool * 100 / (trade.bilateral + trade.pool)) || 0).toFixed(2)}%)`]}
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
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Summary by Imbalance</Typography>
                    </Grid>
                    <Grid container item direction='row' justifyContent='space-between' alignItems='center'>
                        <Grid item alignItems='center'>
                            <Button sx={{ color: '#000', fontSize: '2em', fontWeight: 'bold' }} onClick={handlePreviousChart} disabled={imbalanceChartState === 1}>
                                {'<'}
                            </Button>
                        </Grid>
                        <Grid>

                            {imbalanceChartState === 1 && buildImbalanceStatusChart(status)}
                            {imbalanceChartState === 2 && buildImbalanceAmountChart(netImbalanceAmountByStatus)}
                            {imbalanceChartState === 3 && buildNetAmount(netImbalanceAmount)}

                        </Grid>
                        <Grid>
                            <Button sx={{ color: '#000', fontSize: '2em', fontWeight: 'bold' }} onClick={handleNextChart} disabled={imbalanceChartState === 3}>
                                {'>'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    )
}


function buildImbalanceStatusChart(status: IStatus) {
    return (
        <DoughnutChart
            labels={[`Energy Excess ${status.energyExcess} (${(Math.floor(status.energyExcess * 100 / (status.energyExcess + status.energyShortfall)) || 0).toFixed(2)} %)`,
            `Energy Shortfall ${status.energyShortfall} (${(status.energyShortfall * 100 / (status.energyExcess + status.energyShortfall) || 0).toFixed(2)}%)`]}
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
    )
}

function buildImbalanceAmountChart(imbalanceAmount: INetImbalanceAmountByStatus) {
    let sum = Math.abs(imbalanceAmount.sellerOverCommit) + Math.abs(imbalanceAmount.sellerUnderCommit) + Math.abs(imbalanceAmount.buyerOverCommit) + Math.abs(imbalanceAmount.buyerUnderCommit);
    let labels = [
        `Amount Seller Imbalance + : ${imbalanceAmount.sellerOverCommit.toFixed(3)} kWh (${(Math.round(imbalanceAmount.sellerOverCommit * 100 / sum) || 0).toFixed(2)}%)`,
        `Amount Seller Imbalance - :${imbalanceAmount.sellerUnderCommit.toFixed(3)} kWh (${(Math.round(imbalanceAmount.sellerUnderCommit * 100 / sum) || 0).toFixed(2)}%)`,
        `Amount Buyer Imbalance + :${imbalanceAmount.buyerOverCommit.toFixed(3)} kWh (${(Math.round(imbalanceAmount.buyerOverCommit * 100 / sum) || 0).toFixed(2)}%)`,
        `Amount Buyer Imbalance - : ${imbalanceAmount.buyerUnderCommit.toFixed(3)} kWh (${(Math.round(imbalanceAmount.buyerUnderCommit * 100 / sum) || 0).toFixed(2)}%)`,
    ]
    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [imbalanceAmount.sellerOverCommit, imbalanceAmount.sellerUnderCommit, imbalanceAmount.buyerOverCommit, imbalanceAmount.buyerUnderCommit],
                    backgroundColor: [
                        '#8C52FF',
                        '#0090FF',
                        '#00BCFF',
                        '#00E1FF'
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={500}
        />
    )
}

function buildNetAmount(netImbalance: INetImbalanceAmount) {
    let sum = Math.abs(netImbalance.netSale) + Math.abs(netImbalance.netBuy) + Math.abs(netImbalance.netAll);
    let labels = [
        `Net Sales : ${netImbalance.netSale.toFixed(3)} Baht (${(Math.round(netImbalance.netSale * 100 / sum) || 0).toFixed(2)}%)`,
        `Net Buys : ${netImbalance.netBuy.toFixed(3)} Baht (${(Math.round(netImbalance.netBuy * 100 / sum) || 0).toFixed(2)}%)`,
        `Net Imbalance : ${netImbalance.netAll.toFixed(3)} Baht (${(Math.round(netImbalance.netAll * 100 / sum) || 0).toFixed(2)}%)`,
    ]
    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [netImbalance.netSale, netImbalance.netBuy, netImbalance.netAll],
                    backgroundColor: [
                        '#00ED18',
                        '#00CF8E',
                        '#00A9CC'
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={500}
        />
    )
}