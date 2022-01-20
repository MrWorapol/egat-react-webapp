import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import IconButton from '@mui/material/IconButton';


import { useWheelingCharge } from '../../../../hooks/reference-data/useWheelingCharge';

import SettingsIcon from '@mui/icons-material/Settings';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useDialog } from '../../../../hooks/useDialog';
import SettingDialog from './SettingDialog';
import LogDialog from './LogDialog';
import { useResetRecoilState } from 'recoil';
import { wheelingLogsState } from '../../../../state/reference-data/wheeling-chart/wheeling-log-state';
import { IWheelingCharge } from '../../../../state/reference-data/wheeling-chart/wheeling-charge-state';
interface IMap {
    [key: string]: boolean | string;
}

interface IChargeColumns extends IMap {
    baht: boolean | string,
    mea: boolean | string,
    pea: boolean | string,
    meaegat: boolean | string,
    peaegat: boolean | string,
    meapeaegat: boolean | string,
    paymentTo: boolean | string,
}





interface inputProps {
    columns: IChargeColumns
}
export default function ChargeTableData(props: inputProps) {

    const { wheelingCharge, refreshWheelingCharge } = useWheelingCharge();
    const { showDialog } = useDialog();
    const columns: IChargeColumns = props.columns;
    const chargeColumnsLabel: IChargeColumns = {
        baht: 'Baht/kWh',
        mea: 'MEA',
        pea: 'PEA',
        meaegat: 'MEAEGAT',
        peaegat: 'PEAEGAT',
        meapeaegat: 'MEAPEAEGAT',
        paymentTo: 'Note: Payment To',
    }
    const resetLogsState = useResetRecoilState(wheelingLogsState);

    useEffect(() => {
        if (!wheelingCharge) {
            refreshWheelingCharge();
        }
        return () => {

        }
    }, [wheelingCharge]);
    // Avoid a layout jump when reaching the last page with empty rows.
    if (!wheelingCharge) {
        console.log(`call wheeling Charge`);
        return <> </>;
    }




    function onClickSettingButton(no: number, selectedData: IWheelingCharge) {
        showDialog({
            content: <SettingDialog no={no} wheelingCharge={selectedData} />,
            onClose: () => false,
            width: 'sm',

        })
    }
    function onClickLogButton(no: number, selectedData: IWheelingCharge) {
        //need to reset log state before render new logs
        resetLogsState();
        showDialog({
            content: <LogDialog no={no} wheelingCharge={selectedData} />,
            onClose: () => false,
            width: 'md',
            fullWidth: true,
        })
    }

    let total = {
        no: 1,
        title: 'Total',
        bahtPerKWh: 0,
        mea: 0,
        pea: 0,
        meaEgat: 0,
        peaEgat: 0,
        meaPeaEgat: 0,
    };

    function getTotalData(wheelingCharge: IWheelingCharge[]) {
        if (wheelingCharge.length > 0) {
            wheelingCharge.forEach((row) => {
                total.no += 1;
                total.bahtPerKWh += row.bahtPerKWh;
                total.mea += row.mea;
                total.pea += row.pea;
                total.meaEgat += row.meaEgat;
                total.peaEgat += row.peaEgat;
                total.meaPeaEgat += row.meaPeaEgat;
            })
        }
    }
    getTotalData(wheelingCharge);
    return (
        <Paper sx={{ width: '100%', mb: 2 }} >
            <TableContainer >
                <Table aria-label="">
                    <TableHead sx={{ bgcolor: 'primary.main', fontWeight: '400' }}>
                        <TableRow>
                            <TableCell key={'No'} >
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    No.
                                </Typography>
                            </TableCell>
                            <TableCell key={'Title'} >
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Title
                                </Typography>
                            </TableCell>
                            {Object.keys(columns).map((key: string) => {
                                if (columns[key]) {
                                    return <TableCell
                                        key={key}
                                    >
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {chargeColumnsLabel[key]}
                                        </Typography>
                                    </TableCell>
                                }
                            })
                            }
                            <TableCell key={'action'} >
                                <Typography sx={{ fontWeight: 'bold' }}>

                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            wheelingCharge.length === 0 && /* case notfound data */
                            <TableRow style={{ height: 53 }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        }
                        {
                            wheelingCharge.length > 0 && 
                            wheelingCharge.map((row, i) => (
                                < TableRow sx={{ alignContent: 'center' }}>
                                    <TableCell
                                    >
                                        {i + 1}
                                    </TableCell>
                                    <TableCell
                                    >
                                        {row.title}
                                    </TableCell>
                                    {
                                        columns['baht'] &&
                                        <TableCell
                                        >
                                            {(Math.round(row.bahtPerKWh * 1000) / 1000).toFixed(3)}
                                        </TableCell>
                                    }
                                    {
                                        columns['mea'] &&
                                        <TableCell
                                        >
                                            {(Math.round(row.mea * 1000) / 1000).toFixed(3)}
                                        </TableCell>
                                    }
                                    {
                                        columns['pea'] &&
                                        <TableCell
                                        >
                                            {(Math.round(row.pea * 1000) / 1000).toFixed(3)}
                                        </TableCell>
                                    }
                                    {
                                        columns['meaegat'] &&
                                        <TableCell
                                        >
                                            {(Math.round(row.meaEgat * 1000) / 1000).toFixed(3)}
                                        </TableCell>
                                    }
                                    {
                                        columns['peaegat'] &&
                                        <TableCell
                                        >
                                            {(Math.round(row.peaEgat * 1000) / 1000).toFixed(3)}
                                        </TableCell>
                                    }
                                    {
                                        columns['meapeaegat'] &&
                                        <TableCell
                                        >
                                            {(Math.round(row.meaPeaEgat * 1000) / 1000).toFixed(3)}
                                        </TableCell>
                                    }
                                    {
                                        columns['paymentTo'] &&
                                        <TableCell
                                        >
                                            {row.note}
                                        </TableCell>
                                    }
                                    < TableCell
                                        key={i + row.title}
                                    >
                                        <Grid container direction="row">
                                            <Grid xs={6}>
                                                <IconButton onClick={() => onClickSettingButton(i, row)}>
                                                    <SettingsIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid xs={6}>
                                                <IconButton onClick={() => onClickLogButton(i, row)}>
                                                    <ContentPasteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))


                        }
                        < TableRow id='total'>
                            <TableCell>
                                {total.no}
                            </TableCell>
                            <TableCell  >
                                {`Total`}
                            </TableCell>
                            {
                                columns['baht'] &&
                                <TableCell >
                                    {(Math.round(total.bahtPerKWh * 1000) / 1000).toFixed(3)}
                                </TableCell>
                            }
                            {
                                columns['mea'] &&
                                <TableCell >
                                    {(Math.round(total.mea * 1000) / 1000).toFixed(3)}
                                </TableCell>
                            }
                            {
                                columns['pea'] &&
                                <TableCell>
                                    {(Math.round(total.pea * 1000) / 1000).toFixed(3)}
                                </TableCell>
                            }
                            {
                                columns['meaegat'] &&
                                <TableCell >
                                    {(Math.round(total.meaEgat * 1000) / 1000).toFixed(3)}
                                </TableCell>
                            }
                            {
                                columns['peaegat'] &&
                                <TableCell>
                                    {(Math.round(total.peaEgat * 1000) / 1000).toFixed(3)}
                                </TableCell>
                            }
                            {
                                columns['meapeaegat'] &&
                                <TableCell>
                                    {(Math.round(total.meaPeaEgat * 1000) / 1000).toFixed(3)}
                                </TableCell>
                            }
                            {
                                columns['paymentTo'] &&
                                <TableCell >
                                </TableCell>
                            }
                            < TableCell >
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

            </TableContainer >

        </Paper >
    );

}


