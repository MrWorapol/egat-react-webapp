import React, { useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useDebouncedCallback } from 'use-debounce/lib';
import AllOrderTable from './AllOrderTable';
import { Controller, useForm } from 'react-hook-form';
import { useOrderReport } from '../../../../hooks/summary-report/order/useOrderReport';

interface IRolesState {
    [key: string]: boolean,
}


interface ITableSelector {
    role: string,
    type: string,
    status: string,
    market: string,
}


export default function AllOrder() {
    const [area, setArea] = useState('total');
    const [role, setRole] = useState('all');
    const [buyerType, setBuyerType] = useState('all');
    const [tradeMarket, setTradeMarket] = useState('all');
    const [orderStatus, setOrderStatus] = useState('all');

    const { } = useOrderReport();

    const refreshTable = useDebouncedCallback(() => {
        console.log(`role: ${role}\t buyer: ${buyerType}\t orderStatus: ${orderStatus}\t tradeMarket:${tradeMarket}\n area: ${area}`);

    }, 2000)

    const onSelectedDropdown = (event: SelectChangeEvent) => {
        switch (event.target.name) {
            case ('area'): {
                setArea(event.target.value);
                break;
            }
            case ('role'): {
                setRole(event.target.value);
                break;
            }
            case ('buyerType'): {
                setBuyerType(event.target.value);
                break;
            }
            case ('tradeMarket'): {
                setTradeMarket(event.target.value);
                break;
            }
            case ('orderStatus'): {
                setOrderStatus(event.target.value);
                break;
            }
        }

        refreshTable();
    }

    function buildTableSelector(// onCheckedRole: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) {
        return (
            <>
                <Grid container item xs={3}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '3vh' }}
                            name='role'
                            value={role}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'aggregator'}>Aggregator</MenuItem>
                            <MenuItem value={'prosumer'}>Prosumer</MenuItem>
                            <MenuItem value={'consumer'}>Consumer</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '3vh' }}
                            name='buyerType'
                            value={buyerType}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'seller'}>Seller</MenuItem>
                            <MenuItem value={'buyer'}>Buyer</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '3vh' }}
                            name='tradeMarket'
                            value={tradeMarket}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'bilateral'}>Bilateral Market Trade</MenuItem>
                            <MenuItem value={'pool'}>Pool Market Trade</MenuItem>
                        </Select>

                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '3vh' }}
                            name='orderStatus'
                            value={orderStatus}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'matched'}>Matched</MenuItem>
                            <MenuItem value={'open'}>Open</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </>
        )
    }

    const onSubmitForm = async (data: ITableSelector) => {
        console.log(data);
    }



    return (
        <Grid container direction='column' px={2} sx={{ minHeight: '50vh' }}>
            <Grid item container direction='row' justifyContent='space-between' id='header' pt={2}>
                <Grid item container xs={'auto'}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>All Order</Typography>
                </Grid>
                <Grid item container xs={'auto'}>
                    <FormControl variant='outlined' >
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={area}
                            name='area'
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                            sx={{ height: '3vh' }}
                        >
                            <MenuItem value={'total'}> {'Total'}</MenuItem>
                            <MenuItem value={'3villages'}> {'3 Villages'}</MenuItem>
                            <MenuItem value={'tu'}>{'Thammasat University'}</MenuItem>
                            <MenuItem value={'venueFlow'}>{'VENUE FLOW'}</MenuItem>
                            <MenuItem value={'perfectPark'}>{'Perfect Park'}</MenuItem>
                            <MenuItem value={'casaPermium'}>{'CASA Premium'}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

            </Grid>
            <Grid item container direction='row' spacing={1} id='table-selector' my={1}>
                {buildTableSelector()}
            </Grid>
            <Grid id="area-table">
                <AllOrderTable />
            </Grid>
        </Grid>
        // </Box>

    )
}
