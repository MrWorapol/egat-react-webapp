import { useNavigationSet } from '../../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import {  Grid } from '@mui/material'

import { Box } from '@mui/system'
import SettlementDetail from './SettlementDetail';
import SummaryCharts from './SummaryChartComponents';
import AllSettlementComponent from './AllSettlementComponent';
import PeriodComponent from '../PeriodComponent';
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { useNavigationGet } from '../../../../hooks/useNavigationGet';
import { useRecoilValue } from 'recoil';
import { userSessionState } from '../../../../state/user-sessions';
export default function SettlementReport() {
    useNavigationSet(NavigationCurrentType.SETTLEMENT_REPORT);
    const { currentState } = useNavigationGet();
    const session = useRecoilValue(userSessionState);
    const { refreshSettlementReport, settlementChart } = useSettlementReport();

    const refreshPage = async () => {
        refreshSettlementReport('all', 'all', 'all', 'all', 'all');
    };

    if (session && currentState === NavigationCurrentType.SETTLEMENT_REPORT) {
        return (
            <Box sx={{ width: `100%`, pb: 2, maxWidth: '100%' }}>
                <Grid container item direction="row" justifyContent='flex-end' id='period-zone' mb={1}>
                    <Grid item >
                        <PeriodComponent key='settlement-period' refreshPage={() => { refreshPage() }} />

                    </Grid>
                </Grid>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container  direction='row' xs={12} >
                        <Grid container item direction='column' id='left-side' xs={6}>
                            <Grid container item xs={'auto'} sx={{ backgroundColor: '#fff' }} id='div-area'>
                                <AllSettlementComponent />
                            </Grid>
                            <Grid container item direction='row' xs={'auto'} sx={{ backgroundColor: '#fff' }} mt={2} pt={2} pl={3} id='div-chart'>
                                <SettlementDetail />
                            </Grid>
                        </Grid>
                        <Grid container item id='right-side' xs={6} pl={3}>
                            {settlementChart && <SummaryCharts data={settlementChart} />}
                        </Grid>
                    </Grid>
                </Box>
            </Box >
        )
    } else {
        return (
            <>
                ...Loading
            </>
        )
    }
}
