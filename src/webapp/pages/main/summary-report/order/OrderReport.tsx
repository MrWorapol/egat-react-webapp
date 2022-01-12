import { useCallback } from 'react'
import { useNavigationSet } from '../../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import { Grid } from '@mui/material'

import { Box } from '@mui/system'
import AllOrder from './AllOrderComponent';
import OrderDetail from './OrderDetail';
import SummaryChartComponents from './SummaryChartComponents';
import PeriodComponent from '../PeriodComponent';
import useOrderReport from '../../../../hooks/summary-report/order/useOrderReport';
import { useRecoilValue } from 'recoil';
import { userSessionState } from '../../../../state/user-sessions';
import { useNavigationGet } from '../../../../hooks/useNavigationGet';

export default function OrderReport() {
    useNavigationSet(NavigationCurrentType.ORDER_REPORT);
    const { currentState } = useNavigationGet();
    const session = useRecoilValue(userSessionState);

    const { refreshOrderReport, orderChart } = useOrderReport();
    
    const refreshPage = useCallback(async () => {
        refreshOrderReport([], 'all', 'all', 'all', 'all');
    }, []);

    if (session && currentState === NavigationCurrentType.ORDER_REPORT) {
        return (
            <Box sx={{ width: `100%`, px: 2, py: 2, maxWidth: '100%' }}>
                <Grid container item direction="row" justifyContent='flex-end' id='period-zone' mb={1}>
                    <Grid item >
                        <PeriodComponent key='order-period' refreshPage={refreshPage} />
                    </Grid>
                </Grid>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container item direction='row' xs={12} >
                        <Grid container item direction='column' id='left-side' xs={6} pr={3}>
                            <Grid container item xs={'auto'} sx={{ backgroundColor: '#fff' }} id='div-area'>
                                <AllOrder />
                            </Grid>
                            <Grid container item direction='row' xs={'auto'} sx={{ backgroundColor: '#fff' }} mt={2} pt={2} pl={3} id='div-chart'>
                                <OrderDetail />
                            </Grid>
                        </Grid>
                        <Grid container item id='right-side' xs={6} >
                            {orderChart && <SummaryChartComponents data={orderChart} />}
                        </Grid>
                    </Grid>
                </Box>
            </Box >
        )
    } else {
        return <>Loading...</>;
    }
}
