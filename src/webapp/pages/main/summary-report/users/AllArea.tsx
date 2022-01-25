import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce/lib';
import usePeriodTime from '../../../../hooks/summary-report/usePeriodTime';
import useUserReport from '../../../../hooks/summary-report/user/useUserReport';
import { useLoadingScreen } from '../../../../hooks/useLoadingScreen';
import { IUserMeterInfo } from '../../../../state/summary-report/user-report/user-report-state';
import AllAreaTable from './AllAreaTable';

interface IMap {
    [key: string]: boolean,
}

export interface IRolesState extends IMap {
    aggregator: boolean,
    prosumer: boolean,
    consumer: boolean,
}
interface IProps{
    region: string,
}
export default function AllArea(props: IProps ) {
    const { showLoading, hideLoading } = useLoadingScreen();
    const [areaState, setAreaState] = useState('total');
    const [roleState, setRoleState] = useState<IRolesState>({
        aggregator: false,
        prosumer: false,
        consumer: false,
    });
    const { meterTable } = useUserReport();
    const [filterData, setFilterData] = useState<IUserMeterInfo[] | null>(meterTable);
    const refreshTable = useDebouncedCallback(
        () => {
            let filterRoles = Object.values(roleState).includes(true); // if have role checked filter return true

            if (meterTable) {
                let tableFilter = meterTable.filter((row: IUserMeterInfo) => {
                    if (filterRoles) {
                        if (areaState.includes('VENUE FLOW') || areaState.includes('Perfect Park') || areaState.includes('CASA Premium')) {
                            return roleState[row.role.toLowerCase()] === true && (areaState === row.siteName);
                        }
                        else {
                            return roleState[row.role.toLowerCase()] === true &&
                                (areaState === row.area || areaState === 'total');
                        }
                    }
                    else {
                        if (areaState.includes('VENUE FLOW') || areaState.includes('Perfect Park') || areaState.includes('CASA Premium')) {
                            return (areaState === row.siteName);
                        } else {
                            return (areaState === row.area || areaState === 'total');
                        }
                    }

                })
                console.log(tableFilter);
                setFilterData(tableFilter);
            }
        }, 0
    )

    const onCheckedRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleState({
            ...roleState,
            [event.target.name]: event.target.checked
        });

        refreshTable();
    }

    const onSelectedArea = (event: SelectChangeEvent) => {
        setAreaState(event.target.value);
        refreshTable();
    }

    function buildRoleCheckbox(
        onCheckedRole: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) {

        return <>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Checkbox checked={roleState.aggregator} name="aggregator" onChange={onCheckedRole} />
                    }
                    label="Aggregator"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={roleState.prosumer} name="prosumer" onChange={onCheckedRole} />
                    }
                    label="Prosumer"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={roleState.consumer} name="consumer" onChange={onCheckedRole} />
                    }
                    label="Consumer"
                />
            </FormGroup>
        </>
    }
    useEffect(() => {
        showLoading(10);
        if (meterTable) {
            setFilterData(meterTable)
        }
        //clean up 
        hideLoading(10);
        return () => {
            setRoleState({
                aggregator: false,
                prosumer: false,
                consumer: false
            });
            setAreaState('total')
            hideLoading(10);
        }
    }, [meterTable])
    return (
        // <Box sx={{width: '100%'}}>
        <Grid container direction='column' px={2}>

            <Grid item container direction='row' justifyContent='space-between' id='header' pt={2}>
                <Grid item container xs={'auto'}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>All Area</Typography>
                </Grid>
                <Grid item container xs={'auto'}>
                    <FormControl variant='outlined' >
                        <Select
                            // labelId="demo-simple-select-label"
                            // id="demo-simple-select"
                            defaultValue={'total'}
                            onChange={(event: SelectChangeEvent) => { onSelectedArea(event) }}
                            sx={{ height: '2em' }}
                            value={areaState}
                        >
                            {buildAreaSelector(props.region)}
                        </Select>
                    </FormControl>
                </Grid>

            </Grid>
            <Grid >
                {buildRoleCheckbox(onCheckedRole)}
            </Grid>
            <Grid id="area-table">
                {filterData && <AllAreaTable data={filterData} filter={{ area: areaState, role: roleState }} />}
            </Grid>
        </Grid >
        // </Box>

    )
}

const buildAreaSelector = (region: string) => {
    const areaSelector = [
        { value: 'total', display: 'Total', region: 'all' },
        { value: '3 Villages', display: '3 Villages', region: 'Central' },
        { value: 'Thammasat University', display: 'Thammasat University', region: 'Central' },
        { value: 'VENUE FLOW (SC ASSET)', display: 'VENUE FLOW', region: 'Central' },
        { value: 'Perfect Park (Property Perfect)', display: 'Perfect Park', region: 'Central' },
        { value: 'CASA Premium (Q House)', display: 'CASA Premium', region: 'Central' },
        { value: 'Srisangthum', display: 'Srisangthum', region: 'North-Eastern' }
    ]
    let filterAreaSelectorElement: JSX.Element[] = [];
    areaSelector.forEach((area) => {
        if (area.region === 'all' || region === 'all' || area.region === region) {
            filterAreaSelectorElement.push(
                <MenuItem key={`${area.region}-${area.display}`} value={area.value} > {area.display}</MenuItem>);
        }
    })

    return (filterAreaSelectorElement)
}