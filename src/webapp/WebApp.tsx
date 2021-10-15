import { Grid } from '@mui/material'
import React from 'react'
import Header from './components/Header'
import Login from './pages/login/Login'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import theme from './theme/Theme';
import MainPage from './pages/main/MainPage';

export default function WebApp() {
    return (
        <ThemeProvider theme={theme}>
            {/* <Login /> */}
            <MainPage />
        </ThemeProvider>
        // <div>
        //     <Header />
        //     <Grid container direction="row">
        //         <Grid item xs={2} id="header">
        //             <div style={{ color: 'black', backgroundColor: '#f00' }}><h1>Web App</h1></div>
        //         </Grid>
        //         <Grid item xs={10} id="content">
        //             <div style={{ color: 'black', backgroundColor: '#00f' }}><h1>Web App</h1></div>
        //             {/* <Login/> */}
        //         </Grid>
        //     </Grid>
        // </div>
    )
}

