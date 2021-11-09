import { Box, Icon, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'

export default function NavigationMenuItem(
    {
        icon,
        label,
        selected,
        onClick
    }: {
        icon: JSX.Element,
        label: string,
        selected: boolean,
        onClick: () => void,
    }) {

    // console.log(`selected : ${typeof (selected)}`);

    if (selected) {
        return renderSelected();
    } else {
        return renderNotSelected();
    }

    function renderSelected() {
        // console.log('select ja');
        return (
            // <Box bgcolor="secondary.main" color="white">
                    <ListItemButton onClick={onClick} sx={{ backgroundColor: 'secondary.main',color:"white" }}>
                        <ListItemIcon sx={{ color: "white" }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText >
                            <Typography style={{ fontSize: '1em' }}>{label}</Typography>
                        </ListItemText>
                    </ListItemButton>
            // </Box>
        );
    }

    function renderNotSelected() {
        // console.log('not select ja');

        return (
            <ListItemButton onClick={onClick}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText >
                    <Typography style={{ fontSize: '1em' }}>{label}</Typography>
                </ListItemText>
            </ListItemButton>
        );
    }
}
