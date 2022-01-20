import { Box, createTheme, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';
import { ThemeProvider, styled } from '@mui/material/styles';
import theme from '../../../theme/Theme';

import Divider from '@mui/material/Divider';
import useDashBoard from '../../../hooks/dashboard/useDashBoard';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useNavigationGet } from '../../../hooks/useNavigationGet';


const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

const Sick = styled('div')({
    color: '#1B4DBC',
    textAlign: 'center',
    fontFamily: 'Mitr',
    fontStyle: 'normal',
    fontWeight: 'normal',
    //position: 'absolute',
    padding: theme.spacing(1)
})

const Number = styled(Typography)({
    fontFamily: 'Mitr',
    color: '#000000'
})

const icon_name = createTheme({
    typography: {
        fontFamily: 'Mitr',
        fontSize: 15.69,
    },
    palette: {
        primary: {
            main: '#1B4DBC'
        }
    }
});

const header_name = createTheme({
    typography: {
        fontFamily: 'Mitr',
        fontSize: 26
    }
})
export default function DashBoard() {
    console.log(`call dashboard`);
    useNavigationSet(NavigationCurrentType.DASHBOARD);

    const { userDashboard, energyDashboard, tradingDashboard } = useDashBoard();
    const { session } = useAuthGuard();
    const { currentState } = useNavigationGet();

    useEffect(() => {
        if (!session) {
            return;
        }
        return () => {

        }
    }, [userDashboard, energyDashboard, tradingDashboard])

    if (session && currentState === NavigationCurrentType.DASHBOARD) {
        return (
            <Box style={{ backgroundColor: '#FFFFFF' }} justifyContent="center" >
                <Sick>
                    <Grid container item direction="row" id="user-infos" pt={3} mx={"auto"}>
                        <ThemeProvider theme={header_name}>
                            <Grid item id="title">
                                <Typography>User</Typography>
                            </Grid>
                        </ThemeProvider>
                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-between' py={1} xs={12}>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography >All Meter</Typography>
                                    <Img src="/assets/icon/Member.png" />
                                    <Number>
                                        {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.allmeter}</Typography> : "loading"}
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography >Registered User</Typography>
                                    <Img src="/assets/icon/Member.png" />
                                    <Number>
                                        {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.registeredUser}</Typography> : "loading"}
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography >Today New Registered User</Typography>
                                    <Img src="/assets/icon/New-Member.png" />
                                    <Number>
                                        {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.newRegister}</Typography> : "loading"}
                                    </Number>
                                </Grid>

                                <Divider style={{ border: '1px solid #707070' }} orientation="vertical" />

                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Grid item>
                                        <Typography>Aggregator</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Img src="/assets/icon/Member.png" />
                                    </Grid>
                                    <Grid>
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.aggregator}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography>Prosumer</Typography>
                                    <Img src="/assets/icon/Member.png" />
                                    <Number>
                                        {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.prosumer}</Typography> : "loading"}
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography>Consumer</Typography>
                                    <Img src="/assets/icon/Member.png" />
                                    <Number>
                                        {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.consumer}</Typography> : "loading"}
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Grid item>
                                        <Typography>No User</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Img src="/assets/icon/325.png" />
                                    </Grid>
                                    <Grid item>
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={3}>{userDashboard.noUser}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>

                            </Grid>

                        </ThemeProvider>
                    </Grid>

                    <Divider style={{ border: '1px solid #707070' }} variant="middle" />

                    <Grid container item direction="row" id="energy-info" mx={"auto"}>
                        <ThemeProvider theme={header_name}>
                            <Grid item id="title">
                                <Typography >Energy</Typography>
                            </Grid>
                        </ThemeProvider>
                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-between' mx={'auto'} py={1}>

                                <Grid item container direction='column' justifyContent='space-between' xs={1}>

                                    <Typography>Total PV Generate</Typography>
                                    <Img src="/assets/icon/311.png" />
                                    <Number>
                                        {energyDashboard ?
                                            <Typography style={{ fontSize: 26 }} px={7}>
                                                {(Math.round(energyDashboard.pv * 100) / 100).toFixed(2)}
                                                <Typography style={{ fontSize: 20, color: '#707070' }} display="inline"> kWh</Typography>
                                            </Typography>
                                            : <>Loading...</>}
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography>Total Energy Storage Charge/Discharge</Typography>
                                    <Img src="/assets/icon/310.png" />
                                    <Number>
                                        {energyDashboard ?
                                            <Typography style={{ fontSize: 26 }} px={11}>
                                                {`${(Math.round(energyDashboard.storage * 100) / 100).toFixed(2)}/${(Math.round(energyDashboard.load * 100) / 100).toFixed(2)}`}
                                                <Typography style={{ fontSize: 20, color: '#707070' }} display="inline"> kWh</Typography>
                                            </Typography> : <>Loading...</>}
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography px={12}>Total Grid Used</Typography>
                                    <Img src="/assets/icon/312.png" />
                                    <Number>
                                        {energyDashboard ?
                                            <Typography style={{ fontSize: 26 }} >
                                                {(Math.round(energyDashboard.gridUsed) * 100 / 100).toFixed(2)}
                                                <Typography style={{ fontSize: 20, color: '#707070' }} display="inline"> kWh</Typography>
                                            </Typography>
                                            : <>Loading...</>}
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={1}>
                                    <Typography px={6}>Total Energy Load</Typography>
                                    <Img src="/assets/icon/313.png" />
                                    <Number>
                                        {energyDashboard ? <Typography style={{ fontSize: 26 }} >
                                            {(Math.round(energyDashboard.load * 100) / 100).toFixed(2)}
                                            <Typography style={{ fontSize: 20, color: '#707070' }} display="inline"> kWh</Typography>
                                        </Typography>
                                            : <>Loading...</>}
                                    </Number>
                                </Grid>

                                <Grid item justifyContent="flex-end">
                                </Grid>
                            </Grid>
                        </ThemeProvider>
                    </Grid>

                    <Divider style={{ border: '1px solid #707070' }} variant="middle" />

                    <Grid container item direction="row" >

                        <ThemeProvider theme={header_name}>
                            <Grid item id="title">
                                <Typography>Trading</Typography>
                            </Grid>
                        </ThemeProvider>

                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-between' py={1}>
                                <Grid justifyContent='center' item xs={2} >
                                    <Typography px={1}>Total No. Order</Typography>
                                    <Img src="/assets/icon/256.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} px={2}>{tradingDashboard.totalOrder}</Typography>
                                            : <>...Loading</>}
                                    </Number>
                                </Grid>

                                <Grid item direction='row' justifyContent='center' xs={3} style={{ textAlign: 'center' }}>
                                    <Typography >Total No. Contract</Typography>
                                    <Img src="/assets/icon/320.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} px={2}>{tradingDashboard.totalContract}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item direction='row' justifyContent='center' xs={2} style={{ textAlign: 'center' }}>
                                    <Typography >Total Energy Sales (Net)</Typography>
                                    <Img src="/assets/icon/321.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} px={2} py={3}>{`${(Math.round(tradingDashboard.netSale * 100) / 100).toFixed(2)} kWh`}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item direction='row' justifyContent='center' xs={3} style={{ textAlign: 'center' }}>
                                    <Typography >Total Energy Buys (Amount)</Typography>
                                    <Img src="/assets/icon/322.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} py={3} px={2}>{`${(Math.round(tradingDashboard.netBuy * 100) / 100).toFixed(2)} kWh`}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item direction='row' justifyContent='center' xs={2} style={{ textAlign: 'center' }}>
                                    <Typography >Total Energy Imbalance (Amount)</Typography>
                                    <Img src="/assets/icon/323.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} px={2} py={2}>{`${(Math.round(tradingDashboard.netImbalance * 100) / 100).toFixed(2)} kWh`}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>

                            </Grid>
                        </ThemeProvider>

                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-between'>
                                <Grid item direction='row' justifyContent='center' xs={2}>
                                    <Typography >Total Net Payment</Typography>
                                    <Img src="/assets/icon/receipt-1.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} px={2}>{`${(Math.round(tradingDashboard.netPayment * 100) / 100).toFixed(2)} `}</Typography>
                                                <Typography style={{ fontSize: 20 }} >Baht</Typography>
                                            </>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='row' justifyContent='center' xs={2}>
                                    <Typography >Total Energy Trading (Net)</Typography>
                                    <Img src="/assets/icon/318.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} px={2}>{`${(Math.round(tradingDashboard.totalEnergyNet * 100) / 100).toFixed(2)} `}</Typography>
                                                <Typography style={{ fontSize: 20 }} >Baht</Typography>
                                            </>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='row' justifyContent='center' xs={2}>

                                    <Typography px={5} >Total Grid Used</Typography>
                                    <Img src="/assets/icon/317.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} px={2}>{`${(Math.round(tradingDashboard.totalGridNet * 100) / 100).toFixed(2)} `}</Typography>
                                                <Typography style={{ fontSize: 20 }} >Baht</Typography>
                                            </>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='row' justifyContent='center' xs={3} px={1}>
                                    <Typography px={7} >Total Wheeling Charge</Typography>
                                    <Img src="/assets/icon/294.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} px={20}>{`${(Math.round(tradingDashboard.netPayment * 100) / 100).toFixed(2)} `}</Typography>
                                                <Typography style={{ fontSize: 20 }} >Baht</Typography>
                                            </>
                                            : <>...Loading</>
                                        }

                                    </Number>
                                </Grid>
                                <Grid item container direction='row' justifyContent='center' xs={1}>
                                    <Typography px={3} >Acc. REC</Typography>
                                    <Img src="/assets/icon/319.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} px={9}>{`${(Math.round((tradingDashboard.accREC / 1000) * 1000) / 1000).toFixed(4)}`}</Typography>
                                                <Typography style={{ fontSize: 20 }} >MWh</Typography>
                                            </>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item justifyContent="flex-end">

                                </Grid>
                            </Grid>
                        </ThemeProvider>

                    </Grid>
                </Sick>
            </Box>
        )
    } else {
        return <>Loading...</>;
    }
}
