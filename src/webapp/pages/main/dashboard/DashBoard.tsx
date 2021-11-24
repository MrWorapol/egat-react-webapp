import { Box, Button, Container, createTheme, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import { Datarow, DatarowInterface } from './Data/Datarow';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';
import { fontFamily } from '@mui/system';
import { ThemeProvider, styled } from '@mui/material/styles';
import theme from '../../../theme/Theme';
import Image from "material-ui-image";
import Divider from '@mui/material/Divider';


const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

const Sick = styled('div')({
    color: '#1B4DBC',
    textAlign:'center',
    fontFamily: 'Mitr',
    fontStyle: 'normal',
    fontWeight: 'normal',
    //position: 'absolute',
    padding: theme.spacing(1)
})

const Number = styled(Typography)({
    fontFamily: 'Mitr',
    color:'#000000'
})

const icon_name = createTheme({
    typography: {
        fontFamily:'Mitr',
        fontSize: 15.69,
    },
    palette: {
        primary:{
            main: '#1B4DBC'
        }
    }
});

const header_name = createTheme({
    typography:{
        fontFamily: 'Mitr',
        fontSize: 26
    }
})
export default function DashBoard() {
    useNavigationSet(NavigationCurrentType.DASHBOARD);
    return (
        <Container style={{ width: '100%', backgroundColor: '#FFFFFF', maxWidth: '90%', height:'100%', maxHeight:'100%'}} >
            <Sick>
            <Grid container item direction="row" xs={11} pt={3}>
                <ThemeProvider theme={header_name}>
                <Grid item id="title">
                    <Typography>User</Typography>
                </Grid>
                </ThemeProvider>
                <ThemeProvider theme={icon_name}>
                <Grid item container id="actionzone" justifyContent='space-between' py={1}>
                    <Grid item container justifyContent='center' xs={1} px={3}>
                       <Typography >All Meter</Typography> 
                       <Img src="/assets/icon/Member.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number> 
                    </Grid>
                    <Grid item container justifyContent='center' xs={1}>
                       <Typography >Registered User</Typography>  
                       <Img src="/assets/icon/Member.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container justifyContent='center' xs={2} px={1}>
                       <Typography >Today New Registered User</Typography> 
                       <Img src="/assets/icon/New-Member.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={6}>27</Typography>
                       </Number>
                    </Grid>

                    <Divider style={{border: '1px solid #707070'}} orientation="vertical" flexItem />

                    <Grid item container justifyContent='center' xs={1}>
                       <Typography>Aggregator</Typography>  
                       <Img src="/assets/icon/Member.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container justifyContent='center' xs={1}>
                       <Typography>Prosumer</Typography>
                       <Img src="/assets/icon/Member.png"/>  
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container justifyContent='center' xs={1}>
                       <Typography>Consumer</Typography>
                       <Img src="/assets/icon/Member.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container justifyContent='center' xs={1}>
                       <Typography>No User</Typography>
                       <Img src="/assets/icon/325.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item justifyContent="flex-end">
                    </Grid>
                </Grid>
                
                </ThemeProvider>
            </Grid>

            <Divider style={{border: '1px solid #707070'}} variant="middle" />

            <Grid container item direction="row">
                <ThemeProvider theme={header_name}>
                <Grid item id="title">
                    <Typography >Energy</Typography>
                </Grid>
                </ThemeProvider>
                <ThemeProvider theme={icon_name}>
                <Grid item container id="actionzone" justifyContent='space-between' py={1}>
                    
                    <Grid item container justifyContent='center' direction='row' xs={2} px={4}>
                       <Typography>Total PV Generate</Typography>
                       <Img src="/assets/icon/311.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={7}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container justifyContent='center' direction='row' xs={2}>
                       <Typography>Total Energy Storage Charge/Discharge</Typography>  
                       <Img src="/assets/icon/310.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={11}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container justifyContent='center' direction='row' xs={3}>
                       <Typography px={12}>Total Grid Used</Typography>
                       <Img src="/assets/icon/312.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={20}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container justifyContent='center' direction='row' xs={2}>
                       <Typography px={6}>Total Energy Load</Typography>
                       <Img src="/assets/icon/313.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={20}>27</Typography>
                       </Number>
                    </Grid>
                    
                    <Grid item justifyContent="flex-end">
                    </Grid>
                </Grid>
                </ThemeProvider>
            </Grid>

            <Divider style={{border: '1px solid #707070'}}variant="middle" />

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
                       <Img src="/assets/icon/256.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    
                    <Grid item direction='row' justifyContent='center' xs={3}  style={{textAlign:'center'}}>
                       <Typography >Total No. Contract</Typography>
                       <Img src="/assets/icon/320.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item direction='row' justifyContent='center' xs={2} style={{textAlign:'center'}}>
                       <Typography >Total Energy Sales (Net)</Typography>
                       <Img src="/assets/icon/321.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2} py={3}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item direction='row' justifyContent='center' xs={3} style={{textAlign:'center'}}>
                       <Typography >Total Energy Buys (Net)</Typography>
                       <Img src="/assets/icon/322.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} py={3} px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item direction='row' justifyContent='center' xs={2} style={{textAlign:'center'}}>
                       <Typography >Total Energy Imbalance (Net)</Typography>
                       <Img src="/assets/icon/323.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={2} py={2}>27</Typography>
                       </Number>
                    </Grid>
                    
                </Grid>
                </ThemeProvider>
                
                <ThemeProvider theme={icon_name}>
                <Grid item container id="actionzone" justifyContent='space-between'>
                    <Grid item direction='row' justifyContent='center' xs={2}>
                       <Typography >Total Net Payment</Typography>
                       <Img src="/assets/icon/receipt-1.png"/>
                       <Number>
                            <Typography style={{fontSize:26}}  px={2}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container direction='row' justifyContent='center' xs={2}>
                       <Typography >Total Energy Trading (Net)</Typography>
                       <Img src="/assets/icon/318.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={12}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container direction='row' justifyContent='center' xs={2}>
                       <Typography px={5} >Total Grid Used</Typography>
                       <Img src="/assets/icon/317.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={10}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container direction='row' justifyContent='center' xs={3} px={1}>
                       <Typography px={7} >Total Wheeling Charge</Typography>
                       <Img src="/assets/icon/294.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={20}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item container direction='row' justifyContent='center' xs={1}>
                       <Typography px={2} >Acc. REC</Typography>
                       <Img src="/assets/icon/319.png"/>
                       <Number>
                            <Typography style={{fontSize:26}} px={10}>27</Typography>
                       </Number>
                    </Grid>
                    <Grid item justifyContent="flex-end">
                    
                    </Grid>
                </Grid>
                </ThemeProvider>
               
            </Grid>
            </Sick>
        </Container>
    )
}

function buildAddAdminButton() {
    return <>
        <Button variant="contained" endIcon={<AddCircleOutlineIcon />}>
            New Admin
        </Button>
    </>
}
function buildRoleSelecter() {
    return <>

    </>
}

function buildTable() {

    return;
}