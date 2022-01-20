import { Box, Divider, Grid, Typography } from '@mui/material'
import { INetPaymentState } from '../../../../../state/summary-report/billing-report/net-payment-state'

import NetPaymentChart from './NetPaymentChart'
import NetPaymentTable from './NetPaymentTable'

interface IProps {
    netPayment: INetPaymentState,
}
export default function NetPayment(props: IProps) {

    return (
        <Box sx={{ flexGrow: 1, width: `100%`, minHeight: '20vh' }}>
            <Grid container direction='row' columns={12} sx={{ backgroundColor: '#fff' }} pl={3} py={2}>
                <Grid container item xs={6} id='left-table' sx={{}} direction='row' >
                    <Grid container item xs={11}>
                        <Grid item xs={12} py={1}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>{"Net Payment"}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <NetPaymentTable netPaymentTable={props.netPayment.table} />
                        </Grid>
                    </Grid>
                    <Grid container item xs={1} sx={{ my: 2 }} justifyContent='flex-end'>
                        <Divider orientation="vertical" color="#707070" />
                    </Grid>
                </Grid>
                <Grid container item xs={6} sx={{ backgroundColor: '#fff' }} >
                    <NetPaymentChart netPaymentChart={props.netPayment.chart} />
                </Grid>
            </Grid>
        </Box >
    )
}
