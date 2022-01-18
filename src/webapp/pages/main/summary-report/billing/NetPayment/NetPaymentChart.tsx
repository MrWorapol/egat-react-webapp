
import { Grid, Typography } from '@mui/material'
import DoughnutChart from '../../../../../components/DoughnutChart';
import { INetPaymentChart } from '../../../../../state/summary-report/billing-report/net-payment-state';

interface IProps {
    netPaymentChart: INetPaymentChart,
}

export default function NetPaymentChart(props: IProps) {
    const netPaymentChart = props.netPaymentChart;


    return (
        <>
            <Grid item xs={12} pb={2} pl={1}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>{"Net Payment Summary"}</Typography>
            </Grid>
            <Grid container item xs={12} justifyContent='center' alignContent='center' py={1}>
                {buildPaymentChart(netPaymentChart)}
            </Grid>
        </>
    )
}


function buildPaymentChart(paymentChart: INetPaymentChart) {
    let sum = paymentChart.tradingPayment + paymentChart.gridUsed + paymentChart.wheelingCharge;
    let labels = [
        `Net Energy Trading Payment : ${Number(paymentChart.tradingPayment * 100 / 100).toFixed(2)} Baht ${(Math.round(paymentChart.tradingPayment * 100 / sum) || 0).toFixed(2)}%`,
        `Grid Used : ${Number(paymentChart.gridUsed * 100 / 100).toFixed(2)} Baht ${(Math.round(paymentChart.gridUsed * 100 / sum) || 0).toFixed(2)}%`,
        `Wheeling Charge : ${Number(paymentChart.wheelingCharge * 100 / 100).toFixed(2)} Baht ${(Math.round(paymentChart.wheelingCharge * 100 / sum) || 0).toFixed(2)}%`,
    ];

    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [paymentChart.tradingPayment, paymentChart.gridUsed, paymentChart.wheelingCharge],
                    backgroundColor: [
                        '#FFDE00',
                        '#A9C521',
                        '#62A53A',
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={1}
        />
    )
}