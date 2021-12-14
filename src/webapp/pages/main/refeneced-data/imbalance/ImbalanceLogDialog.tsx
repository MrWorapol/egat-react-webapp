import { Accordion, AccordionDetails, AccordionSummary, Button, DialogActions, DialogContent, DialogTitle, Grid, List, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'
import { useDialog } from '../../../../hooks/useDialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Iimbalance } from '../../../../state/reference-data/imbalance/imbalance-state';
import { useImbalanceLogs } from '../../../../hooks/reference-data/useImbalanceLogs';

interface ILogProps {
    no: number,
    imbalance: Iimbalance,
}

export default function ImbalanceLogDialog(props: ILogProps) {
    console.log(`call log dialog`)
    const { closeDialog } = useDialog();
    // const { register, handleSubmit, watch, formState: { errors }, control } = useForm<IWheelingCharge>();
    const { imbalanceLogs, refreshImbalanceLogs } = useImbalanceLogs(props.imbalance);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    if (!imbalanceLogs || imbalanceLogs.length === 0) {
        console.error(`no imbalance Logs`);
        return <> </>;
    }

    return (
        <>
            <DialogTitle>
                <Typography color='secondary.main' variant="h6" sx={{ fontWeight: 'bold' }}>
                    {`Log:   ${props.imbalance.imbalance}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box >
                    {
                        imbalanceLogs.map((log: Iimbalance, i) => {
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

    function buildList(index: number, log: Iimbalance): JSX.Element {
        return (
            <>
                <Accordion expanded={expanded === `logs-${index}`}

                    onChange={handleChange(`logs-${index}`)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#DEDEDE', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: "row", alignItems: 'center', width: 1 }}>
                            <Grid container direction='row' justifyContent='space-between' px={2} >
                                <Grid container item direction="row" xs={'auto'}>
                                    <Typography> Edit Date : </Typography>
                                    <Typography> {dayjs(props.imbalance.editDate).format('DD/MM/YYYY')}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'}>

                                    <Typography> Effective Date : </Typography>
                                    <Typography> {dayjs(props.imbalance.effectiveDate).format('DD/MM/YYYY')}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'}>

                                    <Typography> Effective Time : </Typography>
                                    <Typography> {dayjs(props.imbalance.effectiveDate).format('HH:mm')}</Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{}}>
                            <Grid container direction='column' justifyContent="space-between" px={3} xs={'auto'} alignContent="center">
                                <Grid container item direction="row" xs={'auto'} alignItems='center' justifyContent="center" >
                                    <Typography> Scenario :</Typography>
                                    <Typography sx={{ alignItems: 'center' }}> {log.scenario}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'} alignItems='center'>

                                    <Typography> Imbalance Clearing :</Typography>
                                    <Typography> {log.imbalance}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'} alignItems='center'>

                                    <Typography> Baht/kWh: </Typography>
                                    <Typography> {log.bahtPerKWh}</Typography>
                                </Grid>

                            </Grid>

                        </Box>
                    </AccordionDetails>
                </Accordion>
            </>
        )
    }
}
