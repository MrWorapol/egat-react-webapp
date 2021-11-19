import { Accordion, AccordionDetails, AccordionSummary, Button, DialogActions, DialogContent, DialogTitle, Grid, List, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDialog } from '../../../../hooks/useDialog';
import { useWheelingLogs } from '../../../../hooks/useWheelingLogs';
import { IWheelingCharge } from '../../../../state/reference-data/wheeling-chart/wheeling-charge-state';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IWheelingLogs } from '../../../../state/reference-data/wheeling-chart/wheeling-log-state';

interface ILogProps {
    no: number,
    wheelingCharge: IWheelingCharge,
}

export default function LogDialog(props: ILogProps) {
    
    const { closeDialog } = useDialog();
    // const { register, handleSubmit, watch, formState: { errors }, control } = useForm<IWheelingCharge>();
    const { wheelingLogs, refreshWheelingLogs } = useWheelingLogs(props.wheelingCharge.wheelingType);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    if (!wheelingLogs || wheelingLogs.length === 0) {
        return <> </>;
    }

    return (
        <>
            <DialogTitle>
                <Typography color='secondary.main' variant="h6" sx={{ fontWeight: 'bold' }}>
                    {`No. ${props.no+1} ${props.wheelingCharge.title}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box >
                    {
                        wheelingLogs.map((log: IWheelingLogs, i) => {
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

    function buildList(index: number, log: IWheelingLogs): JSX.Element {
        return (
            <>
                <Accordion expanded={expanded === `${index}`}

                    onChange={handleChange(`${index}`)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#DEDEDE', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: "row", alignItems: 'center', width: 1 }}>
                            <Grid container direction='row' justifyContent='space-between' px={2} >
                                <Grid container item direction="row" xs={'auto'}>
                                    <Typography> Edit Date : </Typography>
                                    <Typography> {dayjs(log.editDate).format('DD/MM/YYYY')}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'}>

                                    <Typography> Effective Date : </Typography>
                                    <Typography> {dayjs(props.wheelingCharge.effectiveDate).format('DD/MM/YYYY')}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'}>

                                    <Typography> Effective Time : </Typography>
                                    <Typography> {dayjs(props.wheelingCharge.effectiveTime).format('HH:mm')}</Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{}}>
                            <Grid container direction='row' justifyContent="space-between" px={3} xs={'auto'} alignContent="center">
                                <Grid container item direction="column" xs={'auto'} alignItems='center' >
                                    <Typography> Baht/Kwh</Typography>
                                    <Typography sx={{alignItems:'center'}}> {log.bahtPerKWh}</Typography>
                                </Grid>
                                <Grid container direction='column' xs={'auto'}  alignItems='center'>

                                    <Typography> MEA</Typography>
                                    <Typography> {log.mea}</Typography>
                                </Grid>
                                <Grid container direction='column' xs={'auto'} alignItems='center'>

                                    <Typography> PEA</Typography>
                                    <Typography> {log.pea}</Typography>
                                </Grid>
                                <Grid container direction='column' xs={'auto'} alignItems='center'>

                                    <Typography> MEAEGAT</Typography>
                                    <Typography> {log.meaEgat}</Typography >
                                </Grid>
                                <Grid container direction='column' xs={'auto'} alignItems='center'>

                                    <Typography> PEAEGAT</Typography>
                                    <Typography> {log.peaEgat}</Typography>
                                </Grid>
                                <Grid container direction='column' xs={'auto'}alignItems='center'>

                                    <Typography> MEAPEAEGAT</Typography>
                                    <Typography> {log.meaPeaEgat}</Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    </AccordionDetails>
                </Accordion>
            </>
        )
    }
}
