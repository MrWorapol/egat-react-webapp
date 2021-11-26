import { DatePicker } from '@mui/lab';
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { Box } from '@mui/system';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react'
import CustomDatePicker from '../../../components/CustomDatePicker';

export default function PeriodComponent() {
    const [state, setstate] = useState('all');
    const [value, setValue] = React.useState<Date | null>(null);

    return (
        <Grid container item direction='row' justifyContent='flex-end' alignItems='center'>
            <Grid container item xs={'auto'}  mx={2}>
                <Box sx={{backgroundColor: '#fff' }}>
                    <DatePicker
                        views={['year', 'month', 'day']}
                        // label="Year and Month"
                        minDate={dayjs()}
                        maxDate={dayjs().add(5, 'year')}
                        value={value}

                        onChange={(newValue) => {
                            if (newValue) {
                                setValue(newValue.toDate());
                            }
                        }}
                        // renderInput={({ inputRef, inputProps, InputProps }) => (
                        //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        //         <TextField variant='standard' ref={inputRef} {...inputProps}/>

                        //     </Box>
                        // )}
                        renderInput={(params) => <TextField

                            {...params} helperText={null} />}
                    />
                </Box>
            </Grid>
            <Grid item xs={'auto'} sx={{ backgroundColor: '#fff' }}>
                <FormControl variant='outlined'>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={state}
                        onChange={(event: SelectChangeEvent) => { setstate(event.target.value) }}
                        sx={{  }}
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
    )
}

