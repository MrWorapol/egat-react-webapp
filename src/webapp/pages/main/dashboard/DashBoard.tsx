import { Box, Button, Container, createTheme, Grid, Typography } from '@mui/material'
import React from 'react'
import { Datarow, DatarowInterface } from './Data/Datarow';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';
import { fontFamily } from '@mui/system';
import { ThemeProvider, styled } from '@mui/material/styles';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

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
        <Container style={{ width: '100%', backgroundColor: '#FFFFFF', maxWidth: '90%'}} >

            <Grid container item direction="row" p={2} >
                <ThemeProvider theme={header_name}>
                <Grid item id="title" spacing={2}>
                    <Typography>User</Typography>
                </Grid>
                </ThemeProvider>
                <ThemeProvider theme={icon_name}>
                <Grid item container id="actionzone" justifyContent='space-between' xs={12}>
                    <Grid item container direction='row' xs={2}>
                       <Typography>All Meter</Typography>  
                    </Grid>
                    <Grid item container direction='row' xs={1}>
                       <Typography >Registered User</Typography>  
                    </Grid>
                    <Grid item container direction='row' xs={1}>
                       <Typography >Today New Registered User</Typography>  
                    </Grid>
                    <Grid item container direction='row' xs={1}>
                       <Typography>-</Typography>  
                    </Grid>
                    <Grid item container direction='row' xs={1}>
                       <Typography>Aggregator</Typography>  
                    </Grid>
                    <Grid item container direction='row' xs={1}>
                       <Typography>Prosumer</Typography>  
                    </Grid>
                    <Grid item container direction='row' xs={1}>
                       <Typography>Consumer</Typography>  
                    </Grid>
                    <Grid item container direction='row' xs={1}>
                       <Typography>No User</Typography>  
                    </Grid>
                    <Grid item justifyContent="flex-end">
                    </Grid>
                </Grid>
                </ThemeProvider>
                <Grid item container direction='row' xs={12}>
                    <Typography>--------------------------------------------------------------------------------------------------------------------------------------------</Typography>
                </Grid>
            </Grid>

            <Grid container item direction="row" p={2}>
                <ThemeProvider theme={header_name}>
                <Grid item id="title">
                    <Typography >Energy</Typography>
                </Grid>
                </ThemeProvider>
                <ThemeProvider theme={icon_name}>
                <Grid item container id="actionzone" justifyContent='space-between' rowSpacing={4}>
                    
                    <Grid item container direction='row'>
                       <Typography>Total PV Generate</Typography>  
                    </Grid>
                    
                    <Grid item justifyContent="flex-end">
                    </Grid>
                </Grid>
                </ThemeProvider>
                <Grid item container direction='row' xs={12}>
                    <Typography>--------------------------------------------------------------------------------------------------------------------------------------------</Typography>
                </Grid>
            </Grid>

            <Grid container item direction="row" p={2}>
                <ThemeProvider theme={header_name}>
                <Grid item id="title" xs={10}>
                    <Typography>Trading</Typography>
                </Grid>
                </ThemeProvider>
                <ThemeProvider theme={icon_name}>
                <Grid item container id="actionzone" justifyContent='space-between' xs={12}>
                    <Grid item xs={2} >
                       <Typography style={{textAlign:'center'}}>Total No. Order</Typography>  
                    </Grid>
                    
                    <Grid item direction='row' xs={3} style={{textAlign:'center'}}>
                       <Typography >Total No. Contract</Typography>
                       <Typography >Image</Typography>
                    </Grid>
                    <Grid item direction='row' xs={2} style={{textAlign:'center'}}>
                       <Typography >Total Energy Sales (Net)</Typography>
                       <Typography >Image</Typography> 
                    </Grid>
                    <Grid item direction='row' xs={3} style={{textAlign:'center'}}>
                       <Typography >Total Energy Buys (Net)</Typography>
                       <Typography >Image</Typography>
                    </Grid>
                    <Grid item direction='row' xs={2} style={{textAlign:'center'}}>
                       <Typography >Total Energy Imbalance (Net)</Typography>
                       <Typography >Image</Typography>
                    </Grid>
                    
                    <Grid item justifyContent="flex-end">

                    </Grid>
                </Grid>
                </ThemeProvider>
                <ThemeProvider theme={icon_name}>
                <Grid item container id="actionzone" justifyContent='space-between' rowSpacing={4} xs={10}>
                    <Grid item container direction='row' xs={2}>
                       <Typography >Total Net Payment</Typography> 
                    </Grid>
                    <Grid item container direction='row' xs={2}>
                       <Typography >Total Energy Trading (Net)</Typography> 
                    </Grid>
                    <Grid item container direction='row' xs={2}>
                       <Typography >Total Grid Used</Typography> 
                    </Grid>
                    <Grid item container direction='row' xs={2}>
                       <Typography >Total Wheeling Charge</Typography> 
                    </Grid>
                    <Grid item container direction='row' xs={2}>
                       <Typography >Acc. REC</Typography> 
                    </Grid>
                    <Grid item justifyContent="flex-end">
                    
                    </Grid>
                </Grid>
                </ThemeProvider>
            </Grid>
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