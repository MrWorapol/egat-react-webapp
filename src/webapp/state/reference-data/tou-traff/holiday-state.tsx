import { atom } from "recoil";

export interface IHoliday {
    setDate: string,
    description: string,
    editDate?: Date,
}


export interface IHolidayLogs {
    years: string[],
    holidays: IHoliday[],
}
export const holidayLogsState = atom<IHolidayLogs | null>({
    key: 'holidayLogsState',
    default: null
})