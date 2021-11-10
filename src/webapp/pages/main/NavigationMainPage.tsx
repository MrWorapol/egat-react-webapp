import React, { useEffect, useState } from 'react'
import { Grid, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView';
import NavigationMenuItem from '../../components/NavigationMenuItem';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useHistory } from 'react-router-dom';
import { useNavigationGet } from '../../hooks/useNavigationGet';
import { NavigationCurrentType } from '../../state/navigation-current-state';
import NavigationNestedItem, { IChildrenMenu } from '../../components/NavigationNestedItem';

const NavigationMainPage = () => {
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const [openRefMenu, setOpenRefMenu] = useState(false);
    const [openSummary, setOpenSummaryMenu] = useState(false);

    const referenceDataChildrenMenu: IChildrenMenu[] = [
        { label: 'Wheeling Charge Setting', path: '/wheeling_chart', state: NavigationCurrentType.WHEELING_CHART },
        { label: 'Imbalance Setting', path: '/imbalance', state: NavigationCurrentType.IMBALANCE },
        { label: 'TOU Tariff Setting', path: '/tou_tariff', state: NavigationCurrentType.TOU_TARIFF },
        { label: 'Other Setting', path: '/other_setting', state: NavigationCurrentType.OTHER_SETTING },
    ];

    const summaryChildrenMenu : IChildrenMenu[] = [
        { label: 'User & Energy Report', path: '/users_report', state: NavigationCurrentType.USER_ENEGERY },
        { label: 'Order Report', path: '/order_report', state: NavigationCurrentType.ORDER_REPORT},
        { label: 'Settlement Report', path: '/settlement_report', state: NavigationCurrentType.SETTLEMENT_REPORT },
        { label: 'Billing Report', path: '/billing_report', state: NavigationCurrentType.BILLING_REPORT},
    ]
    useEffect(() => {
        console.log(`call use Effect on rerender navigation`);
        // setOpenRefMenu(false);
        referenceDataChildrenMenu.forEach(menu => {
            if (menu.state === currentState) {

                setOpenRefMenu(true);
                console.log(`call use Effect on reference data true`);
                return ;
            }
        });
        summaryChildrenMenu.forEach(menu => {
            if (menu.state === currentState) {

                setOpenSummaryMenu(true);
                console.log(`call use Effect on summary true`);
                return ;
            }
        });
        // if(!openRefMenu){
        //     referenceDataChildrenMenu.forEach(menu => {
        //         if (menu.state === currentState) {
    
        //             setOpenRefMenu(true);
        //             console.log(`call use Effect on rerender true`);
        //             return ;
        //         }
        //     });
        // }
        
        console.log(`call use Effect on rerender fa`);
        return ()=> {
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
                icon={<GridViewIcon />}
                label='Reference Database'
                open={openRefMenu}
                setOpenMenu={() => {
                    setOpenRefMenu(!openRefMenu);
                }}
                menus={childrenMenu}
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

    function buildSummaryReport(childrenMenu: IChildrenMenu[]) {
        return (
            <NavigationNestedItem
                icon={<GridViewIcon />}
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
