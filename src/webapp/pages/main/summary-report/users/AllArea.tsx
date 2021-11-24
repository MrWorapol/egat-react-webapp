import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce/lib';
import AllAreaTable from './AllAreaTable';

interface IRolesState {
    [key: string]: boolean,
}

export default function AllArea() {
    const [areaState, setAreaState] = useState('total');
    const [roleState, setRoleState] = useState<IRolesState>({
        agregator: false,
        prosumer: false,
        consumer: false,
    });

    const roleSearchDebounce = useDebouncedCallback(
        () => {
            const selectedRoles = Object.keys(roleState).filter((key: string) => {
                return roleState[key] === true;
            });
            // if(selectedRoles.length >0){
            // refreshAllUser({ roles: [...selectedRoles] });
            // }
            console.log(`get roles select`);
            console.log(selectedRoles);
        }, 2000
    )

    const onCheckedRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleState({
            ...roleState,
            [event.target.name]: event.target.checked
        });

        roleSearchDebounce();

    }

    function buildRoleSelecter(
        onCheckedRole: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) {

        return <>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Checkbox checked={roleState.agregator} name="agregator" onChange={onCheckedRole} />
                    }
                    label="Agregator"
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
            {/* <Button onClick={roleSearchDebounce}>Test SelectRoles</Button> */}
        </>
    }

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
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={areaState}
                            onChange={(event: SelectChangeEvent) => { setAreaState(event.target.value) }}
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
            <Grid >
                {buildRoleSelecter(onCheckedRole)}
            </Grid>
            <Grid id="area-table">
                <AllAreaTable />
            </Grid>
        </Grid>
        // </Box>

    )
}

