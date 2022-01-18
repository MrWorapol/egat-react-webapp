import { Box, Divider, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { IWheelingReportState } from '../../../../../state/summary-report/billing-report/wheeling-charge-state'

import WheelingChargeChart from './WheelingChargeChart'
import WheelingChargeTable from './WheelingChargeTable'

interface IProps {
    wheelingChargeReport: IWheelingReportState,
}
export default function WheelingChargeReport(props: IProps) {
    const [SelectedWheelingType, setSelectedWheelingType] = useState('all');
    const [filterData, setFilterData] = useState(props.wheelingChargeReport.table);

    const refreshTable = useDebouncedCallback(() => {
        let tableFilter = [...props.wheelingChargeReport.table];
        if (SelectedWheelingType !== 'all') {
            tableFilter = tableFilter.filter((report) => { return report.wheelingCharge === SelectedWheelingType });
        }
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
                            value={SelectedWheelingType}
                            onChange={(event: SelectChangeEvent) => { onSelectedDropdown(event) }}
                        >
                            <MenuItem value='all'>All</MenuItem>
                            <MenuItem value={'mea'}>MEA</MenuItem>
                            <MenuItem value={'pea'}>PEA</MenuItem>
                            <MenuItem value={'meaeagt'}>MEAEGAT</MenuItem>
                            <MenuItem value={'peaegat'}>PEAEGAT</MenuItem>
                            <MenuItem value={'meapeaegat'}>MEAPEAEGAT</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </>
        )
    }

    const onSelectedDropdown = (event: SelectChangeEvent) => {

        setSelectedWheelingType(event.target.value);
        refreshTable();
    }
    return (
        <Box sx={{ flexGrow: 1, width: `100%`, minHeight: '20vh' }}>
            <Grid container direction='row' columns={12} sx={{ backgroundColor: '#fff' }} pl={3} py={2}>
                <Grid container item xs={6} id='left-table' sx={{}} direction='row' >
                    <Grid container item xs={11}>
                        <Grid item xs={12} py={1}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>{"รวมค่าซื้อขายพลังงานไฟฟ้า (Net Energy Trading Payment)"}</Typography>
                            {buildTableSelecter()}
                        </Grid>
                        <Grid item xs={12}>
                            <WheelingChargeTable wheelingChargeTable={filterData} />
                        </Grid>
                    </Grid>
                    <Grid container item xs={1} sx={{ my: 2 }} justifyContent='flex-end'>
                        <Divider orientation="vertical" color="#707070" />
                    </Grid>
                </Grid>
                <Grid container item xs={6} sx={{ backgroundColor: '#fff' }} >
                    <WheelingChargeChart wheelingChargeReport={props.wheelingChargeReport} />
                </Grid>
            </Grid>
        </Box >
    )
}
