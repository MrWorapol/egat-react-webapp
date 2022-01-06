import { DatePicker } from '@mui/lab';
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce/lib';
import CustomDatePicker from '../../../components/CustomDatePicker';
import usePeriodTime from '../../../hooks/summary-report/usePeriodTime';
import { useLoadingScreen } from '../../../hooks/useLoadingScreen';

interface PeriodProps {
    refreshPage: () => void,
}

export default function PeriodComponent(props: PeriodProps) {
    const { period, updatedPeriod } = usePeriodTime();
    const [region, setRegion] = useState('all');
    const [startDay, setStartDay] = useState(dayjs(period.startDate).date().toString());
    const [endDay, setEndDay] = useState(dayjs(period.startDate).date().toString());
    const startDayslist = buildDaylist(period.startDate);
    const endDayslist = buildDaylist(period.startDate);
    const { showLoading, hideLoading } = useLoadingScreen();

    const debounceFn = useDebouncedCallback(() => {
        showLoading(10);
        try {
            props.refreshPage();
        } catch (e) {
            hideLoading(10);
        }
        hideLoading(10);
    }, 4000);
    const handleChangeStartDay = (e: SelectChangeEvent<string>) => {
        setStartDay(e.target.value);
        setEndDay(e.target.value);
        updatedPeriod({
            startDate: dayjs(period.startDate).date(+e.target.value).toDate(),
            endDate: dayjs(period.startDate).date(+e.target.value).toDate(),
            region: period.region,
        })
        debounceFn();
    }
    const handleChangeEndDay = (e: SelectChangeEvent<string>) => {
        const newEndDay = dayjs(period.startDate).date(+e.target.value);
        setEndDay(e.target.value);
        updatedPeriod({
            startDate: period.startDate,
            endDate: newEndDay.toDate(),
            region: period.region,
        })
        debounceFn();
    }

    const handleChangeMonth = (newMonth: Dayjs) => {
        setStartDay(newMonth.date().toString());
        setEndDay(newMonth.date().toString());
        updatedPeriod({
            startDate: newMonth.date(1).toDate(),
            endDate: newMonth.date(1).toDate(),
            region: period.region,
        });
        debounceFn();

    };

    const handleChangeRegion = (event: SelectChangeEvent) => {
        setRegion(event.target.value);
        updatedPeriod({
            startDate: period.startDate,
            endDate: period.endDate,
            region: event.target.value,
        })
        debounceFn();
    }
    useEffect(() => {

    }, [period, startDay, updatedPeriod])

    return (
        <Grid container item direction='row' justifyContent='flex-end' alignItems='center'>
            <Grid container item xs={'auto'} mx={2} id='start-to-end-day'>
                <Box px={2} alignSelf='center'>
                    <Typography >From</Typography>
                </Box>
                <Box sx={{ backgroundColor: '#fff' }} id='startDay'>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            id="select-year"
                            value={startDay}
                            onChange={(e) => { handleChangeStartDay(e) }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: '40vh',
                                        backgroundColor: '#fff',
                                    }
                                }
                            }}
                        >
                            {startDayslist.map((day: number, i) => {
                                return (
                                    <MenuItem key={`start-day-list${day}-${Math.random() * 2.5 / 3}`} value={`${day}`} > {day}</MenuItem>
                                )
                            })}

                        </Select>
                    </FormControl>
                </Box>
                <Box px={2} alignSelf='center'>
                    <Typography >To</Typography>
                </Box>
                <Box sx={{ backgroundColor: '#fff', ml: 2 }} id='endDay'>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            id="select-year"
                            value={endDay}
                            onChange={(e) => { handleChangeEndDay(e) }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: '40vh',
                                        backgroundColor: '#fff',
                                    }
                                }
                            }}
                        >
                            {endDayslist.map((day: number, i) => {
                                return (
                                    <MenuItem key={`end-day-list${day}-${Math.random() * 2.5 / 3}`} value={`${day}`} disabled={day < +startDay}> {day}</MenuItem>
                                )
                            })}

                        </Select>
                    </FormControl>
                </Box>
            </Grid>
            <Grid container item xs={'auto'} mx={2} id="date=picker">
                <Box sx={{ backgroundColor: '#fff' }}>
                    <DatePicker
                        views={['year', 'month']}
                        // label="Year and Month"
                        minDate={dayjs().subtract(2, 'year')}
                        maxDate={dayjs()}
                        value={period.startDate}
                        disableMaskedInput
                        onChange={(newValue) => {
                            if (newValue) {
                                handleChangeMonth(newValue);
                                console.log(`new Month Select${newValue.format('DD/MM/YYYY')}`);

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
            <Grid item xs={'auto'} sx={{ backgroundColor: '#fff' }} id="region">
                <FormControl variant='outlined'>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={region}
                        onChange={(event: SelectChangeEvent) => { handleChangeRegion(event) }}
                        sx={{}}
                    >
                        <MenuItem key="all-region" value={'all'}> {'All Region'}</MenuItem>
                        <MenuItem key="north" value={'north'}>{'North'}</MenuItem>
                        <MenuItem key="east" value={'east'}>{'East'}</MenuItem>
                        <MenuItem key="west" value={'west'}>{'West'}</MenuItem>
                        <MenuItem key="south " value={'south'}>{'South'}</MenuItem>
                        <MenuItem key="northeast" value={'northeast'}>{'North East'}</MenuItem>
                        <MenuItem key="central " value={'central'}>{'Central'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid >
    )
}


function buildDaylist(date: Date) {
    const result = [];
    const daysInMonth = dayjs(date).daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
        result.push(i)
    }
    return result;
}