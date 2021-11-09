import React, { useState } from 'react'
import { Grid, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView';
import NavigationMenuItem from '../../components/NavigationMenuItem';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useHistory } from 'react-router-dom';
import { useNavigationGet } from '../../hooks/useNavigationGet';
import { NavigationCurrentType } from '../../state/navigation-current-state';
import NavigationNestedItem from '../../components/NavigationNestedItem';

const NavigationMainPage = () => {
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const [openRefMenu, setOpenRefMenu] = useState(false);
    const [openSummary, setOpenSummary] = useState(false);
    return (
        <>
            <Grid container item direction='column' justifyContent='flex-start' style={{ backgroundColor: '#EFEFEF', height: '100vh-4em' }}>
                <Grid item>
                    <List>
                        {buildDashBoard()}
                        {buildUserManagement()}
                        {buildReferenceData()}
                        {buildSummaryReport()}
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
    function buildReferenceData() {
        return (
            <NavigationNestedItem
                icon={<GridViewIcon />}
                label='Reference Database'
                open={openRefMenu}
                setOpenMenu={() => {
                    setOpenRefMenu(!openRefMenu);
                }}
                menus={[
                    {label: 'Wheeling Chart Setting',path:'/wheeling_chart',state: NavigationCurrentType.WHEELING_CHART},
                    {label: 'Imbalance Setting',path:'/imbalance',state: NavigationCurrentType.IMBALANCE},
                    {label: 'TOU Tariff Setting',path:'/tou_tariff',state: NavigationCurrentType.TOU_TARIFF},
                    {label: 'Other Setting',path:'/other_setting',state: NavigationCurrentType.OTHER_SETTING},
                ]}
            />
            // <NavigationMenuItem
            //     icon={<GridViewIcon />}
            //     label='Reference Database'
            //     selected={currentState === NavigationCurrentType.REFENRENCE_DATA}
            //     onClick={() => {
            //         history.push('/reference_database');
            //     }}
            // />
        )
    }

    function buildSummaryReport() {
        return (
            <NavigationMenuItem
                icon={<GridViewIcon />}
                label='Summary Report'
                selected={currentState === NavigationCurrentType.SUMMARY_REPORT}
                onClick={() => {
                    history.push('/summary_report');
                }}
            />
        )
    }

    function buildNews() {
        return (
            <NavigationMenuItem
                icon={<GridViewIcon />}
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
