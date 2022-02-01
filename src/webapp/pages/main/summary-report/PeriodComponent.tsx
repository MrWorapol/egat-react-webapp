import { DatePicker } from '@mui/lab';
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce/lib';
import usePeriodTime from '../../../hooks/summary-report/usePeriodTime';
import { useLoadingScreen } from '../../../hooks/useLoadingScreen';

interface PeriodProps {
    refreshPage: () => void,
}

export default function PeriodComponent(props: PeriodProps) {
    const { period, updatedPeriod } = usePeriodTime();
    const [region, setRegion] = useState('all');
    const [startDay, setStartDay] = useState(dayjs(period.startDate).date().toString());
    const [endDay, setEndDay] = useState(dayjs(period.endDate).date().toString());
    const startDayslist = buildDaylist(period.startDate);
    const endDayslist = buildDaylist(period.endDate);
    const { showLoading, hideLoading } = useLoadingScreen();
    const [init, setInit] = useState(true);
    let isCurrentMonth = (dayjs().month() === dayjs(period.startDate).month() &&
        dayjs().year() === dayjs(period.startDate).year()) ? true : false;

    const debounceFn = useDebouncedCallback(() => {
        console.log(`debounce fn`)
        try {
            props.refreshPage();
        } catch (e) {
        }
    }, 2000);

    const handleChangeStartDay = async (e: SelectChangeEvent<string>) => {
        // console.log(`start Day${e.target.value}`);
        setStartDay(e.target.value);
        setEndDay(e.target.value);
        updatedPeriod({
            startDate: dayjs(period.startDate).set('date', +e.target.value).toDate(),
            endDate: dayjs(period.startDate).set('date', +e.target.value).toDate(),
            region: period.region,
        })

    }
    const handleChangeEndDay = async (e: SelectChangeEvent<string>) => {
        const newEndDay = dayjs(period.startDate).date(+e.target.value);
        setEndDay(e.target.value);
        // console.log(`End Day${e.target.value}`);
        updatedPeriod({
            startDate: period.startDate,
            endDate: newEndDay.toDate(),
            region: period.region,
        })

    }

    const handleChangeMonth = async (newMonth: Dayjs) => {
        setStartDay(newMonth.date().toString());
        setEndDay(newMonth.date().toString());
        if (period) {
            updatedPeriod({
                startDate: newMonth.date(1).toDate(),
                endDate: newMonth.date(1).toDate(),
                region: period.region,
            });
        }

    };

    const handleChangeRegion = async (event: SelectChangeEvent) => {
        setRegion(event.target.value);
        if (period) {
            updatedPeriod({
                startDate: period.startDate,
                endDate: period.endDate,
                region: event.target.value,
            })
        }

    }
    useEffect(() => {
        if (init) {
            setInit(false);
        } else {
            debounceFn();
        }

    }, [period, debounceFn]);

    if (period) {
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
                                        <MenuItem key={`start-day-list${day}-${Math.random() * 2.5 / 3}`} value={`${day}`}
                                            disabled={
                                                isCurrentMonth && day > dayjs().date()//if start date is in this month > disabled day is more than today
                                            }
                                        > {day}</MenuItem>
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
                                        <MenuItem
                                            key={`end-day-list${day}-${Math.random() * 2.5 / 3}`}
                                            value={`${day}`}
                                            disabled={
                                                isCurrentMonth && day > dayjs().date()/* is case this month && year */
                                                    ? day < +startDay || day > dayjs().date()  //YES : disabled  day within range 'under startDay ' and 'more than today'   

                                                    : day < +startDay} //'disabled day within range under startDay'
                                        >
                                            {day}
                                        </MenuItem>
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
                            minDate={dayjs().subtract(2, 'year').subtract(1, 'day')}
                            maxDate={dayjs()}
                            value={period.startDate}
                            disableMaskedInput={true}
                            onChange={(newValue) => {
                                if (newValue) {
                                    handleChangeMonth(newValue);
                                }
                            }}

                            renderInput={(params) => <TextField
                                disabled={true}
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
                            <MenuItem key="North" value={'North'}>{'North'}</MenuItem>
                            <MenuItem key="East" value={'East'}>{'East'}</MenuItem>
                            <MenuItem key="West" value={'West'}>{'West'}</MenuItem>
                            <MenuItem key="South " value={'South'}>{'South'}</MenuItem>
                            <MenuItem key="North-Eastern" value={'North-Eastern'}>{'North East'}</MenuItem>
                            <MenuItem key="Central" value={'Central'}>{'Central'}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid >
        )
    } else {
        return <></>;
    }
}


function buildDaylist(date: Date) {
    const result = [];
    const daysInMonth = dayjs(date).daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
        result.push(i)
    }
    return result;
}