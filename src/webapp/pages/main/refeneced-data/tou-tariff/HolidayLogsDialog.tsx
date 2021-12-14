import React, { useState } from 'react'
import {  Button, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useDialog } from '../../../../hooks/useDialog';
import { IServiceCharge } from '../../../../state/reference-data/tou-traff/tou-service-charge-state';
import useHolidayLogs from '../../../../hooks/reference-data/useHolidayLogs';
import { holidayLogsState, IHoliday } from '../../../../state/reference-data/tou-traff/holiday-state';
import { useResetRecoilState } from 'recoil';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IServiceChargeProps {
    serviceCharge: IServiceCharge,
}

export default function HolidayLogsDialog(props: IServiceChargeProps) {
    const { closeDialog } = useDialog();
    const [expanded, setExpanded] = React.useState<string | false>(`logs-0`);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const { holidayLogs, refreshHolidayLogs } = useHolidayLogs(props.serviceCharge.touType);
    const resetLogs = useResetRecoilState(holidayLogsState);
    const thisYear = dayjs().tz('Asia/Bangkok').year().toString();
    const [yearSelected, setYearSelected] = useState(thisYear);


    const handleChangeYear = (event: SelectChangeEvent) => {
        setYearSelected(event.target.value as string);
        // resetLogs();
        refreshHolidayLogs(event.target.value as string)
    }
    const closeOpenDialog = () => {
        resetLogs();
        closeDialog();
    }
    function buildTable(i: number, row: IHoliday): JSX.Element {
        return (
            <TableRow>
                <TableCell>
                    <Typography>
                        {dayjs(row.editDate).format('DD/MM/YYYY')}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography >
                        {row.setDate}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography component="div">
                        {row.description}
                    </Typography>
                </TableCell>

            </TableRow>

        )


    }



    return (
        <>
            <DialogTitle>
                <Typography sx={{ fontSize: '1.2em' }}>
                    {`วันหยุดในปีปฎิทิน`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" justifyContent="flex-end" sx={{ alignItems: 'right' }} width="7em" py={1}>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            id="select-year"
                            value={yearSelected}
                            onChange={handleChangeYear}

                        >
                            {holidayLogs && holidayLogs.years.map((year: string, i) => {
                                console.warn(holidayLogs);
                                return (
                                    <MenuItem value={year}> {year}</MenuItem>
                                )
                            })}
                            
                        </Select>
                    </FormControl>
                </Box>
                <Box>

                    <TableContainer sx={{ width: 1 }} >
                        <Table aria-label="">
                            <TableHead sx={{ bgcolor: '#DEDEDE', fontWeight: '400' }}>
                                <TableRow>
                                    <TableCell key={'edit-date'} sx={{ width: '20%' }} >
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Edit Date
                                        </Typography>
                                    </TableCell>
                                    <TableCell key={'set-date'} sx={{ width: '20%' }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Set Date
                                        </Typography>
                                    </TableCell>
                                    <TableCell key={'description'} sx={{ width: '60%', }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Description
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    holidayLogs && holidayLogs.holidays.map((log: IHoliday, i: number) => {
                                        return buildTable(i, log);
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={closeOpenDialog}>
                    Close
                </Button>
            </DialogActions>
        </>
    )
}
