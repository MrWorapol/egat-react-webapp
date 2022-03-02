import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import TablePaginationActionsComponent from '../../../../../components/TablePaginationActions';
import { IEnergyPaymentTable } from '../../../../../state/summary-report/billing-report/energy-payment-state';
import { INetPaymentTable } from '../../../../../state/summary-report/billing-report/net-payment-state';


interface Column {
    id: string,
    label: string,


}

interface IProps {
    netPaymentTable: INetPaymentTable[],
}
export default function NetPaymentTable(props: IProps) {
    let netPaymentTable = props.netPaymentTable;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);
    const history = useHistory();

    const columns: Column[] = [
        { id: 'meterId', label: 'Meter Id.' },
        { id: 'meterName', label: 'Meter Name' },
        { id: 'role', label: 'Role' },
        { id: 'netPrice', label: 'Net Price' },
    ];
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - netPaymentTable.length) : 0;

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

    useEffect(() => { //watch update length of data and set page to start page
        setPage(0);
    
        return () => {
          
        }
      }, [netPaymentTable.length])

    if (netPaymentTable === null || netPaymentTable === undefined) {
        console.log(`NULL`);
        return <></>;
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
                        {netPaymentTable.length === 0 &&  /* case notfound data */
                            <TableRow style={{ height: 53 * emptyRows }}>

                                <TableCell colSpan={6}>
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        }
                        {netPaymentTable.length !== 0 && (rowsPerPage > 0
                            ? netPaymentTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : netPaymentTable
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
                count={netPaymentTable.length}
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


