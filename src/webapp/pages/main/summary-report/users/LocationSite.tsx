import { Button, Grid, Typography } from '@mui/material'
import { Box, color } from '@mui/system'
import React, { useRef, useState } from 'react'
import useUserReport from '../../../../hooks/summary-report/user/useUserReport';
import { IEnergyInfo, IPowerGraph } from '../../../../state/summary-report/user-report/location-site-state';
import GoogleMap from './GoogleMap';
import { Bar } from 'react-chartjs-2';

export default function LocationSite() {
    const { locationSite } = useUserReport();
    const [range, setRange] = useState({ start: 0, end: 4 });


    if (locationSite) {
        let summaryPVForecast = 0;
        let maximumPVUsed = 0;
        let averagePVUsed = 0;
        if (locationSite.powerUsed) {
            averagePVUsed = locationSite.powerUsed.actual.length > 24 ? locationSite.energySummary.energyLoad / locationSite.powerUsed.actual.length : locationSite.energySummary.energyLoad;
            locationSite.powerUsed.forecast.forEach((forecast) => {
                summaryPVForecast += forecast.pv;
            });
            locationSite.powerUsed.actual.forEach((actual) => {
                maximumPVUsed = maximumPVUsed < actual.pv ? actual.pv : maximumPVUsed; //check maximum Grid Us
            });
            if (locationSite.powerUsed.forecast.length > 24) {
                summaryPVForecast = summaryPVForecast / (locationSite.powerUsed.forecast.length);
            }
        }

        return (
            <Grid container direction='row'>
                <Grid item container xs={12} id='title' sx={{ maxHeight: '64px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Location Site</Typography>
                </Grid>
                <Grid item container xs={12} id='meter-info' direction='column' sx={{ color: '#707070' }}>
                    <Typography py={1}>
                        {`Meter Id : ${locationSite.meterId}`}
                    </Typography>
                    <Typography py={1}>
                        {`PEA/MEA Substation. : ${locationSite.peameaSubstation}`}
                    </Typography>
                    <Typography py={1}>
                        {`EGAT Substation. : ${locationSite.egatSubStation}`}
                    </Typography>
                    <Grid container item justifyContent='flex-end' >
                        <Typography>{`Address: ${locationSite.location.lat},${locationSite.location.lng} `}</Typography>
                    </Grid>
                    <Grid container item id='map-plugin' direction='column' sx={{ backgroundColor: '#fff', borderWidth: '1px', width: 1, height: '300px', boxShadow: 2, }}>
                        <Grid item sx={{ height: '70%', width: 1, }}>

                            <GoogleMap key={`lat:${locationSite.location.lat}:lng:${locationSite.location.lng}`} address={{ lat: +locationSite.location.lat, lng: +locationSite.location.lng }} zoom={18} />
                        </Grid>
                        <Grid item container direction='row' sx={{ height: '20%' }}>
                            <Grid item container direction='column' alignItems='center' xs={4}>
                                <Typography>ไฟที่จะขายได้ 1 วันล่วงหน้า</Typography>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em' }}>{locationSite.powerUsed ? Math.round(summaryPVForecast * 100) / 100 : "Cannot Load ForecastData"}</Typography>
                                <Typography>kWh</Typography>
                            </Grid>
                            <Grid item container direction='column' alignItems='center' xs={4}>
                                <Typography>กำลังไฟฟ้าใช้จริงสูงสุด</Typography>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em' }}>{maximumPVUsed}</Typography>
                                <Typography>kW</Typography>
                            </Grid>
                            <Grid item container direction='column' alignItems='center' xs={4}>
                                <Typography>กำลังไฟฟ้าใช้จริงโดยเฉลี่ย</Typography>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em' }}>{ Math.round(averagePVUsed * 100) / 100}</Typography>
                                <Typography>kW</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} id='energy-info' my={2}>
                    {buildEnergyInfo(locationSite.energySummary)}
                </Grid>
                <Grid item container xs={12} id='forecast-info' pt={3} direction="column" minHeight="20vh">
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>Excess PV/Grid used Energy (Forecast/Actual)</Typography>
                    {locationSite.powerUsed && locationSite.powerUsed.actual.length > 0 && locationSite.powerUsed.forecast.length > 0 &&
                        <Grid container item direction="row">
                            <Grid item container xs={1} key="back-button" sx={{ alignItems: "end" }}>
                                <Button
                                    disabled={range.start === 0}
                                    onClick={() => { setRange({ start: range.start -= 1, end: range.end -= 1 }) }}
                                    sx={{ color: "#000", fontSize: '1.5em' }}
                                >
                                    {`<`}
                                </Button>
                            </Grid>
                            {buildForecastChart(locationSite.powerUsed, range.start, range.end)}
                            <Grid item container xs={1} key="forward-button" sx={{ alignItems: "end" }}>
                                <Button
                                    disabled={range.end === 24}
                                    onClick={() => { setRange({ start: range.start += 1, end: range.end += 1 }) }}
                                    sx={{ color: "#000", fontSize: '1.5em' }}
                                >
                                    {`>`}
                                </Button>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Grid >
        )
    } else {
        return (
            <Grid container direction='row'>
                <Grid item container xs={12} id='title' sx={{ maxHeight: '64px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Location Site</Typography>
                </Grid>
            </Grid>
        );
    }
}

function buildEnergyInfo(energySummary: IEnergyInfo) {
    return (
        <>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>Energy Info</Typography>
            <Grid container item justifyContent='space-between' px={4} >
                <Typography>
                    {`PV`}
                </Typography>
                <Typography >
                    {energySummary.pv + ` kWh`}
                </Typography>
            </Grid>
            <Grid container item justifyContent='space-between' px={4} >
                <Typography>
                    {`Energy Storage`}
                </Typography>
                <Typography >
                    {energySummary.energyStorage + ` kWh`}
                </Typography>
            </Grid>
            <Grid container item justifyContent='space-between' px={4} >
                <Typography>
                    {`Grid`}
                </Typography>
                <Typography >
                    {energySummary.grid + ` kWh`}
                </Typography>
            </Grid>
            <Grid container item justifyContent='space-between' px={4} >
                <Typography>
                    {`Energy Load`}
                </Typography>
                <Typography >
                    {energySummary.energyLoad + ` kWh`}
                </Typography>
            </Grid>
        </>
    )
}

function buildForecastChart( //,chartRef: React.MutableRefObject<any>
    powerUsed: { forecast: IPowerGraph[], actual: IPowerGraph[] },
    start: number,
    end: number
) {
    const labels = ["00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00", "05:00-06:00", "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-23:59"];


    let excessPvForecast = {
        label: 'Excess PV Forecast',
        data: powerUsed.forecast.slice(start, end).map((power: IPowerGraph) => { return power.pv }),
        backgroundColor: '#7D6302',
        stack: "Stack 0",
    }
    let gridUsedForecast = {
        label: 'Grid Used Forecast',
        data: powerUsed.forecast.slice(start, end).map((power: IPowerGraph) => { return -power.grid }),
        backgroundColor: '#760404',
        stack: "Stack 0",
    }
    let excessPvActual = {
        label: 'Excess PV Actual',
        data: powerUsed.actual.slice(start, end).map((power: IPowerGraph) => { return power.pv }),
        backgroundColor: '#FEC908',
        stack: "Stack 1",
    }
    let gridUsedActual = {
        label: 'Grid Used Actual',
        data: powerUsed.actual.slice(start, end).map((power: IPowerGraph) => { return -power.grid }),
        backgroundColor: '#FF0000',
        stack: "Stack 1",

    }

    const data = {
        labels: labels.slice(start, end),
        datasets: [
            excessPvForecast,
            gridUsedForecast,
            excessPvActual,
            gridUsedActual
        ],
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Bar

                data={data}
                options={{
                    plugins: {
                        legend: {
                            position: "bottom",
                            onClick: (e) => { }
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