import { Grid } from '@mui/material'
import Header from '../../components/Header'
import NavigationMainPage from './NavigationMainPage'
import { Switch, Route } from 'react-router-dom'

import UserManagement from './user-management/UserManagement'
import UserDetail from './user-management/UserDetail'
import DashBoard from './dashboard/DashBoard'
import ReferenceData from './refeneced-data/ReferenceData'
import { useRecoilState } from 'recoil'
import { session } from '../../state/user-sessions'
import WheelingCharge from './refeneced-data/WheelingCharge'

export default function MainPage() {
    // const [sessionValue] = useRecoilState(session);

    return (
        <Grid container direction="column" style={{ minHeight: '100vh', backgroundColor: '#E9EDF2' }}>
            <Grid container item id="header" sx={{ height: '4em' }}>
                <Header />
            </Grid>
            <Grid container item id="navigation-tab" direction="row" sx={{ minHeight: '100vh-4em' }}>
                <Grid container item xs={2}>
                    <NavigationMainPage />
                </Grid>
                <Grid container item xs={10} id="content" p={'64px'}>
                    {PageRouting()}
                </Grid>
            </Grid>
        </Grid >
    )
}

export function PageRouting() {
    return (
        <>
            <Switch>
                <Route path={['/', '/dashboard']} exact>
                    <DashBoard />
                </Route>
                <Route path='/user_management/:id'>
                    <UserDetail />
                </Route>
                <Route path='/user_management' >
                    <UserManagement />
                </Route>
                <Route path='/ref_data'>
                    <ReferenceData />
                </Route>
                <Route path="/wheeling_chart">
                    <WheelingCharge />
                </Route>
            </Switch>
        </>
    )

}