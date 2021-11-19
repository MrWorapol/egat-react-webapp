import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Button, DialogActions, DialogContent, DialogTitle, Grid, List, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';

import { useDialog } from '../../../../hooks/useDialog';
import { useTOUTariffLogs } from '../../../../hooks/useTOUTariffLogs';
import { ITouTariff } from '../../../../state/reference-data/tou-traff/tou-tariff-state';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { touTypeLabel } from './TOUTariff';

interface ITariffLogProps {
    tariff: ITouTariff,
}

export default function TariffLogsDialog(props: ITariffLogProps) {
    const { closeDialog } = useDialog();
    const [expanded, setExpanded] = React.useState<string | false>(`logs-0`);

    const { touTariffLogs, refreshTOUTariffLog } = useTOUTariffLogs(props.tariff);
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    function buildList(index: number, log: ITouTariff): JSX.Element {
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
                            <Grid container direction='row' justifyContent="space-around" px={3} xs={'auto'} alignContent="center">
                                <Grid container item direction="column" xs={'auto'} alignItems='center' justifyContent="center" >
                                    <Typography> Start Time</Typography>
                                    <Typography sx={{ alignItems: 'center' }}> {log.startTime}</Typography>
                                </Grid>
                                <Grid container direction='column' xs={'auto'} alignItems='center'>

                                    <Typography> End Time</Typography>
                                    <Typography> {log.endTime}</Typography>
                                </Grid>
                                <Grid container direction='column' xs={'auto'} alignItems='center'>

                                    <Typography> Tariff</Typography>
                                    <Typography> {log.bahtPerKWh}</Typography>
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
                <Typography sx={{fontSize: '1.2em'}}>
                    {`Log : ${touTypeLabel[props.tariff.touType]}`}
                </Typography>
                <Typography sx={{fontSize: '1.2em'}}>
                    {`Title : ${props.tariff.title}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box >
                    {
                        touTariffLogs && touTariffLogs.map((log: ITouTariff,i: number) => {
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
