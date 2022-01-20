import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useAllUser } from '../../../hooks/useAllUser';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { UserInfo } from '../../../state/user-management/user-info';
import { useHistory } from 'react-router-dom';
import { userDetail } from '../../../state/user-management/user-detail';
import { useResetRecoilState } from 'recoil';


interface Column {
    id: 'MeterID' | 'FullName' | 'Email' | 'PhoneNumber' | 'Role' | 'Action',
    label: string,


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

export default function UserTableData() {
    console.log(`call userTable Data`);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const history = useHistory();
    const { userInfoData, refreshAllUser } = useAllUser();//
    const resetUserDetailData = useResetRecoilState(userDetail);

    const columns: Column[] = [
        { id: 'MeterID', label: 'Meter ID' },
        { id: 'FullName', label: 'Full Name' },
        { id: 'Email', label: 'Email' },
        { id: 'PhoneNumber', label: 'Phone Number' },
        { id: 'Role', label: 'Role' },
        { id: 'Action', label: '' }
    ];
    if (userInfoData === null || userInfoData === undefined) {
        console.log(`WTF : ${userInfoData}`);
        return <></>;
    }
    // if (userInfoData.length === 0) {
    //     return <div><Typography variant="h1">Not found</Typography></div>;
    // }
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userInfoData.length) : 0;


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

    console.log(`user data on render ${userInfoData}`);

    function onClickViewButton(userInfo: UserInfo) {
        if (userInfo.role !== 'admin ') {
            resetUserDetailData();
            history.push(`/user_management/${userInfo.meterId}`);
        }
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
                        {userInfoData.length === 0 && /* case notfound data */
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                            }
                        {userInfoData.length > 0 && (rowsPerPage > 0
                            ? userInfoData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : userInfoData
                        ).map((row, i) => (
                            <TableRow>
                                <TableCell
                                // key={row.meterId}
                                >
                                    {row.role !== 'ADMIN' && row.meterId}
                                </TableCell>
                                <TableCell
                                // key={row.fullName + i}
                                >
                                    {row.fullName}
                                </TableCell>
                                <TableCell
                                // key={row.email + i}
                                >
                                    {row.email}
                                </TableCell>
                                <TableCell
                                // key={row.phoneNumber + i}
                                >
                                    {row.phoneNumber}
                                </TableCell>
                                <TableCell
                                // key={row.role + i}
                                >
                                    {row.role}
                                </TableCell>
                                <TableCell
                                    key={row.meterId + row.role + i}
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
                count={userInfoData.length}
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


