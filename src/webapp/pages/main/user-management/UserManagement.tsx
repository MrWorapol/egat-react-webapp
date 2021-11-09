import { Button, Checkbox, Container, FormControlLabel, FormGroup, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';
import UserTableData from './UserTableData';
import NewAdminDialog from './NewAdminDialog';
import { useDialog } from '../../../hooks/useDialog';
import { useAllUser } from '../../../hooks/useAllUser';
import { useNavigationGet } from '../../../hooks/useNavigationGet';
import { useDebouncedCallback } from 'use-debounce/lib';
export interface IUserRoles {
    agregator: boolean,
    prosumer: boolean,
    consumer: boolean,
    admin: boolean,
}

interface IRolesState {
    [key: string]: boolean,
}
export default function UserManagement() {
    useNavigationSet(NavigationCurrentType.USER_MANAGEMENT);
    const { showDialog } = useDialog();
    const { currentState } = useNavigationGet();
    const [searchText, setSearchText] = useState('');
    const { refreshAllUser } = useAllUser();
    const [roleState, setRoleState] = useState<IRolesState>({
        agregator: false,
        prosumer: false,
        consumer: false,
        admin: false,
    });
    // let debounceFn: NodeJS.Timeout;
    // useEffect(() => {
    //     const searchUserByText = setTimeout(() => {
    //         console.log(searchText);
    //         if (searchText === '') {
    //             refreshAllUser();
    //         }
    //         refreshAllUser({ text: searchText });

    //         // Send Axios request here
    //     }, 1000)

    //     return () => clearTimeout(searchUserByText)
    // }, [searchText])

    const roleSearchDebounce = useDebouncedCallback(
        () => {
            const selectedRoles = Object.keys(roleState).filter((key: string) => {
                return roleState[key] === true;
            });
            // if(selectedRoles.length >0){
            refreshAllUser({ roles: [...selectedRoles] });
            // }
            console.log(`get roles select`);
            console.log(selectedRoles);
        }, 2000
    )

    const searchTextDebounce = useDebouncedCallback(
        () => {
            console.log(`search text string : ${searchText}`)
            if (searchText === '') {
                refreshAllUser();
            }
            refreshAllUser({ text: searchText });
        }, 2000
    )

    const onTypingText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        searchTextDebounce();
    }

    const onCheckedRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleState({
            ...roleState,
            [event.target.name]: event.target.checked
        });

        roleSearchDebounce();

    }


    return (
        <Container style={{ backgroundColor: '#FFFFFF' }}  >
            <Grid container direction="row" pt={3} px={3} spacing={0} xs={12}>
                <Grid item container id="title">
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>All Users</Typography>
                </Grid>
                <Grid item container id="actionzone" direction="row" justifyContent='space-between' mt={2}>
                    <Grid item container direction='row' xs={12} md={10} alignItems='center' >
                        <Grid item >
                            {buildAddAdminButton()}
                        </Grid>
                        <Grid item ml={2}>
                            {buildRoleSelecter(onCheckedRole)}
                        </Grid>

                    </Grid>
                    <Grid xs={12} md={2} alignItems="center" sx={{ my: 2 }}>
                        <TextField
                            autoFocus
                            margin="none"
                            id="password"
                            label="Search"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTypingText(e)}
                            value={searchText}

                        />
                    </Grid>
                </Grid>
                <Grid item container mt={2} >
                    {currentState === NavigationCurrentType.USER_MANAGEMENT && <UserTableData />}
                </Grid>
            </Grid>
        </Container>
    )
    function buildAddAdminButton() {
        return <>
            <Button variant="contained" endIcon={<AddCircleOutlineIcon />} onClick={NewAdminOnClicked}>
                New Admin
            </Button>
        </>

    }
    function NewAdminOnClicked() {
        showDialog({
            content: <NewAdminDialog />,
            onClose: () => false,
            width: 'sm',
        });
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
                <FormControlLabel
                    control={
                        <Checkbox checked={roleState.admin} name="admin" onChange={onCheckedRole} />
                    }
                    label="admin"
                />
            </FormGroup>
            <Button onClick={roleSearchDebounce}>Test SelectRoles</Button>
        </>
    }

}



