import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { useNavigationGet } from '../hooks/useNavigationGet';
import { NavigationCurrentType } from '../state/navigation-current-state';

interface IMenu {
    label: string,
    path: string,
    state: NavigationCurrentType,
}

export default function NavigationExpandedItem(
    {
        icon,
        label,
        open,
        setOpenMenu,
        menus
    }: {
        icon: JSX.Element,
        label: string,
        open: boolean,
        setOpenMenu: Function,
        menus: IMenu[]
    }) {
    const history = useHistory();

    const { currentState } = useNavigationGet();
    let bgColor = '';
    let fontColor = '';

    if (open) {
        bgColor = 'secondary.main';
        fontColor = 'white';
    }
    return renderSelected();

    function renderSelected() {
        return (
            <>
                <ListItemButton onClick={() => { setOpenMenu() }} sx={{ bgcolor: bgColor, color: fontColor }}>
                    <ListItemIcon style={{ color: fontColor }}>
                        {icon}
                    </ListItemIcon>
                    <ListItemText >
                        <Typography style={{ fontSize: '1em' }}>{label}</Typography>
                    </ListItemText>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                        {buildChildrenListItem(menus)}
                    </List>
                </Collapse>
            </>
        );
    }

    function buildChildrenListItem(menus: IMenu[]): JSX.Element {
        const element = menus.map(menu => {
            let selected: boolean = false;
            if (menu.state === currentState) {
                selected = true;
                console.log(`childeren list menu is :${selected}`);
            }

            return (
                <ListItemButton sx={{ pl: 4, bgcolor: (selected) ? 'primary.main' : '', }} onClick={() => history.push(menu.path)}>
                    <ListItemText sx={{ color: (selected) ? 'black' : '' }}>
                        <Typography style={{ fontSize: '1em' }}>{menu.label}</Typography>
                    </ListItemText>
                </ListItemButton>
            )
        })
        return <>{element}</>
    }
}
