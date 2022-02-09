import { Grid, Typography } from '@mui/material'
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { ISettlementDetail } from '../../../../state/summary-report/settlement-report/settlement-detail-state';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);


export default function SettlementDetail() {
    const { settlementDetail } = useSettlementReport();
    if (settlementDetail !== null && settlementDetail !== undefined) {
        return buildSettlementDetail(settlementDetail);
    } else {

        return (
            <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Settlement Detail</Typography>
                </Grid>

            </Grid>
        )
    }
}

function buildSettlementDetail(settlement: ISettlementDetail) {
    let settlementTime = dayjs(+settlement.settlementTime);
    return (
        <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh' }}>
            <Grid item >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Settlement Detail</Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: settlement.userType.toLowerCase() === 'seller' ? 'success.light' : 'error.light' }}>
                    {settlement.userType.toLowerCase() === 'seller' && `Seller`}
                    {settlement.userType.toLowerCase() === 'buyer' && `Buyer`}
                </Typography>
                <Typography sx={{ fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : ${settlement.contractId}`}
                </Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ color: settlement.userType.toLowerCase() === 'seller' ? 'success.light' : 'error.light' }}>
                    {settlement.userType.toLowerCase() === 'seller' && `Seller meter:  ${settlement.meterId}`}
                    {settlement.userType.toLowerCase() === 'buyer' && `Buyer meter:  ${settlement.meterId}`}
                </Typography>
                {settlement.tradeMarket === "POOl" &&
                    <Typography pl={2}>
                        {settlement.userType.toLowerCase() === 'seller' && `Buyer meter:  ${settlement.matchedMeterId}`}
                        {settlement.userType.toLowerCase() === 'buyer' && `Seller meter:  ${settlement.matchedMeterId}`}
                    </Typography>
                }
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontSize: '1.2em', color: 'error.light' }}>
                    {settlement.imbalanceType === "energyShortfall" && "Energy Shortfall"}
                    {settlement.imbalanceType === "energyExcess" && "Energy Excess"}
                </Typography>

                <Typography sx={{ fontSize: '1.2em' }} ml={2}>
                    {settlement.tradeMarket === "LONGTERM_BILATERAL" && "Long Term Bilateral Market"}
                    {settlement.tradeMarket === "BILATERAL" && "Short Term Bilateral Market"}
                    {settlement.tradeMarket === "POOl" && "Pool Market"}
                </Typography>
            </Grid>
            <Grid item container xs={12} id='imbalance-info' mt={3}>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {'Settlement Time'}
                    </Typography>
                    <Typography >
                        {`${dayjs(settlementTime).format(`DD/MM/YYYY HH:mm`)}-${dayjs(settlementTime).tz('Asia/Bangkok').add(1, 'hour').format(`HH:mm`)}`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {'Energy Commited/Delivered'}
                    </Typography>
                    <Typography >
                        {`${settlement.energyCommited.toFixed(3)}/${settlement.energyDeliverd.toFixed(3)} kWh`}
                    </Typography>
                </Grid>

                {settlement.orderImbalanceAmount &&
                    <Grid container item justifyContent='space-between' pl={4} pr={6} >
                        <Typography>
                            {settlement.userType.toLowerCase() === 'seller' && 'Seller imbalance amount'}
                            {settlement.userType.toLowerCase() === 'buyer' && 'Buyer imbalance amount'}
                        </Typography>
                        <Typography >
                            {`${settlement.orderImbalanceAmount.toFixed(3)} kWh`}
                        </Typography>
                    </Grid>
                }
                {settlement.orderImbalance &&
                    <Grid container item justifyContent='space-between' pl={4} pr={6} >
                        <Typography>
                            {settlement.userType.toLowerCase() === 'seller' && 'Seller imbalance'}
                            {settlement.userType.toLowerCase() === 'buyer' && 'Buyer imbalance'}
                        </Typography>
                        <Typography >
                            {`(${settlement.orderImbalance.toFixed(3)}) Baht`}
                        </Typography>
                    </Grid>
                }
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {settlement.userType.toLowerCase() === 'seller' && 'NET Sales'}
                        {settlement.userType.toLowerCase() === 'buyer' && 'NET Buy'}
                    </Typography>
                    <Typography >
                        {`${settlement.netPrice.toFixed(3)} Baht`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {settlement.userType.toLowerCase() === 'seller' && 'NET energy price(NET Sales/Energy Delivered)'}
                        {settlement.userType.toLowerCase() === 'buyer' && 'NET energy price(NET Buy/Energy Used)'}
                    </Typography>
                    <Typography >
                        {` ${settlement.netEnergyPrice.toFixed(3)} Baht/kWh`}
                    </Typography>
                </Grid>

            </Grid>

        </Grid>
    )
}