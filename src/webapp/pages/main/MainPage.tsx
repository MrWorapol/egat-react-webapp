import { Grid } from '@mui/material'
import Header from '../../components/Header'
import NavigationMainPage from './NavigationMainPage'
import { Switch, Route, Redirect } from 'react-router-dom'

import UserManagement from './user-management/UserManagement'
import UserDetail from './user-management/UserDetail'
import DashBoard from './dashboard/DashBoard'
import WheelingCharge from './refeneced-data/wheeling-charge/WheelingCharge'
import Imbalance from './refeneced-data/imbalance/Imbalance'
import OtherSetting from './refeneced-data/other-setting/OtherSetting'
import TOUTariff from './refeneced-data/tou-tariff/TOUTariff'
import UserReport from './summary-report/users/UserReport'
import OrderReport from './summary-report/order/OrderReport'
import SettlementReport from './summary-report/settlement/SettlementReport'
import BillingReport from './summary-report/billing/BillingReport'
import NewManagement from './news-management/NewManagement'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import PageNotFound from './PageNotFound'

export default function MainPage() {

    return (
        <Grid container direction="column" style={{ minHeight: '100vh', backgroundColor: '#E9EDF2' }}>
            <Grid container item id="header" sx={{ height: '4em' }}>
                <Header />
            </Grid>
            <Grid container id="navigation-tab" direction="row" sx={{ minHeight: '100vh-5em' }}>

                <Grid container item xs={2} >
                    <NavigationMainPage />
                </Grid>
                <Grid container item xs={10} id="content" pt={3} px={4} width='100%'>
                    {PageRouting()}
                </Grid>
            </Grid>
        </Grid >
    )
}

function PageRouting() {
    let { session, checkRefreshToken } = useAuthGuard();


    if (!session) {
        return;
    } else {
        setInterval(async () => {
            console.log(`call interval on Main Page`);
            checkRefreshToken();
        }, 50000);
        return (
            <>
                <Switch>
                    <Route path={['/']} exact>
                        <DashBoard />
                    </Route>
                    <Route path='/user_management/:id'>
                        <UserDetail />
                    </Route>
                    <Route path='/user_management' >
                        <UserManagement />
                    </Route>
                    <Route path="/wheeling_charge">
                        <WheelingCharge />
                    </Route>
                    <Route path="/imbalance">
                        <Imbalance />
                    </Route>
                    <Route path="/other_setting">
                        <OtherSetting />
                    </Route>
                    <Route path="/tou_tariff">
                        <TOUTariff />
                    </Route>

                    <Route path="/users_report">
                        <UserReport />
                    </Route>
                    <Route path="/order_report">
                        <OrderReport />
                    </Route>
                    <Route path="/settlement_report">
                        <SettlementReport />
                    </Route>
                    <Route path="/billing_report">
                        <BillingReport />
                    </Route>
                    <Route path='/news'>
                        <NewManagement />
                    </Route>
                    <Route path='/404' component={PageNotFound}/>                    
                    <Redirect to='/404' />
                </Switch>
            </>
        )
    }
}