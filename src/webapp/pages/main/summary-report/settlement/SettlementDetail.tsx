import { Grid, Typography } from '@mui/material'
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { ISettlementDetail } from '../../../../state/summary-report/settlement-report/settlement-detail-state';

export default function SettlementDetail() {
    const { settlementDetail } = useSettlementReport();
    console.log(settlementDetail);
    if (settlementDetail !== null && settlementDetail !== undefined) {
        // if(settlementDetail.imbalanceStatus === "")
        // if (settlementDetail.userType.toLowerCase() === "buyer") {
        //     console.log(`build To Buy`)
        //     return buildChooseToBuy(settlementDetail);
        // }
        // else {
        //     console.log(`build Offer To Sell`)
        return buildSettlementDetail(settlementDetail);
        // }
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
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : ${settlement.contractId}`}
                </Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontSize: '1.2em', color: 'error.light' }}>
                    {settlement.imbalanceType === "energyShortfall" && "Energy Shortfall"}
                    {settlement.imbalanceType === "POOl" && "Energy Excess"}
                </Typography>

                <Typography sx={{ fontSize: '1.2em' }} ml={2}>
                    {settlement.tradeMarket === "BILATERAL" && "Bilateral Market"}
                    {settlement.tradeMarket === "POOl" && "Pool Market"}
                </Typography>
            </Grid>
            <Grid item container xs={12} id='energy-info' mt={3}>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {'Energy Commited/Delivered'}
                    </Typography>
                    <Typography >
                        {`${(Math.round(settlement.energyCommited * 100) / 100).toFixed(2)}/${(Math.round(settlement.energyDeliverd * 100) / 100).toFixed(2)} kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {settlement.userType.toLowerCase() === 'seller' && 'NET Sales'}
                        {settlement.userType.toLowerCase() === 'buyer' && 'NET Buy'}
                    </Typography>
                    <Typography >
                        {`${(Math.round(settlement.netPrice * 100) / 100).toFixed(2)} Baht`}
                    </Typography>
                </Grid>
                {settlement.orderImbalanceAmount &&
                    <Grid container item justifyContent='space-between' pl={4} pr={6} >
                        <Typography>
                            {settlement.userType.toLowerCase() === 'seller' && 'Seller imbalance amount'}
                            {settlement.userType.toLowerCase() === 'buyer' && 'Buyer imbalance amount'}
                        </Typography>
                        <Typography >
                            {`${(Math.round(settlement.orderImbalanceAmount * 100) / 100).toFixed(2)} kWh`}
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
                            {`(${(Math.round(settlement.orderImbalance * 100) / 100).toFixed(2)}) Baht`}
                        </Typography>
                    </Grid>
                }
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {settlement.userType.toLowerCase() === 'seller' && 'NET energy price(NET Sales/Energy Delivered)'}
                        {settlement.userType.toLowerCase() === 'buyer' && 'NET energy price(NET Buy/Energy Used)'}
                    </Typography>
                    <Typography >
                        {` ${(Math.round(settlement.netEnergyPrice * 100) / 100).toFixed(2)} Baht/kWh`}
                    </Typography>
                </Grid>

            </Grid>

        </Grid>
    )
}