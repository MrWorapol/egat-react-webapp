import React, { useEffect, useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useDebouncedCallback } from 'use-debounce/lib';
import AllOrderTable from './AllOrderTable';
import { Controller, useForm } from 'react-hook-form';
import { useOrderReport } from '../../../../hooks/summary-report/order/useOrderReport';
import { IOrderInfo, orderState } from '../../../../state/summary-report/order-report/order-report-state';
import { useRecoilValue } from 'recoil';
import { useLoadingScreen } from '../../../../hooks/useLoadingScreen';

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
    const { showLoading, hideLoading } = useLoadingScreen();
    const [area, setArea] = useState('total');
    const [role, setRole] = useState('all');
    const [userType, setUserType] = useState('all');
    const [tradeMarket, setTradeMarket] = useState('all');
    const [orderStatus, setOrderStatus] = useState('all');
    // const { orderReport } = useOrderReport();
    const orderReport = useRecoilValue(orderState);
    const [filterData, setFilterData] = useState<IOrderInfo[] | null>(orderReport);

    const refreshTable = useDebouncedCallback(() => {
        if (orderReport) {
            let tableFilter = [...orderReport];
            console.log(`role: ${role}\t buyer: ${userType}\t orderStatus: ${orderStatus}\t tradeMarket:${tradeMarket}\n area: ${area}`);
            if (role !== 'all') {

                tableFilter = tableFilter.filter((order) => { return (order.role !== undefined && order.role.toLowerCase() === role.toLowerCase()) });
            }
            if (userType !== 'all') {
                tableFilter = tableFilter.filter((order) => { return order.userType === userType });
            }
            if (tradeMarket !== 'all') {
                tableFilter = tableFilter.filter((order) => { return order.tradeMarket === tradeMarket });
            }
            if (orderStatus !== 'all') {
                tableFilter = tableFilter.filter((order) => { return order.status.toLowerCase() === orderStatus.toLowerCase() });
            }
            setFilterData(tableFilter);
            // let tableFilter = []; // table recoil state
            // if(buyerType !== 'all'){
            //     tableFilter = tableFilter.filter((row)=>{return row.})
            // }
        }
    }, 0)

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
                setUserType(event.target.value);
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
                            value={userType}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'SELLER'}>Seller</MenuItem>
                            <MenuItem value={'BUYER'}>Buyer</MenuItem>
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
                            <MenuItem value={'BILATERAL'}>Bilateral Market Trade</MenuItem>
                            <MenuItem value={'POOL'}>Pool Market Trade</MenuItem>
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
                            <MenuItem value={'Matched'}>Matched</MenuItem>
                            <MenuItem value={'OPEN'}>Open</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </>
        )
    }

    const onSubmitForm = async (data: ITableSelector) => {
        console.log(data);
    }

    useEffect(() => {
        if (orderReport) {
            setFilterData(orderReport)
        }
        //clean up 
        return () => {
        }
    }, [orderReport])

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
                {filterData && <AllOrderTable data={filterData} page={0} />}
            </Grid>
        </Grid>
        // </Box>

    )
}
