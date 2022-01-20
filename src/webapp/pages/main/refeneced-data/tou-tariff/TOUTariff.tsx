import { Container, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigationSet } from '../../../../hooks/useNavigationSet'
import { useTOUTariff } from '../../../../hooks/useTOUTariff';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { ITouTariff, touTariffState } from '../../../../state/reference-data/tou-traff/tou-tariff-state';
import { useResetRecoilState } from 'recoil';
import { touTariffLogState } from '../../../../state/reference-data/tou-traff/tou-tariff-log';
import TariffLogsDialog from './TariffLogsDialog';
import { useDialog } from '../../../../hooks/useDialog';
import TariffEditDialog from './TariffEditDialog';
import ServiceChargeDialog from './ServiceChargeEditDialog';
import { IServiceCharge } from '../../../../state/reference-data/tou-traff/tou-service-charge-state';
import ServiceChargeLogDialog from './ServiceChargeLogDialog';
import HolidayLogsDialog from './HolidayLogsDialog';
import CreateHolidaysDialog from './CreateHolidaysDialog';

// const pk: IPackage[] = [
//     {
//         label: 'อัตรา 22-33 kV, 12-24 kV',
//         value: '1',
//         bahtPerKWh: 312.57,
//         effectiveDate: '22/12/2021',
//         effectiveTime: '9:00',
//     },
//     {
//         label: 'อัตรา <22 kV, <12 kV',
//         value: '2',
//         bahtPerKWh: 231.57,
//         effectiveDate: '22/12/2021',
//         effectiveTime: '9:00',
//     },
// ]
interface IMap {
    [key: string]: string,
}

export const touTypeLabel: IMap = {
    'tou-1': '2.1 PEA แรงดัน 22-33 kV, MEA แรงดัน 12-24 kV',
    'tou-2': '2.2 PEA แรงดัน <22 kV, MEA แรงดัน <12 kW',
}

