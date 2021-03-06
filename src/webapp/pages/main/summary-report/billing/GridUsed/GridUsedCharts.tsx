
import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DoughnutChart from '../../../../../components/DoughnutChart';
import { Bar } from 'react-chartjs-2';
import { IGridUsedChart, IGridUsedState, ITOUTariffChart } from '../../../../../state/summary-report/billing-report/grid-used-state';

interface IProps {
    gridUsed: IGridUsedState,
}
export default function GridUsedChart(props: IProps) {
    const { gridChart,
        netTOUTariff,
        amountTOUTariff } = props.gridUsed;
    const [typeChart, setTypeChart] = useState('netTouTariffSummary');

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
                        <MenuItem value={'netTouTariffSummary'}> {'Net TOU Tariff Summary'}</MenuItem>
                        <MenuItem value={'amountTouTariffSummary'}>{'Amount TOU Tariff Summary'}</MenuItem>
                        <MenuItem value={'netGridUsedSummary'}>{'Net Grid Used Summary'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid container item xs={12} justifyContent='center' alignContent='center' py={1}>
                {typeChart === 'netTouTariffSummary' && buildTOUTariffChart(netTOUTariff)}
                {typeChart === 'amountTouTariffSummary' && buildTOUTariffChart(amountTOUTariff)}
                {typeChart === 'netGridUsedSummary' && buildGridUsedChart(gridChart)}

            </Grid>
        </>
    )
}

function buildTOUTariffChart(tariff: ITOUTariffChart): JSX.Element {
    let netTOUTariff = {
        data: [tariff.peak, tariff.offPeak, tariff.offPeakWeekend, tariff.offPeakHoliday],
        backgroundColor: ["#E8F6EF", "#B8DFD8", "#FFE194", "#FFB319"],
    }

    const data = {
        labels: ["Peak (Mon-Fri)", "Off Peak (Mon-Fri)", "Off Peak (Sat-Sun)", "Off Peak (?????????????????????)"],
        datasets: [
            netTOUTariff,
        ],

    }
    return (
        <Box sx={{ flexGrow: 1 }} mx={3} my={1}>
            <Bar

                data={data}
                options={{
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        xAxes: {
                            stacked: true
                        },
                        yAxes: {
                            stacked: true,

                        }
                    }
                }}
            />
        </Box>
    )
}


function buildGridUsedChart(gridUsed: IGridUsedChart): JSX.Element {
    let sum = gridUsed.amount + gridUsed.discount + gridUsed.ft + gridUsed.gridUsed + gridUsed.serviceCharge + gridUsed.vat;
    let labels = [
        `Grid Used : ${gridUsed.gridUsed.toFixed(3)} Baht (${(Math.round(gridUsed.gridUsed * 100 / sum) || 0).toFixed(2)}%)`,
        `??????????????????????????? : ${gridUsed.serviceCharge.toFixed(3)} Baht (${(Math.round(gridUsed.serviceCharge * 100 / sum) || 0).toFixed(2)}%)`,
        `??????????????????????????????????????????(Ft) : ${gridUsed.ft.toFixed(3)} Baht (${(Math.round(Math.abs(gridUsed.ft) * 100 / sum) || 0).toFixed(2)}%)`,
        `????????????????????????????????????????????????????????????????????????????????????????????? :  ${gridUsed.amount.toFixed(3)} Baht (${(Math.round(gridUsed.amount * 100 / sum) || 0).toFixed(2)}%)`,
        `VAT :  ${gridUsed.vat.toFixed(3)} Baht (${(Math.round(gridUsed.vat * 100 / sum) || 0).toFixed(2)}%)`,
        `??????????????????????????????????????????????????????????????? : ${gridUsed.discount.toFixed(3)} Baht (${(Math.round(gridUsed.discount * 100 / sum) || 0).toFixed(2)}%)`,

    ];

    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [gridUsed.gridUsed, gridUsed.serviceCharge, gridUsed.ft, gridUsed.amount, gridUsed.vat, gridUsed.discount],
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
            width={750}
        />
    )
}