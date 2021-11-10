import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { useNavigationGet } from '../../../../hooks/useNavigationGet';
import { useNavigationSet } from '../../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../../state/navigation-current-state';

export default function WheelingCharge() {
    useNavigationSet(NavigationCurrentType.WHEELING_CHART);
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
    let lastestUpdated = dayjs().format('DD/MM/YYYY [at] HH:MM');
    console.log('')
    return (
        <Container sx={{ backgroundColor: '#fff' }}>
            <Grid container direction="column" pt={3} xs={12}>
                <Grid item container id="title">
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        Wheeling Charge Setting
                    </Typography>
                </Grid>
                <Grid item container id="action-zone" direction="row" pt={2} justifyContent='space-between'>
                    <Grid item >
                        <Typography >
                            {`Last Time Updated: ${lastestUpdated}`}
                        </Typography>
                    </Grid>
                    <Grid item >
                        <Typography >
                            {`Last Time Updated: ${lastestUpdated}`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item container id="table">
                    {currentState === NavigationCurrentType.WHEELING_CHART && buildTable()}

                </Grid>
            </Grid>
        </Container>
    )
}

function buildTable(): JSX.Element {
    let columns: string[] = [];
    let rows: string[] = [];
    return (
        <Box>
            <TableContainer >
                <Table aria-label="">
                   
                </Table>

            </TableContainer>
        </Box>

    )
}
