import { Grid } from '@mui/material'
import React from 'react'
import Header from './components/Header'
import Login from './pages/login/Login'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import theme from './theme/Theme';
import MainPage from './pages/main/MainPage';
import { RecoilRoot } from 'recoil';
import { Box } from '@mui/system';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CustomDialog from './components/CustomDialog';
import { useAuthGuard } from './hooks/useAuthGuard';
import { CustomBackdrop } from './components/CustomLoadingBackdrop';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDayjs';

export default function WebApp() {
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <ThemeProvider theme={theme}>
                <RecoilRoot>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Router>
                            {/* <Login /> */}
                            <WebAdminRouting />
                        </Router>
                        <CustomDialog />
                        <CustomBackdrop />
                    </React.Suspense>

                </RecoilRoot>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

function WebAdminRouting() {
    useAuthGuard();
    return (
        <Box>
            <Switch>

                <Route path='/login' exact>
                    <Login />
                </Route>
                <Route path={['/']} >
                    <MainPage />
                </Route>
            </Switch>
        </Box>
    )
}

