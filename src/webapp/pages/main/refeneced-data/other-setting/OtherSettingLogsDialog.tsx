import { Accordion, AccordionDetails, AccordionSummary, Button,  DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { useDialog } from '../../../../hooks/useDialog';
import { useOtherSettingLogs } from '../../../../hooks/reference-data/useOtherSettingLogs';
import { IOtherSetting } from '../../../../state/reference-data/other-setting/othersetting-state';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { IOtherSettingLog } from '../../../../state/reference-data/other-setting/othersetting-log';

export default function OtherSettingLogsDialog() {
    const { closeDialog } = useDialog();
    const { otherSettingLogs } = useOtherSettingLogs();

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    if (!otherSettingLogs) {
        return <></>;
    }

    function buildList(index: number, log: IOtherSettingLog): JSX.Element {
        return (
            <Box pt={1}>
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
                                    <Typography> {log.otherSetting.effectiveDate}</Typography>
                                </Grid>
                                <Grid container direction='row' xs={'auto'}>

                                    <Typography> Effective Time : </Typography>
                                    <Typography> {log.otherSetting.effectiveTime}</Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{}}>
                            <Grid container direction="column" pt={3} px={10} spacing={1}>
                                <Grid container item alignItems="center" id='energy-trading-payment'>
                                    <Typography sx={{ fontSize: '1.5em', }}>
                                        Energy Trading Payment
                                    </Typography>
                                    <Grid container direction='row' justifyContent="space-between">
                                        <Typography sx={{}}>
                                            (App) Transaction Fees
                                        </Typography>
                                        <Typography>
                                            {`${log.otherSetting.energyTradingPayment.transactionFees} Baht/kWh`}
                                        </Typography>
                                    </Grid>
                                    <Grid container direction='row' justifyContent="space-between">
                                        <Typography sx={{}}>
                                            Discount App Fees
                                        </Typography>
                                        <Typography>
                                            {`${log.otherSetting.energyTradingPayment.dicountAppFees} %`}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item id='grid-used'>
                                    <Typography sx={{ fontSize: '1.5em', }}>
                                        Grid Used
                                    </Typography>
                                    <Grid container direction='row' justifyContent="space-between">
                                        <Typography sx={{}}>
                                            Ft
                                        </Typography>
                                        <Typography>
                                            {`${log.otherSetting.gridUsed.ft} Baht/kWh`}
                                        </Typography>
                                    </Grid>
                                    <Grid container direction='row' justifyContent="space-between">
                                        <Typography sx={{}}>
                                            Discount Grid Used
                                        </Typography>
                                        <Typography>
                                            {`${log.otherSetting.gridUsed.discountGridUsed} %`}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item id="other">
                                    <Typography sx={{ fontSize: '1.5em', }}>
                                        Other
                                    </Typography>
                                    <Grid container direction='row' justifyContent="space-between">
                                        <Typography sx={{}}>
                                            Vat
                                        </Typography>
                                        <Typography>
                                            {`${log.otherSetting.other.vat} %`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        )
    }
    return (
        <>
            <DialogTitle>
                <Typography color="secondary.main" variant="h6" sx={{ fontWeight: 'bold' }}>
                    {`Log: Other Setting`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box >
                    {
                        otherSettingLogs.map((log: IOtherSettingLog, i) => {
                            return buildList(i, log);
                        })
                    }

                </Box>
            </DialogContent>
            <DialogActions>
                <Box display="flex" pr={2} justifyContent="flex-end">
                    <Button variant='outlined' onClick={closeDialog}>
                        Close
                    </Button>
                </Box>
            </DialogActions>
        </>
    )
}
