import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, 
    TableRow, Typography, useTheme, Button, ButtonGroup , Container , Menu, MenuItem } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import React from 'react'
import NewsManagementAPI from '../../../api/news/newsManagementApi';
import { useAllNews } from '../../../hooks/useAllNews';
import { NewsInfo } from '../../../state/news-management/news-info';
import { INewsDetail,newsDetail } from '../../../state/news-management/news-detail';
import { useHistory } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { useRecoilState } from "recoil";
import { Dialog , DialogActions ,DialogContent , DialogTitle } from '@mui/material'
import { useDialog } from '../../../hooks/useDialog';
import { Editor}  from 'react-draft-wysiwyg';
import { EditorState,convertFromRaw } from 'draft-js';
import {markdownToDraft } from 'markdown-draft-js';
import MarkdownPreview from '@uiw/react-markdown-preview';

//https://github.com/uiwjs/react-markdown-preview

interface Column {
    id: 'id' | 'title' | 'date' | 'content' | 'status' | 'action' ,
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
                                <TableCell
                                // key={row.phoneNumber + i}
                                >
                                    {row.status}
                                </TableCell>
                                <TableCell >
                                    {<IconButton >
                                        <BasicMenu data = {row}/>
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
    function BasicMenu({data}:{ data:NewsInfo}) {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const api = new NewsManagementAPI();
        let iNewsDetailholder : INewsDetail ;

        iNewsDetailholder = {
            id : 'IDholder',
            title: 'Titleholder',
            date : 'Dateholder',
            content : 'Contentholder',
            status : 'Statusholder',
            };
        
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
        setAnchorEl(null);
        };
        
        if (typeof(data?.id)=='string' && 
        typeof(data?.title)=='string'&&
        typeof(data?.date)=='string'&&
        typeof(data?.content)=='string'&&
        typeof(data?.status)=='string') {
            iNewsDetailholder.id = data.id;
            iNewsDetailholder.title = data.title;
            iNewsDetailholder.title = data.date;
            iNewsDetailholder.content = data.content;
            iNewsDetailholder.title = data.status;
        }


        //console.log(data);
        
        const { showDialog } = useDialog();
        function ViewNewsDetailOnClicked(data : NewsInfo) {
        
            console.log(data.title);
            console.log(data.content);
        
            showDialog({
                content: <ScrollDialog NewsPara={data} />,
                onClose: () => false,
                width: 'sm',
             });
        }


        async function PublishOnClicked() {
        
            console.log(iNewsDetailholder);
            console.log(`is Publish`);

            try {
                //insert Id to newsDetail before send to api
                await api.publishNews({
                    // token: userSession,
                    newsDetail: iNewsDetailholder,
                });
            } catch (e) {
    
            }
            console.log(`back from api`);
        }

        async function DeleteOnClicked() {
        
            console.log(iNewsDetailholder);
            console.log(`is Delete`);

            try {
                //insert Id to newsDetail before send to api
                await api.deleteNews({
                    // token: userSession,
                    newsDetail: iNewsDetailholder,
                });
            } catch (e) {
    
            }
            console.log(`back from api`);
        }


        return (
        <div>
            <Button
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            
            >
            <MoreVertIcon
            
            sx={{ color: grey[900] }}
            />
            </Button>
                                        
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            >
                <MenuItem onClick={() => {ViewNewsDetailOnClicked(data)}}>
                    <VisibilityIcon />
                    View
                </MenuItem>
                <MenuItem onClick={() => {PublishOnClicked()}}>
                    <CheckCircleIcon/>
                    Publish
                </MenuItem>
                <MenuItem onClick={() => {DeleteOnClicked()}}>
                    <DeleteIcon/>
                    Delete
                </MenuItem>
            </Menu>
        </div>
        );
    }


    function ScrollDialog( {NewsPara}:{ NewsPara:NewsInfo}){
        
        //const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
        const { closeDialog } = useDialog();
        const ID =  NewsPara?.id 
        const tittle =  NewsPara?.title;

        var stringcontent = 'stringholder';
        var content = EditorState.createEmpty();
        //console.log(NewsPara);
        const [editorState, setEditorState] = React.useState(
            () => {
                if (typeof(NewsPara?.content) === 'string'){
                    //console.log(NewsPara?.content);
                    stringcontent = NewsPara?.content;
                    //console.log(stringcontent);
                };

            const contentState = convertFromRaw(markdownToDraft(stringcontent));
            //https://www.markdownguide.org/cheat-sheet/
            console.log(contentState);
            return content
                ?EditorState.createWithContent(contentState)
                :EditorState.createEmpty();
            }
        );

        return ( 
            <div>
            <Dialog
                open={true}
                fullWidth={true}
                maxWidth = "md"
                PaperProps={{ 
                    sx: {  
                        mx: 5 ,
                        width: "941", 
                        height: "599" 
                        }
                    }}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                <Typography color='secondary.main' variant='h6' sx={{ fontWeight: 'bold' }}>
                    News ID : {ID}
                </Typography>
                </DialogTitle>
                <DialogTitle sx={{ mx: 5 }}>Title: {tittle}</DialogTitle>

                <DialogContent sx={{ mx: 5 }}>
                    <Paper variant="outlined">
                        <Editor 
                            editorState={editorState}
                            toolbarHidden
                            readOnly 
                        />
                    </Paper>        
                </DialogContent>   
                <DialogActions>
                <Button variant='outlined' onClick={closeDialog}>
                                Close
                </Button>
                </DialogActions>
            </Dialog>      
            </div>  
        );
    }

  