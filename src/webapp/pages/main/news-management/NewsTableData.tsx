import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TablePagination,TableRow, Typography, useTheme
} from '@mui/material'

import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import React from 'react'
import { useAllNews } from '../../../hooks/useAllNews';
import { useHistory } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';//https://github.com/uiwjs/react-markdown-preview
import BasicMenu from './BasicMenu';

interface Column {
    id: 'id' | 'title' | 'date' | 'content' | 'status' | 'action',
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


export default function NewsTableData() {
    console.log(`call userTable Data`);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    // const { showDialog } = useDialog();
    const history = useHistory();
    
    /////set recoil
    const { NewsInfoData, refreshAllNews,
        putRecentsNews, } = useAllNews();
    const columns: Column[] = [
        { id: 'id', label: 'ID' },
        { id: 'title', label: 'Title' },
        { id: 'date', label: 'Date' },
        { id: 'content', label: 'Content' },
        { id: 'status', label: 'Status' },
        { id: 'action', label: '' }
    ];
    if (NewsInfoData === null || NewsInfoData === undefined) {
        console.log(`Error : ${NewsInfoData}`);
        return <></>;
    }
    // if (userInfoData.length === 0) {
    //     return <div><Typography variant="h1">Not found</Typography></div>;
    // }
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - NewsInfoData.length) : 0;


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

    console.log(`user data on render ${NewsInfoData}`);

    //set minwidth ,theme
    return (
        <Paper sx={{ width: '100%', mb: 2 }} >
            <TableContainer >
                <Table aria-label="" >
                    <TableHead sx={{ bgcolor: '#E0E0E0', fontWeight: '400' }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                >
                                    <Typography >
                                        {column.label}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {NewsInfoData.length === 0 && /* case notfound data */
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        }
                        {NewsInfoData.length !== 0 && (rowsPerPage > 0
                            ? NewsInfoData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : NewsInfoData
                        ).map((row, i) => (
                            <TableRow>
                                <TableCell
                                // key={row.meterId}
                                >
                                    {row.id}
                                </TableCell>
                                <TableCell
                                // key={row.fullName + i}
                                >
                                    {row.title}
                                </TableCell>
                                <TableCell
                                // key={row.fullName + i}
                                >
                                    {row.date}
                                </TableCell>
                                <TableCell
                                // key={row.email + i}
                                >
                                    <MarkdownPreview source={row.content} />
                                </TableCell>
                                <TableCell sx={{ color: row.status === 'PUBLISHED'?'success.light':'error.light'  }}
                                // key={row.phoneNumber + i}
                                >
                                        {row.status}
                                </TableCell>
                                <TableCell >
                                    {
                                    <IconButton >
                                        <BasicMenu data={row} />
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
                count={NewsInfoData.length}
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


  
