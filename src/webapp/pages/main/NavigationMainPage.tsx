import React, { useEffect, useState } from 'react'
import { Grid, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'

import NavigationMenuItem from '../../components/NavigationMenuItem';
import { useHistory } from 'react-router-dom';
import { useNavigationGet } from '../../hooks/useNavigationGet';
import { NavigationCurrentType } from '../../state/navigation-current-state';
import NavigationNestedItem, { IChildrenMenu } from '../../components/NavigationNestedItem';

import GridViewIcon from '@mui/icons-material/GridView';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

const NavigationMainPage = () => {
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const [openRefMenu, setOpenRefMenu] = useState(false);
    const [openSummary, setOpenSummaryMenu] = useState(false);

    const referenceDataChildrenMenu: IChildrenMenu[] = [
        { label: 'Wheeling Charge Setting', path: '/wheeling_charge', state: NavigationCurrentType.WHEELING_CHARGE },
        { label: 'Imbalance Setting', path: '/imbalance', state: NavigationCurrentType.IMBALANCE },
        { label: 'TOU Tariff Setting', path: '/tou_tariff', state: NavigationCurrentType.TOU_TARIFF },
        { label: 'Other Setting', path: '/other_setting', state: NavigationCurrentType.OTHER_SETTING },
    ];

    const summaryChildrenMenu: IChildrenMenu[] = [
        { label: 'User & Energy Report', path: '/users_report', state: NavigationCurrentType.SUMMARY_REPORT },
        { label: 'Order Report', path: '/order_report', state: NavigationCurrentType.ORDER_REPORT },
        { label: 'Settlement Report', path: '/settlement_report', state: NavigationCurrentType.SETTLEMENT_REPORT },
        { label: 'Billing Report', path: '/billing_report', state: NavigationCurrentType.BILLING_REPORT },
    ]
    useEffect(() => {
        referenceDataChildrenMenu.forEach(menu => {
            if (menu.state === currentState) {
                setOpenRefMenu(true);
                return;
            }
        });
        summaryChildrenMenu.forEach(menu => {
            if (menu.state === currentState) {
                setOpenSummaryMenu(true);
                return;
            }
        });
        return () => {
            setOpenRefMenu(false);
            setOpenSummaryMenu(false);
        };
    }, [currentState])

    return (
        <>
            <Grid container item direction='column' justifyContent='flex-start' style={{ backgroundColor: '#EFEFEF', height: '100vh-4em' }}>
                <Grid item>
                    <List>
                        {buildDashBoard()}
                        {buildUserManagement()}
                        {buildReferenceData(referenceDataChildrenMenu)}
                        {buildSummaryReport(summaryChildrenMenu)}
                        {buildNews()}
                    </List>
                </Grid>
            </Grid>

        </>
    )

    function buildDashBoard() {
        return (
            <NavigationMenuItem
                icon={<GridViewIcon />}
                label='Dashboard'
                selected={currentState === NavigationCurrentType.DASHBOARD}
                onClick={() => {
                    history.push('/dashboard');
                }
                }
            />
        )
    }

    function buildUserManagement() {
        return (
            <NavigationMenuItem
                icon={<PersonOutlineIcon />}
                label='User Management'
                selected={currentState === NavigationCurrentType.USER_MANAGEMENT || currentState === NavigationCurrentType.USER_DETAIL}
                onClick={() => {
                    history.push('/user_management');
                }}
            />
        )
    }
    function buildReferenceData(childrenMenu: IChildrenMenu[]) {

        return (
            <NavigationNestedItem
                key="reference-data-menu"
                icon={<NoteAltOutlinedIcon />}
                label='Reference Data'
                open={openRefMenu}
                setOpenMenu={() => {
                    setOpenRefMenu(!openRefMenu);
                }}
                menus={childrenMenu}
            />
        )
    }

    function buildSummaryReport(childrenMenu: IChildrenMenu[]) {
        return (
            <NavigationNestedItem
                key="summary-repory-menu"
                icon={<AssessmentOutlinedIcon />}
                label='Summary Report'
                open={openSummary}
                setOpenMenu={() => {
                    setOpenSummaryMenu(!openSummary);
                }}
                menus={childrenMenu}
            />
        )
    }

    function buildNews() {
        return (
            <NavigationMenuItem
                icon={<CampaignOutlinedIcon />}
                label='News Management'
                selected={currentState === NavigationCurrentType.NEWS_MANAGEMENT}
                onClick={() => {
                    history.push('/news');
                }}
            />

        )
    }

}

export default NavigationMainPage;
