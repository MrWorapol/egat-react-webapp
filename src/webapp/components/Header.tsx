import { Grid, IconButton, Menu, MenuItem, Typography, } from '@mui/material'
import React from 'react'
import { AccountCircle } from '@mui/icons-material';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';


import { useLogin } from '../hooks/useLogin';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';
import { userSessionState } from '../state/user-sessions';


export default function Header() {
    const [openMenu, setOpenMenu] = React.useState<null | HTMLElement>(null);
    const { logout } = useLogin();
    let session = useRecoilValue(userSessionState);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setOpenMenu(event.currentTarget);
    };

    const handleClose = () => {
        setOpenMenu(null);
    };

    const handleLogOut = () => {

        logout();
    }



    return (
        <Grid container justifyContent='space-between' style={{ height: '4em' }}>
            <Grid
                container item
                xs={2}
                justifyContent='center'
                alignItems="center" style={{ backgroundColor: "#707070" }}>
                <img src={'/assets/images/logo_1x.png'} alt="p2pweb-logo"></img>

            </Grid>
            <Grid container item xs={10} justifyContent="flex-end" alignItems='center' style={{ backgroundColor: "white" }} pr={2}>
                <Grid item>
                    <Typography> {session && `Last login ${dayjs(session.lasttimeLogIn).format('DD/MM/YYYY [at] HH:mm')}`}</Typography>
                </Grid>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle sx={{ width: 32, height: 32 }} />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={openMenu}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(openMenu)}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                >
                    <MenuItem onClick={handleLogOut}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Log Out</MenuItem>
                </Menu>
            </Grid>
        </Grid>
    )
}