
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
        `Net Sales : ${Number(paymentChart.netSales * 100).toFixed(2)} Baht ${Number(paymentChart.netSales * 100 / sum).toFixed(2)}%`,
        `Net Buys :  : ${Number(paymentChart.netBuys * 100).toFixed(2)} Baht ${Number(paymentChart.netBuys * 100 / sum).toFixed(2)}%`,
        `Net Imbalance : ${Number(paymentChart.netImbalance * 100).toFixed(2)} Baht ${Number(paymentChart.netImbalance * 100 / sum).toFixed(2)}%`,
        `App Transaction Fees :  :  ${Number(paymentChart.appTransaction * 100).toFixed(2)} Baht ${Number(paymentChart.appTransaction * 100 / sum).toFixed(2)}%`,
        `VAT :  ${Number(paymentChart.vat * 100).toFixed(2)} Baht ${Number(paymentChart.vat * 100 / sum).toFixed(2)}%`,
        `Discount App Fees : ${Number(paymentChart.discountFees * 100).toFixed(2)} Baht${Number(paymentChart.discountFees * 100 / sum).toFixed(2)}%`,

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
        `Net Seller Imbalance+ : ${Number(netImbalanceChart.netSellerImbalanceOverCommited * 100).toFixed(2)} Baht ${Number(netImbalanceChart.netSellerImbalanceOverCommited * 100 / sum).toFixed(2)}%`,
        `Net Seller Imbalance- :${Number(netImbalanceChart.netSellerImbalanceUnderCommited * 100).toFixed(2)} Baht ${Number(netImbalanceChart.netSellerImbalanceUnderCommited * 100 / sum).toFixed(2)}%`,
        `Net Buyer Imbalance+ :${Number(netImbalanceChart.netBuyerImbalanceOverCommited * 100).toFixed(2)} Baht ${Number(netImbalanceChart.netBuyerImbalanceOverCommited * 100 / sum).toFixed(2)}%`,
        `Net Buyer Imbalance- : ${Number(netImbalanceChart.netBuyerImbalanceUnderCommited * 100).toFixed(2)} Baht ${Number(netImbalanceChart.netBuyerImbalanceUnderCommited * 100 / sum).toFixed(2)}%`,
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
        `Net Seller Imbalance+ : ${Number(amountImbalanceChart.amountSellerImbalanceOverCommited * 100).toFixed(2)} Baht ${Number(amountImbalanceChart.amountSellerImbalanceOverCommited * 100 / sum).toFixed(2)}%`,
        `Net Seller Imbalance- :${Number(amountImbalanceChart.amountSellerImbalanceUnderCommited * 100).toFixed(2)} Baht ${Number(amountImbalanceChart.amountSellerImbalanceUnderCommited * 100 / sum).toFixed(2)}%`,
        `Net Buyer Imbalance+ :${Number(amountImbalanceChart.amountBuyerImbalanceOverCommited * 100).toFixed(2)} Baht ${Number(amountImbalanceChart.amountBuyerImbalanceOverCommited * 100 / sum).toFixed(2)}%`,
        `Net Buyer Imbalance- : ${Number(amountImbalanceChart.amountBuyerImbalanceUnderCommited * 100).toFixed(2)} Baht ${Number(amountImbalanceChart.amountBuyerImbalanceUnderCommited * 100 / sum).toFixed(2)}%`,
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