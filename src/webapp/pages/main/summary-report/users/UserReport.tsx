import { Container, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useNavigationSet } from '../../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../../state/navigation-current-state'
import AllArea from './AllArea'
import DoughnutChart from './DoughnutChart'
import LocationSite from './LocationSite'
import SummaryChart from './SummaryChart'

export default function UserReport() {
    useNavigationSet(NavigationCurrentType.USER_REPORT);
    const [state, setstate] = useState('all');

    return (
        <Box sx={{ width: `100%`, px: 2, py: 2, maxWidth: '100%' }}>
            <Grid container item direction="row" justifyContent='flex-end' id='period-zone' py={1}>
                <Grid item bgcolor='#fff'>
                    <FormControl variant='outlined'>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state}
                            onChange={(event: SelectChangeEvent) => { setstate(event.target.value) }}
                            sx={{ height: '3vh' }}
                        >
                            <MenuItem value={'all'}> {'All Region'}</MenuItem>
                            <MenuItem value={'n'}>{'North'}</MenuItem>
                            <MenuItem value={'e'}>{'East'}</MenuItem>
                            <MenuItem value={'w'}>{'West'}</MenuItem>
                            <MenuItem value={'s'}>{'South'}</MenuItem>
                            <MenuItem value={'ne'}>{'North East'}</MenuItem>
                            <MenuItem value={'cen'}>{'Central'}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box>
                <Grid container item direction='row' xs={12} >
                    <Grid container item direction='column' id='left-side' xs={6} pr={3}>
                        <Grid container item xs={'auto'} sx={{ backgroundColor: '#fff' }} id='div-area'>
                            <AllArea />
                        </Grid>
                        <Grid container item direction='row' xs={6} sx={{ backgroundColor: '#fff' }} mt={2} pt={2} pl={2} id='div-chart'>
                            <SummaryChart />
                        </Grid>
                    </Grid>
                    <Grid container item id='right-side' xs={6} px={2} py={2} sx={{ backgroundColor: '#fff' }}>
                        <LocationSite />
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}


function buildTable(): JSX.Element {
    return (<></>)
}

function buildLocationSite(): JSX.Element {
    return (<></>)
}
function buildEnergySummary(): JSX.Element {
    return (<></>)
}