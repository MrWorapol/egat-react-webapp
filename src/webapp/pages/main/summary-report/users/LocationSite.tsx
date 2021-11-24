import { Grid, Typography } from '@mui/material'
import { color } from '@mui/system'
import React from 'react'

export default function LocationSite() {
    return (
        <Grid container direction='row'>
            <Grid item container xs={12} id='title' sx={{ maxHeight: '64px' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Location Site</Typography>
            </Grid>
            <Grid item container xs={12} id='meter-info' direction='column' sx={{ color: '#707070' }}>
                <Typography py={1}>
                    {`Meter Id : asdasd`}
                </Typography>
                <Typography py={1}>
                    {`PEA/MEA Substation. : กฟน. สต.แจ้งวัฒนะ(JWT) 115 kV BUS A2`}
                </Typography>
                <Typography py={1}>
                    {`EGAT Substation. : กฟผ. สฟ. CHW`}
                </Typography>
                <Grid container item justifyContent='flex-end' >
                    <Typography>{`Address: 1233.2322332, 123123123132`}</Typography>
                </Grid>
                <Grid container item id='map-plugin' sx={{ backgroundColor: '#101010', borderWidth: '1px', width: 1, height: '200px' }}>

                </Grid>
            </Grid>
            <Grid item container xs={12} id='energy-info'>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>Energy Info</Typography>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`PV`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Energy Storage`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Grid`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Energy Load`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
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
}


