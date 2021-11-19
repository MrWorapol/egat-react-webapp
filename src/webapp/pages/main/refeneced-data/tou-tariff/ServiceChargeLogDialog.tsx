import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Button, DialogActions, DialogContent, DialogTitle, Grid, List, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';

import { useDialog } from '../../../../hooks/useDialog';
import { useTOUTariffLogs } from '../../../../hooks/useTOUTariffLogs';
import { ITouTariff } from '../../../../state/reference-data/tou-traff/tou-tariff-state';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { touTypeLabel } from './TOUTariff';
import { IServiceCharge } from '../../../../state/reference-data/tou-traff/tou-service-charge-state';
import { useServiceChargeLogs } from '../../../../hooks/useServiceChargeLogs';

interface IServiceChargeProps {
    serviceCharge: IServiceCharge,
}

export default function ServiceChargeLogDialog(props: IServiceChargeProps) {
    const { closeDialog } = useDialog();
    const [expanded, setExpanded] = React.useState<string | false>(`logs-0`);

    const { serviceChargeLogs, refreshServiceChargeLogs } = useServiceChargeLogs(props.serviceCharge);
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    function buildList(index: number, log: IServiceCharge): JSX.Element {
        return (
            <>
                <Accordion expanded={expanded === `logs-${index}`}

                    onChange={handleChange(`logs-${index}`)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#DEDEDE', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: "row", alignItems: 'center', width: 1 }}>
                            <Grid container direction='row' justifyContent='space-between' px={2} >
                                <Grid container item direction="row" xs={'auto'}>
                                    <Typography> Edit Date : </Typography>
                                    <Typography> {dayjs(log.editDate).format('DD/MM/YYYY')}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'}>

                                    <Typography> Effective Date : </Typography>
                                    <Typography> {log.effectiveDate}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'}>

                                    <Typography> Effective Time : </Typography>
                                    <Typography> {log.effectiveTime}</Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{}}>
                            <Grid container direction='row' justifyContent="center" px={3} xs={'auto'} alignContent="center">
                                <Grid item >
                                    <Typography> ค่าบริการรายเดือน(Baht/Month) {log.bahtPerMonth}</Typography>
                                </Grid>

                            </Grid>

                        </Box>
                    </AccordionDetails>
                </Accordion>
            </>
        )
    }
    return (
        <>
            <DialogTitle>
                <Typography sx={{ fontSize: '1.2em' }}>
                    {`Log : ${touTypeLabel[props.serviceCharge.touType]}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box >
                    {
                        serviceChargeLogs && serviceChargeLogs.map((log: IServiceCharge, i: number) => {
                            return buildList(i, log);
                        })
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={closeDialog}>
                    Close
                </Button>
            </DialogActions>
        </>
    )
}
