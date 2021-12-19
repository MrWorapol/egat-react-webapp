import { Grid, Typography } from '@mui/material'
import { color } from '@mui/system'
import React from 'react'
import useUserReport from '../../../../hooks/summary-report/user/useUserReport';

export default function LocationSite() {
    const { locationSite } = useUserReport();
    if (locationSite) {


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
                    <Grid container item id='map-plugin' direction='column' sx={{ backgroundColor: '#fff', borderWidth: '1px', width: 1, height: '200px', boxShadow: 2, }}>
                        <Grid item sx={{ height: '', width: 1, }}>

                        </Grid>
                        <Grid item container direction='row'>
                            <Grid item container direction='column' alignItems='center' xs={4}>
                                <Typography>ไฟที่จะขายได้ 1 วันล่วงหน้า</Typography>
                                <Typography>kWh</Typography>
                            </Grid>
                            <Grid item container direction='column' alignItems='center' xs={4}>
                                <Typography>ไฟที่จะขายได้ 1 วันล่วงหน้า</Typography>
                                <Typography>kW</Typography>
                            </Grid>
                            <Grid item container direction='column' alignItems='center' xs={4}>
                                <Typography>ไฟที่จะขายได้ 1 วันล่วงหน้า</Typography>
                                <Typography>kW</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} id='energy-info'>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>Energy Info</Typography>
                    <Grid container item justifyContent='space-between' px={4} >
                        <Typography>
                            {`PV`}
                        </Typography>
                        <Typography >
                            {locationSite.energy.pv + ` kWh`}
                        </Typography>
                    </Grid>
                    <Grid container item justifyContent='space-between' px={4} >
                        <Typography>
                            {`Energy Storage`}
                        </Typography>
                        <Typography >
                            {locationSite.energy.energyStorage + ` kWh`}
                        </Typography>
                    </Grid>
                    <Grid container item justifyContent='space-between' px={4} >
                        <Typography>
                            {`Grid`}
                        </Typography>
                        <Typography >
                            {locationSite.energy.grid + ` kWh`}
                        </Typography>
                    </Grid>
                    <Grid container item justifyContent='space-between' px={4} >
                        <Typography>
                            {`Energy Load`}
                        </Typography>
                        <Typography >
                            {locationSite.energy.energyLoad + ` kWh`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item container xs={12} id='forecast-info' pt={3} >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>Excess PV/Grid used Energy (Forecast/Actual)</Typography>
                    <Typography py={1}>
                        {`PEA/MEA Substation. : กฟน. สต.แจ้งวัฒนะ(JWT) 115 kV BUS A2`}
                    </Typography>
                    <Typography py={1}>
                        {`EGAT Substation. : กฟผ. สฟ. CHW`}
                    </Typography>

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

