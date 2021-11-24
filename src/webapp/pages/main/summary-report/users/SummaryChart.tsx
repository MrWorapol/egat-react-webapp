import { FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DoughnutChart from './DoughnutChart'

interface IMap {
    [key: string]: IChartLabel;
}
interface IChartLabel {
    labels: string[],
    backgroundColor: string[],
}
const chartLabels: IMap = {
    energySummary: {
        labels: [`PV :`, 'Energy Storage :', 'Grid : ', 'Energy Consumption : '],
        backgroundColor: ['#8C52FF', '#00BCFF', '#0090FF', '#00E1FF'],
    },
    userSummary: {
        labels: [`Aggregator`, 'Prosumer', 'Consumer', 'No User'],
        backgroundColor: ['#8C52FF', '#00BCFF', '#0090FF', '#00E1FF'],
    }
}

export default function SummaryChart() {
    const [summaryChart, setSummaryChart] = useState('energySummary');
    let result: IChartLabel = {} as IChartLabel;


    useEffect(() => {
        setLabels();
        // return () => {

        // }
    }, [summaryChart])

    const setLabels = (): IChartLabel => {
        Object.keys(chartLabels).forEach((value: string) => {
            if (value === summaryChart) {

                result = chartLabels[value];
            }
        }
        );
        return result;
    }

    const onChangeData = (event: SelectChangeEvent) => {

        setSummaryChart(event.target.value);
        // setLabels();

    };
    setLabels();
    console.log(result)
    return (
        <>
            <Grid container item xs={12} >
                <FormControl variant='outlined'>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={summaryChart}
                        onChange={(event: SelectChangeEvent) => { onChangeData(event) }}
                        sx={{ height: '5vh', color: 'secondary.main', fontWeight: 'bold', fontSize: '1.5em', width: '15vw' }}
                    >
                        <MenuItem value={'energySummary'}> {'Energy Summary'}</MenuItem>
                        <MenuItem value={'userSummary'}>{'User Summary'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid container item xs={12} justifyContent='center' alignContent='center'>
                <DoughnutChart
                    labels={[`Aggregator`, 'Prosumer', 'Consumer', 'No User']}
                    datasets={[
                        {
                            data: [12, 19, 3, 5],
                            backgroundColor: [
                                '#8C52FF',
                                '#00BCFF',
                                '#0090FF',
                                '#00E1FF',
                            ],
                            // hoverOffset: 4,
                        },
                    ]}
                    width={400}
                />
            </Grid>
        </>
    )
}
