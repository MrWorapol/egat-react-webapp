
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DoughnutChart from '../../../../../components/DoughnutChart';
import { IEnergyPaymentState, IEnergyPaymentChart, INetImbalanceSummaryChart, IAmountImbalanceSummaryChart } from '../../../../../state/summary-report/billing-report/energy-payment-state';
import { INetWheelingSummaryChart, IWheelingReportState, IWheelingSummaryChart } from '../../../../../state/summary-report/billing-report/wheeling-charge-state';

interface IProps {
    wheelingChargeReport: IWheelingReportState,
}
export default function WheelingChargeChart(props: IProps) {
    const { summary,
        netSummary,
    } = props.wheelingChargeReport;
    const [typeChart, setTypeChart] = useState('summary');

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
                        <MenuItem value={'summary'}> {'Wheeling Charge Summary'}</MenuItem>
                        <MenuItem value={'netSummary'}>{'Net Wheeling Charge Summary'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid container item xs={12} justifyContent='center' alignContent='center' py={1}>
                {typeChart === 'summary' && buildsummaryChart(summary)}
                {typeChart === 'netSummary' && buildNetImbalanceChart(netSummary)}

            </Grid>
        </>
    )
}


function buildsummaryChart(summary: IWheelingSummaryChart) {
    let sum = summary.mea + summary.pea + summary.meaegat + summary.peaegat + summary.meapeaegat;
    let labels = [
        `MEA : ${Number(summary.mea * 100).toFixed(2)} Baht ${Number(summary.mea * 100 / sum).toFixed(2)}%`,
        `PEA : ${Number(summary.pea * 100).toFixed(2)} Baht ${Number(summary.pea * 100 / sum).toFixed(2)}%`,
        `MEAEGAT : ${Number(summary.meaegat * 100).toFixed(2)} Baht ${Number(summary.meaegat * 100 / sum).toFixed(2)}%`,
        `PEAEGAT :    ${Number(summary.peaegat * 100).toFixed(2)} Baht ${Number(summary.peaegat * 100 / sum).toFixed(2)}%`,
        `MEAPEAEGAT :  ${Number(summary.meapeaegat * 100).toFixed(2)} Baht ${Number(summary.meapeaegat * 100 / sum).toFixed(2)}%`,

    ];

    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [summary.mea, summary.pea, summary.meaegat, summary.peaegat, summary.meapeaegat],
                    backgroundColor: [
                        '#FF914D',
                        '#E45D56',
                        '#BB2F5D',
                        '#87095E',
                        '#4B0056',

                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={1}
        />
    )
}
function buildNetImbalanceChart(netSummary: INetWheelingSummaryChart) {
    let sum = netSummary.confidential + netSummary.t + netSummary.d + netSummary.re+ netSummary.vat;
    let labels = [
        `ค่าบริการเสริมความมั่นคงของระบบไฟฟ้า : ${Number(netSummary.confidential * 100).toFixed(2)} Baht ${Number(netSummary.confidential * 100 / sum).toFixed(2)}%`,
        `ค่าบริการระบบส่งไฟฟ้า(T) : ${Number(netSummary.t * 100).toFixed(2)} Baht ${Number(netSummary.t * 100 / sum).toFixed(2)}%`,
        `ค่าบริการระบบจำหน่ายไฟฟ้า(D) : ${Number(netSummary.d * 100).toFixed(2)} Baht ${Number(netSummary.d * 100 / sum).toFixed(2)}%`,
        `ค่าใช้จ่ายในการส่งเสริมพลังงานทดแทน(RE) : ${Number(netSummary.re * 100).toFixed(2)} Baht ${Number(netSummary.re * 100 / sum).toFixed(2)}%`,
        `Vat : ${Number(netSummary.vat * 100).toFixed(2)} Baht ${Number(netSummary.vat * 100 / sum).toFixed(2)}%`,
    ];

    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [netSummary.confidential, netSummary.t, netSummary.d, netSummary.re, netSummary.vat],
                    backgroundColor: [
                        '#FF5757',
                        '#D81665',
                        '#A2006E',
                        '#62006E',
                        '#000062'
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={750}
        />
    )
}