export default function TOUTariff() {
    useNavigationSet(NavigationCurrentType.TOU_TARIFF);
    const { showDialog } = useDialog();
    const { onLoad, touTariff, refreshTOUTariff, serviceChargeType1, serviceChargeType2, gridUsedPackage,editGridUsedPackage } = useTOUTariff();
    const resetLogs = useResetRecoilState(touTariffLogState);
    const [packageState, setPackageState] = useState('');

    useEffect(() => {
        if (gridUsedPackage) {

            setPackageState(gridUsedPackage.defaultPackage);
        }
    }, [onLoad, gridUsedPackage])

    // if (!currentPackage || !touTariff || !serviceChargeType1 || serviceChargeType2 === null) {
    //     console.warn(currentPackage);
    //     console.warn(touTariff);
    //     //wait for error loading dialog
    //     return (<></>);
    // }

    const handleChangeCurrentPackage = (event: SelectChangeEvent) => {

        // setPackageState(event.target.value as string);
        editGridUsedPackage(event.target.value);
        
    }
    function onClickSettingButton(selectedData: ITouTariff) {
        showDialog({
            content: <TariffEditDialog tariff={selectedData} />,
            onClose: () => false,
            width: 'sm',
            fullWidth: true,

        })
    }
    function onClickLogButton(selectedData: ITouTariff) {
        resetLogs();
        console.log(`open log ${selectedData}`)
        showDialog({
            content: <TariffLogsDialog tariff={selectedData} />,
            onClose: () => false,
            width: 'md',
            fullWidth: true,
        })
    }

    function onEditServiceChargeButton(selectedData: IServiceCharge) {
        showDialog({
            content: <ServiceChargeDialog serviceCharge={selectedData} />,
            onClose: () => false,
            width: 'sm',
            fullWidth: true,

        })
    }

    function onClickServiceChargeLogButton(selectedData: IServiceCharge) {
        showDialog({
            content: <ServiceChargeLogDialog serviceCharge={selectedData} />,
            onClose: () => false,
            width: 'md',
            fullWidth: true,

        })
    }
    function onClickHolidayLogsButton(selectedData: IServiceCharge) {
        showDialog({
            content: <HolidayLogsDialog serviceCharge={selectedData} />,
            onClose: () => false,
            width: 'sm',
            fullWidth: true,

        })
    }

    function onClickCreateHolidaysButton(selectedData: IServiceCharge) {
        showDialog({
            content: <CreateHolidaysDialog serviceCharge={selectedData} />,
            onClose: () => false,
            width: 'sm',
            fullWidth: true,

        })
    }
    function buildTable(touType: string): JSX.Element {

        return (
            <TableContainer sx={{ width: 1, minWidth: '768px' }} >
                <Table aria-label="">
                    <TableHead sx={{ bgcolor: 'primary.main', fontWeight: '400' }}>
                        <TableRow>
                            <TableCell key={'title'} sx={{ width: '30%' }} >
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Title
                                </Typography>
                            </TableCell>
                            <TableCell key={'start-time'} sx={{ width: '15%' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Start Time
                                </Typography>
                            </TableCell>
                            <TableCell key={'end-time'} sx={{ width: '15%', maxWidth: '400px' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    End Time
                                </Typography>
                            </TableCell>
                            <TableCell key={'baht/kWh'} align='center' sx={{ width: '30%', maxWidth: '400px', justifyContent: 'center' }}>
                                <Typography sx={{ fontWeight: 'bold', justifyContent: 'center' }}>
                                    Tariff (Baht/kWh)
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {touTariff !== null && touTariff.length !== 0 &&
                            touTariff.map((row: ITouTariff, i: number) => {
                                console.log()
                                if (row.touType === touType) {
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                <Typography>
                                                    {row.title}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: '30%' }}>
                                                <Typography component="div">
                                                    {row.startTime}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {row.endTime}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Grid container direction="row" justifyContent='space-around' alignItems='center'>
                                                    <Grid item container justifyContent='center' alignItems="center" xs={6}>
                                                        <Typography>
                                                            {row.bahtPerKWh}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container xs={6}>
                                                        <IconButton onClick={() => onClickSettingButton(row)}>
                                                            <SettingsOutlinedIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => onClickLogButton(row)}>
                                                            <ContentPasteIcon />
                                                        </IconButton>
                                                    </Grid>

                                                </Grid>
                                            </TableCell>
                                        </TableRow>

                                    )
                                }
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <Container sx={{ backgroundColor: '#fff', mb: 2, pb: 4 }} >
            <Grid container direction="row" pt={2} alignItems="center" justifyContent='space-between' spacing={2}>
                <Grid item container id="title" alignItems="center" xs={6}>
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        TOU tariff Setting
                    </Typography>
                </Grid>

                <Grid item container alignItems="center" justifyContent="flex-end" spacing={1} xs={6}>
                    <Grid item >
                        <Typography sx={{ fontSize: '1em', }}>
                            {`Grid Used Package`}
                        </Typography>
                    </Grid>
                    <Grid item width='50%' pl={2}>
                        {gridUsedPackage && packageState !== '' &&
                            <FormControl fullWidth variant='standard'>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={packageState}
                                    onChange={handleChangeCurrentPackage}
                                >
                                    <MenuItem value={gridUsedPackage.packages[0].id}> {gridUsedPackage.packages[0].title}</MenuItem>
                                    <MenuItem value={gridUsedPackage.packages[1].id}>{gridUsedPackage.packages[1].title}</MenuItem>
                                </Select>
                            </FormControl>
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction='column' spacing={3} id='content' pt={3} pl={2}>
                <Grid item container id='2.1-package' direction="column" pt={1} pb={1}>
                    <Grid container id='2.1-title' pb={1}>
                        <Typography>
                            {`2.1 PEA แรงดัน 22-33 kV, MEA แรงดัน 12-24 kW`}
                        </Typography>
                    </Grid>
                    <Grid container id='2.1-content' direction='row' >
                        <Grid container item id='2.1-table' xs={8}>
                            {buildTable('tou-1')}
                        </Grid>
                        <Grid container item id='2.1-action-zone' xs={4} direction='column' justifyContent='flex-end'>
                            <Grid item container direction='row' justifyContent='flex-end' alignItems='center'>
                                <Grid item xs={'auto'}>
                                    <Typography>
                                        {'ตั้งค่าวันหยุดในปีปฏิทิน'}
                                    </Typography>
                                </Grid>

                                <Grid item container xs={'auto'}>
                                    <Grid item>
                                        {serviceChargeType1 && <IconButton onClick={() => { onClickCreateHolidaysButton(serviceChargeType1) }}>
                                            <CalendarTodayIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                    <Grid item>
                                        {serviceChargeType1 && <IconButton onClick={() => { onClickHolidayLogsButton(serviceChargeType1) }}>
                                            <AssignmentOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                </Grid>

                            </Grid>
                            <Grid item container direction='row' justifyContent='flex-end' alignItems='center'>
                                <Grid item xs={'auto'}>
                                    <Typography>
                                        {`ค่าบริการ ${serviceChargeType1?.bahtPerMonth}`}
                                    </Typography>
                                </Grid>

                                <Grid item container xs={'auto'}>
                                    <Grid item>
                                        {serviceChargeType1 && <IconButton onClick={() => { onEditServiceChargeButton(serviceChargeType1) }}>
                                            <SettingsOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                    <Grid item>
                                        {serviceChargeType1 && <IconButton onClick={() => { onClickServiceChargeLogButton(serviceChargeType1) }}>
                                            <AssignmentOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container id='2.2-package' direction="column" pt={1} pb={1}>
                    <Grid container id='2.2-title'>
                        <Typography>
                            {`2.2 PEA แรงดัน <22 kV, MEA แรงดัน <12 kW`}
                        </Typography>
                    </Grid>
                    <Grid container id='2.2-content' direction='row' >
                        <Grid container item id='2.1-table' xs={8}>
                            {buildTable('tou-2')}
                        </Grid>
                        <Grid container item id='2.2-action-zone' xs={4} direction='column' justifyContent='flex-end'>
                            <Grid item container direction='row' justifyContent='flex-end' alignItems='center'>
                                <Grid item xs={'auto'}>
                                    <Typography>
                                        {'ตั้งค่าวันหยุดในปีปฏิทิน'}
                                    </Typography>
                                </Grid>

                                <Grid item container xs={'auto'}>
                                    <Grid item>
                                        {serviceChargeType2 && <IconButton onClick={() => { onClickCreateHolidaysButton(serviceChargeType2) }}>
                                            <CalendarTodayIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                    <Grid item>
                                        {serviceChargeType2 && <IconButton onClick={() => { onClickHolidayLogsButton(serviceChargeType2) }}>
                                            <AssignmentOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' justifyContent='flex-end' alignItems='center' >
                                <Grid item xs={'auto'}>
                                    <Typography>
                                        {`ค่าบริการ ${serviceChargeType2?.bahtPerMonth}`}
                                    </Typography>
                                </Grid>

                                <Grid item container xs={'auto'}>
                                    <Grid item>

                                        {serviceChargeType2 && <IconButton onClick={() => { onEditServiceChargeButton(serviceChargeType2) }}>
                                            <SettingsOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                    <Grid item>
                                        {serviceChargeType2 && <IconButton onClick={() => { onClickServiceChargeLogButton(serviceChargeType2) }}>
                                            <AssignmentOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Container>
    )
}
