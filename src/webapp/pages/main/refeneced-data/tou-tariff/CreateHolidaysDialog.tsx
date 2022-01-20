import React, { useState } from 'react'
import { Button, DialogContent, DialogTitle, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useDialog } from '../../../../hooks/useDialog';
import { IServiceCharge } from '../../../../state/reference-data/tou-traff/tou-service-charge-state';
import useHolidayLogs from '../../../../hooks/reference-data/useHolidayLogs';
import { IHoliday } from '../../../../state/reference-data/tou-traff/holiday-state';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DatePicker } from '@mui/lab';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useSnackBarNotification } from '../../../../hooks/useSnackBarNotification';
dayjs.extend(utc);
dayjs.extend(timezone);



interface IServiceChargeProps {
    serviceCharge: IServiceCharge,
}

interface IHolidayForm {
    holiday: IHoliday[],
}
export default function CreateHolidaysDialog(props: IServiceChargeProps) {
    const { closeDialog } = useDialog();
    const { showSnackBar } = useSnackBarNotification();
    // const[holiday,setHolidayState] = useState<IHoliday[]>([]);

    const { register, handleSubmit, control, watch } = useForm<IHolidayForm>({
        defaultValues: {
            holiday: [{ setDate: '', description: '' }]
        },
    });
    const { fields, append, remove } = useFieldArray<IHolidayForm>({
        control,
        name: "holiday",
    });
    const watchFieldArray = watch("holiday");
    const controlledFields = fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index]
        };
    });

    const { createHoliday } = useHolidayLogs(props.serviceCharge.touType);


    const closeOpenDialog = () => {
        closeDialog();
    }
    const onSubmit = (data: IHolidayForm) => {
        let requestData: IHoliday[] = [];
        if (data.holiday.length > 0) {
            data.holiday.forEach((row: IHoliday, i: number) => {
                if (row.setDate !== null) {
                    if (!dayjs(row.setDate).isValid()) { //validate date format
                        requestData = [];
                        showSnackBar({ serverity: 'error', message: `${row.setDate} row number: ${i + 1}` });
                        return;
                    }
                    row.setDate = dayjs(row.setDate).toISOString();
                    requestData.push({
                        ...row,
                    })
                }
            })

            if (requestData.length > 0) {

                createHoliday(requestData);
            }
        }
    }
    return (
        <>
            <DialogTitle>
                <Typography sx={{ fontSize: '1.2em' }}>
                    {`วันหยุดในปีปฎิทิน`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <TableContainer sx={{ width: 1 }} >
                            <Table aria-label="">
                                <TableHead sx={{ bgcolor: '#DEDEDE', fontWeight: '400' }}>
                                    <TableRow>
                                        <TableCell key={'edit-date'} sx={{ width: '30%' }} >
                                            <Typography sx={{ fontWeight: 'bold', pl: 2 }}>
                                                Set Date
                                            </Typography>
                                        </TableCell>
                                        <TableCell key={'description'} sx={{ width: '70%', pl: 1, }}>
                                            <Typography sx={{ fontWeight: 'bold', pl: 2 }}>
                                                Description
                                            </Typography>
                                        </TableCell>

                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {controlledFields.map((field, index) => {
                                        return (
                                            <TableRow key={`${index}`}>
                                                <TableCell>
                                                    <Controller
                                                        control={control}
                                                        name={`holiday.${index}.setDate` as const}
                                                        render={({ field: { onChange, onBlur, value, ref } }) =>
                                                            <DatePicker
                                                                minDate={dayjs()}
                                                                maxDate={dayjs().add(5, 'year')}
                                                                inputFormat='DD/MM/YYYY'
                                                                value={value}
                                                                onChange={onChange}
                                                                renderInput={(params) => (
                                                                    <TextField {...params}  />
                                                                )}
                                                            />
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Grid container direction='row' alignItems='center'>
                                                        <Grid item xs={11}>

                                                            <TextField key={field.id} fullWidth
                                                                {...register(`holiday.${index}.description` as const)} />
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton onClick={() => {
                                                                remove(index)
                                                            }}>
                                                                <DeleteOutlinedIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Box display='flex' justifyContent='flex-end' py={2}>
                        <Button variant="contained" endIcon={<AddCircleOutlineIcon />}
                            onClick={() => {
                                append({
                                    setDate: dayjs().toString(),
                                    description: "",
                                })
                            }}
                        >
                            Add Date
                        </Button>

                    </Box>
                    <Grid container direction="row" xs={12} justifyContent="flex-end" pb={2} pt={1}  >
                        <Grid px={2}>
                            <Button variant='outlined' onClick={closeOpenDialog} >
                                Close
                            </Button>
                        </Grid>
                        <Grid>
                            <Button variant='contained' type="submit" disabled={watchFieldArray.length < 1}>
                                Set
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>

        </>
    )
}
