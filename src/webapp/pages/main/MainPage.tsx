import { Grid } from '@mui/material'
import Header from '../../components/Header'
import NavigationMainPage from './NavigationMainPage'
import { Switch, Route } from 'react-router-dom'

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
                <Grid container item xs={10} id="content" pt={3} px={4} width='100%'>
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
                <Route path="/wheeling_chart">
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
            </Switch>
        </>
    )

}