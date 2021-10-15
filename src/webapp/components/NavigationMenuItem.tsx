import { Box, Icon, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'

export default function NavigationMenuItem(
    {
        icon,
        label,
        selected
    }: {
        icon: JSX.Element,
        label: string,
        selected: boolean
    }) {

    console.log(`selected : ${typeof (selected)}`);

    if (selected) {
        return renderSelected();
    } else {
        return renderNotSelected();
    }

    function renderSelected() {
        console.log('select ja');
        return (
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText >
                        <Typography style={{ fontSize: '1em', backgroundColor: 'secondary' }}>{label}</Typography>
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        );
    }

    function renderNotSelected() {
        console.log('not select ja');

        return (
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText >
                        <Typography style={{ fontSize: '1em' }}>{label}</Typography>
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        );
    }
}
