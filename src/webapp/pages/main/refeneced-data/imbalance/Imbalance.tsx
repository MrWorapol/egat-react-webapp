import { Container, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, } from '@mui/material';
import React, { useEffect } from 'react'
import { useDialog } from '../../../../hooks/useDialog';
import { useImbalance } from '../../../../hooks/reference-data/useImbalance';
import { useNavigationSet } from '../../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ImbalanceSettingDialog from './ImbalanceSettingDialog';
import ImbalanceLogDialog from './ImbalanceLogDialog';
import { Iimbalance } from '../../../../state/reference-data/imbalance/imbalance-state';
import { useResetRecoilState } from 'recoil';
import { imbalanceLogsState } from '../../../../state/reference-data/imbalance/imbalance-log';
interface IMap {
    [key: string]: boolean | string;
}

export default function Imbalance() {
    useNavigationSet(NavigationCurrentType.IMBALANCE);
    const { showDialog, closeDialog } = useDialog();
    const { imbalance } = useImbalance();
    const resetLogs = useResetRecoilState(imbalanceLogsState);

    // if (!imbalance) { return <> </>; }

    function onClickSettingButton(no: number, selectedData: Iimbalance) {
        showDialog({
            content: <ImbalanceSettingDialog no={no} imbalance={selectedData} />,
            onClose: () => false,
            width: 'sm',
            fullWidth: true,

        })
    }
    function onClickLogButton(no: number, selectedData: Iimbalance) {
        resetLogs();
        console.log(`open log ${selectedData.imbalance}`)
        showDialog({
            content: <ImbalanceLogDialog no={no} imbalance={selectedData} />,
            onClose: () => false,
            width: 'md',
            fullWidth: true,
        })
    }

    function buildTable(type: string): JSX.Element {

        return (
            <TableContainer sx={{ width: 1, minWidth: '768px' }} >
                <Table aria-label="">
                    <TableHead sx={{ bgcolor: 'primary.main', fontWeight: '400' }}>
                        <TableRow>
                            <TableCell key={'seller-imbalance'} sx={{ width: '17%' }} >
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Imbalance
                                </Typography>
                            </TableCell>
                            <TableCell key={'seller-scenario'} sx={{ minWidth: '345px', width: '400px' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Scenario
                                </Typography>
                            </TableCell>
                            <TableCell key={'seller-clearing'} sx={{ minWidth: '245px', maxWidth: '400px' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Imbalance Clearing
                                </Typography>
                            </TableCell>
                            <TableCell key={'baht/kWh'} >
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Baht/kWh
                                </Typography>
                            </TableCell>
                            <TableCell key={'action-zone'} sx={{ width: '6em' }}>

                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(imbalance && imbalance.length !== 0) &&
                            imbalance.map((row: Iimbalance, i) => {
                                console.info(row);
                                if (row.type === type) {

                                    return (
                                        <TableRow>
                                            <TableCell>
                                                <Typography>
                                                    {row.imbalance}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: '30%' }}>
                                                <Typography component="div">
                                                    {row.scenario}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {row.imbalanceClearing}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {row.bahtPerKWh}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                key={i + row.id}
                                            >
                                                <Grid container direction="row">
                                                    <Grid item>
                                                        <IconButton onClick={() => onClickSettingButton(i + 1, row)}>
                                                            <SettingsIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton onClick={() => onClickLogButton(i + 1, row)}>
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

    useEffect(() => {
        
        return () => {
        
        }
    }, [])

    return (
        <Container sx={{ backgroundColor: '#FFF', width: 1 }}>
            <Grid container direction="column" pt={3} xs={12}>
                <Grid item container id="title">
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        Imbalance
                    </Typography>
                </Grid>
                <Grid item container id="seller-table" direction="column" py={2} justifyContent='space-between'>
                    <Grid item py={2}>
                        <Typography variant="h6" sx={{ color: '#22BA20' }} >
                            Seller
                        </Typography>
                    </Grid>
                    <Grid item >
                        {buildTable('seller')}
                    </Grid>
                </Grid>
                <Grid item container id="buyer-table" direction="column" py={2} justifyContent='space-between'>
                    <Grid item py={2}>
                        <Typography variant="h6" sx={{ color: '#CF2521' }} >
                            Buyer
                        </Typography>
                    </Grid>
                    <Grid item >
                        {buildTable('buyer')}
                    </Grid>

                </Grid>
            </Grid>
        </Container>
    )



}
