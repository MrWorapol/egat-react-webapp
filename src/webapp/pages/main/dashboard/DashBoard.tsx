import { Box, Button, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { Datarow, DatarowInterface } from './Data/Datarow'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';

export default function DashBoard() {
    useNavigationSet(NavigationCurrentType.DASHBOARD);
    return (
        <Container style={{ width: '100%', backgroundColor: '#FFFFFF', maxWidth: '100%' }} >
            <Grid container item direction="row" p={2} spacing={4}>
                <Grid item id="title">
                    <Typography style={{ fontSize: '1.5em' }}>DASHBOARD</Typography>
                </Grid>
                <Grid item container id="actionzone" justifyContent='space-between'>
                    <Grid item container direction='row' spacing={3}>
                      
                    </Grid>
                    <Grid item justifyContent="flex-end">

                    </Grid>
                </Grid>
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