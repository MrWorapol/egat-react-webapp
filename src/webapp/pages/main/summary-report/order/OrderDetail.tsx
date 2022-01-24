import { Grid, Typography } from '@mui/material'
import React from 'react'
import { IOrderDetail } from '../../../../state/summary-report/order-report/order-detail-state';
import useOrderReport from '../../../../hooks/summary-report/order/useOrderReport';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

export default function OrderDetail() {
    const { orderDetail } = useOrderReport();

    if (orderDetail) {
        // console.log(`order detail page`);
        // console.log(orderDetail)
        if (orderDetail.tradeContractId === undefined) {
            
            return buildOpenOrder(orderDetail);
        } else {
            if (orderDetail.userType.toLowerCase() === 'buyer') {
                // console.log(`orderDEtail is found case buyer`)
                return buildMatchedBuyOrder(orderDetail);
            }
            else {
                // console.log(`orderDEtail is found case seller`)
                return buildMatchedSellOrder(orderDetail);

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
function buildMatchedBuyOrder(orderDetail: IOrderDetail) {
    let settlementTime = dayjs(+orderDetail.orderDetail.deliverdTime);
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
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontSize: '1.1em', color: 'error.light' }}>
                    {`Buyer meter id: ${orderDetail.meterId}`}
                </Typography>
                <Typography sx={{ fontSize: '1.1em' }} pl={2}>
                    {`Seller meter id: ${orderDetail.matchedMeterId}`}
                </Typography>
            </Grid>
            <Grid item py={1}>
                <Typography sx={{ fontSize: '1.2em' }}>{orderDetail.tradeMarket === 'pool' ? 'Pool Market Trade' : 'Bilateral Trade'}</Typography>
            </Grid>
            <Grid item container id='energy-info'>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Deliverd Time`}
                    </Typography>
                    <Typography >
                        {`${dayjs(settlementTime).format(`DD/MM/YYYY HH:mm`)}-${dayjs(settlementTime).tz('Asia/Bangkok').add(1, 'hour').format(`HH:mm`)}`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Amount`}
                    </Typography>
                    <Typography >
                        {`${orderDetail.orderDetail["amount"]} kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`NET buy`}
                    </Typography>
                    <Typography >
                        {`${(Math.round(orderDetail.orderDetail.netBuy * 1000) / 1000).toFixed(2)} Baht`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`NET energy price`}
                    </Typography>
                    <Typography >
                        {`${(Math.round(orderDetail.orderDetail.netEnergyPrice * 1000) / 1000).toFixed(2)} Baht`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Energy to buy`}
                    </Typography>
                    <Typography >
                        {`${orderDetail.orderDetail.energyToBuy} kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Energy to tariff`}
                    </Typography>
                    <Typography >
                        {`${(Math.round(orderDetail.orderDetail.energyTariff * 1000) / 1000).toFixed(2)} Baht/kWh`}
                    </Typography>

                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Energy price`}
                    </Typography>
                    <Typography >
                        {`${(Math.round(orderDetail.orderDetail.energyPrice * 1000) / 1000).toFixed(2)} Baht`}
                    </Typography>

                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Wheeling charge Tariff`}
                    </Typography>
                    <Typography >
                        {`${(Math.round(orderDetail.orderDetail.wheelingChargeTariff * 1000) / 1000).toFixed(2)} Baht/kWh`}
                    </Typography>

                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Wheeling charge`}
                    </Typography>
                    <Typography >
                        {`${(Math.round(orderDetail.orderDetail.wheelingCharge * 1000) / 1000).toFixed(2)} Baht`}
                    </Typography>

                </Grid>
                <Grid container item justifyContent='space-between' pl={4} pr={6} >
                    <Typography>
                        {`Trading fee`}
                    </Typography>
                    <Typography >
                        {`${(Math.round(orderDetail.orderDetail.tradingFee * 1000) / 1000).toFixed(2)} Baht`}
                    </Typography>

                </Grid>
            </Grid>

        </Grid>
    )
}

function buildMatchedSellOrder(orderDetail: IOrderDetail) {
    let settlementTime = dayjs(+orderDetail.orderDetail.deliverdTime);
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
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontSize: '1.1em', color: 'success.light' }}>
                    {`Seller meter id: ${orderDetail.meterId}`}
                </Typography>
                <Typography sx={{ fontSize: '1.1em' }} pl={2}>
                    {`Buyer meter id: ${orderDetail.matchedMeterId}`}
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
                        {`${dayjs(settlementTime).format(`DD/MM/YYYY HH:mm`)}-${dayjs(settlementTime).tz('Asia/Bangkok').add(1, 'hour').format(`HH:mm`)}`}
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
                        {`${(Math.round(orderDetail.orderDetail.offerToSell * 100) / 100).toFixed(2)} Baht/kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Trading Fee`}
                    </Typography>
                    <Typography >
                        {`(${(Math.round(orderDetail.orderDetail.tradingFee * 100) / 100).toFixed(2)}) Baht`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Estimated Sales`}
                    </Typography>
                    <Typography >

                        {`${(Math.round((orderDetail.orderDetail.estimatedSales + orderDetail.orderDetail.tradingFee) * 100) / 100).toFixed(2)} Baht`}
                    </Typography>
                </Grid>
            </Grid>

        </Grid>
    )
}

function buildOpenOrder(orderDetail: IOrderDetail) {
    let settlementTime = dayjs(+orderDetail.orderDetail.deliverdTime);
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
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontSize: '1.1em', color: 'success.light' }}>
                    {orderDetail.userType.toLowerCase() === "seller" &&  `Seller meter id: ${orderDetail.meterId}`}
                    {orderDetail.userType.toLowerCase() === "buyer" &&  `Buyer meter id: ${orderDetail.meterId}`}
                </Typography>
            </Grid>
            <Grid item container id='energy-info'>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Deliverd Time`}
                    </Typography>
                    <Typography >
                        {`${dayjs(settlementTime).format(`DD/MM/YYYY HH:mm`)}-${dayjs(settlementTime).tz('Asia/Bangkok').add(1, 'hour').format(`HH:mm`)}`}
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
                        {`${(Math.round(orderDetail.orderDetail.price * 1000) / 1000).toFixed(3)} Baht/kWh`}
                    </Typography>
                </Grid>
            </Grid>

        </Grid>
    )
}