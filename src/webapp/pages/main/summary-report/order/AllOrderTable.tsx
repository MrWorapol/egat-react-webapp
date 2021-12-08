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
import TablePaginationActionsComponent from '../../../../components/TablePaginationActions';
import { useOrderReport } from '../../../../hooks/summary-report/order/useOrderReport';
import { IOrderInfo } from '../../../../state/summary-report/order-report/order-report-state';


interface Column {
    id: string,
    label: string,


}

export default function AllOrderTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const history = useHistory();
    // const { userInfoData, refreshAllUser } = useAllUser();
    // const resetUserDetailData = useResetRecoilState(userDetail);
    const { orderReport } = useOrderReport();
    const columns: Column[] = [
        { id: 'tradeMarket', label: 'Trade Market' },
        { id: 'role', label: 'Role' },
        { id: 'buyer/seller', label: 'Buyer/Seller' },
        { id: 'orderStatus', label: 'Order Status' },
        { id: 'Action', label: '' }
    ];
    if (orderReport === null || orderReport === undefined) {
        console.log(`WTF : ${orderReport}`);
        return <></>;
    }
    // if (userInfoData.length === 0) {
    //     return <div><Typography variant="h1">Not found</Typography></div>;
    // }
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderReport.length) : 0;


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
        // if (userInfo.role !== 'admin ') {
        //     resetUserDetailData();
        //     history.push(`/user_management/${userInfo.meterId}`);
        // }
        console.log('click view button')
    }
    return (
        <Paper sx={{ width: '100%', mb: 2 }} >
            <TableContainer >
                <Table aria-label="">
                    <TableHead sx={{ bgcolor: 'primary.main', fontWeight: '400' }}>
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
                        {(!orderReport || orderReport.length === 0) && /* case notfound data */
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        }
                        {!orderReport || orderReport.length !== 0 && (rowsPerPage > 0
                            ? orderReport.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : orderReport
                        ).map((row: IOrderInfo, i) => (
                            <TableRow>
                                <TableCell
                                // key={row.meterId}
                                >
                                    {row.tradeMarket}
                                </TableCell>
                                <TableCell
                                // key={row.fullName + i}
                                >
                                    {row.role}
                                </TableCell>
                                <TableCell
                                // key={row.email + i}
                                >
                                    {row.orderType}
                                </TableCell>
                                <TableCell
                                // key={row.phoneNumber + i}
                                >
                                    {row.status}
                                </TableCell>

                                <TableCell
                                    key={row.orderId + row.role + i}
                                >
                                    <IconButton onClick={() => onClickViewButton(row)}>
                                        <SearchIcon />
                                    </IconButton>

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
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={orderReport.length}
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


