import React, { useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useDebouncedCallback } from 'use-debounce/lib';
import AllSettlementTable from './AllSettlementTable';
import { Controller, useForm } from 'react-hook-form';

interface IRolesState {
    [key: string]: boolean,
}


interface ITableSelector {
    role: string,
    type: string,
    status: string,
    market: string,
}


export default function AllSettlementComponent() {
    const [areaState, setAreaState] = useState('total');
    const [roleState, setRoleState] = useState<IRolesState>({
        aggregator: false,
        prosumer: false,
        consumer: false,
    });
    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors }
    } = useForm<ITableSelector>();


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

    function buildTableSelecter(// onCheckedRole: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) {
        return (
            <>
                <Grid container item xs={3}>
                    <Controller
                        render={({ field }) => (
                            <Select
                                {...field}
                                fullWidth
                                sx={{ height: '3vh' }}

                            >
                                <MenuItem value={'aggregator'}>Aggregator</MenuItem>
                                <MenuItem value={'prosumer'}>Prosumer</MenuItem>
                                <MenuItem value={'consumer'}>Consumer</MenuItem>
                            </Select>
                        )}
                        name="role"
                        control={control}
                        defaultValue={'aggregator'}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        render={({ field }) => (
                            <Select
                                {...field}
                                fullWidth
                                sx={{ height: '3vh' }}
                            >
                                <MenuItem value={'seller'}>Seller</MenuItem>
                                <MenuItem value={'buyer'}>Buyer</MenuItem>
                            </Select>
                        )}
                        name="type"
                        control={control}
                        defaultValue={'seller'}
                    />
                </Grid>
                <Grid item xs={5}>
                    <Controller
                        render={({ field }) => (
                            <Select
                                {...field}
                                fullWidth
                                sx={{ height: '3vh' }}
                            >
                                <MenuItem value={'bilateral'}>Short Term Bilateral Market Trade</MenuItem>
                                <MenuItem value={'pool'}>Pool Market Trade</MenuItem>
                            </Select>
                        )}
                        name="market"
                        control={control}
                        defaultValue={'bilateral'}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        render={({ field }) => (
                            <Select
                                {...field}
                                fullWidth
                                sx={{ height: '3vh' }}
                            >
                                <MenuItem value={'matched'}>Matched</MenuItem>
                                <MenuItem value={'open'}>Open</MenuItem>
                            </Select>
                        )}
                        name="status"
                        control={control}
                        defaultValue={'matched'}
                    />
                </Grid>
            </>
        )
    }

    const onSubmitForm = async (data: ITableSelector) => {
        console.log(data);
    }

    return (
        <Grid container direction='column' px={2} sx={{ minHeight: '50vh' }}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid item container direction='row' justifyContent='space-between' id='header' pt={2}>
                    <Grid item container xs={'auto'}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5em', color: 'secondary.main' }}>All Settlement</Typography>
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
                <Grid item container direction='row' spacing={1} id='table-selector' my={1}>
                    {buildTableSelecter()}
                </Grid>
            </form>
            <Grid id="area-table">
                <AllSettlementTable />
            </Grid>
        </Grid>
        // </Box>

    )
}
