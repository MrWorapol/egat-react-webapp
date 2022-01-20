import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { ControllerRenderProps } from 'react-hook-form';

export interface ICustomTimeSelectProps {
    // name: string,
    size: "small" | "medium" | undefined, //size of material-ui textField
    width: string, //width size
    menuLength: number, //length of select
    step?: number, //ex 5min 10min 15min default is 1
    field: ControllerRenderProps, //value

}

export default function CustomTimeSelect(props: ICustomTimeSelectProps) {
    return (
        <Select variant="outlined"
            {...props.field}
            size={props.size}
            sx={{ maxWidth: props.width, justifyContent: 'flex-end', }}
            MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: '30vh',
                        // backgroundColor: ,
                    }
                }
            }}
        >
            {
                Array.from(Array(props.menuLength)).map((menu,i)=>{
                // buildMenuItems(props.menuLength, props?.step).map((menu, i) => {
                    return (
                        <MenuItem key={i + `${menu}`} value={`${i}`}> {(`00` + i).slice(-2)}</MenuItem>
                    )
                })
            }
        </Select >
    )
}

function buildMenuItems(length: number, step?: number): number[] {
    let loopStep = step;
    if (!step) {
        loopStep = 1;
    }
    let result = [];
    for (let i = 0; i < length; loopStep) {
        result.push(i)
    }
    return result;
}