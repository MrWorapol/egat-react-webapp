import { FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IEnergySummary, IUserChart, IUserSummary } from '../../../../state/summary-report/user-report/user-chart-state';
import DoughnutChart from '../../../../components/DoughnutChart'

interface IMap {
    [key: string]: IChartLabel;
}
interface IChartLabel {
    labels: string[],
    backgroundColor: string[],
}
const chartLabels: IMap = {
    energySummary: {
        labels: [`PV :`, 'Energy Storage :', 'Excess PV/Grid Used : ', 'Energy load : '],
        backgroundColor: ['#8C52FF', '#00BCFF', '#0090FF', '#00E1FF'],
    },
    userSummary: {
        labels: [`Aggregator`, 'Prosumer', 'Consumer', 'No User'],
        backgroundColor: ['#8C52FF', '#00BCFF', '#0090FF', '#00E1FF'],
    }
}

interface IProps {
    data: IUserChart,
}
export default function SummaryChart(props: IProps) {
    const [typeChart, setTypeChart] = useState('energySummary');
    let result: IChartLabel = {} as IChartLabel;


    useEffect(() => {
        setLabels();
        // return () => {

        // }
    }, [typeChart])

    const setLabels = (): IChartLabel => {
        Object.keys(chartLabels).forEach((value: string) => {
            if (value === typeChart) {

                result = chartLabels[value];
            }
        }
        );
        return result;
    }

    const onChangeData = (event: SelectChangeEvent) => {

        setTypeChart(event.target.value);
        // setLabels();

    };
    setLabels();
    // console.log(result)
    return (
        <>
            <Grid item xs={12} pb={2} pl={1}>
                <FormControl variant='outlined'>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={typeChart}
                        onChange={(event: SelectChangeEvent) => { onChangeData(event) }}
                        sx={{ height: '5vh', color: 'secondary.main', fontWeight: 'bold', fontSize: '1.5em', width: 1 }}
                    >
                        <MenuItem value={'energySummary'}> {'Energy Summary'}</MenuItem>
                        <MenuItem value={'userSummary'}>{'User Summary'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid container item xs={12} justifyContent='center' alignContent='center' py={1}>
                {typeChart === 'energySummary' && buildEnergyChart(props.data.energy)}
                {typeChart === 'userSummary' && buildUserChart(props.data.user)}

            </Grid>
        </>
    )
}

function buildEnergyChart(data: IEnergySummary): JSX.Element {

    let sum = Math.abs(data.pv) + Math.abs(data.energyStorage) + Math.abs(data.grid) + Math.abs(data.load);
    let labels = [`PV : ${data.pv} kWh (${Number((Math.abs(data.pv) * 100 / sum)).toFixed(2)}%)`,
    `Energy Storage : ${data.energyStorage} kWh (${Number(Math.abs(data.energyStorage) * 100 / sum).toFixed(2)}%)`,
    `Excess PV/Grid Used : ${data.grid} kWh (${Number(Math.abs(data.grid) * 100 / sum).toFixed(2)}%)`,
    `Energy Load : ${data.load} kWh (${Math.abs((Math.abs(data.load) * 100 / sum)).toFixed(2)}%)`];
    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [data.pv, data.energyStorage, data.grid, data.load],
                    backgroundColor: [
                        '#8C52FF',
                        '#00BCFF',
                        '#0090FF',
                        '#00E1FF',
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={1}
        />
    )
}
function buildUserChart(data: IUserSummary): JSX.Element {
    let sum = data.AGGREGATOR + data.PROSUMER + data.CONSUMER + data.noUser;
    let labels = [`Aggregator : ${data.AGGREGATOR} (${Number(data.AGGREGATOR * 100 / sum).toFixed(2)}%)`,
    `Prosumer : ${data.PROSUMER} (${Number(data.PROSUMER * 100 / sum).toFixed(2)}%)`,
    `Consumer : ${data.CONSUMER} (${Number(data.CONSUMER * 100 / sum).toFixed(2)}%)`,
    `No User : ${data.noUser} (${Number(data.noUser * 100 / sum).toFixed(2)}%)`];
    return (
        <DoughnutChart
            labels={labels}
            datasets={[
                {
                    data: [data.AGGREGATOR, data.PROSUMER, data.CONSUMER, data.noUser],
                    backgroundColor: [
                        '#8C52FF',
                        '#00BCFF',
                        '#0090FF',
                        '#00E1FF',
                    ],
                    // hoverOffset: 4,
                },
            ]}
            width={1}
        />
    )
}