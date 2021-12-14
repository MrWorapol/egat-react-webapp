import { AppBar, Grid, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import React from 'react'
import GridViewIcon from '@mui/icons-material/GridView';
import { AccountCircle } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLogin } from '../hooks/useLogin';
import { useSnackBarNotification } from '../hooks/useSnackBarNotification';

export default function Header() {
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { logout } = useLogin();
    const { showSnackBar } = useSnackBarNotification();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        showSnackBar({
            serverity: 'success',
            message: 'test snackbar',
        })
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

                <Typography>
                    LOGO EGAT
                </Typography>
            </Grid>
            <Grid container item xs={10} justifyContent="flex-end" style={{ backgroundColor: "white" }} pr={2}>
                {/* <Typography>Main Menu </Typography> */}
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogOut}>LogOut</MenuItem>
                    </Menu>
                </div>
            </Grid>
        </Grid>
        // <AppBar position="static" style={{ backgroundColor:"white"}}>

        //     {/* <Toolbar>
        //         <IconButton
        //             size="large"
        //             edge="start"
        //             color="inherit"
        //             aria-label="menu"
        //             sx={{ mr: 2 }}
        //         >
        //             <MenuIcon />
        //         </IconButton>
        //         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        //             Photos
        //         </Typography>
        // <div>
        //     <IconButton
        //         size="large"
        //         aria-label="account of current user"
        //         aria-controls="menu-appbar"
        //         aria-haspopup="true"
        //         onClick={handleMenu}
        //         color="inherit"
        //     >
        //         <AccountCircle />
        //     </IconButton>
        //     <Menu
        //         id="menu-appbar"
        //         anchorEl={anchorEl}
        //         anchorOrigin={{
        //             vertical: 'top',
        //             horizontal: 'right',
        //         }}
        //         keepMounted
        //         transformOrigin={{
        //             vertical: 'top',
        //             horizontal: 'right',
        //         }}
        //         open={Boolean(anchorEl)}
        //         onClose={handleClose}
        //     >
        //         <MenuItem onClick={handleClose}>Profile</MenuItem>
        //         <MenuItem onClick={handleClose}>My account</MenuItem>
        //     </Menu>
        // </div>

        //     </Toolbar> */}
        // </AppBar>
    )
}
