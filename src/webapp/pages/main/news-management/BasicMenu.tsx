import {Button, Menu, MenuItem,} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react'
import NewsManagementAPI from '../../../api/news/newsManagementApi';
import { NewsInfo } from '../../../state/news-management/news-info';
import { INewsDetail} from '../../../state/news-management/news-detail';
import { grey } from '@mui/material/colors';
import { useAllNews } from '../../../hooks/useAllNews';
import { useDialog } from '../../../hooks/useDialog';
import { useSnackbar } from '../../../hooks/useSnackbar';
import ScrollDialog from './ScrollDialog';

export default function BasicMenu({ data }: { data: NewsInfo }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const api = new NewsManagementAPI();
    let newsDetailholder: INewsDetail;
    
    newsDetailholder = {
        id: 'IDholder',
        title: 'Titleholder',
        date: 'Dateholder',
        content: 'Contentholder',
        status: 'DRAFT',
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (typeof (data?.id) === 'string' &&
        typeof (data?.title) === 'string' &&
        typeof (data?.date) === 'string' &&
        typeof (data?.content) === 'string' &&
        typeof (data?.status) === 'string') {
        newsDetailholder.id = data.id;
        newsDetailholder.title = data.title;
        newsDetailholder.title = data.date;
        newsDetailholder.content = data.content;
        newsDetailholder.title = data.status;
    }

    const { showDialog } = useDialog();
    const { showSnackbar } = useSnackbar();
    const { refreshAllNews} = useAllNews();

    function viewNewsDetailOnClicked(data: NewsInfo) 
    {
        console.log(data.title);
        console.log(data.content);

        showDialog({
            content: <ScrollDialog NewsPara={data} />,
            onClose: () => false,
            width: 'sm',
        });
    }

    async function publishOnClicked() 
    {   
        console.log(newsDetailholder);
        console.log(`is Publish`);
        try {
            //insert Id to newsDetail before send to api
            await api.publishNews(
                { // token: userSession,
                newsDetail: newsDetailholder
            })
            showSnackbar({
                message:"Publish Successful",
                servirity: "success",
                width: 'sm',
                anchorOrigin : {
                    vertical: 'center',
                    horizontal : 'buttom'
                },
                autoHideDuration : 4000 
            })
        } catch (e) {
            console.log(e);
            showSnackbar({
                message:`Cannot Publish with status:\n${e}`,
                servirity: "error",
                width: 'sm',
                anchorOrigin : {
                    vertical: 'center',
                    horizontal : 'buttom'
                },
                autoHideDuration : 4000 
            })
        }
        refreshAllNews();
        console.log(`back from api`);
        
    }

    async function deleteOnClicked() 
    {
        // console.log(newsDetailholder);
        // console.log(`is Delete`);
        try {
            //insert Id to newsDetail before send to api
            await api.deleteNews({
                // token: userSession,
                newsDetail: newsDetailholder,
            });
            showSnackbar({
                message:"Delete Successful",
                servirity: "success",
                width: 'sm',
                anchorOrigin : {
                    vertical: 'center',
                    horizontal : 'buttom'
                },
                autoHideDuration : 4000 
            })
        } catch (e) {
            console.log(e);
            showSnackbar({
                message:`Cannot Delete with status:\n${e}`,
                servirity: "error",
                width: 'sm',
                anchorOrigin : {
                    vertical: 'center',
                    horizontal : 'buttom'
                },
                autoHideDuration : 4000 
            })
        }
        refreshAllNews();
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
                <MenuItem onClick={() => { viewNewsDetailOnClicked(data) }}>
                    <VisibilityIcon />
                    View
                </MenuItem>
                <MenuItem onClick={() => { publishOnClicked() }}>
                    <CheckCircleIcon />
                    Publish
                </MenuItem>
                <MenuItem onClick={() => { deleteOnClicked() }}>
                    <DeleteIcon />
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}