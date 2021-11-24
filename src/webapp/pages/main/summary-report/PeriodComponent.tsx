import { FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react'

export default function PeriodComponent() {
    const { } = usePeriodState();
    const [state, setstate] = useState('all');

    return (
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
    )
}
function usePeriodState() {
    return {

    }
}

