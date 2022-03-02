import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import useOrderReport from '../../../../hooks/summary-report/order/useOrderReport';

import { useHistory } from 'react-router-dom';

import TablePaginationActionsComponent from '../../../../components/TablePaginationActions';
import { IOrderInfo } from '../../../../state/summary-report/order-report/order-report-state';


interface Column {
    id: string,
    label: string,


}

interface IProps {
    data: IOrderInfo[],
    page: number,
}
export default function AllOrderTable(props: IProps) {
    const [page, setPage] = React.useState(props.page);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const history = useHistory();
    const { refreshOrderDetail } = useOrderReport();
    const columns: Column[] = [
        { id: 'tradeMarket', label: 'Trade Market' },
        { id: 'role', label: 'Role' },
        { id: 'buyer/seller', label: 'Buyer/Seller' },
        { id: 'orderStatus', label: 'Order Status' },
        { id: 'Action', label: '' }
    ];

    useEffect(() => { //watch update length of data and set page to start page
        setPage(0);
        return () => {
        }
      }, [props.data.length])

    if (props.data === null || props.data === undefined) {
        return <></>;
    }
   
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;


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


    function onClickViewButton(row: IOrderInfo) {
        // if (userInfo.role !== 'admin ') {
        //     resetUserDetailData();
        //     history.push(`/user_management/${userInfo.meterId}`);
        // }
   
        refreshOrderDetail(row)
    }
    
    if (props.data.length < rowsPerPage && page !== 0) {
        setPage(0);
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
                        {(props.data && props.data.length === 0) && /* case notfound data */
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6}>
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        }
                        {props.data && props.data.length !== 0 && (rowsPerPage > 0
                            ? props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : props.data
                        ).map((row: IOrderInfo, i) => (
                            <TableRow key={`${i}-${row.orderId}`}>
                                <TableCell
                                    key={row.orderId}
                                >
                                    {row.tradeMarket.includes("BILATERAL")  ? "Bilateral Trade" : "Pool Market"}
                                </TableCell>
                                <TableCell
                                // key={row.fullName + i}
                                >
                                    {row.role}
                                </TableCell>
                                <TableCell
                                // key={row.email + i}
                                >
                                    {row.userType}
                                </TableCell>
                                <TableCell sx={{ color: row.status === "OPEN" ? "success.light": "error.light" }}
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
                count={props.data.length}
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


