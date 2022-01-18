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
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { ISettlementReport } from '../../../../state/summary-report/settlement-report/settlement-report-state';


interface Column {
    id: string,
    label: string,


}
interface IProps {
    data: ISettlementReport[],
    page: number,
}
export default function AllSettlementTable(props: IProps) {
    const { refreshSettlementDetail } = useSettlementReport();
    const { data } = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const columns: Column[] = [
        { id: 'contractId', label: 'Contract ID' },
        { id: 'role', label: 'Role' },
        { id: 'buyer/seller', label: 'Buyer/Seller' },
        { id: 'tradeMarket', label: 'Trade Market' },
        { id: 'imbalance', label: 'Imbalance' },
        { id: 'Action', label: '' }
    ];
    if (data === null || data === undefined) {
        console.log(`WTF : ${data}`);
        return <></>;
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;


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


    function onClickViewButton(row: ISettlementReport) {
        refreshSettlementDetail(row);
    }
    return (
        <Paper sx={{ width: 1, }}>
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
                        {data.length === 0 && /* case notfound data */
                                <TableRow style={{ height: 53 * emptyRows }}>
    
                                    <TableCell colSpan={6}>
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                        }
                        {data.length !== 0 && (rowsPerPage > 0
                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                        ).map((row, i) => (
                            <TableRow>
                                <TableCell
                                    key={row.contractId + row.userType}
                                >
                                    {row.contractId}
                                </TableCell>
                                <TableCell
                                    key={row.role + row.userType + i}
                                >
                                    {row.role}
                                </TableCell>
                                <TableCell
                                    key={row.userType + i}
                                >
                                    {row.userType}
                                </TableCell>
                                <TableCell
                                    key={row.tradeMarket + i}
                                >
                                    {console.log(row.tradeMarket)}
                                    {row.tradeMarket === "BILATERAL" && "Bilateral Trade"}
                                    {row.tradeMarket === "POOL" && "Pool Market"}
                                </TableCell>
                                <TableCell
                                    key={row.imbalanceStatus + i}
                                >
                                    {row.imbalanceStatus === "energyShortfall" && "Energy ShortFall"}
                                    {row.imbalanceStatus === "energyExcess" && "Energy Excess"}
                                    {row.imbalanceStatus === "CONTRACT" && "CONTRACT"}
                                </TableCell>
                                <TableCell
                                    key={row.contractId + row.role + i}
                                >
                                    {row.role !== 'ADMIN' && <IconButton onClick={() => onClickViewButton(row)}>
                                        <SearchIcon />
                                    </IconButton>
                                    }
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
                count={data.length}
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


