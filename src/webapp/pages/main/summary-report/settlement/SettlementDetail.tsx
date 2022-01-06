import { Grid, Typography } from '@mui/material'
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { IImbalanceReport, ISettlementReport } from '../../../../state/summary-report/settlement-report/settlement-report-state';

interface IMap {
    [key: string]: string,
}

export default function SettlementDetail() {
    const { settlementDetail } = useSettlementReport();
    if (settlementDetail !== null) {
        // console.log(`Call Settlement Detail ${settlementDetail.contractId}`);
        // console.log(settlementDetail.userType);

        if (settlementDetail.userType.toLowerCase() === "buyer") {
            console.log(`build To Buy`)
            return buildChooseToBuy(settlementDetail);
        }
        else {
            console.log(`build Offer To Sell`)
            return buildOfferToSell(settlementDetail);
        }
    } else {

        return (
            <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Cannot Load Data</Typography>
                </Grid>
            </Grid>
        )
    }
}
function buildChooseToBuy(settlement: ISettlementReport) {
    let details: IMap[] = [
        {
            key: 'amount',
            label: 'amount'
        },
        {
            key: 'netBuy',
            label: 'NET buy'
        },
        {
            key: 'netEnergyPrice',
            label: 'NET energy price'
        },
        { key: 'energyToBuy', label: 'Energy to buy' },
        { key: 'energyTariff', label: 'Energy tariff' },
        { key: 'energyPrice', label: 'Energy price' },
        { key: 'wheelingChargeTariff', label: 'Wheeling charge Tariff' },
        { key: 'wheelingCharge', label: 'Wheeling charge' },
        { key: 'tradingFee', label: 'Trading fee' }
    ];
    let mockData: IMap = {
        amount: 'amount',
        netBuy: 'NET buy',
        netEnergyPrice: 'NET energy price',
        energyToBuy: 'Energy to buy',
        energyTariff: 'Energy tariff',
        energyPrice: 'Energy price',
        wheelingChargeTariff: 'Wheeling charge Tariff',
        wheelingCharge: 'Wheeling charge',
        tradingFee: 'Trading fee'
    }
    return (
        <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh' }}>
            <Grid item >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Settlement Detail</Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'error.light' }} key={`userType`}>
                    {`Buyer`}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : ${settlement.contractId}`}
                </Typography>
            </Grid>
            <Grid item py={1}>
                <Typography sx={{ fontSize: '1.2em' }}>{`Bileteral Trade`}</Typography>
            </Grid>
            <Grid item container xs={12} id='energy-info'>
                {details.map((detail, index) => {
                    return (
                        <Grid container item justifyContent='space-between' pl={4} pr={6} >
                            <Typography>
                                {detail.label}
                            </Typography>
                            <Typography >
                                {mockData[detail.key]}
                            </Typography>
                        </Grid>
                    )
                })
                }
            </Grid>

        </Grid>
    )
}

function buildOfferToSell(settlement: ISettlementReport) {
    let imbalance: IImbalanceReport | undefined;
    if (settlement.imbalance !== undefined && settlement.imbalance.length > 0) {
        imbalance = settlement.imbalance.find((imbalance) => { return imbalance.tradeType === "SELLER_IMBALANCE_UNDERCOMMIT" || imbalance.tradeType === "SELLER_IMBALANCE_OVERCOMMIT" })
        console.log(`is settlement imbalance`)
        console.log(imbalance);
    }
    return (
        <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh' }}>
            <Grid item >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Settlement Detail</Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'success.light' }}>
                    {`Seller`}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : ${settlement.contractId}`}
                </Typography>
            </Grid>
            <Grid item py={1}>
                <Typography sx={{ fontSize: '1.2em' }}>
                    {settlement.tradeMarket === "BILATERAL" && "Bilateral Market"}
                    {settlement.tradeMarket === "POOl" && "Pool Market"}
                </Typography>
            </Grid>
            <Grid item container xs={12} id='energy-info'>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {'Energy Commited/Delivered'}
                    </Typography>
                    <Typography >
                        {`${settlement.energyCommitted}/${imbalance ? settlement.energyCommitted - imbalance.amount : settlement.energyCommitted} kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {'NET Sales'}
                    </Typography>
                    <Typography >
                        {`${settlement.priceCommitted + settlement.tradingFee + settlement.wheelingChargeFee} Baht`}
                    </Typography>
                </Grid>
                {imbalance &&
                    <Grid container item justifyContent='space-between' pl={4} pr={6} >
                        <Typography>
                            {'Seller imbalance amount'}
                        </Typography>
                        <Typography >
                            {`${imbalance.amount} kWh`}
                        </Typography>
                    </Grid>
                }
                {imbalance &&
                    <Grid container item justifyContent='space-between' pl={4} pr={6} >
                        <Typography>
                            {'Seller imbalance'}
                        </Typography>
                        <Typography >
                            {`(${imbalance.price}) Baht`}
                        </Typography>
                    </Grid>
                }
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {'NET energy price(NET Sales/Energy Delivered)'}
                    </Typography>
                    <Typography >
                        {`${settlement.priceCommitted + settlement.tradingFee + settlement.wheelingChargeFee / (imbalance ? settlement.energyCommitted - imbalance.amount : settlement.energyCommitted)} Baht/kWh`}
                    </Typography>
                </Grid>

            </Grid>

        </Grid>
    )
}