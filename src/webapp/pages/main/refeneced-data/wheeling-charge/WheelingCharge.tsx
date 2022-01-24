import { Checkbox, Container, FormControlLabel, FormGroup, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useNavigationGet } from '../../../../hooks/useNavigationGet';
import { useNavigationSet } from '../../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';
import ChargeTableData from './ChargeTableData';


import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useWheelingCharge } from '../../../../hooks/reference-data/useWheelingCharge';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

interface IMap {
    [key: string]: boolean | string;
}



export default function WheelingCharge() {
    useNavigationSet(NavigationCurrentType.WHEELING_CHARGE);
    const [menus, setOpenMenus] = React.useState<null | HTMLElement>(null);
    const { currentState } = useNavigationGet();
    const [selectedColumn, setSelectedColumn] = useState({
        baht: true,
        mea: true,
        pea: true,
        meaegat: true,
        peaegat: true,
        meapeaegat: true,
        paymentTo: true,
    });
    const { lastestUpdated } = useWheelingCharge();

    useEffect(() => {

        return () => {
        }
    }, [lastestUpdated]);

    function CustomizedMenus(): JSX.Element {

        const open = Boolean(menus);
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setOpenMenus(event.currentTarget);
        };
        const handleClose = () => {
            setOpenMenus(null);
        };

        const onCheckedColumns = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedColumn({
                ...selectedColumn,
                [event.target.name]: event.target.checked
            });
            // console.log(selectedColumn);
        }

        return (
            <div>
                <Button
                    id="demo-customized-button"
                    aria-controls="demo-customized-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="text"
                    disableElevation
                    onClick={handleClick}
                    sx={{ color: 'black', }}
                // endIcon={}
                >
                    <KeyboardArrowDownIcon />
                </Button>
                <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={menus}
                    open={open}
                    onClose={handleClose}
                >
                    {buildColumnsSelecter(onCheckedColumns)}
                </StyledMenu>
            </div>
        );
    }

    function buildColumnsSelecter(
        onCheckedRole: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) {
        return <>
            <FormGroup >
                <FormControlLabel
                    control={
                        <Checkbox checked={selectedColumn.baht} name="baht" onChange={onCheckedRole} />
                    }
                    label="Baht/kWh"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={selectedColumn.mea} name="mea" onChange={onCheckedRole} />
                    }
                    label="MEA"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={selectedColumn.pea} name="pea" onChange={onCheckedRole} />
                    }
                    label="PEA"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={selectedColumn.meaegat} name="meaegat" onChange={onCheckedRole} />
                    }
                    label="MEAEGAT"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={selectedColumn.peaegat} name="peaegat" onChange={onCheckedRole} />
                    }
                    label="PEAEGAT"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={selectedColumn.meapeaegat} name="meapeaegat" onChange={onCheckedRole} />
                    }
                    label="MEAPEAEGAT"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={selectedColumn.paymentTo} name="paymentTo" onChange={onCheckedRole} />
                    }
                    label="Payment To"
                />
            </FormGroup>
        </>
    }

    useEffect(() => {
        
    }, []);

    return (
        <Container sx={{ backgroundColor: '#fff' }}>
            <Grid container direction="column" pt={3} xs={12}>
                <Grid item container id="title">
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        Wheeling Charge Setting
                    </Typography>
                </Grid>
                <Grid item container id="action-zone" direction="row" py={2} justifyContent='space-between'>
                    <Grid item >
                        <Typography >
                            {`Last Time Updated: ${dayjs(lastestUpdated).format('DD/MM/YYYY [at] HH:MM')}`}
                        </Typography>
                    </Grid>
                    <Grid item >
                        {CustomizedMenus()}
                    </Grid>
                </Grid>
                <Grid item container id="table">
                    {currentState === NavigationCurrentType.WHEELING_CHARGE && <ChargeTableData columns={selectedColumn} />}

                </Grid>
            </Grid>
        </Container>
    )
}




