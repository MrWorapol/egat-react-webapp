import { Container } from '@mui/material';
import { Box, height } from '@mui/system';
import React from 'react'
import { Doughnut } from 'react-chartjs-2';

export interface CustomDataSet {
    data: number[],
    backgroundColor: string[],
    hoverOffset?: number | 4,
}

export interface DoughNutChartProps {
    labels: string[],
    datasets: CustomDataSet[],
    width: number, //minWidth: 360
}

export default function DoughnutChart(props: DoughNutChartProps) {
    const data = {
        labels: [...props.labels],
        datasets: [...props.datasets],

    };
    return (
        <Box justifyContent='center' alignItems='center' sx={{ width: `${props.width}px` }}>
            <Doughnut
                data={data}

                options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.7,
                    plugins: {
                        legend: {

                            position: 'right',
                            labels: {
                                padding: 20,
                                boxHeight: 30,
                                // generateLabels function to change legent text
                            }
                        },

                        tooltip: {
                            callbacks: {
                                title: tooltipItems => {
                                    let customTitle = tooltipItems[0].parsed;
                                    if (customTitle !== null) {
                                        console.dir(customTitle)
                                        //     console.dir(title)
                                        //     title = new Date(title).toDateString()
                                    }
                                    return customTitle.toString();
                                },
                            },
                        }
                    },
                    cutout: 95,
                }}
            />
        </Box>
    )
}
