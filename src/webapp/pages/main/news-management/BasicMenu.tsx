import { Button, Menu, MenuItem, } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react'
import NewsManagementAPI from '../../../api/news/newsManagementApi';
import { NewsInfo } from '../../../state/news-management/news-info';
import { INewsDetail } from '../../../state/news-management/news-detail';
import { grey } from '@mui/material/colors';
import { useAllNews } from '../../../hooks/useAllNews';
import { useDialog } from '../../../hooks/useDialog';
import ScrollDialog from './ScrollDialog';
import { useSnackBarNotification } from '../../../hooks/useSnackBarNotification';
import { useLoadingScreen } from '../../../hooks/useLoadingScreen';
import { useRecoilValue } from 'recoil';
import { userSessionState } from '../../../state/user-sessions';

export default function BasicMenu({ data }: { data: NewsInfo }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const api = new NewsManagementAPI();
    let newsDetailholder: INewsDetail = {
        id: 'IDholder',
        title: 'Titleholder',
        date: 'Dateholder',
        content: 'Contentholder',
        status: 'DRAFT',
    };
    const { showDialog } = useDialog();
    const { showSnackBar } = useSnackBarNotification();
    const { refreshAllNews } = useAllNews();
    const { showLoading, hideLoading } = useLoadingScreen();
    let session = useRecoilValue(userSessionState);

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


    function viewNewsDetailOnClicked(data: NewsInfo) {

        showDialog({
            content: <ScrollDialog NewsPara={data} />,
            onClose: () => false,
            width: 'sm',
        });
    }

    async function publishOnClicked() {
   
        if (session) {
            try {
                showLoading(10);
                //insert Id to newsDetail before send to api
                await api.publishNews(
                    {
                        session,
                        newsDetail: newsDetailholder
                    })
                hideLoading(10);
                showSnackBar({
                    serverity: "success",
                    message: "Publish Successful",
                })
            } catch (e) {
                hideLoading(10);
                console.log(e);
                showSnackBar({
                    serverity: "error",
                    message: `Cannot Publish with status:\n${e}`,
                })
            }
            refreshAllNews();
            // console.log(`back from api`);
        }
    }

    async function deleteOnClicked() {
        // console.log(newsDetailholder);
        // console.log(`is Delete`);
        if (session) {
            try {
                showLoading(10);
                //insert Id to newsDetail before send to api
                await api.deleteNews({
                    session,
                    newsDetail: newsDetailholder,
                });
                hideLoading(10);
                showSnackBar({
                    serverity: "success",
                    message: "Delete Successful",
                })
            } catch (e) {
                hideLoading(10);
                console.log(e);
                showSnackBar({
                    serverity: "error",
                    message: `Cannot Delete with status:\n${e}`,

                })
            }
            refreshAllNews();
        }
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