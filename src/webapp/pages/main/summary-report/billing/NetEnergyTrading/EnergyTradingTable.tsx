import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useHistory } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import TablePaginationActionsComponent from '../../../../../components/TablePaginationActions';
import { IEnergyPaymentTable } from '../../../../../state/summary-report/billing-report/energy-payment-state';


interface Column {
    id: string,
    label: string,


}

interface IProps {
    energyPaymentTable: IEnergyPaymentTable[],
}
export default function EnergyTradingTable(props: IProps) {
    let energyPaymentTable = props.energyPaymentTable;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);
    const history = useHistory();
    console.log(energyPaymentTable);

    const columns: Column[] = [
        { id: 'meterId', label: 'Meter Id.' },
        { id: 'meterName', label: 'Meter Name' },
        { id: 'role', label: 'Role' },
        { id: 'netPrice', label: 'Net Price' },
    ];
    if (energyPaymentTable === null || energyPaymentTable === undefined) {
        console.log(`WTF : ${energyPaymentTable}`);
        return <></>;
    }
    
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - energyPaymentTable.length) : 0;


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


    function onClickViewButton(row: any) {
        console.log('click view button')
    }

    return (
        <Paper sx={{ width: '100%', mb: 2 }} >
            <TableContainer >
                <Table aria-label="">
                    <TableHead sx={{ bgcolor: '#E0E0E0', fontWeight: '400' }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {column.label}
                                    </Typography>
                                </TableCell>

                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {energyPaymentTable.length === 0 &&  /* case notfound data */
                            <TableRow style={{ height: 53 * emptyRows }}>

                                <TableCell colSpan={6}>
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        }
                        {energyPaymentTable.length !== 0 && (rowsPerPage > 0
                            ? energyPaymentTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : energyPaymentTable
                        ).map((row: IEnergyPaymentTable, i: number) => (
                            <TableRow>
                                <TableCell
                                    key={row.meterId + i}
                                >
                                    {row.meterId}
                                </TableCell>
                                <TableCell
                                    key={row.meterName + i}
                                >
                                    {row.meterName}
                                </TableCell>
                                <TableCell
                                    key={row.role + i}
                                >
                                    {row.role}
                                </TableCell>
                                <TableCell
                                    key={row.netPrice + i}
                                >
                                    {(Math.round(row.netPrice*100)/100).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))
                        }
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            </TableContainer>
            <TablePagination
                component='div'
                sx={{ right: 0 }}
                rowsPerPageOptions={[3, 5]}
                colSpan={3}
                count={energyPaymentTable.length}
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
                ActionsComponent={TablePaginationActionsComponent}
            />
        </Paper>
    );

}


