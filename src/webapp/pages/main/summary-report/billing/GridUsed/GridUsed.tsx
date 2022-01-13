import { Box, Divider, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { IGridUsedState } from '../../../../../state/summary-report/billing-report/grid-used-state'
import GridUsedChart from './GridUsedCharts'
import GridUsedTable from './GridUsedTable'

interface IProps {
    gridUsedData: IGridUsedState;
}
export default function GridUsed(props: IProps) {
    const [gridUsed, setGridUsed] = useState('all');
    const [filterData, setFilterData] = useState(props.gridUsedData.table);

    const refreshTable = useDebouncedCallback(() => {

        let tableFilter = [...props.gridUsedData.table];
        // console.log(`table Filter ${gridUsed}`);
        // console.log(tableFilter);
        // console.log(`role: ${role}\t buyer: ${userType}\t orderStatus: ${orderStatus}\t tradeMarket:${tradeMarket}\n area: ${area}`);
        if (gridUsed !== 'all') {
            tableFilter = tableFilter.filter((report) => { return report.gridUsedType === gridUsed });
        }

        console.log(`table filter fater check State`);
        console.log(tableFilter);
        setFilterData(tableFilter);
    }, 0);


    function buildTableSelecter(// onCheckedRole: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) {
        return (
            <>
                <Grid container item xs={3}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            fullWidth
                            sx={{ height: '3em' }}
                            name='gridUsed'
                            value={gridUsed}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'PEAK_MONFRI'}>Peak (Mon-Fri)</MenuItem>
                            <MenuItem value={'OFFPEAK_MONFRI'}>Off Peak (Mon-Fri)</MenuItem>
                            <MenuItem value={'OFFPEAK_WEEKEND'}>Off Peak (Sat-Sun)</MenuItem>
                            <MenuItem value={'OFFPEAK_HOLIDAY'}>Off Peak (วันหยุด)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </>
        )
    }

    const onSelectedDropdown = (event: SelectChangeEvent) => {

        setGridUsed(event.target.value);
        console.log(event.target.value);
        refreshTable();
    }

    useEffect(() => {

        return () => {

        }
    }, [props.gridUsedData])

    return (
        <Box sx={{ flexGrow: 1, width: `100%`, minHeight: '20vh' }}>
            <Grid container direction='row' columns={12} sx={{ backgroundColor: '#fff' }} pl={3} py={2}>
                <Grid container item xs={6} id='left-table' sx={{}} direction='row' >
                    <Grid container item xs={11}>
                        <Grid item xs={12} py={1}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>{"รวมค่าซื้อไฟฟ้าจาก Grid (Grid Used)"}</Typography>
                            {buildTableSelecter()}
                        </Grid>
                        <Grid item xs={12}>
                            <GridUsedTable gridUsedTable={filterData} />
                        </Grid>
                    </Grid>
                    <Grid container item xs={1} sx={{ my: 2 }} justifyContent='flex-end'>
                        <Divider orientation="vertical" color="#707070" />
                    </Grid>
                </Grid>
                <Grid container item xs={6} sx={{ backgroundColor: '#fff' }} >
                    <GridUsedChart gridUsed={props.gridUsedData} />
                </Grid>
            </Grid>
        </Box >
    )
}

