import { Box, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import { IEnergyPaymentState } from '../../../../../state/summary-report/billing-report/energy-payment-state'

import EnergyTradingChart from './EnergyTradingChart'
import EnergyTradingTable from './EnergyTradingTable'

interface IProps {
    netEnergyTrading: IEnergyPaymentState,
}
export default function NetEnergyTrading(props: IProps) {

    return (
        <Box sx={{ flexGrow: 1, width: `100%`, minHeight: '20vh' }}>
            <Grid container direction='row' columns={12} sx={{ backgroundColor: '#fff' }} pl={3} py={2}>
                <Grid container item xs={6} id='left-table' sx={{}} direction='row' >
                    <Grid container item xs={11}>
                        <Grid item xs={12} py={1}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>{"รวมค่าซื้อขายพลังงานไฟฟ้า (Net Energy Trading Payment)"}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <EnergyTradingTable energyPaymentTable={props.netEnergyTrading.table} />
                        </Grid>
                    </Grid>
                    <Grid container item xs={1} sx={{ my: 2 }} justifyContent='flex-end'>
                        <Divider orientation="vertical" color="#707070" />
                    </Grid>
                </Grid>
                <Grid container item xs={6} sx={{ backgroundColor: '#fff' }} >
                    <EnergyTradingChart energyPayment={props.netEnergyTrading} />
                </Grid>
            </Grid>
        </Box >
    )
}
