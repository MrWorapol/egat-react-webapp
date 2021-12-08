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
import TablePaginationActions from '../../../../components/TablePaginationActions';
import { meterInfo } from '../../../../state/summary-report/user-report/user-report-state';
import useUserReport from '../../../../hooks/summary-report/user/useUserReport';


interface Column {
    id: string,
    label: string,


}

interface IProps {
    data: meterInfo[],

}
export default function AllAreaTable(props: IProps) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const history = useHistory();
    const rows = props.data;
    const { refreshLocationSite } = useUserReport();
    // const { userInfoData, refreshAllUser } = useAllUser();
    // const resetUserDetailData = useResetRecoilState(userDetail);
    const mockDatas = [{}, {}];
    const columns: Column[] = [
        { id: 'MeterID', label: 'Meter ID' },
        { id: 'MeterName', label: 'Meter Name' },
        { id: 'siteName', label: 'Site Name' },
        { id: 'locationCode', label: 'Location Code' },
        { id: 'Action', label: '' }
    ];
    if (mockDatas === null || mockDatas === undefined) {
        console.log(`WTF : ${mockDatas}`);
        return <></>;
    }
    // if (userInfoData.length === 0) {
    //     return <div><Typography variant="h1">Not found</Typography></div>;
    // }
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - mockDatas.length) : 0;


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


    function onClickViewButton(row: meterInfo) {
        refreshLocationSite(row.meterId)
        // console.log('click view button')
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
                        {mockDatas.length === 0 && /* case notfound data */
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        }
                        {rows.length !== 0 && (rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row, i) => (
                            <TableRow>
                                <TableCell
                                // key={row.meterId}
                                >
                                    {row.meterId}
                                </TableCell>
                                <TableCell
                                // key={row.fullName + i}
                                >
                                    {row.meterName}
                                </TableCell>
                                <TableCell
                                // key={row.email + i}
                                >
                                    {row.siteName}
                                </TableCell>
                                <TableCell
                                // key={row.phoneNumber + i}
                                >
                                    {row.locationCode}
                                </TableCell>

                                <TableCell
                                    key={row.meterId + row.role + i}
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
                count={mockDatas.length}
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
        </Paper>
    );

}


