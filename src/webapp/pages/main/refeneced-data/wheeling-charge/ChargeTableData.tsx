import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useHistory } from 'react-router-dom';


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


interface TablePaginationActionsProps {
    count: number,
    page: number,
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}


function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

interface inputProps {
    columns: IChargeColumns
}
export default function ChargeTableData(props: inputProps) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
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


    // Avoid a layout jump when reaching the last page with empty rows.
    if (!wheelingCharge) {
        return <> </>;
    }
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - wheelingCharge.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // console.log(`user data on render ${userInfoData}`);

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
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        }
                        {
                            wheelingCharge.length !== 0 && (rowsPerPage > 0
                                ? wheelingCharge.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : wheelingCharge
                            ).map((row, i) => (
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
                                            {row.bahtPerKWh}
                                        </TableCell>
                                    }
                                    {
                                        columns['mea'] &&
                                        <TableCell
                                        >
                                            {row.mea}
                                        </TableCell>
                                    }
                                    {
                                        columns['pea'] &&
                                        <TableCell
                                        >
                                            {row.pea}
                                        </TableCell>
                                    }
                                    {
                                        columns['meaegat'] &&
                                        <TableCell
                                        >
                                            {row.meaEgat}
                                        </TableCell>
                                    }
                                    {
                                        columns['peaegat'] &&
                                        <TableCell
                                        >
                                            {row.peaEgat}
                                        </TableCell>
                                    }
                                    {
                                        columns['meapeaegat'] &&
                                        <TableCell
                                        >
                                            {row.meaPeaEgat}
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
                                    {total.bahtPerKWh}
                                </TableCell>
                            }
                            {
                                columns['mea'] &&
                                <TableCell >
                                    {total.mea}
                                </TableCell>
                            }
                            {
                                columns['pea'] &&
                                <TableCell>
                                    {total.pea}
                                </TableCell>
                            }
                            {
                                columns['meaegat'] &&
                                <TableCell >
                                    {total.meaEgat}
                                </TableCell>
                            }
                            {
                                columns['peaegat'] &&
                                <TableCell>
                                    {total.peaEgat}
                                </TableCell>
                            }
                            {
                                columns['meapeaegat'] &&
                                <TableCell>
                                    {total.meaPeaEgat}
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
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}

                    </TableBody>
                </Table>

            </TableContainer >
            <TablePagination
                component='div'
                sx={{ right: 0 }}
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={wheelingCharge.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                    inputProps: {
                        'aria-label': 'Item per page',
                    },
                    native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
        </Paper >
    );

}


