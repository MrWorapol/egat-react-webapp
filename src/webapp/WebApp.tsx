import React from 'react'
import Login from './pages/login/Login'
import {  ThemeProvider } from '@mui/material/styles';
import MainPage from './pages/main/MainPage';
import { RecoilRoot } from 'recoil';
import { Box } from '@mui/system';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CustomDialog from './components/CustomDialog';
import { useAuthGuard } from './hooks/useAuthGuard';
import { CustomBackdrop } from './components/CustomLoadingBackdrop';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDayjs';
import SnackBarNotification from './components/SnackBarNotification';

import theme from './theme/Theme';

export default function WebApp() {
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <ThemeProvider theme={theme}>
                <RecoilRoot>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Router>
                            <WebAdminRouting />
                        </Router>
                        <CustomDialog />
                        <CustomBackdrop />
                        <SnackBarNotification/>
                    </React.Suspense>

                </RecoilRoot>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

function WebAdminRouting() {
    useAuthGuard();
    // const sessionValue = useRecoilValue(userSessionState);
    return (
        <Box>
            <Switch>

                <Route path='/login' exact>
                    <Login />
                </Route>
                <Route >
                    <MainPage />
                </Route>
            </Switch>
        </Box>
    )
}

