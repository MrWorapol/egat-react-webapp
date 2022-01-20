import { DatePicker } from '@mui/lab'
import { DatePickerView } from '@mui/lab/DatePicker/shared'
import { TextField } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { Control, Controller, FieldValue, FieldValues } from 'react-hook-form'

interface CustomDatePickerProps {
    control: Control<FieldValues, object>
    name: string,
    value: string | Date,
    minDate?: Date,
    maxDate?: Date,
    format ?: string 
    views?: DatePickerView[],
}
export default function CustomDatePicker(props: CustomDatePickerProps) {

    return (
        <Controller
            control={props.control}
            name={props.name}
            render={({ field: { onChange, onBlur, value, ref } }) =>
                <DatePicker
                    views = {props.views }
                    minDate={dayjs()}
                    maxDate={dayjs().add(5, 'year')}
                    inputFormat='DD/MM/YYYY'
                    value={value}
                    onChange={onChange}
                    renderInput={(params) => (
                        <TextField {...params} helperText={'DD/MM/YYYY'} />
                    )}
                />
            }
        />
    )
}
