import { Box, createTheme, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';
import { ThemeProvider, styled } from '@mui/material/styles';
import theme from '../../../theme/Theme';

import Divider from '@mui/material/Divider';
import useDashBoard from '../../../hooks/dashboard/useDashBoard';
import { useNavigationGet } from '../../../hooks/useNavigationGet';
import { useRecoilValue } from 'recoil';
import { userSessionState } from '../../../state/user-sessions';


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
    let session = useRecoilValue(userSessionState);
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
                            <Grid item container id="title" ml={2}>
                                <Typography>User</Typography>
                            </Grid>
                        </ThemeProvider>
                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-between' py={1} columns={15}>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Grid item justifyContent="start">
                                        <Typography >All Meter</Typography>
                                    </Grid>

                                    <Grid item justifyContent="end">
                                        <Img src="/assets/icon/Member.png" />
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.allmeter}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Typography >Registered User</Typography>
                                    <Grid item justifyContent="end">

                                        <Img src="/assets/icon/Member.png" />
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.registeredUser}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Typography >Today New Registered User</Typography>
                                    <Grid item justifyContent="end">

                                        <Img src="/assets/icon/New-Member.png" />
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.newRegister}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Divider style={{ border: '1px solid #707070' }} orientation="vertical" />

                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Grid item>
                                        <Typography>Aggregator</Typography>
                                    </Grid>
                                    <Grid item justifyContent="end">

                                        <Img src="/assets/icon/Member.png" />
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.aggregator}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Typography>Prosumer</Typography>
                                    <Grid item justifyContent="end">

                                        <Img src="/assets/icon/Member.png" />
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.prosumer}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Typography>Consumer</Typography>

                                    <Grid item justifyContent="end">
                                        <Img src="/assets/icon/Member.png" />
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={2}>{userDashboard.consumer}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Grid item>
                                        <Typography>No User</Typography>
                                    </Grid>
                                    <Grid item justifyContent="end">
                                        <Img src="/assets/icon/325.png" />
                                        <Number>
                                            {userDashboard ? <Typography style={{ fontSize: 26 }} px={3}>{userDashboard.noUser}</Typography> : "loading"}
                                        </Number>
                                    </Grid>
                                </Grid>

                            </Grid>

                        </ThemeProvider>
                    </Grid>

                    <Divider style={{ border: '1px solid #707070' }} variant="middle" />

                    <Grid container item direction="row" id="energy-info" mx={"auto"} >
                        <ThemeProvider theme={header_name}>
                            <Grid item id="title" ml={2}>
                                <Typography >Energy</Typography>
                            </Grid>
                        </ThemeProvider>
                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-around' mx={'auto'} py={1} flexGrow={1} height="200px">

                                <Grid item container direction='column' justifyContent='space-between' xs={3} width="100%">
                                    <Typography>Total PV Generate</Typography>
                                    <Grid item justifyContent="end">

                                        <Img src="/assets/icon/311.png" />
                                        <Number>
                                            {energyDashboard ?
                                                <Typography style={{ fontSize: 26 }}>
                                                    {(Math.round(energyDashboard.pv * 100) / 100).toFixed(2)}
                                                    <Typography style={{ fontSize: 20, color: '#707070' }} display="inline"> kWh</Typography>
                                                </Typography>
                                                : <>Loading...</>}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={3} >
                                    <Grid item justifyContent="start">

                                        <Typography noWrap>Total Energy Storage
                                        </Typography>
                                        <Typography>Charge/Discharge</Typography>
                                    </Grid>
                                    <Grid item justifyContent="end">
                                        <Img src="/assets/icon/310.png" />
                                        <Number>
                                            {energyDashboard ?
                                                <Typography style={{ fontSize: 26 }} >
                                                    {`${(Math.round(energyDashboard.charge * 100) / 100).toFixed(2)}/${(Math.round(energyDashboard.discharge * 100) / 100).toFixed(2)}`}
                                                    <Typography style={{ fontSize: 20, color: '#707070' }} display="inline"> kWh</Typography>
                                                </Typography> : <>Loading...</>}
                                        </Number>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={3}>
                                    <Typography>Total Excess PV/Grid Used</Typography>
                                    <Grid item justifyContent="end">

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
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={3} >
                                    <Typography >Total Energy Load</Typography>
                                    <Grid item justifyContent="end">

                                        <Img src="/assets/icon/313.png" />
                                        <Number>
                                            {energyDashboard ? <Typography style={{ fontSize: 26 }} >
                                                {(Math.round(energyDashboard.load * 100) / 100).toFixed(2)}
                                                <Typography style={{ fontSize: 20, color: '#707070' }} display="inline"> kWh</Typography>
                                            </Typography>
                                                : <>Loading...</>}
                                        </Number>
                                    </Grid>
                                </Grid>


                            </Grid>
                        </ThemeProvider>
                    </Grid>

                    <Divider style={{ border: '1px solid #707070' }} variant="middle" />

                    <Grid container item direction="row" height='400px' >

                        <ThemeProvider theme={header_name}>
                            <Grid item id="title" pl={2}>
                                <Typography>Trading</Typography>
                            </Grid>
                        </ThemeProvider>

                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-around' py={1} columns={15}>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
                                    <Typography px={1}>Total No. Order</Typography>
                                    <Img src="/assets/icon/256.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }}>{tradingDashboard.totalOrder}</Typography>
                                            : <>...Loading</>}
                                    </Number>
                                </Grid>

                                <Grid item container direction='column' justifyContent='space-between' xs={3} style={{ textAlign: 'center' }}>
                                    <Typography >Total No. Contract</Typography>
                                    <Img src="/assets/icon/320.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} >{tradingDashboard.totalContract}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={3} style={{ textAlign: 'center' }}>
                                    <Typography >Total Energy Sales (Amount)</Typography>
                                    <Img src="/assets/icon/321.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} >{`${(Math.round(tradingDashboard.netSale * 100) / 100).toFixed(2)} kWh`}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={3} style={{ textAlign: 'center' }}>
                                    <Typography >Total Energy Buys (Amount)</Typography>
                                    <Img src="/assets/icon/322.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} >{`${(Math.round(tradingDashboard.netBuy * 100) / 100).toFixed(2)} kWh`}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={4} style={{ textAlign: 'center' }}>
                                    <Typography >Total Energy Imbalance (Amount)</Typography>
                                    <Img src="/assets/icon/323.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <Typography style={{ fontSize: 26 }} >{`${(Math.round(tradingDashboard.netImbalance * 100) / 100).toFixed(2)} kWh`}</Typography>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>

                            </Grid>
                        </ThemeProvider>

                        <ThemeProvider theme={icon_name}>
                            <Grid item container id="actionzone" justifyContent='space-around' pb={2} columns={15}>
                                <Grid item container direction='column' justifyContent='space-between' xs={2}>
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
                                <Grid item container direction='column' justifyContent='space-between' xs={3}>
                                    <Typography >Total Energy Trading (Net)</Typography>
                                    <Img src="/assets/icon/318.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} >{`${(Math.round(tradingDashboard.totalEnergyNet * 100) / 100).toFixed(2)} `}</Typography>
                                                <Typography style={{ fontSize: 20 }} >Baht</Typography>
                                            </>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={3}>
                                    <Typography  >Total Grid Used</Typography>
                                    <Img src="/assets/icon/317.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} >{`${(Math.round(tradingDashboard.totalGridNet * 100) / 100).toFixed(2)} `}</Typography>
                                                <Typography style={{ fontSize: 20 }} >Baht</Typography>
                                            </>
                                            : <>...Loading</>
                                        }
                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={3}>
                                    <Typography  >Total Wheeling Charge</Typography>
                                    <Img src="/assets/icon/294.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} >{`${(Math.round(tradingDashboard.totalWheelingNet * 100) / 100).toFixed(2)} `}</Typography>
                                                <Typography style={{ fontSize: 20 }} >Baht</Typography>
                                            </>
                                            : <>...Loading</>
                                        }

                                    </Number>
                                </Grid>
                                <Grid item container direction='column' justifyContent='space-between' xs={4}>
                                    <Typography  >Acc. REC</Typography>
                                    <Img src="/assets/icon/319.png" />
                                    <Number>
                                        {tradingDashboard ?
                                            <>
                                                <Typography style={{ fontSize: 26 }} >{`${(tradingDashboard.accREC / 1000).toFixed(4)}`}</Typography>
                                                <Typography style={{ fontSize: 20 }} >MWh</Typography>
                                            </>
                                            : <>...Loading</>
                                        }
                                    </Number>
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
