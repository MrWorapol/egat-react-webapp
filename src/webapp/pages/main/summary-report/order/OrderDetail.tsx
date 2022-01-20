import { Grid, Typography } from '@mui/material'
import React from 'react'
import { IOrderDetail } from '../../../../state/summary-report/order-report/order-detail-state';
import useOrderReport from '../../../../hooks/summary-report/order/useOrderReport';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

interface IMap {
    [key: string]: string,
}

export default function OrderDetail() {
    const { orderDetail } = useOrderReport();

    if (orderDetail) {
        console.log(`order detail page`);
        console.log(orderDetail)
        if (orderDetail.tradeContractId === undefined) {

            return buildOpenOrder(orderDetail);
        } else {
            if (orderDetail.userType.toLowerCase() === 'buyer') {
                console.log(`orderDEtail is found case buyer`)
                return buildChooseToBuy(orderDetail);
            }
            else {
                console.log(`orderDEtail is found case seller`)
                return buildOfferToSell(orderDetail);

            }
        }
    } else {
        console.log(`orderDEtail not found`)
        return (
            <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh' }}>
                <Grid item >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Order Detail</Typography>
                </Grid>
            </Grid>
        )

    }

}
function buildChooseToBuy(orderDetail: IOrderDetail) {
    let details: IMap[] = [
        { key: 'amount', label: 'amount', unit: 'kWh' },
        { key: 'netBuy', label: 'NET buy', unit: 'Baht' },
        { key: 'netEnergyPrice', label: 'NET energy price', unit: 'Baht' },
        { key: 'energyToBuy', label: 'Energy to buy', unit: 'kWh' },
        { key: 'energyTariff', label: 'Energy tariff', unit: 'Baht/kWh' },
        { key: 'energyPrice', label: 'Energy price', unit: 'Baht' },
        { key: 'wheelingChargeTariff', label: 'Wheeling charge Tariff', unit: 'Baht/kWh' },
        { key: 'wheelingCharge', label: 'Wheeling charge', unit: 'Baht' },
        { key: 'tradingFee', label: 'Trading fee', unit: 'Baht' }
    ];
    return (
        <Grid px={2} py={2} sx={{ minHeight: '25vh' }}>
            <Grid item >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Order Detail</Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'error.light' }}>
                    {`Choose to Buy`}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : #${orderDetail.tradeContractId}`}
                </Typography>
            </Grid>
            <Grid item py={1}>
                <Typography sx={{ fontSize: '1.2em' }}>{orderDetail.tradeMarket === 'pool' ? 'Pool Market Trade' : 'Bilateral Trade'}</Typography>
            </Grid>
            <Grid item container id='energy-info'>
                {details.map((detail, index) => {
                    return (
                        <Grid container item justifyContent='space-between' pl={4} pr={6} >
                            <Typography>
                                {detail.label}
                            </Typography>
                            <Typography >
                                {`${orderDetail.orderDetail[detail.key]} ${detail.unit}`}
                            </Typography>
                        </Grid>
                    )
                })
                }
            </Grid>

        </Grid>
    )
}

function buildOfferToSell(orderDetail: IOrderDetail) {
    return (
        <Grid container px={2} py={2} sx={{ minHeight: '25vh' }}>
            <Grid item >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Order Detail</Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'success.light' }}>
                    {`Offer To Sell`}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : #${orderDetail.tradeContractId}`}
                </Typography>
            </Grid>
            <Grid item py={1}>
                <Typography sx={{ fontSize: '1.2em' }}>{orderDetail.tradeMarket === 'pool' ? 'Pool Market Trade' : 'Bilateral Trade'}</Typography>
            </Grid>
            <Grid item container id='energy-info'>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Deliverd Time`}
                    </Typography>
                    <Typography >
                        {`${dayjs.unix(orderDetail.orderDetail.deliverdTime).tz('Asia/Bangkok').format(`HH:mm`)}-${dayjs.unix(orderDetail.orderDetail.deliverdTime).tz('Asia/Bangkok').add(1, 'hour').format(`HH:mm`)}`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Committed Amount`}
                    </Typography>
                    <Typography >
                        {`${orderDetail.orderDetail.commitedAmount} kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Offer To Sell`}
                    </Typography>
                    <Typography >
                        {`${orderDetail.orderDetail.offerToSell} Baht/kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Trading Fee`}
                    </Typography>
                    <Typography >
                        {`(${orderDetail.orderDetail.tradingFee}) Baht`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Estimated Sales`}
                    </Typography>
                    <Typography >
                        {`${orderDetail.orderDetail.estimatedSales + orderDetail.orderDetail.tradingFee} Baht`}
                    </Typography>
                </Grid>
            </Grid>

        </Grid>
    )
}

function buildOpenOrder(orderDetail: IOrderDetail) {
    console.log(orderDetail);
    return (
        <Grid container px={2} py={2} sx={{ minHeight: '25vh' }}>
            <Grid item >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Order Detail</Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'success.light' }}>
                    {orderDetail.userType.toLowerCase() === "seller" && `Offer To Sell`}
                    {orderDetail.userType.toLowerCase() === "buyer" && `Bid To Buy`}
                </Typography>

            </Grid>
            <Grid item py={1}>
                <Typography sx={{ fontSize: '1.2em' }}>{orderDetail.tradeMarket.toLowerCase() === 'pool' ? 'Pool Market Trade' : 'Bilateral Trade'}</Typography>
            </Grid>
            <Grid item container id='energy-info'>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Deliverd Time`}
                    </Typography>
                    <Typography >
                        {`${dayjs.unix(orderDetail.orderDetail.deliverdTime).tz('Asia/Bangkok').format(`HH:mm`)}-${dayjs.unix(orderDetail.orderDetail.deliverdTime).tz('Asia/Bangkok').add(1, 'hour').format(`HH:mm`)}`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Commited Amount`}
                    </Typography>
                    <Typography >
                        {`${orderDetail.orderDetail.commitedAmount} kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    {orderDetail.userType.toLowerCase() === "seller" &&
                        <Typography>
                            {`Offer To Sell`}
                        </Typography>
                    }
                    {orderDetail.userType.toLowerCase() === "buyer" &&
                        <Typography>
                            {`Bid to Buy`}
                        </Typography>
                    }
                    <Typography >
                        {`${orderDetail.orderDetail.price} Baht/kWh`}
                    </Typography>
                </Grid>
            </Grid>

        </Grid>
    )
}