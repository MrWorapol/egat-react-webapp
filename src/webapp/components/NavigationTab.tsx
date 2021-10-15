import React from 'react'
import { Grid, Icon, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NavigationMenuItem from './NavigationMenuItem';
const NavigationTab = () => {
    const Icon = <GridViewIcon />;

    return (
        <>
            <Grid container item direction='column' justifyContent='flex-start' pt={2} style={{ backgroundColor: '#EFEFEF', height: '100vh' }}>
                <Grid item>
                    <NavigationMenuItem icon={<GridViewIcon/>} label='Dashboard' selected={false} />
                    <NavigationMenuItem icon={<GridViewIcon/>} label='User Management'selected={true}/>
                    <NavigationMenuItem icon={<GridViewIcon/>} label='Reference Database' selected={false}/>
                    <NavigationMenuItem icon={<GridViewIcon/>} label='Summary Report'selected={false}/>
                    <NavigationMenuItem icon={<GridViewIcon/>} label='Dashboard'    selected={false}/>
                    
                </Grid>
            </Grid>

        </>
    )
}


export default NavigationTab;
