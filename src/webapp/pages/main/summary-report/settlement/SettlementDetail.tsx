import { Grid, Typography } from '@mui/material'
import React from 'react'

interface IMap {
    [key: string]: string,
}

export default function SettlementDetail() {
    return buildChooseToBuy()
    // return (
    //     <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh' }}>
    //         <Grid item >
    //             <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Order Detail</Typography>
    //         </Grid>
    //         <Grid container item direction='row' alignItems='center' pt={2}>
    //             <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'success.light' }}>
    //                 {`Offer To Sell`}
    //             </Typography>
    //             <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
    //                 {`Contract ID : #1485434482`}
    //             </Typography>
    //         </Grid>
    //         <Grid item py={1}>
    //             <Typography sx={{ fontSize: '1.2em' }}>{`Bileteral Trade`}</Typography>
    //         </Grid>
    //         <Grid item container xs={12} id='energy-info'>
    //             <Grid container item justifyContent='space-between' px={4} >
    //                 <Typography>
    //                     {`PV`}
    //                 </Typography>
    //                 <Typography >
    //                     {`37.9kWh`}
    //                 </Typography>
    //             </Grid>
    //             <Grid container item justifyContent='space-between' px={4} >
    //                 <Typography>
    //                     {`Energy Storage`}
    //                 </Typography>
    //                 <Typography >
    //                     {`37.9kWh`}
    //                 </Typography>
    //             </Grid>
    //             <Grid container item justifyContent='space-between' px={4} >
    //                 <Typography>
    //                     {`Grid`}
    //                 </Typography>
    //                 <Typography >
    //                     {`37.9kWh`}
    //                 </Typography>
    //             </Grid>
    //             <Grid container item justifyContent='space-between' px={4} >
    //                 <Typography>
    //                     {`Energy Load`}
    //                 </Typography>
    //                 <Typography >
    //                     {`37.9kWh`}
    //                 </Typography>
    //             </Grid>
    //         </Grid>

    //     </Grid>
    // )
}
function buildChooseToBuy() {
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
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'error.light' }}>
                    {`Choose to Buy`}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : #1485434482`}
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

function buildOfferToSell() {
    return (
        <Grid px={2} py={2} direction='column' sx={{ minHeight: '25vh' }}>
            <Grid item >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>Settlement Detail</Typography>
            </Grid>
            <Grid container item direction='row' alignItems='center' pt={2}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em', color: 'success.light' }}>
                    {`Offer To Sell`}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }} pl={2}>
                    {`Contract ID : #1485434482`}
                </Typography>
            </Grid>
            <Grid item py={1}>
                <Typography sx={{ fontSize: '1.2em' }}>{`Bileteral Trade`}</Typography>
            </Grid>
            <Grid item container xs={12} id='energy-info'>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`PV`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Energy Storage`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Grid`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
                    </Typography>
                </Grid>
                <Grid container item justifyContent='space-between' px={4} >
                    <Typography>
                        {`Energy Load`}
                    </Typography>
                    <Typography >
                        {`37.9kWh`}
                    </Typography>
                </Grid>
            </Grid>

        </Grid>
    )
}