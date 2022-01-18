import React, { useEffect, useState } from 'react'
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useDebouncedCallback } from 'use-debounce/lib';
import AllSettlementTable from './AllSettlementTable';
import { useSettlementReport } from '../../../../hooks/summary-report/settlement/useSettlementReport';
import { ISettlementReport } from '../../../../state/summary-report/settlement-report/settlement-report-state';

export default function AllSettlementComponent() {
    const [area, setArea] = useState('total');
    const [role, setRole] = useState('all');
    const [userType, setBuyerType] = useState('all');
    const [tradeMarket, setTradeMarket] = useState('all');
    const [imbalance, setImbalance] = useState('all');

    const { settlementReport } = useSettlementReport();
    const [filterData, setFilterData] = useState<ISettlementReport[] | null>(settlementReport);

    const refreshTable = useDebouncedCallback(() => {
        if (settlementReport) {
            let tableFilter = [...settlementReport];
            if (role !== 'all') {
                tableFilter = tableFilter.filter((report) => { return report.role === role });
            }
            if (userType !== 'all') {
                tableFilter = tableFilter.filter((report) => { return report.userType === userType });
            }
            if (tradeMarket !== 'all') {
                tableFilter = tableFilter.filter((report) => { return report.tradeMarket === tradeMarket });
            }
            if (imbalance !== 'all') {

                tableFilter = tableFilter.filter((report) => {
                    return report.imbalanceStatus === imbalance
                });
            }
            setFilterData(tableFilter);
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
                setBuyerType(event.target.value);
                break;
            }
            case ('tradeMarket'): {
                setTradeMarket(event.target.value);
                break;
            }
            case ('imbalance'): {
                setImbalance(event.target.value);
                break;
            }
        }

        refreshTable();
    }


    function buildTableSelecter(// onCheckedRole: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) {
        return (
            <>
                <Grid container item xs={3} >
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '1.5em' }}
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
                            sx={{ height: '1.5em' }} name='buyerType'
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
                            sx={{ height: '1.5em' }} name='tradeMarket'
                            value={tradeMarket}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'BILATERAL'}>Short Term Bilateral Trade</MenuItem>
                            <MenuItem value={'POOL'}>Pool Market Trade</MenuItem>
                        </Select>

                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '1.5em' }} name='imbalance'
                            value={imbalance}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'energyShortfall'}>Energy Shortfall</MenuItem>
                            <MenuItem value={'energyExcess'}>Energy Excess</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </>
        )
    }

    useEffect(() => {
        if (settlementReport) {
            setFilterData(settlementReport)
        }
        //clean up 
        return () => {
        }
    }, [settlementReport])


    return (
        <Grid container direction='column' sx={{ maxWidth: '100%' }} pb={3}>
            <Grid item container direction='row' justifyContent='space-between' id='header' pt={2} px={2}>
                <Grid item container xs={'auto'} >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>All Settlement</Typography>
                </Grid>
                <Grid item container xs={'auto'} >
                    <FormControl variant='outlined' >
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={area}
                            name='area'
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                            sx={{ height: '1.5em' }}
                        >
                            <MenuItem value={'total'}> {'Total'}</MenuItem>
                            <MenuItem value={'3villages'}> {'3 Villages'}</MenuItem>
                            <MenuItem value={'tu'}>{'Thammasat University'}</MenuItem>
                            <MenuItem value={'venueFlow'}>{'VENUE FLOW'}</MenuItem>
                            <MenuItem value={'perfectPark'}>{'Perfect Park'}</MenuItem>
                            <MenuItem value={'casaPermium'}>{'CASA Premium'}</MenuItem>
                            <MenuItem value={'Srisangthum'}>{'Srisangthum'}</MenuItem>

                        </Select>
                    </FormControl>
                </Grid>

            </Grid>
            <Grid item container direction='row' spacing={1} id='table-selector' my={1} px={2}>
                {buildTableSelecter()}
            </Grid>
            <Grid id="area-table">
                {filterData && <AllSettlementTable data={filterData} page={0} />}
            </Grid>
        </Grid >
        // </Box>

    )
}
