import { Grid } from '@mui/material'
import React from 'react'
import Header from '../../components/Header'
import NavigationTab from '../../components/NavigationTab'

export default function MainPage() {
    return (
        <Grid container direction="column" style={{ minHeight: '100vh', backgroundColor: '#E5E5E5' }}>
            <Grid container item id="header">
                <Header />
            </Grid>
            <Grid container item id="content">
                <Grid container item xs={2}>
                    <NavigationTab />
                </Grid>
            </Grid>
        </Grid >
    )
}
