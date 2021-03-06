
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DoughnutChart from '../../../../../components/DoughnutChart';
import { IEnergyPaymentState, IEnergyPaymentChart, INetImbalanceSummaryChart, IAmountImbalanceSummaryChart } from '../../../../../state/summary-report/billing-report/energy-payment-state';

interface IProps {
    energyPayment: IEnergyPaymentState,
}
export default function EnergyTradingChart(props: IProps) {
    const { energyPaymentChart,
        netImbalanceChart,
        amountImbalanceChart } = props.energyPayment;
    const [typeChart, setTypeChart] = useState('paymentChart');

    useEffect(() => {
    }, [typeChart])


    const onChangeSelector = (event: SelectChangeEvent) => {
        setTypeChart(event.target.value);
    };

    return (
        <>
            <Grid item xs={12} pb={2} pl={1}>
                <FormControl variant='outlined'>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={typeChart}
                        onChange={(event: SelectChangeEvent) => { onChangeSelector(event) }}
                        sx={{ height: '5vh', color: 'secondary.main', fontWeight: 'bold', fontSize: '1.5em', width: 1 }}
                    >
                        <MenuItem value={'paymentChart'}> {'Net Energy Trading Summary'}</MenuItem>
                        <MenuItem value={'netImbalanceChart'}>{'Net Imbalance Summary'}</MenuItem>
                        <MenuItem value={'amountImbalanceChart'}>{'Amount Imbalance Summary'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid container item xs={12} justifyContent='center' alignContent='center' py={1}>
                {typeChart === 'paymentChart' && buildPaymentChart(energyPaymentChart)}
                {typeChart === 'netImbalanceChart' && buildNetImbalanceChart(netImbalanceChart)}
                {typeChart === 'amountImbalanceChart' && buildAmountImbalanceChart(amountImbalanceChart)}

            </Grid>
        </>
    )
}


function buildPaymentChart(paymentChart: IEnergyPaymentChart) {
    let sum = paymentChart.netSales + paymentChart.netBuys + paymentChart.netImbalance + paymentChart.appTransaction + paymentChart.vat + paymentChart.discountFees;
    let labels = [
        `Net Sales : ${paymentChart.netSales.toFixed(3)} Baht (${(Math.round(paymentChart.netSales * 100 / sum) || 0).toFixed(2)}%)`,
        `Net Buys : ${paymentChart.netBuys.toFixed(3)} Baht (${(Math.round(paymentChart.netBuys * 100 / sum) || 0).toFixed(2)}%)`,
        `Net Imbalance : ${paymentChart.netImbalance.toFixed(3)} Baht (${(Math.round(paymentChart.netImbalance * 100 / sum) || 0).toFixed(2)}%)`,
        `App Transaction Fees : ${paymentChart.appTransaction.toFixed(3)} Baht (${(Math.round(paymentChart.appTransaction * 100 / sum) || 0).toFixed(2)}%)`,
        `VAT : ${paymentChart.vat.toFixed(3)} Baht (${(Math.round(paymentChart.vat * 100 / sum) || 0).toFixed(2)}%)`,
        `Discount App Fees : ${paymentChart.discountFees.toFixed(3)} (Baht${(Math.round(paymentChart.discountFees * 100 / sum) || 0).toFixed(2)}%)`,

    ];

    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [paymentChart.netSales, paymentChart.netBuys, paymentChart.netImbalance, paymentChart.appTransaction, paymentChart.vat, paymentChart.discountFees],
                    backgroundColor: [
                        '#C9E265',
                        '#74C36F',
                        '#299E78',
                        '#007773',
                        '#00505E',
                        '#1B8FCD',
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={1}
        />
    )
}
function buildNetImbalanceChart(netImbalanceChart: INetImbalanceSummaryChart) {
    let sum = netImbalanceChart.netSellerImbalanceOverCommited + netImbalanceChart.netSellerImbalanceUnderCommited + netImbalanceChart.netBuyerImbalanceOverCommited + netImbalanceChart.netBuyerImbalanceUnderCommited;
    let labels = [
        `Net Seller Imbalance + : ${netImbalanceChart.netSellerImbalanceOverCommited.toFixed(3)} Baht (${(Math.round(netImbalanceChart.netSellerImbalanceOverCommited * 100 / sum) || 0).toFixed(2)}%)`,
        `Net Seller Imbalance - :${netImbalanceChart.netSellerImbalanceUnderCommited.toFixed(3)} Baht (${(Math.round(netImbalanceChart.netSellerImbalanceUnderCommited * 100 / sum) || 0).toFixed(2)}%)`,
        `Net Buyer Imbalance + :${netImbalanceChart.netBuyerImbalanceOverCommited.toFixed(3)} Baht (${(Math.round(netImbalanceChart.netBuyerImbalanceOverCommited * 100 / sum) || 0).toFixed(2)}%)`,
        `Net Buyer Imbalance - : ${netImbalanceChart.netBuyerImbalanceUnderCommited.toFixed(3)} Baht (${(Math.round(netImbalanceChart.netBuyerImbalanceUnderCommited * 100 / sum) || 0).toFixed(2)}%)`,
    ];

    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [netImbalanceChart.netSellerImbalanceOverCommited, netImbalanceChart.netSellerImbalanceUnderCommited, netImbalanceChart.netBuyerImbalanceOverCommited, netImbalanceChart.netBuyerImbalanceUnderCommited],
                    backgroundColor: [
                        '#8C52FF',
                        '#0090FF',
                        '#00BCFF',
                        '#00E1FF',
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={750}
        />
    )
}
function buildAmountImbalanceChart(amountImbalanceChart: IAmountImbalanceSummaryChart) {
    let sum = amountImbalanceChart.amountSellerImbalanceOverCommited + amountImbalanceChart.amountSellerImbalanceUnderCommited + amountImbalanceChart.amountBuyerImbalanceOverCommited + amountImbalanceChart.amountBuyerImbalanceUnderCommited;
    let labels = [
        `Amount Seller Imbalance + : ${amountImbalanceChart.amountSellerImbalanceOverCommited.toFixed(3)} kWh (${(Math.round(amountImbalanceChart.amountSellerImbalanceOverCommited * 100 / sum) || 0).toFixed(2)}%)`,
        `Amount Seller Imbalance - : ${amountImbalanceChart.amountSellerImbalanceUnderCommited.toFixed(3)} kWh (${(Math.round(amountImbalanceChart.amountSellerImbalanceUnderCommited * 100 / sum) || 0).toFixed(2)}%)`,
        `Amount Buyer Imbalance + : ${amountImbalanceChart.amountBuyerImbalanceOverCommited.toFixed(3)} kWh (${(Math.round(amountImbalanceChart.amountBuyerImbalanceOverCommited * 100 / sum) || 0).toFixed(2)}%)`,
        `Amount Buyer Imbalance - : ${amountImbalanceChart.amountBuyerImbalanceUnderCommited.toFixed(3)} kWh (${(Math.round(amountImbalanceChart.amountBuyerImbalanceUnderCommited * 100 / sum) || 0).toFixed(2)}%)`,
    ];

    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [amountImbalanceChart.amountSellerImbalanceOverCommited, amountImbalanceChart.amountSellerImbalanceUnderCommited, amountImbalanceChart.amountBuyerImbalanceOverCommited, amountImbalanceChart.amountBuyerImbalanceUnderCommited],
                    backgroundColor: [
                        '#8C52FF',
                        '#0090FF',
                        '#00BCFF',
                        '#00E1FF',
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={750}
        />
    )
}